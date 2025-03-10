
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Settings, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login, isAuthenticated, error, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loginInProgress, setLoginInProgress] = useState(false);
  const [configCheck, setConfigCheck] = useState({
    clientId: false,
    tenant: false,
    clientSecret: false
  });

  // Verifica configurações ao carregar
  useEffect(() => {
    const clientId = localStorage.getItem('azure_ad_client_id');
    const tenant = localStorage.getItem('azure_ad_tenant');
    const clientSecret = localStorage.getItem('azure_ad_client_secret');
    
    setConfigCheck({
      clientId: !!clientId,
      tenant: !!tenant,
      clientSecret: !!clientSecret
    });
  }, []);

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

  const hasMinimumConfig = configCheck.clientId && configCheck.tenant;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">CISER</CardTitle>
          <CardDescription>
            {hasMinimumConfig 
              ? "Entre com sua conta Microsoft para acessar o sistema" 
              : "Configure o Azure AD para acessar o sistema"}
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
          
          {!hasMinimumConfig && (
            <div className="rounded-md bg-amber-50 dark:bg-amber-900/30 p-3 text-sm text-amber-800 dark:text-amber-200">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <p>Você precisa configurar o Client ID e Tenant antes de fazer login.</p>
              </div>
            </div>
          )}
          
          {hasMinimumConfig && !configCheck.clientSecret && (
            <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/30 p-3 text-sm text-yellow-800 dark:text-yellow-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <p>O Client Secret não está configurado. Isso pode ser necessário para alguns tipos de aplicativos Azure AD.</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button 
            className="w-full" 
            onClick={handleLogin} 
            disabled={loginInProgress || !hasMinimumConfig}
          >
            {loginInProgress ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Autenticando...
              </>
            ) : (
              "Entrar com Microsoft"
            )}
          </Button>
          <Button className="w-full" variant="outline" onClick={handleConfig}>
            {hasMinimumConfig ? "Editar Configuração Azure AD" : "Configurar Azure AD"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
