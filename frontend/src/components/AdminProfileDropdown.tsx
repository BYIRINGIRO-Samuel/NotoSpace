import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

interface AdminProfileDropdownProps {
  onClose: () => void;
}

const AdminProfileDropdown: React.FC<AdminProfileDropdownProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    onClose();
    navigate('/admin/profile');
  };

  const handleLogout = async () => {
    try {
      // Call the backend logout endpoint
      await axios.post('/api/users/logout');
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout.');
    }

    // Remove user data from localStorage
    localStorage.removeItem('user');
    
    // Redirect to login page
    navigate('/');
    
    // Close the dropdown
    onClose();
  };

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
      <button
        onClick={handleProfileClick}
        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        Profile
      </button>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
         <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3v-10a3 3 0 013-3h4a3 3 0 013 3v1"></path>
         </svg>
        Logout
      </button>
    </div>
  );
};

export default AdminProfileDropdown;
