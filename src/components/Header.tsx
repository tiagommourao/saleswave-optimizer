
import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BellIcon, LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/auth/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  companyName: string;
  partnerCode: string;
  salesOrgName: string;
  userName: string;
}

const Header: FC<HeaderProps> = ({ companyName, partnerCode, salesOrgName, userName }) => {
  const { setTheme } = useTheme();
  const { logout, user } = useAuth();
  
  // Use o nome do usuário do Active Directory se disponível
  const displayName = user?.profile?.name || userName;
  
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-sfa-border dark:border-gray-700 px-4 py-2 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="font-bold text-xl text-sfa-primary dark:text-white">{companyName}</div>
        <div className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
          <span className="text-sfa-secondary dark:text-gray-300">Parceiro:</span> {partnerCode}
        </div>
        <div className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
          <span className="text-sfa-secondary dark:text-gray-300">Org. Vendas:</span> {salesOrgName}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <BellIcon className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <SettingsIcon className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-sfa-secondary dark:text-gray-300 hidden md:inline-block">Bem-vindo, {displayName}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src={user?.profile?.picture || ""} />
                <AvatarFallback className="bg-sfa-primary text-white">
                  <UserIcon className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Tema</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Claro
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Escuro
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                Sistema
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                <LogOutIcon className="h-4 w-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
