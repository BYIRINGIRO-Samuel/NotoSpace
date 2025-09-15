import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  // Get user from localStorage
  const userStr = localStorage.getItem('user');
  
  if (!userStr || typeof userStr !== 'string') {
    // No user found or invalid data type, redirect to login
    if (typeof userStr !== 'string' && userStr !== null) {
        console.error("ProtectedRoute: Invalid data type in localStorage for user:", typeof userStr);
    }
    return <Navigate to="/" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    const userRole = user.role.type.toLowerCase();

    // Check if user's role is allowed
    if (!allowedRoles.includes(userRole)) {
      // User's role is not allowed, redirect to appropriate dashboard
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
    }

    // Special case: block admin dashboard if onboarding not complete
    if (
      userRole === 'admin' &&
      window.location.pathname === '/admindashboard' &&
      !user.school
    ) {
      return <Navigate to="/adminonboarding" replace />;
    }

    // User is authenticated and has correct role
    return <>{children}</>;
  } catch (error) {
    // Invalid user data in localStorage
    console.error("ProtectedRoute: Error parsing user data from localStorage.", error);
    console.log("Invalid user data string:", userStr);
    localStorage.removeItem('user');
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute; 