
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';

interface OTPVerificationProps {
  email: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  isLoading?: boolean;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onVerify,
  onResend,
  isLoading = false
}) => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleVerify = () => {
    if (otp.length === 6) {
      onVerify(otp);
    } else {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter a 6-digit OTP.',
        variant: 'destructive',
      });
    }
  };

  const handleResend = () => {
    onResend();
    setTimer(60);
    setCanResend(false);
    setOtp('');
    toast({
      title: 'OTP Sent',
      description: 'A new OTP has been sent to your email.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-[#20283a] mb-2">Verify Your Email</h3>
        <p className="text-gray-600">
          We've sent a 6-digit verification code to<br />
          <span className="font-medium">{email}</span>
        </p>
      </div>

      <div className="flex justify-center">
        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <Button
        onClick={handleVerify}
        disabled={otp.length !== 6 || isLoading}
        className="w-full bg-[#f15a59] hover:bg-[#d63031] text-white"
      >
        {isLoading ? 'Verifying...' : 'Verify OTP'}
      </Button>

      <div className="text-center">
        <p className="text-gray-600 text-sm">
          Didn't receive the code?{' '}
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-[#f15a59] hover:text-[#d63031] font-medium"
            >
              Resend OTP
            </button>
          ) : (
            <span className="text-gray-400">
              Resend in {timer}s
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default OTPVerification;
