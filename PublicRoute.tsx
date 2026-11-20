// components/routes/PublicRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';

interface PublicRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

export const PublicRoute = ({ isAuthenticated, children }: PublicRouteProps) => {
  const location = useLocation();
  // Get the intended destination from state, default to role-based dashboard
  const from = (location.state as { from?: Location })?.from?.pathname;
  
  // If already authenticated, redirect to appropriate dashboard
  if (isAuthenticated) {
    if (from) return <Navigate to={from} replace />;
    return <Navigate to="/dashboard" replace />;
  }

  // Not authenticated - show public page (login/register)
  return <>{children}</>;
};