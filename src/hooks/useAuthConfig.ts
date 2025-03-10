
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getAzureConfig } from '@/lib/supabase';

export const useAuthConfig = () => {
  const [clientId, setClientId] = useState<string>('');
  const [tenant, setTenant] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadAttempted, setLoadAttempted] = useState<boolean>(false);
  const { toast } = useToast();

  const loadSettings = useCallback(async () => {
    // If we've already attempted to load, don't try again
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      // Tentar carregar do Supabase primeiro
      const supabaseConfig = await getAzureConfig();
      
      if (supabaseConfig) {
        console.log('Configurações carregadas do Supabase');
        setClientId(supabaseConfig.clientid);
        setTenant(supabaseConfig.tenant);
        setClientSecret(supabaseConfig.secret || '');
        
        toast({
          title: "Configurações carregadas",
          description: "Configurações carregadas do banco de dados com sucesso."
        });
      } else {
        // Se não encontrar no Supabase, usar o localStorage
        const savedClientId = localStorage.getItem('azure_ad_client_id');
        const savedTenant = localStorage.getItem('azure_ad_tenant');
        const savedClientSecret = localStorage.getItem('azure_ad_client_secret');
        
        if (savedClientId) setClientId(savedClientId);
        if (savedTenant) setTenant(savedTenant);
        if (savedClientSecret) setClientSecret(savedClientSecret);
        
        if (savedClientId || savedTenant) {
          toast({
            title: "Configurações locais carregadas",
            description: "Configurações carregadas do armazenamento local."
          });
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar configurações",
        description: "Não foi possível carregar as configurações do Azure AD."
      });
      
      // Em caso de erro, tentar localStorage
      const savedClientId = localStorage.getItem('azure_ad_client_id');
      const savedTenant = localStorage.getItem('azure_ad_tenant');
      const savedClientSecret = localStorage.getItem('azure_ad_client_secret');
      
      if (savedClientId) setClientId(savedClientId);
      if (savedTenant) setTenant(savedTenant);
      if (savedClientSecret) setClientSecret(savedClientSecret);
    } finally {
      setIsLoading(false);
      setLoadAttempted(true);
    }
  }, [toast, isLoading]);

  return { 
    clientId, 
    tenant, 
    clientSecret, 
    isLoading, 
    loadSettings,
    loadAttempted
  };
};
