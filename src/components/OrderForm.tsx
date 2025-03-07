
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { 
  Search, 
  CheckSquare, 
  Upload, 
  Trash2, 
  Send,
  InfoIcon
} from 'lucide-react';
import ProductList from '@/components/ProductList';
import { useToast } from '@/hooks/use-toast';

const OrderForm = () => {
  const { toast } = useToast();
  const [orderNumber, setOrderNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<string | undefined>(undefined);

  // Mock client data with the format from the image
  const mockClient = {
    id: '124789',
    name: 'AFONSO FRANÇA CONSTRUÇÕES E COMERCI',
    profile: 'Bronze',
    channel: '10',
    sector: '11',
    address: 'RUA PEDRO NATALIO LORENZETTI 95, CENTRO - LENÇÓIS PAULISTA/SP'
  };

  // Mock payment conditions
  const paymentConditions = [
    { id: '2012', name: 'À VISTA (ATÉ 5 DIAS CORRIDOS) (PIX / TRANSFERÊNCIA / DEPÓSITO)' },
    { id: '2013', name: '30 DIAS' },
    { id: '2014', name: '60 DIAS' }
  ];

  // Mock document types
  const documentTypes = [
    { id: '1', name: 'Pedido de Venda' },
    { id: '2', name: 'Orçamento' },
    { id: '3', name: 'Reserva' }
  ];

  // Mock order motives
  const orderMotives = [
    { id: '1', name: 'Venda Normal' },
    { id: '2', name: 'Reposição' },
    { id: '3', name: 'Garantia' }
  ];

  const handleSubmitOrder = () => {
    toast({
      title: "Pedido enviado com sucesso",
      description: "Seu pedido foi processado e será atendido em breve."
    });
  };

  const handleClearForm = () => {
    setOrderNumber('');
    setSearchQuery('');
    toast({
      title: "Formulário limpo",
      description: "Todos os campos foram limpos."
    });
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-sfa-dark mb-1">Iniciar Novo Pedido</h1>
          <p className="text-sfa-secondary">Preencha os dados do pedido e adicione os produtos</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleClearForm}>
            <Trash2 className="mr-2 h-4 w-4" />
            Limpar
          </Button>
          <Button onClick={handleSubmitOrder}>
            <Send className="mr-2 h-4 w-4" />
            Enviar Pedido
          </Button>
        </div>
      </div>

      {/* Client Information Card */}
      <Card className="p-4 mb-6 bg-white border-sfa-border">
        <div className="text-sm text-sfa-secondary mb-2 flex items-center">
          <InfoIcon className="h-4 w-4 mr-1" />
          Informações do Cliente
        </div>
        <div className="flex items-center text-sm">
          <span className="font-medium">Cliente: {mockClient.id} - {mockClient.name}</span>
          <span className="mx-2">|</span>
          <span>Perfil: {mockClient.profile}</span>
          <span className="mx-2">|</span>
          <span>Canal: {mockClient.channel}</span>
          <span className="mx-2">|</span>
          <span>Setor: {mockClient.sector}</span>
          <span className="mx-2">|</span>
          <span>{mockClient.address}</span>
        </div>
      </Card>

      {/* Order Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="document-type">Tipo de Documento</Label>
          <Select>
            <SelectTrigger id="document-type" className="w-full">
              <SelectValue placeholder="Selecione o tipo de documento" />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map(type => (
                <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment-condition">Condição de Pagamento</Label>
          <Select defaultValue="2012">
            <SelectTrigger id="payment-condition" className="w-full">
              <SelectValue placeholder="Selecione a condição de pagamento" />
            </SelectTrigger>
            <SelectContent>
              {paymentConditions.map(condition => (
                <SelectItem key={condition.id} value={condition.id}>{condition.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="order-motive">Motivo da Ordem</Label>
          <Select>
            <SelectTrigger id="order-motive" className="w-full">
              <SelectValue placeholder="Selecione o motivo" />
            </SelectTrigger>
            <SelectContent>
              {orderMotives.map(motive => (
                <SelectItem key={motive.id} value={motive.id}>{motive.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="order-number">Ordem de Compra</Label>
          <Input 
            id="order-number" 
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Número da ordem de compra"
          />
        </div>
      </div>

      {/* Product Search */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Input
                placeholder="Busca por código de Cliente"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <CheckSquare className="h-5 w-5" />
            </Button>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Importar
            </Button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <ProductList />

      {/* Order Summary */}
      <div className="mt-6 bg-white p-4 rounded-md border border-sfa-border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-sfa-secondary">Valor dos Produtos:</span>
            <span className="ml-2 font-medium">R$ 0,00</span>
          </div>
          <div>
            <span className="text-sfa-secondary">Desc. Ponderado:</span>
            <span className="ml-2 font-medium">0,00%</span>
          </div>
          <div>
            <span className="text-sfa-secondary">Base Prêmio:</span>
            <span className="ml-2 font-medium">R$ 0,00 (0,00%)</span>
          </div>
          <div>
            <span className="text-sfa-secondary">Valor Total da NF:</span>
            <span className="ml-2 font-medium">R$ 0,00</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={handleClearForm}>
          <Trash2 className="mr-2 h-4 w-4" />
          Limpar
        </Button>
        <Button onClick={handleSubmitOrder}>
          <Send className="mr-2 h-4 w-4" />
          Enviar
        </Button>
      </div>
    </div>
  );
};

export default OrderForm;
