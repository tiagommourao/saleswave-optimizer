
import { createClient } from '@supabase/supabase-js';

// Definir valores padrão (URL e chave anônima do projeto SFA)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ycjmaxrexzzclhvgynwr.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inljam1heHJleHp6Y2xodmd5bndyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MTE1NDQsImV4cCI6MjA1NzE4NzU0NH0.1WpYuBnjP1AouBS61OLrnJKRC8dbaVoT0Bs4GAWR2hg';

// Verificar se as variáveis estão definidas (apenas log, agora temos valores padrão)
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Variáveis de ambiente do Supabase não configuradas. Usando valores padrão.');
}

// Criar e exportar o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);

// Definir os tipos para nossas configurações
export interface AzureConfig {
  id?: string;
  clientid: string;
  tenant: string;
  secret?: string;
  created_at?: string;
}

// Função para buscar a configuração
export async function getAzureConfig(): Promise<AzureConfig | null> {
  try {
    const { data, error } = await supabase
      .from('azure_creds')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar configuração do Azure:', error);
    return null;
  }
}

// Função para salvar a configuração
export async function saveAzureConfig(config: AzureConfig): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('azure_creds')
      .insert([
        {
          clientid: config.clientid.trim(),
          tenant: config.tenant.trim(),
          secret: config.secret?.trim() || null,
        }
      ]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao salvar configuração do Azure:', error);
    return false;
  }
}
