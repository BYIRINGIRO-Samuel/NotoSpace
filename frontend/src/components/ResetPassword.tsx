import React, { useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

interface ResetPasswordProps {
  onBackToLogin: () => void;
  onForgotPasswordSuccess: (email: string, token: string) => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({
  onBackToLogin,
  onForgotPasswordSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/users/forgot-password', { email });
      if (response.status === 200) {
        toast.success('Password reset instructions sent to your email');
        onForgotPasswordSuccess(email, response.data.token);
      }
    } catch (error: any) {
      console.error('Error in forgot password:', error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorMessage = error.response?.data?.message;

        switch (status) {
          case 400:
            if (errorMessage?.includes('invalid email')) {
              toast.error('Please enter a valid email address');
            } else {
              toast.error(errorMessage || 'Invalid request');
            }
            break;
          case 404:
            toast.error('No account found with this email address');
            break;
          case 429:
            toast.error('Too many attempts. Please try again later');
            break;
          case 500:
            toast.error('Failed to send reset instructions. Please try again later');
            break;
          default:
            toast.error(errorMessage || 'An error occurred while sending reset instructions');
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
        onClick={onBackToLogin}
        className="absolute left-4 top-4 md:left-0 md:top-0 focus:outline-none"
      >
        <img src="/assets/icons/back.svg" alt="Back" className="w-7 h-7" />
      </button>
      <h2 className="text-2xl font-bold mb-2 text-[#349156] mt-8">
        Reset Password
      </h2>
      <p className="text-gray-600 text-center mb-6">
        Enter the email address associated with your account and we'll send you a reset code.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#86c49c]"
            placeholder="name@example.com"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-[#349156] text-white font-semibold text-lg hover:bg-[#2a7a45] transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Sending code...' : 'Send Reset Code'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
