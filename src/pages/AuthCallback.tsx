
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';

const AuthCallback = () => {
  const { userManager } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userManager) return;

    userManager.signinRedirectCallback()
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error('Signin error:', error);
        navigate('/auth-config');
      });
  }, [userManager, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Processando autenticação...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto"></div>
      </div>
    </div>
  );
};

export default AuthCallback;
