
import { useEffect, useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import LoginCard from '@/components/auth/LoginCard';
import LoadingSpinner from '@/components/auth/LoadingSpinner';
import { useAzureConfig } from '@/hooks/useAzureConfig';

const Login = () => {
  const { login, isAuthenticated, error, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loginInProgress, setLoginInProgress] = useState(false);
  const { configCheck, checkingConfig } = useAzureConfig();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro de autenticação",
        description: error.message
      });
      setLoginInProgress(false);
    }
  }, [error, toast]);

  const handleLogin = () => {
    const clientId = localStorage.getItem('azure_ad_client_id');
    const tenant = localStorage.getItem('azure_ad_tenant');
    
    if (!clientId || !tenant) {
      toast({
        variant: "destructive",
        title: "Configuração necessária",
        description: "Configure o Azure AD antes de fazer login."
      });
      navigate('/auth-config');
      return;
    }

    setLoginInProgress(true);
    login();
  };

  const handleConfig = () => {
    navigate('/auth-config');
  };

  if (isLoading || checkingConfig) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <LoginCard 
        handleLogin={handleLogin}
        handleConfig={handleConfig}
        loginInProgress={loginInProgress}
        configCheck={configCheck}
      />
    </div>
  );
};

export default Login;
