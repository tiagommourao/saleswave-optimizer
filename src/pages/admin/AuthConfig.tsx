
import { useAuthConfig } from '@/hooks/useAuthConfig';
import AzureConfigForm from '@/components/auth/AzureConfigForm';
import LoadingSpinner from '@/components/auth/LoadingSpinner';

const AuthConfig = () => {
  const { clientId, tenant, clientSecret, isLoading, loadSettings, loadAttempted } = useAuthConfig();

  // Load settings if not already loaded
  if (!loadAttempted) {
    loadSettings();
  }

  // Show a loading spinner while loading settings
  if (isLoading) {
    return <LoadingSpinner message="Carregando configurações..." />;
  }

  return (
    <div className="flex justify-center">
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
