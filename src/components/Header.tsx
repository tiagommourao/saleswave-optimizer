
import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BellIcon, SettingsIcon, UserIcon } from 'lucide-react';

interface HeaderProps {
  companyName: string;
  partnerCode: string;
  salesOrgName: string;
  userName: string;
}

const Header: FC<HeaderProps> = ({ companyName, partnerCode, salesOrgName, userName }) => {
  return (
    <header className="bg-white border-b border-sfa-border px-4 py-2 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="font-bold text-xl text-sfa-primary">{companyName}</div>
        <div className="text-xs bg-gray-100 px-2 py-1 rounded">
          <span className="text-sfa-secondary">Parceiro:</span> {partnerCode}
        </div>
        <div className="text-xs bg-gray-100 px-2 py-1 rounded">
          <span className="text-sfa-secondary">Org. Vendas:</span> {salesOrgName}
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
          <span className="text-sm text-sfa-secondary hidden md:inline-block">Bem-vindo, {userName}</span>
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback className="bg-sfa-primary text-white">
              <UserIcon className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
