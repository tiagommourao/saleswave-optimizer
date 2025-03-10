
import { createClient } from '@supabase/supabase-js';

// Obter as variáveis de ambiente do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verificar se as variáveis estão definidas
if (!supabaseUrl || !supabaseKey) {
  console.error('Variáveis de ambiente do Supabase não configuradas');
}

// Criar e exportar o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);

// Definir os tipos para nossas configurações
export interface AzureConfig {
  id?: string;
  client_id: string;
  tenant: string;
  client_secret?: string;
  updated_at?: string;
}

// Função para buscar a configuração
export async function getAzureConfig(): Promise<AzureConfig | null> {
  try {
    const { data, error } = await supabase
      .from('azure_configs')
      .select('*')
      .order('updated_at', { ascending: false })
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
      .from('azure_configs')
      .insert([
        {
          client_id: config.client_id.trim(),
          tenant: config.tenant.trim(),
          client_secret: config.client_secret?.trim() || null,
          updated_at: new Date().toISOString()
        }
      ]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao salvar configuração do Azure:', error);
    return false;
  }
}
