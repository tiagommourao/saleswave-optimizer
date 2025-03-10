
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

interface AdminPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthenticate: () => void;
}

// This constant is moved from AuthConfig
const ADMIN_PASSWORD = "AMLvVk@C@N!Ztgf%k9aU";

const AdminPasswordDialog = ({ open, onOpenChange, onAuthenticate }: AdminPasswordDialogProps) => {
  const [password, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const navigate = useNavigate();

  const handlePasswordSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      setPasswordError('');
      sessionStorage.setItem('admin_authenticated', 'true');
      onAuthenticate();
    } else {
      setPasswordError('Senha incorreta. Tente novamente.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
};

export default AdminPasswordDialog;
