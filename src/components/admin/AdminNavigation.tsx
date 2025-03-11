
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, BarChart2 } from 'lucide-react';

const AdminNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath === path;
  };

  return (
    <div className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-md">
      <Tabs defaultValue="auth-config" className="w-full">
        <TabsList className="h-14 bg-transparent border-b-0 w-full justify-start gap-2 px-4 flex overflow-x-auto">
          <Link to="/cisadm/auth-config" className="w-auto">
            <TabsTrigger 
              value="auth-config" 
              className={`h-14 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none dark:text-gray-300 dark:data-[state=active]:text-white ${isActive('/cisadm/auth-config') ? 'border-b-2 border-blue-600 text-blue-600 dark:text-white' : ''}`}
            >
              <Settings className="h-4 w-4 mr-2" />
              Configuração Azure AD
            </TabsTrigger>
          </Link>
          <Link to="/cisadm/observabilidade" className="w-auto">
            <TabsTrigger 
              value="observabilidade" 
              className={`h-14 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none dark:text-gray-300 dark:data-[state=active]:text-white ${isActive('/cisadm/observabilidade') ? 'border-b-2 border-blue-600 text-blue-600 dark:text-white' : ''}`}
            >
              <BarChart2 className="h-4 w-4 mr-2" />
              Observabilidade
            </TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default AdminNavigation;
