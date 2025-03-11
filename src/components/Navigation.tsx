
import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChartIcon, 
  PackageIcon, 
  ShoppingCartIcon, 
  UsersIcon,
  ActivityIcon,
  LucideIcon
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: BarChartIcon
  },
  {
    title: 'Meus Clientes',
    href: '/meus-clientes',
    icon: UsersIcon
  },
  {
    title: 'Novo Pedido',
    href: '/novo-pedido',
    icon: ShoppingCartIcon
  },
  {
    title: 'Catálogo de Produtos',
    href: '/catalogo-produtos',
    icon: PackageIcon
  },
  {
    title: 'Relatórios',
    href: '/relatorios',
    icon: BarChartIcon
  },
  {
    title: 'Observabilidade',
    href: '/observabilidade',
    icon: ActivityIcon
  }
];

const Navigation: FC = () => {
  return (
    <nav className="space-y-1 px-2 py-5">
      {navItems.map((item) => (
        <NavLink
          to={item.href}
          key={item.href}
          className={({ isActive }) => 
            `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? 'bg-sfa-primary text-white dark:bg-blue-600'
                : 'text-sfa-secondary hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
            }`
          }
        >
          <item.icon className="mr-3 h-5 w-5" />
          {item.title}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;
