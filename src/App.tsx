
import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Index from './pages/Index';
import MyClients from './pages/MyClients';
import NewOrder from './pages/NewOrder';
import ProductCatalog from './pages/ProductCatalog';
import ReportsPage from './pages/Reports';
import NotFound from './pages/NotFound';
import AdminLayout from './components/admin/AdminLayout';
import AuthConfig from './pages/admin/AuthConfig';
import Observabilidade from './pages/admin/Observabilidade';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/toaster';
import { getAzureConfig } from './lib/supabase';
import { useToast } from './hooks/use-toast';

function App() {
  const [clientId, setClientId] = useState<string>('');
  const [tenant, setTenant] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadAttempted, setLoadAttempted] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const { toast } = useToast();
  
  const loadConfigurations = useCallback(async () => {
    if (isLoading && loadAttempted) return;
    
    setIsLoading(true);
    try {
      // Try to load from Supabase first
      const supabaseConfig = await getAzureConfig();
      
      if (supabaseConfig) {
        console.log('Configurações carregadas do Supabase');
        setClientId(supabaseConfig.clientid);
        setTenant(supabaseConfig.tenant);
        
        localStorage.setItem('azure_ad_client_id', supabaseConfig.clientid);
        localStorage.setItem('azure_ad_tenant', supabaseConfig.tenant);
        if (supabaseConfig.secret) {
          localStorage.setItem('azure_ad_client_secret', supabaseConfig.secret);
        }
      } else {
        // If not found in Supabase, try localStorage
        const savedClientId = localStorage.getItem('azure_ad_client_id') || '';
        const savedTenant = localStorage.getItem('azure_ad_tenant') || '';
        
        setClientId(savedClientId);
        setTenant(savedTenant);
        
        if (!savedClientId || !savedTenant) {
          console.warn('Nenhuma configuração encontrada no Supabase ou localStorage');
        }
      }
      setLoadError(null);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      setLoadError(error instanceof Error ? error : new Error(String(error)));
      
      // In case of error, try localStorage
      const savedClientId = localStorage.getItem('azure_ad_client_id') || '';
      const savedTenant = localStorage.getItem('azure_ad_tenant') || '';
      
      setClientId(savedClientId);
      setTenant(savedTenant);
      
      if (savedClientId && savedTenant) {
        toast({
          title: "Usando configurações locais",
          description: "Houve um erro ao acessar o banco de dados, usando configurações salvas localmente."
        });
      }
    } finally {
      setIsLoading(false);
      setLoadAttempted(true);
    }
  }, [isLoading, loadAttempted, toast]);

  useEffect(() => {
    // Ensure we load configurations
    if (!loadAttempted) {
      loadConfigurations();
    }

    const handleStorageChange = () => {
      setClientId(localStorage.getItem('azure_ad_client_id') || '');
      setTenant(localStorage.getItem('azure_ad_tenant') || '');
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Add a timeout to ensure we always exit loading state
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        const savedClientId = localStorage.getItem('azure_ad_client_id') || '';
        const savedTenant = localStorage.getItem('azure_ad_tenant') || '';
        
        setClientId(savedClientId);
        setTenant(savedTenant);
        
        toast({
          variant: "destructive",
          title: "Tempo esgotado",
          description: "Carregamento das configurações demorou muito tempo. Usando dados locais."
        });
      }
    }, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearTimeout(timer);
    };
  }, [loadConfigurations, loadAttempted, isLoading, toast]);

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
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/auth-callback" element={<AuthCallback />} />
            
            {/* Admin Routes */}
            <Route path="/cisadm" element={<AdminLayout />}>
              <Route index element={<Navigate to="/cisadm/auth-config" replace />} />
              <Route path="auth-config" element={<AuthConfig />} />
              <Route path="observabilidade" element={<Observabilidade />} />
            </Route>
            
            {/* Redirect old auth-config to new location */}
            <Route path="/auth-config" element={<Navigate to="/cisadm/auth-config" replace />} />
            
            {/* Protected App Routes */}
            <Route path="/" element={<PrivateRoute><Index /></PrivateRoute>} />
            <Route path="/relatorios" element={<PrivateRoute><ReportsPage /></PrivateRoute>} />
            <Route path="/novo-pedido" element={<PrivateRoute><NewOrder /></PrivateRoute>} />
            <Route path="/meus-clientes" element={<PrivateRoute><MyClients /></PrivateRoute>} />
            <Route path="/catalogo-produtos" element={<PrivateRoute><ProductCatalog /></PrivateRoute>} />
            
            {/* Legacy Routes for EN/PT compatibility */}
            <Route path="/reports" element={<Navigate to="/relatorios" replace />} />
            <Route path="/new-order" element={<Navigate to="/novo-pedido" replace />} />
            <Route path="/my-clients" element={<Navigate to="/meus-clientes" replace />} />
            <Route path="/product-catalog" element={<Navigate to="/catalogo-produtos" replace />} />
            
            {/* Fallback Routes */}
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
