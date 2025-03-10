import { useState, useEffect } from 'react';
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

function App() {
  const [clientId, setClientId] = useState<string>('');
  const [tenant, setTenant] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Carregar configurações do Azure AD do localStorage
    const savedClientId = localStorage.getItem('azure_ad_client_id') || '';
    const savedTenant = localStorage.getItem('azure_ad_tenant') || '';
    const savedClientSecret = localStorage.getItem('azure_ad_client_secret') || undefined;
    
    setClientId(savedClientId);
    setTenant(savedTenant);
    setClientSecret(savedClientSecret);
    
    // Monitorar mudanças nas configurações
    const handleStorageChange = () => {
      setClientId(localStorage.getItem('azure_ad_client_id') || '');
      setTenant(localStorage.getItem('azure_ad_tenant') || '');
      setClientSecret(localStorage.getItem('azure_ad_client_secret') || undefined);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider clientId={clientId} tenant={tenant} clientSecret={clientSecret}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/auth-config" element={<AuthConfig />} />
            <Route path="/auth-callback" element={<AuthCallback />} />
            <Route path="/" element={<PrivateRoute><Index /></PrivateRoute>} />
            <Route path="/meus-clientes" element={<PrivateRoute><MyClients /></PrivateRoute>} />
            <Route path="/novo-pedido" element={<PrivateRoute><NewOrder /></PrivateRoute>} />
            <Route path="/catalogo-produtos" element={<PrivateRoute><ProductCatalog /></PrivateRoute>} />
            <Route path="/relatorios" element={<PrivateRoute><ReportsPage /></PrivateRoute>} />
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
