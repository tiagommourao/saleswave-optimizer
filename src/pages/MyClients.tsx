
import { useState } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import ClientList from '@/components/ClientList';

const MyClients = () => {
  // Mock data for the header (same as in Index.tsx)
  const userInfo = {
    companyName: 'CISER',
    partnerCode: 'P12345',
    salesOrgName: 'Vendas Corporativas',
    userName: 'João Silva',
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header {...userInfo} />
      <Navigation onTabChange={() => {}} />
      <main className="flex-1">
        <ClientList />
      </main>
    </div>
  );
};

export default MyClients;
