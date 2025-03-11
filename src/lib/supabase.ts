
import { createClient } from '@supabase/supabase-js';

// Define default values (SFA project URL and anonymous key)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ycjmaxrexzzclhvgynwr.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inljam1heHJleHp6Y2xodmd5bndyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MTE1NDQsImV4cCI6MjA1NzE4NzU0NH0.1WpYuBnjP1AouBS61OLrnJKRC8dbaVoT0Bs4GAWR2hg';

// Check if environment variables are defined
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Variáveis de ambiente do Supabase não configuradas. Usando valores padrão.');
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Define types for our configurations
export interface AzureConfig {
  id?: string;
  clientid: string;
  tenant: string;
  secret?: string;
  created_at?: string;
}

// Function to fetch configuration
export async function getAzureConfig(): Promise<AzureConfig | null> {
  try {
    const { data, error } = await supabase
      .from('azure_creds')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Erro ao buscar configuração do Azure:', error);
      
      // Fallback to localStorage
      const clientId = localStorage.getItem('azure_ad_client_id');
      const tenant = localStorage.getItem('azure_ad_tenant');
      const secret = localStorage.getItem('azure_ad_client_secret');
      
      if (clientId && tenant) {
        console.log('Usando configurações do localStorage como fallback');
        return {
          clientid: clientId,
          tenant: tenant,
          secret: secret || undefined
        };
      }
      
      throw error;
    }
    
    // Store in localStorage as backup
    if (data) {
      localStorage.setItem('azure_ad_client_id', data.clientid);
      localStorage.setItem('azure_ad_tenant', data.tenant);
      if (data.secret) {
        localStorage.setItem('azure_ad_client_secret', data.secret);
      }
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar configuração do Azure:', error);
    
    // Last attempt to use localStorage
    const clientId = localStorage.getItem('azure_ad_client_id');
    const tenant = localStorage.getItem('azure_ad_tenant');
    const secret = localStorage.getItem('azure_ad_client_secret');
    
    if (clientId && tenant) {
      console.log('Usando configurações do localStorage após erro');
      return {
        clientid: clientId,
        tenant: tenant,
        secret: secret || undefined
      };
    }
    
    return null;
  }
}

// Function to save configuration
export async function saveAzureConfig(config: AzureConfig): Promise<boolean> {
  try {
    // Always store in localStorage as backup
    localStorage.setItem('azure_ad_client_id', config.clientid.trim());
    localStorage.setItem('azure_ad_tenant', config.tenant.trim());
    if (config.secret) {
      localStorage.setItem('azure_ad_client_secret', config.secret.trim());
    }
    
    const { error } = await supabase
      .from('azure_creds')
      .insert([
        {
          clientid: config.clientid.trim(),
          tenant: config.tenant.trim(),
          secret: config.secret?.trim() || null,
        }
      ]);

    if (error) {
      console.error('Erro ao salvar configuração do Azure no Supabase:', error);
      // We'll return true anyway since we saved to localStorage
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao salvar configuração do Azure:', error);
    // We'll return true if we at least saved to localStorage
    return localStorage.getItem('azure_ad_client_id') === config.clientid.trim() && 
           localStorage.getItem('azure_ad_tenant') === config.tenant.trim();
  }
}
