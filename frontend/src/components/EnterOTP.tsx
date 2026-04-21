import React, { useRef, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

interface EnterOTPProps {
  onBack: () => void;
  email?: string;
  onOTPVerified: () => void;
  resetToken: string;
}

const EnterOTP: React.FC<EnterOTPProps> = ({
  onBack,
  email = "your email",
  onOTPVerified,
  resetToken,
}) => {
  const inputs = Array.from({ length: 6 }, () =>
    useRef<HTMLInputElement>(null)
  );
  const [loading, setLoading] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const value = e.target.value;
    if (value.length === 1 && idx < 5) {
      inputs[idx + 1].current?.focus();
    }
    if (value.length === 0 && idx > 0) {
      inputs[idx - 1].current?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otp = inputs.map(input => input.current?.value).join('');
    if (otp.length !== 6) {
      toast.error('Please enter all 6 digits of the verification code');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/users/verify-otp', {
        email,
        otp,
        token: resetToken,
      });

      if (response.status === 200) {
        toast.success('Verification successful');
        onOTPVerified();
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorMessage = error.response?.data?.message;

        switch (status) {
          case 400:
            if (errorMessage?.includes('invalid')) {
              toast.error('Invalid verification code. Please try again');
            } else if (errorMessage?.includes('expired')) {
              toast.error('Verification code has expired. Please request a new one');
            } else {
              toast.error(errorMessage || 'Invalid verification code');
            }
            break;
          case 429:
            toast.error('Too many attempts. Please try again later');
            break;
          case 500:
            toast.error('Failed to verify code. Please try again later');
            break;
          default:
            toast.error(errorMessage || 'Failed to verify code');
        }
      } else {
        toast.error('Network error. Please check your internet connection');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center min-h-[80vh] p-4 relative">
      <button
        onClick={onBack}
        className="absolute left-4 top-4 md:left-0 md:top-0 focus:outline-none"
      >
        <img src="/assets/icons/back.svg" alt="Back" className="w-7 h-7" />
      </button>
      <h2 className="text-2xl font-bold mb-2 text-[#349156] mt-8">
        Reset Password
      </h2>
      <p className="text-gray-600 text-center mb-10">
        Please enter the password reset code below that was sent to{" "}
        <span className="font-semibold">{email}</span>.
      </p>
      <div className="flex gap-2 mb-6">
        {inputs.map((ref, idx) => (
          <input
            key={idx}
            ref={ref}
            type="text"
            maxLength={1}
            className="w-12 h-12 border border-gray-300 rounded-lg text-center text-xl focus:outline-none focus:border-[#349156]"
            onChange={(e) => handleInput(e, idx)}
          />
        ))}
      </div>
      <button
        className="w-full py-3 rounded-lg bg-[#349156] text-white font-semibold text-lg mb-4 hover:bg-[#2a7a45] transition disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleVerifyOTP}
        disabled={loading}
      >
        {loading ? 'Verifying...' : 'Reset Password'}
      </button>
      <div className="flex items-center w-full mb-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="mx-2 text-gray-400 text-sm">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <button className="py-3 flex items-center justify-center gap-2 border border-gray-200 bg-gray-300 rounded-[10px] hover:bg-gray-400 transition w-full">
        <img src="/assets/icons/google.svg" alt="google" className="w-7 h-7" />
        Google
      </button>
    </div>
  );
};

export default EnterOTP;
