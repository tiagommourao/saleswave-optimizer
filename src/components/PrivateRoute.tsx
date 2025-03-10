
import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Carregando...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
