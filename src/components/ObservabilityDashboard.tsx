
import { FC, useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LogEvent, logger, LogLevel } from '@/observability/logger';
import { apiMonitoring } from '@/observability/apiMonitoring';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { AlertCircle, RefreshCw, Download, Filter } from 'lucide-react';

const ObservabilityDashboard: FC = () => {
  const [activeTab, setActiveTab] = useState<string>('logs');
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEvent[]>([]);
  const [apiCalls, setApiCalls] = useState<any[]>([]);
  const [logLevel, setLogLevel] = useState<LogLevel>('info');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState<number>(0);
  
  // Filtros de logs
  const [userIdFilter, setUserIdFilter] = useState<string>('');
  const [routeFilter, setRouteFilter] = useState<string>('');
  
  // Atualizar dados quando a aba mudar ou atualização manual
  useEffect(() => {
    if (activeTab === 'logs') {
      setLogs(logger.getLogs());
    } else if (activeTab === 'api') {
      setApiCalls(apiMonitoring.getApiMetricsHistory());
    }
  }, [activeTab, refreshKey]);
  
  // Filtrar logs
  useEffect(() => {
    let filtered = logs;
    
    // Filtrar por nível
    filtered = filtered.filter(log => 
      (logLevel === 'debug') || 
      (logLevel === 'info' && log.level !== 'debug') ||
      (logLevel === 'warn' && (log.level === 'warn' || log.level === 'error')) ||
      (logLevel === 'error' && log.level === 'error')
    );
    
    // Filtrar por userId
    if (userIdFilter) {
      filtered = filtered.filter(log => log.userId?.includes(userIdFilter));
    }
    
    // Filtrar por rota
    if (routeFilter) {
      filtered = filtered.filter(log => log.route?.includes(routeFilter));
    }
    
    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        JSON.stringify(log.context).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredLogs(filtered);
  }, [logs, logLevel, searchTerm, userIdFilter, routeFilter]);
  
  // Preparar dados para gráficos de API
  const prepareApiCallsChart = () => {
    const methodCounts: Record<string, number> = {};
    const durationByMethod: Record<string, number[]> = {};
    
    apiCalls.forEach(call => {
      const method = call.method;
      methodCounts[method] = (methodCounts[method] || 0) + 1;
      
      if (call.duration) {
        if (!durationByMethod[method]) {
          durationByMethod[method] = [];
        }
        durationByMethod[method].push(call.duration);
      }
    });
    
    const chartData = Object.keys(methodCounts).map(method => {
      const durations = durationByMethod[method] || [];
      const avgDuration = durations.length 
        ? durations.reduce((sum, val) => sum + val, 0) / durations.length 
        : 0;
        
      return {
        method,
        count: methodCounts[method],
        avgDuration: Math.round(avgDuration * 100) / 100
      };
    });
    
    return chartData;
  };
  
  // Dados para o gráfico de logs por nível
  const prepareLogsChart = () => {
    const levelCounts: Record<string, number> = {
      debug: 0,
      info: 0,
      warn: 0,
      error: 0
    };
    
    logs.forEach(log => {
      levelCounts[log.level] = (levelCounts[log.level] || 0) + 1;
    });
    
    const chartData = Object.keys(levelCounts).map(level => ({
      level,
      count: levelCounts[level]
    }));
    
    return chartData;
  };
  
  // Exportar logs como JSON
  const exportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `logs-${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  // Exportar métricas de API como JSON
  const exportApiMetrics = () => {
    const dataStr = JSON.stringify(apiCalls, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `api-metrics-${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  // Renderizar um log individual
  const renderLogItem = (log: LogEvent) => {
    const logColors: Record<LogLevel, string> = {
      debug: 'text-gray-500',
      info: 'text-blue-500',
      warn: 'text-yellow-500',
      error: 'text-red-500'
    };
    
    return (
      <div key={log.timestamp.getTime()} className="border-b border-gray-200 dark:border-gray-700 py-2">
        <div className="flex justify-between">
          <span className={`font-semibold ${logColors[log.level]}`}>
            [{format(log.timestamp, 'HH:mm:ss')}] [{log.level.toUpperCase()}]
          </span>
          <span className="text-gray-500 text-sm">
            {log.route && <span className="mr-2">Route: {log.route}</span>}
            {log.userId && <span>User: {log.userId.substring(0, 8)}...</span>}
          </span>
        </div>
        <div className="mt-1">{log.message}</div>
        {log.context && (
          <pre className="mt-1 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
            {JSON.stringify(log.context, null, 2)}
          </pre>
        )}
      </div>
    );
  };
  
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Dashboard de Observabilidade</h1>
        <p className="text-gray-500 dark:text-gray-400">Monitore logs, desempenho e erros do sistema em tempo real</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="api">Chamadas de API</TabsTrigger>
            <TabsTrigger value="metrics">Métricas</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setRefreshKey(k => k + 1)}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            
            {activeTab === 'logs' && (
              <Button variant="outline" size="sm" onClick={exportLogs}>
                <Download className="h-4 w-4 mr-2" />
                Exportar Logs
              </Button>
            )}
            
            {activeTab === 'api' && (
              <Button variant="outline" size="sm" onClick={exportApiMetrics}>
                <Download className="h-4 w-4 mr-2" />
                Exportar Métricas
              </Button>
            )}
          </div>
        </div>
        
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Filtros de Log</CardTitle>
              <CardDescription>Filtre os logs por diferentes critérios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium">Nível</label>
                  <Select value={logLevel} onValueChange={(value) => setLogLevel(value as LogLevel)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debug">Debug</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warn">Warn</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Usuário ID</label>
                  <Input
                    placeholder="Filtrar por ID de usuário"
                    value={userIdFilter}
                    onChange={(e) => setUserIdFilter(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Rota</label>
                  <Input
                    placeholder="Filtrar por rota"
                    value={routeFilter}
                    onChange={(e) => setRouteFilter(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Busca</label>
                  <Input
                    placeholder="Buscar em mensagens e contexto"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-gray-500">
                Exibindo {filteredLogs.length} de {logs.length} logs
              </div>
              <Button variant="ghost" size="sm" onClick={() => {
                setLogLevel('info');
                setSearchTerm('');
                setUserIdFilter('');
                setRouteFilter('');
              }}>
                Limpar Filtros
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Logs do Sistema</CardTitle>
              <CardDescription>Registros de atividade e erros do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                {filteredLogs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40">
                    <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500">Nenhum log encontrado com os filtros atuais</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {[...filteredLogs].reverse().map(renderLogItem)}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Métricas de API</CardTitle>
              <CardDescription>Desempenho e estatísticas de chamadas de API</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Chamadas de API por Método</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={prepareApiCallsChart()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="method" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="count" name="Quantidade" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="avgDuration" name="Duração Média (ms)" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-2">
                  {apiCalls.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40">
                      <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-500">Nenhuma chamada de API registrada</p>
                    </div>
                  ) : (
                    [...apiCalls].reverse().map((call, index) => (
                      <div key={index} className="border-b border-gray-200 dark:border-gray-700 py-2">
                        <div className="flex justify-between">
                          <span className={`font-semibold ${call.success ? 'text-green-500' : 'text-red-500'}`}>
                            {call.method} {call.endpoint}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {call.duration ? `${call.duration.toFixed(2)} ms` : 'N/A'}
                          </span>
                        </div>
                        {!call.success && call.error && (
                          <pre className="mt-1 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto text-red-500">
                            {JSON.stringify(call.error, null, 2)}
                          </pre>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Métricas do Sistema</CardTitle>
              <CardDescription>Visão geral do desempenho do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Distribuição de Logs por Nível</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={prepareLogsChart()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="level" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Quantidade" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{logs.filter(log => log.level === 'error').length}</div>
                      <div className="text-sm text-gray-500">Erros Registrados</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{apiCalls.length}</div>
                      <div className="text-sm text-gray-500">Chamadas de API</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {apiCalls.filter(call => !call.success).length}
                      </div>
                      <div className="text-sm text-gray-500">Falhas de API</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {apiCalls.length > 0 
                          ? Math.round(apiCalls.filter(call => call.success).length / apiCalls.length * 100) 
                          : 0}%
                      </div>
                      <div className="text-sm text-gray-500">Taxa de Sucesso</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ObservabilityDashboard;
