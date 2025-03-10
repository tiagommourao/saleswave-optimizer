
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/auth/AuthContext';
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import NewOrder from "./pages/NewOrder";
import Reports from "./pages/Reports";
import MyClients from "./pages/MyClients";
import ProductCatalog from "./pages/ProductCatalog";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AuthConfig from "./pages/AuthConfig";
import AuthCallback from "./pages/AuthCallback";
import PrivateRoute from "./components/PrivateRoute";

const queryClient = new QueryClient();

const App = () => {
  const [clientId, setClientId] = useState<string>('');
  const [tenant, setTenant] = useState<string>('');

  useEffect(() => {
    // Carregar configurações salvas
    const savedClientId = localStorage.getItem('azure_ad_client_id');
    const savedTenant = localStorage.getItem('azure_ad_tenant');
    
    if (savedClientId) setClientId(savedClientId);
    if (savedTenant) setTenant(savedTenant);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider clientId={clientId} tenant={tenant}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/auth-config" element={<AuthConfig />} />
                <Route path="/auth-callback" element={<AuthCallback />} />
                <Route path="/" element={
                  <PrivateRoute>
                    <Index />
                  </PrivateRoute>
                } />
                <Route path="/new-order" element={
                  <PrivateRoute>
                    <NewOrder />
                  </PrivateRoute>
                } />
                <Route path="/reports" element={
                  <PrivateRoute>
                    <Reports />
                  </PrivateRoute>
                } />
                <Route path="/my-clients" element={
                  <PrivateRoute>
                    <MyClients />
                  </PrivateRoute>
                } />
                <Route path="/product-catalog" element={
                  <PrivateRoute>
                    <ProductCatalog />
                  </PrivateRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
