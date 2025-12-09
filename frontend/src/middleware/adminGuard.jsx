import { useAuth } from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * AdminGuard middleware component
 * Protects admin routes by checking user authentication and admin role
 */
export default function AdminGuard({ children }) {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated || !user?.token) {
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location.pathname,
          message: "Vous devez être connecté pour accéder à l'administration"
        }} 
        replace 
      />
    );
  }

  // Check if user has admin role
  if (!isAdmin) {
    return (
      <Navigate 
        to="/" 
        state={{ 
          message: "Accès refusé. Vous n'avez pas les permissions d'administrateur."
        }} 
        replace 
      />
    );
  }

  // User is authenticated and has admin role
  return children;
}

/**
 * Higher-order component version of AdminGuard
 * Can be used to wrap components that need admin protection
 */
export function withAdminGuard(Component) {
  return function AdminProtectedComponent(props) {
    return (
      <AdminGuard>
        <Component {...props} />
      </AdminGuard>
    );
  };
}