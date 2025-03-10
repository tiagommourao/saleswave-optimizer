
import { FC } from 'react';
import { Link } from 'react-router-dom';
import MetricCard from './MetricCard';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { 
  MessageSquare, 
  ShoppingCart, 
  AlertTriangle, 
  Users, 
  PackageOpen,
  Clock,
  Briefcase,
  ShoppingBag,
} from 'lucide-react';

const Dashboard: FC = () => {
  const customerStatusData = [
    { name: 'Recentes (90 dias)', value: 450, color: '#1a73e8' },
    { name: 'Ativos (180 dias)', value: 820, color: '#00c49f' },
    { name: 'Nunca compraram', value: 230, color: '#ffc658' },
  ];

  const salesData = [
    { name: 'Jan', value: 4000 },
    { name: 'Fev', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Abr', value: 2780 },
    { name: 'Mai', value: 1890 },
    { name: 'Jun', value: 2390 },
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-slate-950 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Visão geral dos indicadores de vendas e métricas principais</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard 
          title="Mensagens"
          value="12"
          description="Mensagens pendentes para revisão"
          icon={<MessageSquare className="h-5 w-5" />}
          variant="primary"
        />
        <Link to="/new-order" className="block">
          <MetricCard 
            title="Iniciar Novo Pedido"
            value="Clique aqui"
            description="Criar um novo pedido de vendas"
            icon={<ShoppingCart className="h-5 w-5" />}
            variant="accent"
          />
        </Link>
        <MetricCard 
          title="Parcelas Vencidas" 
          value="R$ 45.678,90"
          description="Total de parcelas em atraso"
          icon={<AlertTriangle className="h-5 w-5" />}
          variant="warning"
        />
        <MetricCard 
          title="Total de Produtos" 
          value="2.456"
          description="Produtos ativos no catálogo"
          icon={<PackageOpen className="h-5 w-5" />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="chart-container">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Status dos Clientes</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {customerStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="data-card">
              <p className="text-xs text-gray-500 dark:text-gray-400">Total de Clientes</p>
              <p className="text-xl font-bold dark:text-white">1.500</p>
            </div>
            <div className="data-card">
              <p className="text-xs text-gray-500 dark:text-gray-400">Novos (30 dias)</p>
              <p className="text-xl font-bold dark:text-white">75</p>
            </div>
            <div className="data-card">
              <p className="text-xs text-gray-500 dark:text-gray-400">Clientes Ativos</p>
              <p className="text-xl font-bold dark:text-white">820</p>
            </div>
          </div>
        </div>
        
        <div className="chart-container">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Vendas Mensais</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }} />
                <Legend />
                <Bar dataKey="value" name="Valor (R$)" fill="#1a73e8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="data-card">
              <p className="text-xs text-gray-500 dark:text-gray-400">Meta Mensal</p>
              <p className="text-xl font-bold dark:text-white">R$ 100k</p>
            </div>
            <div className="data-card">
              <p className="text-xs text-gray-500 dark:text-gray-400">Realizado</p>
              <p className="text-xl font-bold dark:text-white">R$ 85k</p>
            </div>
            <div className="data-card">
              <p className="text-xs text-gray-500 dark:text-gray-400">% Atingimento</p>
              <p className="text-xl font-bold dark:text-white">85%</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="dashboard-panel">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold dark:text-white">Pedidos Recentes</h2>
            <Button variant="outline" size="sm" className="dark:text-gray-200 dark:border-gray-700">Ver todos</Button>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-full">
                  <ShoppingBag className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium dark:text-white">Pedido #{12340 + item}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Cliente: Empresa {item}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium dark:text-white">R$ {(Math.random() * 10000).toFixed(2)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Hoje</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="dashboard-panel">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold dark:text-white">Atividades Recentes</h2>
            <Button variant="outline" size="sm" className="dark:text-gray-200 dark:border-gray-700">Ver todas</Button>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-full">
                  <Clock className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium dark:text-white">Atividade #{item}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Usuário: João Silva</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Há {item} hora{item > 1 ? 's' : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="dashboard-panel">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold dark:text-white">Oportunidades</h2>
            <Button variant="outline" size="sm" className="dark:text-gray-200 dark:border-gray-700">Ver todas</Button>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-full">
                  <Briefcase className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium dark:text-white">Oportunidade #{item}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Cliente: Empresa {item + 3}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium dark:text-white">R$ {(Math.random() * 50000).toFixed(2)}</p>
                  <p className="text-xs text-green-600 dark:text-green-400">85% probabilidade</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
