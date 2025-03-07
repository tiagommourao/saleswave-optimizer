
import { FC } from 'react';
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
    { name: 'Recentes (90 dias)', value: 450 },
    { name: 'Ativos (180 dias)', value: 820 },
    { name: 'Nunca compraram', value: 230 },
  ];

  const salesData = [
    { name: 'Jan', value: 4000 },
    { name: 'Fev', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Abr', value: 2780 },
    { name: 'Mai', value: 1890 },
    { name: 'Jun', value: 2390 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-sfa-dark mb-2">Dashboard</h1>
        <p className="text-sfa-secondary">Visão geral dos indicadores de vendas e métricas principais</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard 
          title="Mensagens"
          value="12"
          description="Mensagens pendentes para revisão"
          icon={<MessageSquare className="h-5 w-5" />}
          variant="primary"
        />
        <MetricCard 
          title="Iniciar Novo Pedido"
          value="Clique aqui"
          description="Criar um novo pedido de vendas"
          icon={<ShoppingCart className="h-5 w-5" />}
          variant="accent"
          onClick={() => alert('Iniciando novo pedido...')}
        />
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
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Status dos Clientes</h2>
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs text-sfa-secondary">Total de Clientes</p>
              <p className="text-xl font-bold">1.500</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs text-sfa-secondary">Novos (30 dias)</p>
              <p className="text-xl font-bold">75</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs text-sfa-secondary">Clientes Ativos</p>
              <p className="text-xl font-bold">820</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Vendas Mensais</h2>
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
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Valor (R$)" fill="#1a73e8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs text-sfa-secondary">Meta Mensal</p>
              <p className="text-xl font-bold">R$ 100k</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs text-sfa-secondary">Realizado</p>
              <p className="text-xl font-bold">R$ 85k</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs text-sfa-secondary">% Atingimento</p>
              <p className="text-xl font-bold">85%</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Pedidos Recentes</h2>
            <Button variant="outline" size="sm">Ver todos</Button>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="bg-blue-50 p-2 rounded-full">
                  <ShoppingBag className="h-4 w-4 text-sfa-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Pedido #{12340 + item}</p>
                  <p className="text-xs text-sfa-secondary">Cliente: Empresa {item}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">R$ {(Math.random() * 10000).toFixed(2)}</p>
                  <p className="text-xs text-sfa-secondary">Hoje</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Atividades Recentes</h2>
            <Button variant="outline" size="sm">Ver todas</Button>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="bg-blue-50 p-2 rounded-full">
                  <Clock className="h-4 w-4 text-sfa-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Atividade #{item}</p>
                  <p className="text-xs text-sfa-secondary">Usuário: João Silva</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-sfa-secondary">Há {item} hora{item > 1 ? 's' : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Oportunidades</h2>
            <Button variant="outline" size="sm">Ver todas</Button>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="bg-blue-50 p-2 rounded-full">
                  <Briefcase className="h-4 w-4 text-sfa-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Oportunidade #{item}</p>
                  <p className="text-xs text-sfa-secondary">Cliente: Empresa {item + 3}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">R$ {(Math.random() * 50000).toFixed(2)}</p>
                  <p className="text-xs text-green-600">85% probabilidade</p>
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
