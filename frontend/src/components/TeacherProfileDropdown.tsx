import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

interface TeacherProfileDropdownProps {
  onClose: () => void;
}

const TeacherProfileDropdown: React.FC<TeacherProfileDropdownProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = async () => {
    onClose();
    try {
      await axios.post('/api/users/logout');
      toast.success('Logged out successfully!');
      localStorage.removeItem('user');
      navigate('/'); 
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout.');
      // Still remove user data and redirect on error to prevent being stuck
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  return (
    <div 
      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="user-menu-button"
    >
      <button
        onClick={() => handleNavigate('/teacherdashboard/teacherProfile')}
        className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        role="menuitem"
      >
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        <span>Profile</span>
      </button>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        role="menuitem"
      >
         <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
         </svg>
        <span>Logout</span>
      </button>
    </div>
  );
};

export default TeacherProfileDropdown; 
