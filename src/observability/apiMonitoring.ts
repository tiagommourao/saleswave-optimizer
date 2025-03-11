
import { supabase } from '@/integrations/supabase/client';
import { logger } from './logger';

// Tipos de dados para rastreamento de API
interface ApiCallMetrics {
  endpoint: string;
  method: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  status?: number;
  success: boolean;
  error?: any;
}

let activeApiCalls: ApiCallMetrics[] = [];
const apiMetricsHistory: ApiCallMetrics[] = [];

/**
 * Intercepta e monitora chamadas de API do Supabase
 */
export const setupApiMonitoring = () => {
  // Infelizmente, o Supabase não oferece um sistema de interceptação de requisições como o Axios
  // Então, precisamos fazer um wrapper em torno de seus métodos principais

  // Exemplo de monitoramento de chamadas de API
  const originalSelect = supabase.from;
  
  // Cria um proxy para interceptar chamadas do supabase.from()
  supabase.from = function(table: string) {
    const originalMethods = originalSelect.call(this, table);
    
    // Cria um proxy para os métodos de consulta
    const monitoredMethods = {
      ...originalMethods,
      select: function(...args: any[]) {
        const callMetrics: ApiCallMetrics = {
          endpoint: `/${table}`,
          method: 'SELECT',
          startTime: performance.now(),
          success: true
        };
        
        activeApiCalls.push(callMetrics);
        
        const originalPromise = originalMethods.select.apply(this, args);
        
        return originalPromise.then((result: any) => {
          // Registrar sucesso
          finishApiCall(callMetrics, true, result);
          return result;
        }).catch((error: any) => {
          // Registrar erro
          finishApiCall(callMetrics, false, error);
          throw error;
        });
      },
      insert: function(...args: any[]) {
        const callMetrics: ApiCallMetrics = {
          endpoint: `/${table}`,
          method: 'INSERT',
          startTime: performance.now(),
          success: true
        };
        
        activeApiCalls.push(callMetrics);
        
        const originalPromise = originalMethods.insert.apply(this, args);
        
        return originalPromise.then((result: any) => {
          finishApiCall(callMetrics, true, result);
          return result;
        }).catch((error: any) => {
          finishApiCall(callMetrics, false, error);
          throw error;
        });
      },
      update: function(...args: any[]) {
        const callMetrics: ApiCallMetrics = {
          endpoint: `/${table}`,
          method: 'UPDATE',
          startTime: performance.now(),
          success: true
        };
        
        activeApiCalls.push(callMetrics);
        
        const originalPromise = originalMethods.update.apply(this, args);
        
        return originalPromise.then((result: any) => {
          finishApiCall(callMetrics, true, result);
          return result;
        }).catch((error: any) => {
          finishApiCall(callMetrics, false, error);
          throw error;
        });
      },
      delete: function(...args: any[]) {
        const callMetrics: ApiCallMetrics = {
          endpoint: `/${table}`,
          method: 'DELETE',
          startTime: performance.now(),
          success: true
        };
        
        activeApiCalls.push(callMetrics);
        
        const originalPromise = originalMethods.delete.apply(this, args);
        
        return originalPromise.then((result: any) => {
          finishApiCall(callMetrics, true, result);
          return result;
        }).catch((error: any) => {
          finishApiCall(callMetrics, false, error);
          throw error;
        });
      }
    };
    
    return monitoredMethods;
  } as any; // Necessário devido às tipagens do Supabase
  
  // Função para finalizar o monitoramento de uma chamada
  function finishApiCall(metrics: ApiCallMetrics, success: boolean, result: any) {
    metrics.endTime = performance.now();
    metrics.duration = metrics.endTime - metrics.startTime;
    metrics.success = success;
    
    if (!success && result) {
      metrics.error = result;
      logger.error(`Erro na chamada de API: ${metrics.method} ${metrics.endpoint}`, {
        duration: metrics.duration,
        error: result
      });
    } else {
      logger.debug(`Chamada de API bem-sucedida: ${metrics.method} ${metrics.endpoint}`, {
        duration: metrics.duration
      });
    }
    
    // Adicionar ao histórico
    apiMetricsHistory.push({ ...metrics });
    
    // Remover das chamadas ativas
    activeApiCalls = activeApiCalls.filter(call => call !== metrics);
  }
  
  return {
    getActiveApiCalls: () => [...activeApiCalls],
    getApiMetricsHistory: () => [...apiMetricsHistory],
    clearApiMetricsHistory: () => {
      apiMetricsHistory.length = 0;
    }
  };
};

// Exporta funções de utilidade
export const apiMonitoring = setupApiMonitoring();
