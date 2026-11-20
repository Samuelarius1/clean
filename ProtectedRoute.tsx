// components/routes/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import Loading from '../components/common/Loading';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  allowedRoles?: string[];
  userRole?: string;
  children: React.ReactNode;
}

export const ProtectedRoute = ({
  isAuthenticated,
  isLoading,
  allowedRoles,
  userRole,
  children,
}: ProtectedRouteProps) => {
  const location = useLocation();

  // Show loading while checking auth state to prevent flash
  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}>
        <Loading />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after successful login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    if (userRole === 'staff') return <Navigate to="/staff" replace />;
    if (userRole === 'client') return <Navigate to="/client" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  // Authenticated AND authorized - render children
  return <>{children}</>;
};