import { useState} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { sidebarLinks } from '../constants'; 
import { admindashboardlinks } from '../constants/admin'; 
import { teacherdashbordlinks } from '../constants/teacher'; 
import axios from 'axios';
import { toast } from 'react-toastify';

interface MobileMenuProps {
  userName: string;
  userRole: string; 
}

const MobileMenu = ({ userName, userRole }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems: { route: string; label: string; imgURL: string; children?: any[] }[] = userRole === 'admin' ? admindashboardlinks :
                    userRole === 'teacher' ? teacherdashbordlinks :
                    sidebarLinks; 

  const handleLogout = async () => {
    try {
      await axios.post('/api/users/logout');
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout.');
    }
    
    localStorage.removeItem('user');
    
    navigate('/');
    
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
      >
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Menu Content */}
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{userName}</p>
                    <p className="text-sm text-gray-500">{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto py-4">
                {menuItems.map((item) => (
                  // Handle potential nested children links in admin/teacher menus
                  item.children ? (
                    <div key={item.route}>
                       <div className={`flex items-center gap-3 px-4 py-3 text-gray-700 transition ${
                            location.pathname.startsWith(item.route) ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
                          }`}>
                          <img src={item.imgURL} alt={item.label} className="w-5 h-5" />
                          <span>{item.label}</span>
                      </div>
                      <div className="ml-4">
                         {item.children.map((child) => (
                           <Link
                              key={child.route}
                              to={child.route}
                              className={`flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 ${
                                location.pathname === child.route ? 'bg-blue-50 text-blue-600' : ''
                              }`}
                             onClick={() => setIsOpen(false)}
                            >
                             <img src={child.imgURL} alt={child.label} className="w-5 h-5" />
                             <span>{child.label}</span>
                           </Link>
                         ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={item.route}
                      to={item.route}
                      className={`flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 ${
                        location.pathname === item.route ? 'bg-blue-50 text-blue-600' : ''
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <img src={item.imgURL} alt={item.label} className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  )
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full"
                >
                  <img
                    src="/assets/icons/logout.svg"
                    alt="Logout"
                    className="w-5 h-5"
                  />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu; 
