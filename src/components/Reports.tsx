
import { FC, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChartIcon, 
  FileTextIcon, 
  TrendingUpIcon, 
  CalendarIcon, 
  DownloadIcon,
  RefreshCwIcon,
  ListIcon,
  SearchIcon
} from 'lucide-react';

const reportsList = [
  { id: 'orders', name: 'Analítico de Pedidos', icon: <FileTextIcon className="h-4 w-4" /> },
  { id: 'invoices', name: 'Notas Fiscais', icon: <FileTextIcon className="h-4 w-4" /> },
  { id: 'installments', name: 'Parcelas', icon: <CalendarIcon className="h-4 w-4" /> },
  { id: 'sync', name: 'Sincronização', icon: <RefreshCwIcon className="h-4 w-4" /> },
  { id: 'sales-position', name: 'Posição de Vendas', icon: <TrendingUpIcon className="h-4 w-4" /> },
  { id: 'abc-mix', name: 'Consulta Mix ABC', icon: <ListIcon className="h-4 w-4" /> },
  { id: 'sales-performance', name: 'Desempenho de Vendas', icon: <BarChartIcon className="h-4 w-4" /> },
  { id: 'customer-analysis', name: 'Análise de Clientes', icon: <SearchIcon className="h-4 w-4" /> },
];

const Reports: FC = () => {
  const [activeReportType, setActiveReportType] = useState('performance');
  
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900/80 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-sfa-dark mb-2 dark:text-white">Relatórios</h1>
        <p className="text-sfa-secondary dark:text-gray-400">Acesse relatórios detalhados para análise de vendas e desempenho</p>
      </div>
      
      <Tabs defaultValue="performance" value={activeReportType} onValueChange={setActiveReportType} className="mb-6">
        <TabsList className="mb-6 dark:bg-gray-800/70 dark:backdrop-blur-md">
          <TabsTrigger value="performance" className="flex items-center gap-2 dark:data-[state=active]:bg-gray-700/70">
            <TrendingUpIcon className="h-4 w-4" />
            <span>Desempenho</span>
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2 dark:data-[state=active]:bg-gray-700/70">
            <BarChartIcon className="h-4 w-4" />
            <span>Financeiro</span>
          </TabsTrigger>
          <TabsTrigger value="operational" className="flex items-center gap-2 dark:data-[state=active]:bg-gray-700/70">
            <ListIcon className="h-4 w-4" />
            <span>Operacional</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {reportsList.map((report) => (
          <Card key={report.id} className="shadow-sm hover:shadow-md transition-all cursor-pointer glass-card-dark">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-full">
                  {report.icon}
                </div>
                <CardTitle className="text-base dark:text-white">{report.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <CardDescription className="dark:text-gray-400">
                Visualize informações detalhadas e exporte dados para análise.
              </CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between pt-0">
              <Button variant="outline" size="sm" className="dark:bg-gray-800/70 dark:hover:bg-gray-700/70 dark:border-gray-600">Visualizar</Button>
              <Button variant="ghost" size="sm" className="text-sfa-primary dark:text-blue-400 dark:hover:bg-gray-800/50">
                <DownloadIcon className="h-4 w-4 mr-1" /> Exportar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="bg-white dark:bg-gray-800/70 dark:backdrop-blur-lg dark:border dark:border-gray-700/50 p-5 rounded-lg shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Filtros de Relatório</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date-range" className="dark:text-gray-300">Período</Label>
            <Select defaultValue="last30">
              <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="last7">Últimos 7 dias</SelectItem>
                <SelectItem value="last30">Últimos 30 dias</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customer" className="dark:text-gray-300">Cliente</Label>
            <Select defaultValue="all">
              <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="all">Todos os clientes</SelectItem>
                <SelectItem value="1">Cliente A</SelectItem>
                <SelectItem value="2">Cliente B</SelectItem>
                <SelectItem value="3">Cliente C</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="product" className="dark:text-gray-300">Produto</Label>
            <Select defaultValue="all">
              <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                <SelectValue placeholder="Selecione o produto" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="all">Todos os produtos</SelectItem>
                <SelectItem value="1">Produto A</SelectItem>
                <SelectItem value="2">Produto B</SelectItem>
                <SelectItem value="3">Produto C</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="search" className="dark:text-gray-300">Busca</Label>
            <div className="relative">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input id="search" placeholder="Buscar..." className="pl-8 dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-6 gap-2">
          <Button variant="outline" className="dark:bg-gray-800/70 dark:hover:bg-gray-700/70 dark:border-gray-600 dark:text-white">Limpar Filtros</Button>
          <Button className="dark:bg-blue-600 dark:hover:bg-blue-700">Gerar Relatório</Button>
        </div>
      </div>
      
      <Card className="glass-card-dark">
        <CardHeader>
          <CardTitle className="dark:text-white">Percentual de Vendas e Base para Prêmios</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Análise de desempenho com base nos objetivos e métricas definidas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm dark:text-gray-300">
                <span>Meta Mensal</span>
                <span className="font-semibold dark:text-white">85% alcançado</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-sfa-primary dark:bg-blue-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm dark:text-gray-300">
                <span>Meta Trimestral</span>
                <span className="font-semibold dark:text-white">72% alcançado</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-sfa-primary dark:bg-blue-500 h-2.5 rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm dark:text-gray-300">
                <span>Base para Prêmios</span>
                <span className="font-semibold dark:text-white">65% alcançado</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-sfa-primary dark:bg-blue-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800/80 dark:border dark:border-gray-700/50 p-4 rounded-md text-center">
              <p className="text-sfa-secondary dark:text-gray-400 text-sm mb-1">Valor Vendido</p>
              <p className="text-xl font-bold dark:text-white">R$ 357.890</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/80 dark:border dark:border-gray-700/50 p-4 rounded-md text-center">
              <p className="text-sfa-secondary dark:text-gray-400 text-sm mb-1">Meta</p>
              <p className="text-xl font-bold dark:text-white">R$ 420.000</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/80 dark:border dark:border-gray-700/50 p-4 rounded-md text-center">
              <p className="text-sfa-secondary dark:text-gray-400 text-sm mb-1">Prêmio Estimado</p>
              <p className="text-xl font-bold dark:text-white">R$ 8.750</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
