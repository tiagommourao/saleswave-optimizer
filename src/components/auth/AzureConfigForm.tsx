
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Info, RefreshCw } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAzureConfig } from '@/lib/supabase';

interface AzureConfigFormProps {
  initialClientId: string;
  initialTenant: string;
  initialClientSecret: string;
  isLoading: boolean;
  onReload: () => void;
}

const AzureConfigForm = ({
  initialClientId,
  initialTenant,
  initialClientSecret,
  isLoading,
  onReload
}: AzureConfigFormProps) => {
  const [clientId, setClientId] = useState<string>(initialClientId);
  const [tenant, setTenant] = useState<string>(initialTenant);
  const [clientSecret, setClientSecret] = useState<string>(initialClientSecret);
  const [showSecret, setShowSecret] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSave = async () => {
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

    setIsSaving(true);
    
    try {
      // Salvar no Supabase
      const saved = await saveAzureConfig({
        clientid: trimmedClientId,
        tenant: trimmedTenant,
        secret: trimmedClientSecret || undefined
      });
      
      if (!saved) {
        throw new Error("Falha ao salvar no banco de dados");
      }
      
      // Também salvar no localStorage para compatibilidade
      localStorage.setItem('azure_ad_client_id', trimmedClientId);
      localStorage.setItem('azure_ad_tenant', trimmedTenant);
      
      if (trimmedClientSecret) {
        localStorage.setItem('azure_ad_client_secret', trimmedClientSecret);
      } else {
        localStorage.removeItem('azure_ad_client_secret');
      }

      toast({
        title: "Configuração salva",
        description: "As configurações do Azure AD foram salvas com sucesso no banco de dados e localmente."
      });

      // Após salvar, redireciona para a página de login
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações no banco de dados. Tente novamente."
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Configuração do Azure AD</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Configure os parâmetros para autenticação com o Active Directory
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md bg-blue-50 dark:bg-blue-900/30 p-3 text-sm text-blue-800 dark:text-blue-200 mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <p>As configurações serão salvas no banco de dados e estarão disponíveis em todos os dispositivos.</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="clientId">Client ID <span className="text-red-500">*</span></Label>
          <Input
            id="clientId"
            placeholder="Digite o Client ID"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tenant">Tenant (Directory ID) <span className="text-red-500">*</span></Label>
          <Input
            id="tenant"
            placeholder="Digite o Tenant ID"
            value={tenant}
            onChange={(e) => setTenant(e.target.value)}
            disabled={isLoading}
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
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowSecret(!showSecret)}
              disabled={isLoading}
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
        <Button 
          className="w-full" 
          onClick={handleSave} 
          disabled={isSaving || isLoading}
        >
          {isSaving ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar Configuração"
          )}
        </Button>
        <Button variant="outline" className="w-full" onClick={() => navigate('/login')} disabled={isSaving || isLoading}>
          Voltar ao Login
        </Button>
        <Button 
          variant="ghost" 
          className="w-full" 
          onClick={onReload} 
          disabled={isSaving || isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Recarregar Configurações
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AzureConfigForm;
