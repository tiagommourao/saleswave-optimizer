
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const AuthConfig = () => {
  const [clientId, setClientId] = useState<string>('');
  const [tenant, setTenant] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Carregar configurações salvas
    const savedClientId = localStorage.getItem('azure_ad_client_id');
    const savedTenant = localStorage.getItem('azure_ad_tenant');
    const savedClientSecret = localStorage.getItem('azure_ad_client_secret');
    
    if (savedClientId) setClientId(savedClientId);
    if (savedTenant) setTenant(savedTenant);
    if (savedClientSecret) setClientSecret(savedClientSecret);
  }, []);

  const handleSave = () => {
    if (!clientId || !tenant) {
      toast({
        variant: "destructive",
        title: "Erro de configuração",
        description: "Client ID e Tenant são obrigatórios."
      });
      return;
    }

    localStorage.setItem('azure_ad_client_id', clientId);
    localStorage.setItem('azure_ad_tenant', tenant);
    
    // Salvar o Client Secret apenas se for fornecido
    if (clientSecret) {
      localStorage.setItem('azure_ad_client_secret', clientSecret);
    } else {
      localStorage.removeItem('azure_ad_client_secret');
    }

    toast({
      title: "Configuração salva",
      description: "As configurações do Azure AD foram salvas com sucesso."
    });

    // Após salvar, redireciona para a página de login
    setTimeout(() => {
      navigate('/login');
    }, 1500); // Pequeno atraso para que o usuário veja a mensagem de sucesso
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Configuração do Azure AD</CardTitle>
          <CardDescription>
            Configure os parâmetros para autenticação com o Active Directory
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-blue-50 dark:bg-blue-900/30 p-3 text-sm text-blue-800 dark:text-blue-200 mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <p>Configure todos os campos necessários para o Azure AD.</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clientId">Client ID <span className="text-red-500">*</span></Label>
            <Input
              id="clientId"
              placeholder="Digite o Client ID"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tenant">Tenant (Directory ID) <span className="text-red-500">*</span></Label>
            <Input
              id="tenant"
              placeholder="Digite o Tenant ID"
              value={tenant}
              onChange={(e) => setTenant(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clientSecret">Client Secret</Label>
            <Input
              id="clientSecret"
              type="password"
              placeholder="Digite o Client Secret"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
            />
            <p className="text-xs text-gray-500">Necessário para alguns fluxos de autenticação</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" onClick={handleSave}>
            Salvar Configuração
          </Button>
          <Button variant="outline" className="w-full" onClick={handleBackToLogin}>
            Voltar ao Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthConfig;
