
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Info, Lock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const AuthConfig = () => {
  const [clientId, setClientId] = useState<string>('');
  const [tenant, setTenant] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [showSecret, setShowSecret] = useState<boolean>(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState<boolean>(true);
  const [password, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const ADMIN_PASSWORD = "AMLvVk@C@N!Ztgf%k9aU";

  useEffect(() => {
    // Check if already authenticated
    const isAuthenticated = sessionStorage.getItem('admin_authenticated');
    if (isAuthenticated === 'true') {
      setAuthenticated(true);
      setShowPasswordDialog(false);
      
      // Only load settings if authenticated
      const savedClientId = localStorage.getItem('azure_ad_client_id');
      const savedTenant = localStorage.getItem('azure_ad_tenant');
      const savedClientSecret = localStorage.getItem('azure_ad_client_secret');
      
      if (savedClientId) setClientId(savedClientId);
      if (savedTenant) setTenant(savedTenant);
      if (savedClientSecret) setClientSecret(savedClientSecret);
    }
  }, []);

  const handlePasswordSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setShowPasswordDialog(false);
      sessionStorage.setItem('admin_authenticated', 'true');
      
      // Load settings after authentication
      const savedClientId = localStorage.getItem('azure_ad_client_id');
      const savedTenant = localStorage.getItem('azure_ad_tenant');
      const savedClientSecret = localStorage.getItem('azure_ad_client_secret');
      
      if (savedClientId) setClientId(savedClientId);
      if (savedTenant) setTenant(savedTenant);
      if (savedClientSecret) setClientSecret(savedClientSecret);
    } else {
      setPasswordError('Senha incorreta. Tente novamente.');
    }
  };

  const handleSave = () => {
    if (!clientId || !tenant) {
      toast({
        variant: "destructive",
        title: "Erro de configuração",
        description: "Client ID e Tenant são obrigatórios."
      });
      return;
    }

    // Remover espaços em branco extras que possam ter sido copiados
    const trimmedClientId = clientId.trim();
    const trimmedTenant = tenant.trim();
    const trimmedClientSecret = clientSecret.trim();

    localStorage.setItem('azure_ad_client_id', trimmedClientId);
    localStorage.setItem('azure_ad_tenant', trimmedTenant);
    
    // Salvar o Client Secret apenas se for fornecido
    if (trimmedClientSecret) {
      localStorage.setItem('azure_ad_client_secret', trimmedClientSecret);
      console.log("Cliente secret salvo com comprimento:", trimmedClientSecret.length);
    } else {
      localStorage.removeItem('azure_ad_client_secret');
      console.log("Cliente secret removido do localStorage");
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

  if (!authenticated) {
    return (
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Autenticação Administrativa</DialogTitle>
            <DialogDescription>
              Digite a senha de administrador para acessar as configurações do Azure AD
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-blue-500" />
              <Label htmlFor="password" className="font-medium">
                Senha de Administrador
              </Label>
            </div>
            <Input 
              id="password"
              type="password"
              placeholder="Digite a senha de administrador"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handlePasswordSubmit();
                }
              }}
            />
            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}
          </div>
          <DialogFooter className="flex space-x-2">
            <Button variant="outline" onClick={() => navigate('/login')}>
              Cancelar
            </Button>
            <Button onClick={handlePasswordSubmit}>
              Acessar Configurações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

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
            <div className="relative">
              <Input
                id="clientSecret"
                type={showSecret ? "text" : "password"}
                placeholder="Digite o Client Secret"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowSecret(!showSecret)}
              >
                {showSecret ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            <div className="flex items-start gap-2 mt-2 text-xs text-gray-500">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <p>
                Necessário para autenticação. Certifique-se de copiar o valor exato do Client Secret do Azure Portal, 
                sem espaços adicionais. Se estiver enfrentando erros, tente gerar um novo secret no Azure Portal.
              </p>
            </div>
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
