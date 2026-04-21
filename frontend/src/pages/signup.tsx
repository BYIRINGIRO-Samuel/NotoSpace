import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    school: "",
    classname: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    setRole(newRole);
    setFormData(prev => ({
      ...prev,
      school: "",
      classname: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const baseData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role.toLowerCase(),
        profilePicture: "", 
      };

      let dataToSend: any = { ...baseData };

      if (role.toLowerCase() === 'student') {
        dataToSend.school = formData.school;
        dataToSend.classname = formData.classname;
      } else if (role.toLowerCase() === 'teacher') {
        dataToSend.school = formData.school;
      }
      const response = await axios.post("/api/users/create", dataToSend);
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        const userRole = response.data.user.role?.type?.toLowerCase();
        console.log("User role received from backend:", userRole);
        switch(userRole) {
          case "student":
            navigate("/studentdashboard");
            break;
          case "teacher":
            navigate("/teacheronboarding");
            break;
          case "admin":
            navigate("/adminonboarding");
            break;
          default:
            console.error("Unknown or missing user role type:", userRole);
            navigate("/");
        }
        toast.success('Account created successfully!');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      if (axios.isAxiosError(err)) {
        console.log('Backend error response data:', err.response?.data);
        const errorMessage = err.response?.data?.message || err.response?.data?.error;

        if (errorMessage?.includes('password must include')) {
          toast.error(errorMessage);
        } else if (errorMessage?.includes('Email already exists')) {
          toast.error('Email already exists. Please use a different email or sign in.');
        } else if (errorMessage?.includes('School not found')) {
           toast.error('School not found. Please enter a valid school name.');
        } else if (errorMessage?.includes('Class not found')) {
           toast.error('Class not found. Please enter a valid class name.');
        } else if (errorMessage) {
           toast.error(errorMessage);
        } else {
          toast.error('An error occurred during signup');
        }
      } else {
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-2">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden">
        <div className="hidden md:flex relative md:w-4/12 bg-gradient-to-b from-[#349156] to-[#1877c9] flex-col items-center justify-center p-8 md:rounded-tl-2xl md::rounded-bl-2xl md:rounded-tr-2xl md::rounded-br-2xl">
          <div
            className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 h-72 w-10 bg-white rounded-l-[80px]"
            style={{ zIndex: 2 }}
          />
          <div className="flex flex-col items-center justify-center h-full w-full z-10">
            <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mb-6 shadow-md">
              <svg
                className="w-12 h-12 text-[#349156]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M3 20.5L21 12 3 3.5v7l12 1.5-12 1.5v7z"
                  fill="#349156"
                />
              </svg>
            </div>
            <h1 className="text-white text-2xl font-bold mb-4 text-center">
              Join LearnLite🤗
            </h1>
            <p className="text-white text-base mb-2 text-center font-thin">
              Start your learning journey today.
            </p>
            <Link
              to="/"
              className="z-10 mt-4 px-6 py-2 rounded-full text-white bg-white bg-opacity-20 border border-white/30 font-semibold text-sm shadow hover:bg-opacity-30 transition"
            >
              Sign in
            </Link>
          </div>
        </div>

        <div className="md:w-8/12 w-full flex flex-col justify-center p-8 bg-white">
          <div className="flex justify-center mb-2 md:hidden">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-lg">
              <svg
                className="w-8 h-8 text-[#349156]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M3 20.5L21 12 3 3.5v7l12 1.5-12 1.5v7z"
                  fill="#349156"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-center mb-6 md:hidden text-[#349156]">
            Sign Up
          </h2>

          <div className="flex mb-6 border-b border-gray-200">
            <Link
              to="/"
              className="flex-1 py-2 text-center font-medium text-gray-400 hover:text-[#349156] transition"
            >
              Sign in
            </Link>
            <div className="flex-1 py-2 text-center font-medium border-b-2 border-[#349156] text-[#349156]">
              Sign up
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  I am a...
                </label>
                <select
                  id="role"
                  name="role"
                  className="w-full px-4 py-2 border border-gray-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#86c49c] text-gray-700"
                  value={role}
                  onChange={handleRoleChange}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">School Administrator</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border border-gray-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#86c49c]"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
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
                  className="w-full px-4 py-2 border border-gray-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#86c49c]"
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
                  className="w-full px-4 py-2 border border-gray-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#86c49c] pr-10"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
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
              {role.toLowerCase() !== "admin" && (
                <>
                  <div>
                    <label
                      htmlFor="school"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      School Name
                    </label>
                    <input
                      id="school"
                      name="school"
                      type="text"
                      placeholder="Enter school name"
                      className="w-full px-4 py-2 border border-gray-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#86c49c]"
                      value={formData.school}
                      onChange={handleChange}
                      required={role.toLowerCase() !== "admin"}
                    />
                  </div>
                  {role.toLowerCase() === "student" && (
                    <div>
                      <label
                        htmlFor="classname"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Class Name
                      </label>
                      <input
                        id="classname"
                        name="classname"
                        type="text"
                        placeholder="Enter class name"
                        className="w-full px-4 py-2 border border-gray-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#86c49c]"
                        value={formData.classname}
                        onChange={handleChange}
                        required={role.toLowerCase() === "student"}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-[10px] bg-[#349156] text-white font-semibold text-lg mt-4 hover:bg-[#2a7a45] transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="mx-2 text-gray-400 text-sm">
              Or Continue with
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="mb-4">
            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 bg-gray-200 rounded-[10px] py-2 hover:bg-gray-300 transition w-full md:w-full">
              <img src="/assets/icons/google.svg" alt="google" className="w-7 h-7" />
              Google
            </button>
          </div>

          <div className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link to="/" className="text-[#349156] hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
