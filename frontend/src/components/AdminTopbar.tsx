import { useState, useEffect, useRef } from 'react';
import AdminProfileDropdown from './AdminProfileDropdown';
import AdminNoficationsSection from './AdminNoficationsSection';
import MobileMenu from './MobileMenu';

interface AdminTopbarProps {
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

const AdminTopbar: React.FC<AdminTopbarProps> = ({ userName }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [firstName, setFirstName] = useState<string>('');
  const [profilePicture, setProfilePicture] = useState<string | undefined>(undefined);
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
    <header className="sticky top-0 z-50 w-full bg-white border-b">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <MobileMenu userName={userName} userRole={userRole} />
        </div>

        <div className="flex items-center space-x-4">
          {/* Notification Button */}
          <button 
            className="relative p-2 text-gray-600 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={toggleRightSidebar}
            aria-label="Notifications"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full"
            >
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#349156] flex items-center justify-center text-white text-sm font-bold">
                  {initials.toUpperCase()}
                </div>
              )}
              
              <span className="hidden sm:block text-sm font-medium text-gray-700">{firstName}</span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 9l-7 7-7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {isDropdownOpen && <AdminProfileDropdown onClose={closeDropdown} />}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      {isRightSidebarOpen && (
        <>
          <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg z-50 overflow-y-auto hide-scrollbar">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
                <button
                  onClick={toggleRightSidebar}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <AdminNoficationsSection />
            </div>
          </div>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleRightSidebar}
          />
        </>
      )}
    </header>
  );
};

export default AdminTopbar;
