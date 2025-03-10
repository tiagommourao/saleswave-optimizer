
import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import AuthConfig from './pages/AuthConfig';
import AuthCallback from './pages/AuthCallback';
import Index from './pages/Index';
import MyClients from './pages/MyClients';
import NewOrder from './pages/NewOrder';
import ProductCatalog from './pages/ProductCatalog';
import ReportsPage from './pages/Reports';
import NotFound from './pages/NotFound';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/toaster';
import { getAzureConfig } from './lib/supabase';
import { useToast } from './hooks/use-toast';

function App() {
  const [clientId, setClientId] = useState<string>('');
  const [tenant, setTenant] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadAttempted, setLoadAttempted] = useState<boolean>(false);
  const { toast } = useToast();

  const loadConfigurations = useCallback(async () => {
    if (isLoading && loadAttempted) return;
    
    setIsLoading(true);
    try {
      const supabaseConfig = await getAzureConfig();
      
      if (supabaseConfig) {
        console.log('Configurações carregadas do Supabase');
        setClientId(supabaseConfig.clientid);
        setTenant(supabaseConfig.tenant);
        
        localStorage.setItem('azure_ad_client_id', supabaseConfig.clientid);
        localStorage.setItem('azure_ad_tenant', supabaseConfig.tenant);
      } else {
        const savedClientId = localStorage.getItem('azure_ad_client_id') || '';
        const savedTenant = localStorage.getItem('azure_ad_tenant') || '';
        
        setClientId(savedClientId);
        setTenant(savedTenant);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar configurações",
        description: "Não foi possível carregar as configurações do Azure AD."
      });
      
      const savedClientId = localStorage.getItem('azure_ad_client_id') || '';
      const savedTenant = localStorage.getItem('azure_ad_tenant') || '';
      
      setClientId(savedClientId);
      setTenant(savedTenant);
    } finally {
      setIsLoading(false);
      setLoadAttempted(true);
    }
  }, [isLoading, loadAttempted, toast]);

  useEffect(() => {
    if (!loadAttempted) {
      loadConfigurations();
    }

    const handleStorageChange = () => {
      setClientId(localStorage.getItem('azure_ad_client_id') || '');
      setTenant(localStorage.getItem('azure_ad_tenant') || '');
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadConfigurations, loadAttempted]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Carregando configurações...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 dark:border-gray-200 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider clientId={clientId} tenant={tenant}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/auth-config" element={<AuthConfig />} />
            <Route path="/auth-callback" element={<AuthCallback />} />
            <Route path="/" element={<PrivateRoute><Index /></PrivateRoute>} />
            
            <Route path="/relatorios" element={<PrivateRoute><ReportsPage /></PrivateRoute>} />
            <Route path="/novo-pedido" element={<PrivateRoute><NewOrder /></PrivateRoute>} />
            <Route path="/meus-clientes" element={<PrivateRoute><MyClients /></PrivateRoute>} />
            <Route path="/catalogo-produtos" element={<PrivateRoute><ProductCatalog /></PrivateRoute>} />
            
            <Route path="/reports" element={<Navigate to="/relatorios" replace />} />
            <Route path="/new-order" element={<Navigate to="/novo-pedido" replace />} />
            <Route path="/my-clients" element={<Navigate to="/meus-clientes" replace />} />
            <Route path="/product-catalog" element={<Navigate to="/catalogo-produtos" replace />} />
            
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
