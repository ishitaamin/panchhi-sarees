import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import OTPVerification from './OTPVerification';
import axios from 'axios';

const AdminLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loginAdmin, registerAdmin } = useAdminAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const success = await loginAdmin({ username: formData.username, password: formData.password });
        if (success) {
          toast({
            title: "Login successful",
            description: "Welcome to the admin panel.",
          });
        } else {
          toast({
            title: "Login failed",
            description: "Invalid credentials. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        // Send OTP via backend
        const response = await axios.post('http://localhost:5000/api/admin/register', {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });

        if (response.status === 200) {
          toast({
            title: 'OTP Sent',
            description: 'Please check your email for the verification code.',
          });
          setStep('otp');
        } else {
          toast({
            title: 'Error',
            description: response.data?.message || 'Failed to send OTP',
            variant: 'destructive',
          });
        }
      }
    } catch (error: any) {
      console.error("❌ Backend Error:", error); // Add this line
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerify = async (otp: string) => {
    setIsLoading(true);

    try {
      const success = await registerAdmin({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        otp,
      });

      if (success) {
        toast({
          title: "Registration successful",
          description: "Admin account created. You can now login.",
        });
        setIsLogin(true);
        setStep('form');
        setFormData({ username: '', email: '', password: '' });
      } else {
        toast({
          title: "Registration failed",
          description: "Failed to create admin account.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error?.response?.data?.message || "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      await axios.post('http://localhost:5000/api/admin/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      toast({
        title: 'OTP Resent',
        description: 'Please check your email again.',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to resend OTP',
        description: error?.response?.data?.message || 'Try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#20283a]">
            {step === 'otp' ? 'Verify Email' : isLogin ? 'Admin Login' : 'Admin Registration'}
          </h2>
          <p className="mt-2 text-gray-600">
            {step === 'otp' ? 'Complete your registration' : 'Access the admin panel'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59]"
                  placeholder="Enter username"
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59]"
                    placeholder="Enter email"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59]"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#f15a59] hover:bg-[#d63031] text-white"
              >
                {isLoading ? (isLogin ? 'Logging in...' : 'Sending OTP...') : (isLogin ? 'Login' : 'Send OTP')}
              </Button>
            </form>
          ) : (
            <OTPVerification
              email={formData.email}
              onVerify={handleOTPVerify}
              onResend={handleResendOTP}
              isLoading={isLoading}
            />
          )}

          {step === 'form' && (
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({ username: '', email: '', password: '' });
                }}
                className="text-[#f15a59] hover:text-[#d63031] font-medium"
              >
                {isLogin ? 'Need to register? Create admin account' : 'Already have an account? Login'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;