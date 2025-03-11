
import { useState, useEffect, useRef } from 'react';
import { getAzureConfig } from '@/lib/supabase';
import { ConfigCheckResult } from '@/types/auth';

export const useAzureConfig = () => {
  const [configCheck, setConfigCheck] = useState<ConfigCheckResult>({
    clientId: false,
    tenant: false,
    clientSecret: false,
    source: null
  });
  const [checkingConfig, setCheckingConfig] = useState<boolean>(true);
  const checkAttempted = useRef<boolean>(false);

  useEffect(() => {
    const checkConfigurations = async () => {
      // If already attempted, don't check again
      if (checkAttempted.current) return;
      
      checkAttempted.current = true;
      setCheckingConfig(true);
      
      try {
        // Try to get configuration from Supabase
        const supabaseConfig = await getAzureConfig();
        
        if (supabaseConfig) {
          // Store configuration in localStorage for backup
          localStorage.setItem('azure_ad_client_id', supabaseConfig.clientid);
          localStorage.setItem('azure_ad_tenant', supabaseConfig.tenant);
          if (supabaseConfig.secret) {
            localStorage.setItem('azure_ad_client_secret', supabaseConfig.secret);
          }
          
          // Configuration found in Supabase
          setConfigCheck({
            clientId: !!supabaseConfig.clientid,
            tenant: !!supabaseConfig.tenant,
            clientSecret: !!supabaseConfig.secret,
            source: "database"
          });
          console.log("Usando configurações do banco de dados");
        } else {
          // If not found in Supabase, check localStorage
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
        // In case of error, try to use localStorage
        const clientId = localStorage.getItem('azure_ad_client_id');
        const tenant = localStorage.getItem('azure_ad_tenant');
        const clientSecret = localStorage.getItem('azure_ad_client_secret');
        
        setConfigCheck({
          clientId: !!clientId,
          tenant: !!tenant,
          clientSecret: !!clientSecret,
          source: "local"
        });
        console.log("Erro ao acessar configurações do banco, usando configurações locais");
      } finally {
        setCheckingConfig(false);
      }
    };
    
    checkConfigurations();
  }, []);

  return { configCheck, checkingConfig };
};
