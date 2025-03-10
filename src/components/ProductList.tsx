
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  PlusCircle, 
  Trash2, 
  Pencil, 
  Percent,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Product = {
  code: string;
  mixCode: string;
  mixType: string;
  reference: string;
  description: string;
  stock: number;
  stockUnit: string;
  clientCode?: string;
  selected?: boolean;
  quantity?: number;
  price?: number;
  discount?: number;
};

const ProductList = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([
    {
      code: '10010800',
      mixCode: 'MIX: B',
      mixType: 'B',
      reference: 'PA FR AC UNC C/PO SX 3/16X3/4 RI POL',
      description: 'Parafuso AC UNC com porca sextavada 3/16X3/4 RI Polido',
      stock: 150.01,
      stockUnit: 'CE',
      quantity: 0,
      price: 0,
      discount: 0,
      selected: false
    },
    {
      code: '10010801',
      mixCode: 'MIX: B',
      mixType: 'B',
      reference: 'PA FR AC UNC C/PO SX 3/16X3/4 RI ZB',
      description: 'Parafuso AC UNC com porca sextavada 3/16X3/4 RI Zincado Branco',
      stock: 113.7,
      stockUnit: 'CE',
      quantity: 0,
      price: 0,
      discount: 0,
      selected: false
    },
    {
      code: '10011000',
      mixCode: 'MIX: B',
      mixType: 'B',
      reference: 'PA FR AC UNC C/PO SX 3/16X1 RI POL',
      description: 'Parafuso AC UNC com porca sextavada 3/16X1 RI Polido',
      stock: 398.1,
      stockUnit: 'CE',
      quantity: 0,
      price: 0,
      discount: 0,
      selected: false
    },
    {
      code: '10011001',
      mixCode: 'MIX: B',
      mixType: 'B',
      reference: 'PA FR AC UNC C/PO SX 3/16X1 RI ZB',
      description: 'Parafuso AC UNC com porca sextavada 3/16X1 RI Zincado Branco',
      stock: 1402.17,
      stockUnit: 'CE',
      quantity: 0,
      price: 0,
      discount: 0,
      selected: false
    }
  ]);
  
  const [massDiscount, setMassDiscount] = useState('');
  const [selectAll, setSelectAll] = useState(false);

  const handleToggleSelect = (code: string) => {
    setProducts(products.map(product => 
      product.code === code 
        ? { ...product, selected: !product.selected } 
        : product
    ));
  };

  const handleToggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setProducts(products.map(product => ({ ...product, selected: newSelectAll })));
  };

  const handleRemoveProduct = (code: string) => {
    setProducts(products.filter(product => product.code !== code));
    toast({
      title: "Produto removido",
      description: `O produto ${code} foi removido do pedido.`,
    });
  };

  const handleEditProduct = (code: string) => {
    toast({
      title: "Editar produto",
      description: `Funcionalidade para editar o produto ${code}.`,
    });
  };

  const handleAddProduct = (code: string) => {
    toast({
      title: "Adicionar produto",
      description: `O produto ${code} foi adicionado ao pedido.`,
    });
  };

  const applyMassDiscount = () => {
    const discountValue = parseFloat(massDiscount);
    
    if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
      toast({
        title: "Erro",
        description: "Por favor, insira um valor de desconto válido entre 0 e 100.",
        variant: "destructive"
      });
      return;
    }
    
    const selectedProducts = products.filter(p => p.selected);
    
    if (selectedProducts.length === 0) {
      toast({
        title: "Atenção",
        description: "Selecione pelo menos um produto para aplicar o desconto.",
        variant: "destructive"
      });
      return;
    }
    
    setProducts(products.map(product => 
      product.selected 
        ? { ...product, discount: discountValue } 
        : product
    ));
    
    toast({
      title: "Desconto aplicado",
      description: `Desconto de ${discountValue}% aplicado a ${selectedProducts.length} produtos.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800/70 dark:backdrop-blur-md dark:border dark:border-gray-700/50 p-4 rounded-md border border-sfa-border">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Checkbox 
              id="select-all" 
              checked={selectAll}
              onCheckedChange={handleToggleSelectAll}
              className="border-sfa-border dark:border-gray-600"
            />
            <label htmlFor="select-all" className="text-sm text-sfa-dark dark:text-white cursor-pointer">
              Selecionar todos
            </label>
          </div>
          
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="% Desconto"
              value={massDiscount}
              onChange={(e) => setMassDiscount(e.target.value)}
              className="w-32 border-sfa-border dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <Button 
              variant="outline" 
              onClick={applyMassDiscount}
              className="border-sfa-border dark:border-gray-700 dark:text-white dark:bg-gray-800/70"
            >
              <Percent className="h-4 w-4 mr-2" />
              Aplicar Desconto
            </Button>
          </div>
          
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" className="border-sfa-border dark:border-gray-700 dark:text-white dark:bg-gray-800/70">
              <AlertCircle className="h-4 w-4 mr-2" />
              Verificar Produtos
            </Button>
          </div>
        </div>
      </div>
      
      <Card className="border border-sfa-border dark:border-gray-700 dark:bg-gray-800/70 dark:backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/80 border-b border-sfa-border dark:border-gray-600">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-sfa-secondary dark:text-gray-300">
                  <Checkbox 
                    checked={selectAll}
                    onCheckedChange={handleToggleSelectAll}
                    className="border-sfa-border dark:border-gray-600"
                  />
                </th>
                <th className="px-4 py-3 text-left font-medium text-sfa-secondary dark:text-gray-300">Cód</th>
                <th className="px-4 py-3 text-left font-medium text-sfa-secondary dark:text-gray-300">Referência</th>
                <th className="px-4 py-3 text-left font-medium text-sfa-secondary dark:text-gray-300">MIX</th>
                <th className="px-4 py-3 text-left font-medium text-sfa-secondary dark:text-gray-300">Cód.Cli.</th>
                <th className="px-4 py-3 text-left font-medium text-sfa-secondary dark:text-gray-300">Ordem de Compra</th>
                <th className="px-4 py-3 text-left font-medium text-sfa-secondary dark:text-gray-300">Descrição</th>
                <th className="px-4 py-3 text-center font-medium text-sfa-secondary dark:text-gray-300">Qtd</th>
                <th className="px-4 py-3 text-center font-medium text-sfa-secondary dark:text-gray-300">UMV</th>
                <th className="px-4 py-3 text-center font-medium text-sfa-secondary dark:text-gray-300">Múltiplo</th>
                <th className="px-4 py-3 text-right font-medium text-sfa-secondary dark:text-gray-300">Preço Líquido</th>
                <th className="px-4 py-3 text-right font-medium text-sfa-secondary dark:text-gray-300">Último Preço</th>
                <th className="px-4 py-3 text-right font-medium text-sfa-secondary dark:text-gray-300">Desconto</th>
                <th className="px-4 py-3 text-center font-medium text-sfa-secondary dark:text-gray-300">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sfa-border dark:divide-gray-700">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={14} className="px-4 py-4 text-center text-sfa-secondary dark:text-gray-400">
                    Nenhum Item
                  </td>
                </tr>
              ) : (
                products.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3">
                      <Checkbox 
                        checked={product.selected} 
                        onCheckedChange={() => handleToggleSelect(product.code)}
                        className="border-sfa-border dark:border-gray-600" 
                      />
                    </td>
                    <td className="px-4 py-3 text-sfa-dark dark:text-white">{product.code}</td>
                    <td className="px-4 py-3 text-sfa-dark dark:text-white max-w-xs truncate">{product.reference}</td>
                    <td className="px-4 py-3 text-sfa-dark dark:text-white">{product.mixType}</td>
                    <td className="px-4 py-3 text-sfa-dark dark:text-white">{product.clientCode || '-'}</td>
                    <td className="px-4 py-3 text-sfa-dark dark:text-white">-</td>
                    <td className="px-4 py-3 text-sfa-dark dark:text-white max-w-xs truncate">{product.description}</td>
                    <td className="px-4 py-3 text-center text-sfa-dark dark:text-white">
                      <Input 
                        type="number" 
                        value={product.quantity || ''} 
                        onChange={(e) => {
                          const newProducts = [...products];
                          newProducts[index].quantity = Number(e.target.value);
                          setProducts(newProducts);
                        }} 
                        className="w-16 text-center border-sfa-border dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      />
                    </td>
                    <td className="px-4 py-3 text-center text-sfa-dark dark:text-white">UN</td>
                    <td className="px-4 py-3 text-center text-sfa-dark dark:text-white">100</td>
                    <td className="px-4 py-3 text-right text-sfa-dark dark:text-white">-</td>
                    <td className="px-4 py-3 text-right text-sfa-dark dark:text-white">-</td>
                    <td className="px-4 py-3 text-right text-sfa-dark dark:text-white">
                      <Input 
                        type="number" 
                        value={product.discount || ''} 
                        onChange={(e) => {
                          const newProducts = [...products];
                          newProducts[index].discount = Number(e.target.value);
                          setProducts(newProducts);
                        }} 
                        className="w-16 text-right border-sfa-border dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex space-x-1 justify-center">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-sfa-primary dark:text-blue-400"
                          onClick={() => handleAddProduct(product.code)}
                        >
                          <PlusCircle className="h-5 w-5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-amber-500"
                          onClick={() => handleEditProduct(product.code)}
                        >
                          <Pencil className="h-5 w-5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-500"
                          onClick={() => handleRemoveProduct(product.code)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 flex justify-between items-center bg-gray-50 dark:bg-gray-700/80 border-t border-sfa-border dark:border-gray-600">
          <div className="text-sm text-sfa-secondary dark:text-gray-300">
            Mostrando {products.length} produtos
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-sfa-secondary dark:text-gray-300">Itens por página:</span>
            <select className="text-sm bg-white border border-sfa-border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductList;
