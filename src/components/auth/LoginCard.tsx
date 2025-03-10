
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Loader2, Settings, AlertCircle, Database, CloudOff } from 'lucide-react';
import { ConfigCheckResult } from '@/types/auth';

interface LoginCardProps {
  handleLogin: () => void;
  handleConfig: () => void;
  loginInProgress: boolean;
  configCheck: ConfigCheckResult;
}

const LoginCard = ({ 
  handleLogin, 
  handleConfig, 
  loginInProgress, 
  configCheck 
}: LoginCardProps) => {
  const hasMinimumConfig = configCheck.clientId && configCheck.tenant;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">CISER</CardTitle>
        <CardDescription>
          {hasMinimumConfig 
            ? "Entre com sua conta Microsoft para acessar o sistema" 
            : "Configure o Azure AD para acessar o sistema"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <img 
            src="/placeholder.svg" 
            alt="CISER Logo" 
            className="w-32 h-32 mx-auto mb-6" 
          />
        </div>
        
        {!hasMinimumConfig && (
          <div className="rounded-md bg-amber-50 dark:bg-amber-900/30 p-3 text-sm text-amber-800 dark:text-amber-200">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <p>Você precisa configurar o Client ID e Tenant antes de fazer login.</p>
            </div>
          </div>
        )}
        
        {hasMinimumConfig && !configCheck.clientSecret && (
          <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/30 p-3 text-sm text-yellow-800 dark:text-yellow-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <p>O Client Secret não está configurado. Isso pode ser necessário para alguns tipos de aplicativos Azure AD.</p>
            </div>
          </div>
        )}
        
        {hasMinimumConfig && (
          <div className="rounded-md bg-blue-50 dark:bg-blue-900/30 p-3 text-sm text-blue-800 dark:text-blue-200">
            <div className="flex items-center gap-2">
              {configCheck.source === "database" ? (
                <Database className="h-4 w-4" />
              ) : (
                <CloudOff className="h-4 w-4" />
              )}
              <p>
                {configCheck.source === "database" 
                  ? "Usando configurações sincronizadas do banco de dados." 
                  : "Usando configurações locais (não sincronizadas)."}
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-3">
        <Button 
          className="w-full" 
          onClick={handleLogin} 
          disabled={loginInProgress || !hasMinimumConfig}
        >
          {loginInProgress ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Autenticando...
            </>
          ) : (
            "Entrar com Microsoft"
          )}
        </Button>
        <Button className="w-full" variant="outline" onClick={handleConfig}>
          {hasMinimumConfig ? "Editar Configuração Azure AD" : "Configurar Azure AD"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginCard;
