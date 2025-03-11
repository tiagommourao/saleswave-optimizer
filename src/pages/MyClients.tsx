
import { useState } from 'react';
import ClientList from '@/components/ClientList';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';

const MyClients = () => {
  // Mock data for header
  const userInfo = {
    companyName: 'CISER',
    partnerCode: 'P12345',
    salesOrgName: 'Vendas Corporativas',
    userName: 'João Silva',
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header {...userInfo} />
      <Navigation />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Meus Clientes</h1>
        <ClientList />
      </main>
    </div>
  );
};

export default MyClients;
