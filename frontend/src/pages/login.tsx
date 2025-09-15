import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EnterOTP from "../components/EnterOTP";
import ResetPassword from "../components/ResetPassword";
import NewPassword from "../components/NewPassword";
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/users/login', formData);

      if (response.status === 200 && response.data && response.data.user) {
        // Store user data in localStorage (token is handled by HTTP-only cookie)
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Redirect based on role
        const userRole = response.data.user.role.type.toLowerCase();
        switch (userRole) {
          case 'student':
            navigate('/studentdashboard');
            break;
          case 'teacher':
            navigate('/teacherdashboard');
            break;
          case 'admin':
            navigate('/admindashboard'); // Assuming admin dashboard is /admindashboard
            break;
          default:
            navigate('/'); // Redirect to home or a default page if role is unknown
        }
        toast.success('Logged in successfully!');
      } else {
        toast.error(response.data?.message || 'Login failed.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (axios.isAxiosError(err)) {
        const backendErrorMessage = err.response?.data?.message;
        const backendError = err.response?.data?.error;
        
        // Prioritize backend message or error if available
        const displayMessage = backendErrorMessage || backendError || 'An error occurred during login.';
        toast.error(displayMessage);

      } else {
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordClick = () => {
    setShowReset(true);
  };

  const handleForgotPasswordSuccess = (email: string, token: string) => {
    setResetEmail(email);
    setResetToken(token);
    setShowReset(false);
    setShowOTP(true);
  };

  const handleOTPVerified = () => {
    setShowOTP(false);
    setShowNewPassword(true);
  };

  const handleBackOrError = () => {
    setResetToken("");
    setResetEmail("");
    if(showOTP) setShowOTP(false);
    else if(showNewPassword) setShowNewPassword(false);
    else setShowReset(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-2">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden">
        <div className="hidden md:flex relative md:w-1/2 bg-gradient-to-b from-[#1DA1F2] to-[#1877c9] flex-col items-center justify-center p-8 md:rounded-tl-2xl md:rounded-bl-2xl md:rounded-tr-2xl md:rounded-br-2xl">
          <div
            className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 h-72 w-10 bg-white rounded-l-[80px]"
            style={{ zIndex: 2 }}
          />
          <div className="flex flex-col items-center justify-center h-full w-full z-10">
            <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mb-6 shadow-md">
              <svg
                className="w-12 h-12 text-[#1DA1F2]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M3 20.5L21 12 3 3.5v7l12 1.5-12 1.5v7z"
                  fill="#1DA1F2"
                />
              </svg>
            </div>
            <h1 className="text-white text-2xl font-bold mb-4 text-center">
              Welcome Back👏
            </h1>
            <p className="text-white text-base mb-2 text-center font-thin">
              Sign in to continue your learning journey.
            </p>
            <Link
              to="/signup"
              className="z-10 mt-4 px-6 py-2 rounded-full text-white bg-white bg-opacity-20 border border-white/30 font-semibold text-sm shadow hover:bg-opacity-30 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>

        <div className="md:w-1/2 w-full flex flex-col justify-center p-8 bg-white">
          {showNewPassword ? (
            <NewPassword onBackToLogin={handleBackOrError} resetToken={resetToken} />
          ) : showOTP ? (
            <EnterOTP onBack={handleBackOrError} email={resetEmail} onOTPVerified={handleOTPVerified} resetToken={resetToken} />
          ) : showReset ? (
            <ResetPassword onBackToLogin={handleBackOrError} onForgotPasswordSuccess={handleForgotPasswordSuccess} />
          ) : (
            <>
              <div className="flex justify-center mb-2 md:hidden">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-lg">
                  <svg
                    className="w-8 h-8 text-[#1DA1F2]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M3 20.5L21 12 3 3.5v7l12 1.5-12 1.5v7z"
                      fill="#1DA1F2"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="text-2xl font-semibold text-center mb-6 md:hidden text-[#1DA1F2]">
                Welcome Back
              </h2>
              
              <div className="flex mb-6 border-b border-gray-200">
                <div className="flex-1 py-2 text-center font-medium border-b-2 border-[#1DA1F2] text-[#1DA1F2]">
                  Sign in
                </div>
                <Link
                  to="/signup"
                  className="flex-1 py-2 text-center font-medium text-gray-400 hover:text-[#1DA1F2] transition"
                >
                  Sign up
                </Link>
              </div>
              
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    className="w-full px-4 py-2 border border-gray-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#A8D8F8]"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="relative">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full px-4 py-2 border border-gray-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#A8D8F8] pr-10"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 mt-3.5"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex justify-end -mt-2 mb-2">
                  <button
                    type="button"
                    className="text-[#1DA1F2] text-sm hover:underline"
                    onClick={handleResetPasswordClick}
                  >
                    Forgot password?
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 rounded-[10px] bg-[#1DA1F2] text-white font-semibold text-lg mt-2 hover:bg-[#1991DA] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Continue'}
                </button>
              </form>
              <div className="flex flex-col items-center justify-center my-4">
                <span className="text-gray-500 text-sm mb-2">Or Continue with</span>
                <button
                  className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-200"
                >
                  <img
                    src="https://img.icons8.com/color/16/000000/google-logo.png"
                    alt="Google logo"
                    className="mr-2"
                  />
                  Google
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
