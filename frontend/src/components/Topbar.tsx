import { useState, useEffect, useRef } from 'react';
import ProfileDropdown from './ProfileDropdown';
import Rightsidebar from './Rightsidebar';
import MobileMenu from "./MobileMenu";

interface TopbarProps {
  userName: string;
}

interface User {
  name: string;
  email: string;
  role: {
    type: string;
  };
  profilePicture?: string;
}

const Topbar: React.FC<TopbarProps> = ({ userName }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [firstName, setFirstName] = useState<string>('');
  const [profilePicture, setProfilePicture] = useState<string | undefined>(undefined);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [initials, setInitials] = useState<string>('');

  useEffect(() => {
    if (userName) {
      const names = userName.split(' ');
      setFirstName(names[0]);
    }
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user: User = JSON.parse(userStr);
        setProfilePicture(user.profilePicture || undefined);
        setUserRole(user.role?.type || '');
        if (user.name) {
          const names = user.name.split(' ').filter(n => n); 
          if (names.length > 1) {
            setInitials(names[0][0] + names[names.length - 1][0]);
          } else if (names.length === 1) {
            setInitials(names[0][0]);
          }
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, [userName]);

  useEffect(() => {
    const handleStorageChange = () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user: User = JSON.parse(userStr);
          setProfilePicture(user.profilePicture || undefined);
          setUserRole(user.role?.type || '');
          if (user.name) {
            const names = user.name.split(' ').filter(n => n); 
            if (names.length > 1) {
              setInitials(names[0][0] + names[names.length - 1][0]);
            } else if (names.length === 1) {
              setInitials(names[0][0]);
            }
          }
        } catch (error) {
          console.error('Error parsing user data from localStorage on storage change:', error);
        }
      } else {
        setProfilePicture(undefined);
        setUserRole('');
        setInitials('');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled ? "bg-white shadow-sm" : "bg-white"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <MobileMenu userName={userName} userRole={userRole} />
        </div>

        <div className="flex items-center gap-4">
          <button 
            className="relative p-2 rounded-full hover:bg-gray-100 transition"
            onClick={toggleRightSidebar}
          >
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="relative" ref={dropdownRef}>
            <div
              className="cursor-pointer flex items-center gap-2"
              onClick={toggleDropdown}
            >
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white text-sm font-bold">
                  {initials.toUpperCase()}
                </div>
              )}
              
              <span className="font-medium text-gray-700 text-sm">{firstName}</span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 9l-7 7-7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {isDropdownOpen && <ProfileDropdown onClose={closeDropdown} />}
          </div>
        </div>
      </div>

      {isRightSidebarOpen && (
        <>
          <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 overflow-y-auto hide-scrollbar">
            <Rightsidebar onClose={toggleRightSidebar} />
          </div>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleRightSidebar}
          />
        </>
      )}
    </div>
  );
};

export default Topbar;
