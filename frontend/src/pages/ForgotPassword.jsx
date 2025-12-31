import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/auth/forgot-password`, { email });
      setOtpSent(true);
      toast.success('OTP sent! Check your email (or console logs if mocked)');
      
      // Navigate to reset password page with email
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 1500);
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f4f8] to-[#e8f0f2] px-4" data-testid="forgot-password-page">
      <Card className="w-full max-w-md shadow-lg border-0" data-testid="forgot-password-card">
        <CardHeader className="space-y-2">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#667eea] transition-colors mb-2"
            data-testid="back-to-login-button"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </button>
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-2xl flex items-center justify-center mb-4">
            <span className="text-3xl">🔐</span>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent text-center">
            Forgot Password?
          </CardTitle>
          <CardDescription className="text-base text-center">
            No worries! Enter your email and we'll send you an OTP to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
                data-testid="forgot-password-email-input"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90 transition-opacity text-white font-medium"
              disabled={loading || otpSent}
              data-testid="send-otp-button"
            >
              {loading ? 'Sending OTP...' : otpSent ? 'OTP Sent! Redirecting...' : 'Send OTP'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
