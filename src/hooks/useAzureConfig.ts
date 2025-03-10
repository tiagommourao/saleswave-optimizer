
import { useState, useEffect } from 'react';
import { getAzureConfig } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { ConfigCheckResult } from '@/types/auth';

export const useAzureConfig = () => {
  const [configCheck, setConfigCheck] = useState<ConfigCheckResult>({
    clientId: false,
    tenant: false,
    clientSecret: false,
    source: null
  });
  const [checkingConfig, setCheckingConfig] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkConfigurations = async () => {
      setCheckingConfig(true);
      try {
        // Verificar se existe configuração no Supabase
        const supabaseConfig = await getAzureConfig();
        
        if (supabaseConfig) {
          // Configuração encontrada no Supabase
          setConfigCheck({
            clientId: !!supabaseConfig.clientid,
            tenant: !!supabaseConfig.tenant,
            clientSecret: !!supabaseConfig.secret,
            source: "database"
          });
          console.log("Usando configurações do banco de dados");
        } else {
          // Caso não encontre no Supabase, verificar localStorage
          const clientId = localStorage.getItem('azure_ad_client_id');
          const tenant = localStorage.getItem('azure_ad_tenant');
          const clientSecret = localStorage.getItem('azure_ad_client_secret');
          
          setConfigCheck({
            clientId: !!clientId,
            tenant: !!tenant,
            clientSecret: !!clientSecret,
            source: "local"
          });
          console.log("Usando configurações locais");
        }
      } catch (error) {
        console.error("Erro ao verificar configurações:", error);
        // Em caso de erro, tenta usar o localStorage
        const clientId = localStorage.getItem('azure_ad_client_id');
        const tenant = localStorage.getItem('azure_ad_tenant');
        const clientSecret = localStorage.getItem('azure_ad_client_secret');
        
        setConfigCheck({
          clientId: !!clientId,
          tenant: !!tenant,
          clientSecret: !!clientSecret,
          source: "local"
        });
      } finally {
        setCheckingConfig(false);
      }
    };
    
    checkConfigurations();
  }, []);

  return { configCheck, checkingConfig };
};
