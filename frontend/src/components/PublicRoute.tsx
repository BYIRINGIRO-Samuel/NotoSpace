import { Navigate } from 'react-router-dom';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  // Get user from localStorage
  const userStr = localStorage.getItem('user');
  
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      const userRole = user.role.type.toLowerCase();

      // Redirect to appropriate dashboard based on role
      switch (userRole) {
        case 'student':
          return <Navigate to="/studentdashboard" replace />;
        case 'teacher':
          return <Navigate to="/teacherdashboard" replace />;
        case 'admin':
          return <Navigate to="/admindashboard" replace />;
        default:
          return <Navigate to="/" replace />;
      }
    } catch (error) {
      // Invalid user data in localStorage
      localStorage.removeItem('user');
    }
  }

  // No user found or invalid data, allow access to public route
  return <>{children}</>;
};

export default PublicRoute; 
