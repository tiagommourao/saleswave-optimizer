
import { useEffect, useState } from 'react';
import { logger } from './logger';
import { useAuth } from '@/auth/AuthContext';
import { useLocation } from 'react-router-dom';

interface ErrorMonitoringProps {
  componentName: string;
}

/**
 * Hook para monitorar erros em componentes React
 */
export const useErrorMonitoring = ({ componentName }: ErrorMonitoringProps) => {
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const location = useLocation();

  // Capturar e registrar erros não tratados
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      logger.error(
        `Erro não tratado em ${componentName}: ${event.message}`,
        {
          stack: event.error?.stack,
          componentName,
          errorType: 'Unhandled'
        },
        user?.id,
        location.pathname
      );
      setError(event.error);
    };

    // Capturar erros de promises não tratadas
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logger.error(
        `Promise rejeitada não tratada em ${componentName}`,
        {
          reason: event.reason,
          componentName,
          errorType: 'UnhandledPromiseRejection'
        },
        user?.id,
        location.pathname
      );
      if (event.reason instanceof Error) {
        setError(event.reason);
      } else {
        setError(new Error(String(event.reason)));
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [componentName, user, location.pathname]);

  // Registrar renderização do componente (pode ser útil para análise de desempenho)
  useEffect(() => {
    logger.debug(
      `Componente ${componentName} montado`,
      {
        componentName,
        path: location.pathname
      },
      user?.id,
      location.pathname
    );

    return () => {
      logger.debug(
        `Componente ${componentName} desmontado`,
        {
          componentName,
          path: location.pathname
        },
        user?.id,
        location.pathname
      );
    };
  }, [componentName, user, location.pathname]);

  return { error, setError };
};
