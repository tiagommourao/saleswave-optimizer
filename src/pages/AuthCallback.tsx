
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

    console.log("Processando callback de autenticação...");
    
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
        // Extrair a mensagem de erro mais detalhada
        let detailedError = error.message;
        
        // Tentar obter mais detalhes do erro
        if (error.response) {
          try {
            console.log("Detalhes do erro:", error.response);
            if (typeof error.response === 'string') {
              detailedError += " - " + error.response;
            } else if (error.response.error_description) {
              detailedError += " - " + error.response.error_description;
            }
          } catch (e) {
            console.error("Erro ao processar detalhes do erro:", e);
          }
        }
        
        setErrorMessage("Falha na autenticação: " + detailedError);
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: "Ocorreu um problema durante a autenticação. Verifique os logs para mais detalhes."
        });
        
        // Aguardar um pouco mais para permitir ver o erro
        setTimeout(() => {
          navigate('/auth-config');
        }, 5000);
      });
  }, [userManager, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center max-w-lg">
        {errorMessage ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4 text-red-500">Erro de Autenticação</h2>
            <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-md border border-red-200 dark:border-red-800">
              <p className="text-red-700 dark:text-red-300 break-words">{errorMessage}</p>
            </div>
            <p className="text-sm text-gray-500 mt-4">Redirecionando para a página de configuração em 5 segundos...</p>
            <button 
              onClick={() => navigate('/auth-config')} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Ir para configuração agora
            </button>
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
