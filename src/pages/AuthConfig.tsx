
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const AuthConfig = () => {
  const [clientId, setClientId] = useState<string>('');
  const [tenant, setTenant] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    // Carregar configurações salvas
    const savedClientId = localStorage.getItem('azure_ad_client_id');
    const savedTenant = localStorage.getItem('azure_ad_tenant');
    
    if (savedClientId) setClientId(savedClientId);
    if (savedTenant) setTenant(savedTenant);
  }, []);

  const handleSave = () => {
    if (!clientId || !tenant) {
      toast({
        variant: "destructive",
        title: "Erro de configuração",
        description: "Todos os campos são obrigatórios."
      });
      return;
    }

    localStorage.setItem('azure_ad_client_id', clientId);
    localStorage.setItem('azure_ad_tenant', tenant);

    toast({
      title: "Configuração salva",
      description: "As configurações do Azure AD foram salvas com sucesso."
    });
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
          <div className="space-y-2">
            <Label htmlFor="clientId">Client ID</Label>
            <Input
              id="clientId"
              placeholder="Digite o Client ID"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tenant">Tenant (Directory ID)</Label>
            <Input
              id="tenant"
              placeholder="Digite o Tenant ID"
              value={tenant}
              onChange={(e) => setTenant(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSave}>
            Salvar Configuração
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthConfig;
