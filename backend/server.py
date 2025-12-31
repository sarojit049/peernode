from fastapi import FastAPI, APIRouter, HTTPException, status
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import random
import string
import asyncio

try:
    import resend
    RESEND_AVAILABLE = True
except ImportError:
    RESEND_AVAILABLE = False

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Settings
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# Email Settings
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')

if RESEND_AVAILABLE and RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============= Models =============

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    university: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    user_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    university: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

class PasswordResetOTP(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    otp_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    otp: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    expires_at: datetime
    used: bool = False

# ============= Helper Functions =============

def generate_otp(length: int = 6) -> str:
    """Generate a random OTP"""
    return ''.join(random.choices(string.digits, k=length))

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def send_otp_email(email: str, otp: str):
    """Send OTP email using Resend or mock it"""
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: 'Inter', Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; }}
            .container {{ max-width: 600px; margin: 40px auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }}
            .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }}
            .header h1 {{ color: white; margin: 0; font-size: 28px; font-weight: 600; }}
            .content {{ padding: 40px 30px; }}
            .otp-box {{ background-color: #f8f9fa; border-radius: 8px; padding: 25px; text-align: center; margin: 30px 0; border: 2px dashed #667eea; }}
            .otp-code {{ font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; }}
            .message {{ color: #4a5568; font-size: 16px; line-height: 1.6; margin: 20px 0; }}
            .footer {{ background-color: #f8f9fa; padding: 20px; text-align: center; color: #718096; font-size: 14px; }}
            .warning {{ color: #e53e3e; font-size: 14px; margin-top: 20px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🧘 PeerNode</h1>
            </div>
            <div class="content">
                <p class="message">Hi there,</p>
                <p class="message">You requested to reset your password. Use the OTP code below to continue:</p>
                <div class="otp-box">
                    <div class="otp-code">{otp}</div>
                </div>
                <p class="message">This code will expire in 10 minutes.</p>
                <p class="warning">⚠️ If you didn't request this, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>PeerNode - Your Academic Co-Pilot</p>
                <p>Building better study communities, one connection at a time.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    if RESEND_AVAILABLE and RESEND_API_KEY:
        try:
            params = {
                "from": SENDER_EMAIL,
                "to": [email],
                "subject": "Reset Your PeerNode Password",
                "html": html_content
            }
            await asyncio.to_thread(resend.Emails.send, params)
            logger.info(f"OTP email sent to {email}")
        except Exception as e:
            logger.error(f"Failed to send email via Resend: {str(e)}")
            logger.info(f"[MOCKED EMAIL] OTP for {email}: {otp}")
    else:
        # Mock email sending - log to console
        logger.info(f"\n{'='*60}")
        logger.info(f"[MOCKED EMAIL] Password Reset OTP")
        logger.info(f"To: {email}")
        logger.info(f"OTP Code: {otp}")
        logger.info(f"Expires in: 10 minutes")
        logger.info(f"{'='*60}\n")

# ============= Routes =============

@api_router.get("/")
async def root():
    return {"message": "PeerNode API is running"}

@api_router.post("/auth/register", response_model=dict)
async def register(user_data: UserRegister):
    """Register a new user"""
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    user = User(
        email=user_data.email,
        name=user_data.name,
        university=user_data.university
    )
    
    # Hash password and store
    user_doc = user.model_dump()
    user_doc['password'] = hash_password(user_data.password)
    user_doc['created_at'] = user_doc['created_at'].isoformat()
    
    await db.users.insert_one(user_doc)
    
    # Create token
    access_token = create_access_token(data={"sub": user.email, "user_id": user.user_id})
    
    return {
        "message": "User registered successfully",
        "token": access_token,
        "user": {
            "user_id": user.user_id,
            "email": user.email,
            "name": user.name,
            "university": user.university
        }
    }

@api_router.post("/auth/login", response_model=dict)
async def login(credentials: UserLogin):
    """Login user"""
    # Find user
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user['password']):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create token
    access_token = create_access_token(data={"sub": user['email'], "user_id": user['user_id']})
    
    return {
        "message": "Login successful",
        "token": access_token,
        "user": {
            "user_id": user['user_id'],
            "email": user['email'],
            "name": user['name'],
            "university": user['university']
        }
    }

@api_router.post("/auth/forgot-password", response_model=dict)
async def forgot_password(request: ForgotPasswordRequest):
    """Generate OTP and send to user's email"""
    # Check if user exists
    user = await db.users.find_one({"email": request.email}, {"_id": 0})
    if not user:
        # For security, don't reveal if email exists or not
        return {
            "message": "If your email is registered, you will receive an OTP shortly",
            "email": request.email
        }
    
    # Generate OTP
    otp_code = generate_otp()
    
    # Store OTP in database
    otp_data = PasswordResetOTP(
        email=request.email,
        otp=otp_code,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=10)
    )
    
    otp_doc = otp_data.model_dump()
    otp_doc['created_at'] = otp_doc['created_at'].isoformat()
    otp_doc['expires_at'] = otp_doc['expires_at'].isoformat()
    
    await db.password_reset_otps.insert_one(otp_doc)
    
    # Send email
    await send_otp_email(request.email, otp_code)
    
    return {
        "message": "If your email is registered, you will receive an OTP shortly",
        "email": request.email
    }

@api_router.post("/auth/verify-otp", response_model=dict)
async def verify_otp(request: VerifyOTPRequest):
    """Verify OTP without resetting password"""
    # Find OTP
    otp_record = await db.password_reset_otps.find_one(
        {
            "email": request.email,
            "otp": request.otp,
            "used": False
        },
        {"_id": 0}
    )
    
    if not otp_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP"
        )
    
    # Check if OTP is expired
    expires_at = datetime.fromisoformat(otp_record['expires_at'])
    if datetime.now(timezone.utc) > expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP has expired"
        )
    
    return {
        "message": "OTP verified successfully",
        "valid": True
    }

@api_router.post("/auth/reset-password", response_model=dict)
async def reset_password(request: ResetPasswordRequest):
    """Reset password using OTP"""
    # Find OTP
    otp_record = await db.password_reset_otps.find_one(
        {
            "email": request.email,
            "otp": request.otp,
            "used": False
        },
        {"_id": 0}
    )
    
    if not otp_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP"
        )
    
    # Check if OTP is expired
    expires_at = datetime.fromisoformat(otp_record['expires_at'])
    if datetime.now(timezone.utc) > expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP has expired"
        )
    
    # Update password
    hashed_password = hash_password(request.new_password)
    result = await db.users.update_one(
        {"email": request.email},
        {"$set": {"password": hashed_password}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to reset password"
        )
    
    # Mark OTP as used
    await db.password_reset_otps.update_one(
        {"otp_id": otp_record['otp_id']},
        {"$set": {"used": True}}
    )
    
    return {
        "message": "Password reset successfully"
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
