
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const { login, isAuthenticated, error, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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

    login();
  };

  const handleConfig = () => {
    navigate('/auth-config');
  };

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">CISER</CardTitle>
          <CardDescription>
            Entre com sua conta Microsoft para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <img 
              src="/placeholder.svg" 
              alt="CISER Logo" 
              className="w-32 h-32 mx-auto mb-6" 
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button className="w-full" onClick={handleLogin}>
            Entrar com Microsoft
          </Button>
          <Button className="w-full" variant="outline" onClick={handleConfig}>
            Configurar Azure AD
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
