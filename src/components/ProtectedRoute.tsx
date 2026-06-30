import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '@/contexts/auth';
import { LOGIN_PATH } from '@/routes/config';
import { getAccessiblePathsForRole, getDefaultPathForRole } from '@/enums/userRoleEnum';
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={LOGIN_PATH} replace />;
  }

  const allowed = getAccessiblePathsForRole(user?.role_name);
  if (!allowed.includes(location.pathname)) {
    return <Navigate to={getDefaultPathForRole(user?.role_name)} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
