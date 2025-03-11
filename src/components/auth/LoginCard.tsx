
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';
import { ConfigCheckResult } from '@/types/auth';
import { Image } from '@/components/ui/image';

interface LoginCardProps {
  handleLogin: () => void;
  loginInProgress: boolean;
  configCheck: ConfigCheckResult;
}

const LoginCard = ({ handleLogin, loginInProgress, configCheck }: LoginCardProps) => {
  const isConfigured = configCheck.clientId && configCheck.tenant;
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex justify-center items-center mb-4">
          <img 
            src="https://www.ciser.com.br/application/modules/comum/assets/img/logo-ciser.svg" 
            alt="CISER Logo" 
            className="h-12"
          />
        </div>
        <div className="text-center mb-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            COPILOTO DE VENDAS
          </h1>
        </div>
        <CardDescription className="text-center">
          {isConfigured 
            ? "Faça login com sua conta Microsoft"
            : "Configure o Azure AD para continuar"}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {!isConfigured && (
          <div className="rounded-md border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-orange-700 dark:text-orange-200">
                  Configuração incompleta. Configure o Azure AD antes de continuar.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          className="w-full" 
          onClick={handleLogin} 
          disabled={loginInProgress || !isConfigured}
        >
          {loginInProgress ? "Processando..." : (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              Entrar com Microsoft
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginCard;
