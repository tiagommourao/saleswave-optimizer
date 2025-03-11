
import { useState, useEffect, ErrorInfo } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { logger } from './logger';
import { useLocation } from 'react-router-dom';

// Type definition for the error information
interface ErrorData {
  error: Error;
  errorInfo: ErrorInfo | null;
  componentStack?: string;
  timestamp: Date;
}

// Hook for monitoring component errors
export const useErrorMonitoring = (componentName: string) => {
  const [error, setError] = useState<ErrorData | null>(null);
  const { user } = useAuth();
  const location = useLocation();
  
  // Log the error when it occurs
  useEffect(() => {
    if (error) {
      // Create a context object with relevant error details
      const errorContext = {
        componentName,
        errorMessage: error.error.message,
        errorStack: error.error.stack,
        componentStack: error.errorInfo?.componentStack || error.componentStack,
        path: location.pathname,
        userInfo: user ? {
          email: user.email,
          userId: user.id?.toString() || 'unknown', // Fix TS2339 error by adding optional chaining
        } : null,
        timestamp: error.timestamp
      };
      
      // Log the error to our logging system
      logger.error(
        `Error in component: ${componentName}`,
        errorContext,
        user?.id?.toString(), // Fix TS2339 error by adding optional chaining
        location.pathname
      );
    }
  }, [error, componentName, user, location]);
  
  // Error handler function to be used in componentDidCatch
  const handleComponentError = (error: Error, errorInfo: ErrorInfo) => {
    setError({
      error,
      errorInfo,
      timestamp: new Date()
    });
  };
  
  // Function to manually log an error
  const logError = (error: Error, componentStack?: string) => {
    // Create the error data object
    const errorData: ErrorData = {
      error,
      errorInfo: null,
      componentStack,
      timestamp: new Date()
    };
    
    // Set the error state which will trigger the useEffect hook
    setError(errorData);
    
    // Additionally, log directly for immediate feedback
    logger.error(
      `Manual error log from ${componentName}`,
      {
        errorMessage: error.message,
        errorStack: error.stack,
        componentStack,
        path: location.pathname,
        userInfo: user ? {
          email: user.email,
          userId: user.id?.toString() || 'unknown', // Fix TS2339 error by adding optional chaining
        } : null,
      },
      user?.id?.toString(), // Fix TS2339 error by adding optional chaining
      location.pathname
    );
  };
  
  return {
    error,
    handleComponentError,
    logError
  };
};
