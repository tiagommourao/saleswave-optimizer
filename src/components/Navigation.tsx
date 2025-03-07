
import { FC, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboardIcon, BarChartIcon, PackageIcon, UsersIcon, FileTextIcon } from 'lucide-react';

interface NavigationProps {
  onTabChange: (value: string) => void;
}

const Navigation: FC<NavigationProps> = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onTabChange(value);
  };

  return (
    <div className="bg-white border-b border-sfa-border sticky top-14 z-40">
      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full flex justify-start h-12 bg-white px-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2 px-4 py-2">
            <LayoutDashboardIcon className="h-4 w-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2 px-4 py-2">
            <BarChartIcon className="h-4 w-4" />
            <span>Relatórios</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2 px-4 py-2">
            <PackageIcon className="h-4 w-4" />
            <span>Produtos</span>
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2 px-4 py-2">
            <UsersIcon className="h-4 w-4" />
            <span>Clientes</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2 px-4 py-2">
            <FileTextIcon className="h-4 w-4" />
            <span>Pedidos</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default Navigation;
