
import { FC, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, FileText, UserPlus, Filter } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  channel: string;
  sector: string;
  cnpj: string;
  location: string;
  lastOrderDate?: string;
  lastOrderValue?: string;
  nextOrderDate?: string;
}

const ClientList: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock client data based on the image
  const clients: Client[] = [
    {
      id: '25288',
      name: 'ACARTOCENTER CONSTRUCAO A SECO LTDA',
      channel: '10 - Vendas standard',
      sector: '11 - Linha Ciser',
      cnpj: '05.383.915/0001-47',
      location: 'SAO GERALDO - PORTO ALEGRE/RS',
      lastOrderDate: '19/09/2024',
      lastOrderValue: 'R$ 12.198,99'
    },
    {
      id: '125059',
      name: 'AGUIAR E LAGUNA COMERCIO E DISTRIBU',
      channel: '10 - Vendas standard',
      sector: '11 - Linha Ciser',
      cnpj: '30.158.404/0001-79',
      location: 'QUERENCIA - VIAMAO/RS',
      lastOrderDate: '08/08/2024',
      lastOrderValue: 'R$ 2.892,31'
    },
    {
      id: '23423',
      name: 'ALEX FABIAN PIRES CARDOSO',
      channel: '10 - Vendas standard',
      sector: '11 - Linha Ciser',
      cnpj: '',
      location: 'SAO JOAO - PORTO ALEGRE/RS',
      lastOrderValue: 'R$ 0,00'
    },
    {
      id: '23550',
      name: 'ALUITA ALUMINIO PORTO ALEGRE LT',
      channel: '10 - Vendas standard',
      sector: '11 - Linha Ciser',
      cnpj: '04.919.212/0001-28',
      location: 'NAVEGANTES - PORTO ALEGRE/RS',
      lastOrderDate: '09/07/2024',
      lastOrderValue: 'R$ 3.874,31'
    },
    {
      id: '77013',
      name: 'ALUITA ALUMINIO PORTO ALEGRE LTDA',
      channel: '10 - Vendas standard',
      sector: '11 - Linha Ciser',
      cnpj: '04.919.212/0002-09',
      location: 'TRÊS VENDAS - PELOTAS/RS',
      lastOrderDate: '22/07/2024',
      lastOrderValue: 'R$ 9.505,94'
    },
    {
      id: '93469',
      name: 'ANCOPAR COMERCIO DE FIXACOES LTDA',
      channel: '10 - Vendas standard',
      sector: '11 - Linha Ciser',
      cnpj: '42.447.867/0001-30',
      location: 'NAVEGANTES - PORTO ALEGRE/RS',
      lastOrderValue: 'R$ 0,00'
    }
  ];

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.id.includes(searchQuery)
  );

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-sfa-dark dark:text-white mb-1">Meus Clientes (154)</h1>
          <p className="text-sfa-secondary dark:text-gray-400">Gerenciamento e consulta de clientes</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" className="border-sfa-border dark:border-gray-700 dark:text-white">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Procurar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-sfa-border dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      <Card className="border border-sfa-border dark:border-gray-700 dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-sfa-border dark:border-gray-600">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-sfa-secondary dark:text-gray-300">Cód.</th>
                <th className="px-4 py-3 text-left font-medium text-sfa-secondary dark:text-gray-300">Nome</th>
                <th className="px-4 py-3 text-left font-medium text-sfa-secondary dark:text-gray-300">Canal</th>
                <th className="px-4 py-3 text-left font-medium text-sfa-secondary dark:text-gray-300">Setor</th>
                <th className="px-4 py-3 text-left font-medium text-sfa-secondary dark:text-gray-300">CNPJ</th>
                <th className="px-4 py-3 text-left font-medium text-sfa-secondary dark:text-gray-300">Bairro/Cidade/UF</th>
                <th className="px-4 py-3 text-left font-medium text-sfa-secondary dark:text-gray-300">Dt. Últ. Vnd.</th>
                <th className="px-4 py-3 text-right font-medium text-sfa-secondary dark:text-gray-300">Vl. Últ. Vnd.</th>
                <th className="px-4 py-3 text-center font-medium text-sfa-secondary dark:text-gray-300">Novo Ped.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sfa-border dark:divide-gray-700">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-4 text-center text-sfa-secondary dark:text-gray-400">
                    Nenhum cliente encontrado
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 text-sfa-dark dark:text-white">{client.id}</td>
                    <td className="px-4 py-3 text-sfa-dark dark:text-white">{client.name}</td>
                    <td className="px-4 py-3 text-sfa-dark dark:text-white">{client.channel}</td>
                    <td className="px-4 py-3 text-sfa-dark dark:text-white">{client.sector}</td>
                    <td className="px-4 py-3 text-sfa-dark dark:text-white">{client.cnpj || '-'}</td>
                    <td className="px-4 py-3 text-sfa-dark dark:text-white">{client.location}</td>
                    <td className="px-4 py-3 text-sfa-dark dark:text-white">{client.lastOrderDate || '-'}</td>
                    <td className="px-4 py-3 text-right text-sfa-dark dark:text-white">{client.lastOrderValue || '-'}</td>
                    <td className="px-4 py-3 text-center">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-sfa-primary dark:text-blue-400">
                        <FileText className="h-5 w-5" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 flex justify-between items-center bg-gray-50 dark:bg-gray-700 border-t border-sfa-border dark:border-gray-600">
          <div className="text-sm text-sfa-secondary dark:text-gray-300">
            Mostrando {filteredClients.length} de {clients.length} clientes
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ClientList;
