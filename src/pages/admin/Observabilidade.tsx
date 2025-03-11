
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, CheckCircle, XCircle, BarChart, Clock, Activity, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Mock data for visualizations
const generateMockData = () => {
  const now = new Date();
  const lastDay = Array.from({ length: 24 }, (_, i) => ({
    time: new Date(now.getFullYear(), now.getMonth(), now.getDate(), i).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    sales: Math.floor(Math.random() * 100),
    errors: Math.floor(Math.random() * 10),
    latency: Math.floor(Math.random() * 1000),
  }));
  
  return {
    transactions: {
      total: Math.floor(Math.random() * 10000),
      successful: Math.floor(Math.random() * 9000),
      failed: Math.floor(Math.random() * 1000),
    },
    apiLatency: {
      avg: Math.floor(Math.random() * 300),
      p95: Math.floor(Math.random() * 500),
      p99: Math.floor(Math.random() * 800),
    },
    errors: {
      total: Math.floor(Math.random() * 500),
      critical: Math.floor(Math.random() * 50),
      warnings: Math.floor(Math.random() * 200),
    },
    resources: {
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 100),
      storage: Math.floor(Math.random() * 100),
    },
    timeSeriesData: lastDay,
    recentAlerts: [
      { id: 1, type: "critical", message: "API Gateway timeout em processamento de pagamento", time: "2 horas atrás" },
      { id: 2, type: "warning", message: "Latência elevada na sincronização de estoque", time: "5 horas atrás" },
      { id: 3, type: "info", message: "Manutenção programada em 24h", time: "12 horas atrás" },
    ],
    healthStatus: {
      sales: Math.random() > 0.9 ? "critical" : Math.random() > 0.7 ? "warning" : "healthy",
      inventory: Math.random() > 0.9 ? "critical" : Math.random() > 0.7 ? "warning" : "healthy",
      payment: Math.random() > 0.9 ? "critical" : Math.random() > 0.7 ? "warning" : "healthy",
      auth: Math.random() > 0.9 ? "critical" : Math.random() > 0.7 ? "warning" : "healthy",
      database: Math.random() > 0.9 ? "critical" : Math.random() > 0.7 ? "warning" : "healthy",
    }
  };
};

