
import { useState, useEffect } from 'react';
import AdminPasswordDialog from '@/components/auth/AdminPasswordDialog';
import AzureConfigForm from '@/components/auth/AzureConfigForm';
import { useAuthConfig } from '@/hooks/useAuthConfig';
import LoadingSpinner from '@/components/auth/LoadingSpinner';

const AuthConfig = () => {
  const [showPasswordDialog, setShowPasswordDialog] = useState<boolean>(true);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const { clientId, tenant, clientSecret, isLoading, loadSettings } = useAuthConfig();

  useEffect(() => {
    // Check if already authenticated
    const isAuthenticated = sessionStorage.getItem('admin_authenticated');
    if (isAuthenticated === 'true') {
      setAuthenticated(true);
      setShowPasswordDialog(false);
      
      // Only load settings if authenticated
      loadSettings();
    }
  }, [loadSettings]);

  const handleAuthenticate = () => {
    setAuthenticated(true);
    setShowPasswordDialog(false);
    
    // Load settings after authentication
    loadSettings();
  };

  if (!authenticated) {
    return (
      <AdminPasswordDialog 
        open={showPasswordDialog} 
        onOpenChange={setShowPasswordDialog}
        onAuthenticate={handleAuthenticate}
      />
    );
  }

  // Show a loading spinner while loading settings
  if (isLoading) {
    return <LoadingSpinner message="Carregando configurações..." />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <AzureConfigForm
        initialClientId={clientId}
        initialTenant={tenant}
        initialClientSecret={clientSecret}
        isLoading={isLoading}
        onReload={loadSettings}
      />
    </div>
  );
};

export default AuthConfig;
