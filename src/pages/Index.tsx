
import { useState } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import Reports from '@/components/Reports';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data for the header
  const userInfo = {
    companyName: 'CISER',
    partnerCode: 'P12345',
    salesOrgName: 'Vendas Corporativas',
    userName: 'João Silva',
  };

  const renderActiveContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header {...userInfo} />
      <Navigation />
      <main className="flex-1">
        {renderActiveContent()}
      </main>
    </div>
  );
};

export default Index;