const Observabilidade = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(generateMockData());
  const [activeTab, setActiveTab] = useState("dashboard");
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setData(generateMockData());
      setRefreshing(false);
    }, 1000);
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
        <p className="mt-4 text-lg">Carregando dados de observabilidade...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard de Observabilidade SFA</h1>
        <Button onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Atualizando...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar Dados
            </>
          )}
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="traces">Traces</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          {/* Métricas-chave em cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Transações de Vendas (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.transactions.total.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">{data.transactions.successful.toLocaleString()} sucesso</span> | 
                  <span className="text-red-500"> {data.transactions.failed.toLocaleString()} falhas</span>
                </div>
                <Progress 
                  value={(data.transactions.successful / data.transactions.total) * 100} 
                  className="h-2 mt-2"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Latência de APIs (ms)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.apiLatency.avg}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  P95: {data.apiLatency.p95}ms | P99: {data.apiLatency.p99}ms
                </div>
                <Progress 
                  value={Math.min((data.apiLatency.avg / 500) * 100, 100)} 
                  className={`h-2 mt-2 ${data.apiLatency.avg > 300 ? 'bg-red-200' : ''}`}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Erros (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.errors.total.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  <span className="text-red-500">{data.errors.critical} críticos</span> | 
                  <span className="text-yellow-500"> {data.errors.warnings} avisos</span>
                </div>
                <Progress 
                  value={Math.min((data.errors.total / 1000) * 100, 100)} 
                  className={`h-2 mt-2 ${data.errors.critical > 10 ? 'bg-red-200' : ''}`}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Uso de Recursos (%)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.resources.cpu}% CPU</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Memória: {data.resources.memory}% | Storage: {data.resources.storage}%
                </div>
                <Progress 
                  value={data.resources.cpu} 
                  className={`h-2 mt-2 ${data.resources.cpu > 80 ? 'bg-red-200' : data.resources.cpu > 60 ? 'bg-yellow-200' : ''}`}
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Status de Saúde dos Sistemas */}
          <Card>
            <CardHeader>
              <CardTitle>Saúde do Sistema</CardTitle>
              <CardDescription>Estado atual de cada componente do SFA</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Object.entries(data.healthStatus).map(([system, status]) => (
                  <div key={system} className="flex flex-col items-center p-4 border rounded-lg">
                    {status === "healthy" ? (
                      <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                    ) : status === "warning" ? (
                      <AlertCircle className="h-8 w-8 text-yellow-500 mb-2" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-500 mb-2" />
                    )}
                    <span className="text-sm font-medium capitalize">{system}</span>
                    <span className={`text-xs ${
                      status === "healthy" ? "text-green-500" : 
                      status === "warning" ? "text-yellow-500" : "text-red-500"
                    }`}>
                      {status === "healthy" ? "Saudável" : 
                       status === "warning" ? "Atenção" : "Crítico"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Alertas Recentes */}
          <Card>
            <CardHeader>
              <CardTitle>Alertas Recentes</CardTitle>
              <CardDescription>Últimos alertas do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentAlerts.map((alert) => (
                  <Alert key={alert.id} className={`
                    ${alert.type === 'critical' ? 'border-red-600 bg-red-50 dark:bg-red-900/20' : 
                      alert.type === 'warning' ? 'border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' : 
                      'border-blue-600 bg-blue-50 dark:bg-blue-900/20'}
                  `}>
                    <AlertCircle className={`
                      h-4 w-4 
                      ${alert.type === 'critical' ? 'text-red-600' : 
                        alert.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'}
                    `} />
                    <AlertTitle className="ml-2 text-sm font-medium">
                      {alert.type === 'critical' ? 'Crítico' : 
                        alert.type === 'warning' ? 'Aviso' : 'Informação'}
                    </AlertTitle>
                    <AlertDescription className="ml-2 text-sm">
                      <div className="flex justify-between">
                        <span>{alert.message}</span>
                        <span className="text-xs text-muted-foreground">{alert.time}</span>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registro de Alertas</CardTitle>
              <CardDescription>Histórico completo de alertas e notificações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground italic">
                  Esta seção mostraria um log detalhado de todos os alertas com capacidade de filtragem, exportação e configuração de regras de alerta.
                </p>
                
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mensagem</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Componente</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${i % 3 === 0 ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" : 
                                i % 3 === 1 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" : 
                                "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"}
                            `}>
                              {i % 3 === 0 ? "Crítico" : i % 3 === 1 ? "Aviso" : "Info"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {i % 3 === 0 ? "Timeout em processamento de pagamento" : 
                             i % 3 === 1 ? "Latência elevada na sincronização" : 
                             "Atualizações de sistema programadas"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {i % 5 === 0 ? "API Gateway" : 
                             i % 5 === 1 ? "Database" : 
                             i % 5 === 2 ? "Auth Service" :
                             i % 5 === 3 ? "Inventory API" : "Payment Service"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(Date.now() - i * 3600000).toLocaleDateString('pt-BR')} {" "}
                            {new Date(Date.now() - i * 3600000).toLocaleTimeString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${i % 2 === 0 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : 
                                "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"}
                            `}>
                              {i % 2 === 0 ? "Resolvido" : "Pendente"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="traces" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rastreamento Distribuído</CardTitle>
              <CardDescription>Acompanhamento de transações através do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground italic">
                  Esta seção exibiria visualizações de trace, permitindo ver o fluxo completo de requisições através de diferentes serviços.
                </p>
                
                <div className="border p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Exemplo de Trace: Processamento de Pedido #12345</h3>
                  
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          {i + 1}
                        </div>
                        <div className="ml-2 h-12 w-0.5 bg-gray-300 dark:bg-gray-700"></div>
                        <div className="ml-4 bg-white dark:bg-gray-800 p-3 rounded-md border w-full">
                          <div className="flex justify-between">
                            <span className="font-medium">
                              {i === 0 ? "API Gateway" : 
                               i === 1 ? "Auth Service" : 
                               i === 2 ? "Order Processing" :
                               i === 3 ? "Inventory Service" : "Payment Service"}
                            </span>
                            <span className="text-sm text-gray-500">
                              {Math.floor(Math.random() * 100) + 10}ms
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {i === 0 ? "Recebeu requisição POST /orders" : 
                             i === 1 ? "Validou token de autenticação" : 
                             i === 2 ? "Processou dados do pedido" :
                             i === 3 ? "Verificou disponibilidade de estoque" : "Processou pagamento"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Logs do Sistema</CardTitle>
              <CardDescription>Registros detalhados de atividades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground italic">
                  Esta seção exibiria logs consolidados de todos os componentes do sistema com capacidade de filtragem e busca.
                </p>
                
                <div className="bg-black rounded-lg p-4 font-mono text-sm text-green-400 overflow-auto max-h-96">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="py-1">
                      <span className="text-gray-500">[{new Date(Date.now() - i * 60000).toISOString()}]</span>{" "}
                      <span className={`
                        ${i % 4 === 0 ? "text-red-400" : 
                          i % 4 === 1 ? "text-yellow-400" : 
                          i % 4 === 2 ? "text-blue-400" : "text-green-400"}
                      `}>
                        {i % 4 === 0 ? "ERROR" : i % 4 === 1 ? "WARN" : i % 4 === 2 ? "INFO" : "DEBUG"}
                      </span>{" "}
                      <span className="text-gray-300">
                        {i % 5 === 0 ? "[ApiGateway]" : 
                         i % 5 === 1 ? "[AuthService]" : 
                         i % 5 === 2 ? "[OrderService]" :
                         i % 5 === 3 ? "[InventoryService]" : "[PaymentService]"}
                      </span>{" "}
                      <span>
                        {i % 4 === 0 ? "Failed to process payment for order #" + (1000 + i) + ": Timeout" : 
                         i % 4 === 1 ? "High latency detected in database query (300ms)" : 
                         i % 4 === 2 ? "User " + (2000 + i) + " successfully authenticated" :
                         "Processing order #" + (1000 + i) + " completed in 150ms"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Observabilidade;
