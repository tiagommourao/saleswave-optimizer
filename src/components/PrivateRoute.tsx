
import { FC, ReactNode, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';
import { useToast } from '@/hooks/use-toast';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, error } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Verificar configuração válida
    const clientId = localStorage.getItem('azure_ad_client_id');
    const tenant = localStorage.getItem('azure_ad_tenant');
    
    if (!isAuthenticated && !isLoading) {
      if (!clientId || !tenant) {
        toast({
          variant: "destructive",
          title: "Configuração necessária",
          description: "Configure o Azure AD antes de acessar o sistema."
        });
        navigate('/cisadm/auth-config');
        return;
      }
      
      // Se temos configuração mas não estamos autenticados, redirecionar para login
      navigate('/login');
    }
    
    // Se houver um erro de autenticação
    if (error) {
      console.error("Erro de autenticação no PrivateRoute:", error);
      toast({
        variant: "destructive",
        title: "Erro de autenticação",
        description: "Ocorreu um erro ao verificar sua autenticação. Tente fazer login novamente."
      });
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, error, navigate, toast]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Carregando...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 dark:border-gray-200 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Even if the user is not authenticated, for admin routes we want to allow access 
  // to the auth-config page, which we'll check in the component itself
  const currentPath = window.location.pathname;
  if (currentPath.includes('/cisadm/') && !isAuthenticated) {
    // For admin paths, we'll allow navigation but the components themselves
    // will handle authentication as needed
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
