# Forgot Password Feature - Setup Guide

## Overview
The forgot password feature is now fully implemented with email-based OTP (One-Time Password) authentication.

## Current Status: MOCKED EMAIL
🔴 **Email sending is currently MOCKED** - OTPs are logged to backend console instead of being sent via email.

## Features Implemented
✅ Forgot Password page with email input
✅ OTP generation (6-digit code)
✅ Reset Password page with OTP verification
✅ Password visibility toggle
✅ Secure password reset flow
✅ 10-minute OTP expiration
✅ One-time use OTP tokens

## Flow
1. User clicks "Forgot your password?" on login page
2. User enters their email address
3. System generates a 6-digit OTP
4. OTP is logged to backend console (MOCKED) or sent via Resend (when configured)
5. User enters OTP and new password
6. Password is reset successfully

## How to Enable Real Email Sending

### Step 1: Get Resend API Key
1. Sign up at https://resend.com
2. Go to Dashboard → API Keys
3. Create a new API key (starts with `re_...`)

### Step 2: Configure Backend
Add these variables to `/app/backend/.env`:

```bash
RESEND_API_KEY=re_your_actual_api_key_here
SENDER_EMAIL=noreply@yourdomain.com
```

**Note:** In Resend's testing mode, emails only go to verified email addresses. To send to any email, you need to:
- Verify your domain in Resend dashboard
- Or add specific test email addresses to your Resend account

### Step 3: Restart Backend
```bash
sudo supervisorctl restart backend
```

### Step 4: Test
1. Go to http://localhost:3000/forgot-password
2. Enter a registered email
3. Check your email for the OTP
4. Enter OTP and new password
5. Login with new password

## Security Features
- ✅ OTPs expire after 10 minutes
- ✅ OTPs can only be used once
- ✅ Passwords are hashed with bcrypt
- ✅ JWT token-based authentication
- ✅ Email validation on all endpoints

## API Endpoints

### POST /api/auth/forgot-password
Request:
```json
{
  "email": "user@university.edu"
}
```

Response:
```json
{
  "message": "If your email is registered, you will receive an OTP shortly",
  "email": "user@university.edu"
}
```

### POST /api/auth/verify-otp
Request:
```json
{
  "email": "user@university.edu",
  "otp": "123456"
}
```

Response:
```json
{
  "message": "OTP verified successfully",
  "valid": true
}
```

### POST /api/auth/reset-password
Request:
```json
{
  "email": "user@university.edu",
  "otp": "123456",
  "new_password": "newSecurePassword123"
}
```

Response:
```json
{
  "message": "Password reset successfully"
}
```

## Checking Mocked OTP (Development)
When email is mocked, check backend logs to see the OTP:

```bash
tail -f /var/log/supervisor/backend.err.log | grep "MOCKED EMAIL" -A 5
```

You'll see output like:
```
============================================================
[MOCKED EMAIL] Password Reset OTP
To: user@university.edu
OTP Code: 123456
Expires in: 10 minutes
============================================================
```

## Email Template
The OTP email uses a beautiful HTML template with:
- PeerNode branding with gradient colors
- Clear OTP display in a bordered box
- 10-minute expiration notice
- Security warning for unauthorized requests
- Professional footer

## Troubleshooting

### Email not received (when Resend is configured)
1. Check if RESEND_API_KEY is set correctly in `/app/backend/.env`
2. Verify your domain in Resend dashboard for production use
3. Check Resend logs in your dashboard
4. Ensure the recipient email is verified in Resend (testing mode)

### OTP expired
- OTPs are valid for 10 minutes only
- Request a new OTP by going through the forgot password flow again

### OTP already used
- Each OTP can only be used once
- Request a new OTP if needed

## Files Modified/Created
- `/app/backend/server.py` - Added auth endpoints with OTP logic
- `/app/frontend/src/pages/Login.jsx` - Added "Forgot Password" link
- `/app/frontend/src/pages/ForgotPassword.jsx` - New page for email input
- `/app/frontend/src/pages/ResetPassword.jsx` - New page for OTP and password reset
- `/app/frontend/src/App.js` - Added new routes

## Dependencies Added
- Backend: `resend>=2.0.0`
- Frontend: `input-otp` (already available via shadcn)
