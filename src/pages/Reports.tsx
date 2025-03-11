
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Reports from '@/components/Reports';

const ReportsPage = () => {
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
        <h1 className="text-2xl font-bold mb-6">Relatórios</h1>
        <Reports />
      </main>
    </div>
  );
};

export default ReportsPage;
