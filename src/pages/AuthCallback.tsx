
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const { userManager } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!userManager) {
      setErrorMessage("Configuração de autenticação não encontrada.");
      return;
    }

    userManager.signinRedirectCallback()
      .then((user) => {
        console.log("Login bem-sucedido:", user);
        toast({
          title: "Autenticação bem-sucedida",
          description: "Você está conectado e será redirecionado."
        });
        navigate('/');
      })
      .catch((error) => {
        console.error('Erro de autenticação:', error);
        setErrorMessage("Falha na autenticação. Verifique suas configurações do Azure AD.");
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: error.message || "Ocorreu um erro durante a autenticação."
        });
        setTimeout(() => {
          navigate('/auth-config');
        }, 3000);
      });
  }, [userManager, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        {errorMessage ? (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-red-500">Erro de Autenticação</h2>
            <p className="mb-4">{errorMessage}</p>
            <p className="text-sm text-gray-500">Redirecionando para a página de configuração...</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4">Processando autenticação...</h2>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 dark:border-gray-200 mx-auto"></div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
