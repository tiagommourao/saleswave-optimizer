
import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, FileBarChart, ShoppingCart, Users, Package } from 'lucide-react';

interface NavigationProps {
  onTabChange: (value: string) => void;
}

const Navigation: FC<NavigationProps> = ({ onTabChange }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path === '/reports' && currentPath === '/reports') return true;
    if (path === '/new-order' && currentPath === '/new-order') return true;
    if (path === '/my-clients' && currentPath === '/my-clients') return true;
    if (path === '/product-catalog' && currentPath === '/product-catalog') return true;
    return false;
  };

  return (
    <div className="bg-white border-b border-sfa-border dark:bg-gray-800 dark:border-gray-700 sticky top-16 z-40 w-full">
      <div className="container mx-auto px-4">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="h-14 bg-transparent border-b-0 w-full justify-start gap-2 px-0 overflow-x-auto">
            <Link to="/" className="w-auto">
              <TabsTrigger 
                value="dashboard" 
                className={`h-14 px-4 data-[state=active]:border-b-2 data-[state=active]:border-sfa-primary data-[state=active]:text-sfa-primary rounded-none dark:text-gray-300 dark:data-[state=active]:text-white ${isActive('/') ? 'border-b-2 border-sfa-primary text-sfa-primary dark:text-white' : ''}`}
                onClick={() => onTabChange('dashboard')}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
            </Link>
            <Link to="/reports" className="w-auto">
              <TabsTrigger 
                value="reports" 
                className={`h-14 px-4 data-[state=active]:border-b-2 data-[state=active]:border-sfa-primary data-[state=active]:text-sfa-primary rounded-none dark:text-gray-300 dark:data-[state=active]:text-white ${isActive('/reports') ? 'border-b-2 border-sfa-primary text-sfa-primary dark:text-white' : ''}`}
                onClick={() => onTabChange('reports')}
              >
                <FileBarChart className="h-4 w-4 mr-2" />
                Relatórios
              </TabsTrigger>
            </Link>
            <Link to="/new-order" className="w-auto">
              <TabsTrigger 
                value="new-order" 
                className={`h-14 px-4 data-[state=active]:border-b-2 data-[state=active]:border-sfa-primary data-[state=active]:text-sfa-primary rounded-none dark:text-gray-300 dark:data-[state=active]:text-white ${isActive('/new-order') ? 'border-b-2 border-sfa-primary text-sfa-primary dark:text-white' : ''}`}
                onClick={() => onTabChange('new-order')}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Novo Pedido
              </TabsTrigger>
            </Link>
            <Link to="/my-clients" className="w-auto">
              <TabsTrigger 
                value="my-clients" 
                className={`h-14 px-4 data-[state=active]:border-b-2 data-[state=active]:border-sfa-primary data-[state=active]:text-sfa-primary rounded-none dark:text-gray-300 dark:data-[state=active]:text-white ${isActive('/my-clients') ? 'border-b-2 border-sfa-primary text-sfa-primary dark:text-white' : ''}`}
                onClick={() => onTabChange('my-clients')}
              >
                <Users className="h-4 w-4 mr-2" />
                Meus Clientes
              </TabsTrigger>
            </Link>
            <Link to="/product-catalog" className="w-auto">
              <TabsTrigger 
                value="product-catalog" 
                className={`h-14 px-4 data-[state=active]:border-b-2 data-[state=active]:border-sfa-primary data-[state=active]:text-sfa-primary rounded-none dark:text-gray-300 dark:data-[state=active]:text-white ${isActive('/product-catalog') ? 'border-b-2 border-sfa-primary text-sfa-primary dark:text-white' : ''}`}
                onClick={() => onTabChange('product-catalog')}
              >
                <Package className="h-4 w-4 mr-2" />
                Catálogo de Produtos
              </TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default Navigation;
