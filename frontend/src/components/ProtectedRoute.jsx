import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Guards nested routes: unauthenticated users are bounced to /login.
 * Optionally restricts by role (e.g. allowedRoles={['ADMIN','ANALYST']}).
 */
export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
