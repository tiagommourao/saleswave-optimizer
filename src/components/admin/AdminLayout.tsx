
import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AdminPasswordDialog from '@/components/auth/AdminPasswordDialog';
import AdminNavigation from '@/components/admin/AdminNavigation';

const AdminLayout = () => {
  const [showPasswordDialog, setShowPasswordDialog] = useState<boolean>(true);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already authenticated
    const isAuthenticated = sessionStorage.getItem('admin_authenticated');
    if (isAuthenticated === 'true') {
      setAuthenticated(true);
      setShowPasswordDialog(false);
    }
  }, []);

  const handleAuthenticate = () => {
    setAuthenticated(true);
    setShowPasswordDialog(false);
  };

  if (!authenticated) {
    return (
      <AdminPasswordDialog 
        open={showPasswordDialog} 
        onOpenChange={setShowPasswordDialog}
        onAuthenticate={handleAuthenticate}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Administração CIS</h1>
            <Button 
              variant="outline" 
              onClick={() => {
                sessionStorage.removeItem('admin_authenticated');
                navigate('/login');
              }}
            >
              Sair da Área Admin
            </Button>
          </div>
          
          <AdminNavigation />
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
