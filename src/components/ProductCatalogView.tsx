
import { FC, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Filter, 
  Grid, 
  ListIcon, 
  ColumnsIcon, 
  ChevronDown 
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  stock: string;
}

const ProductCatalogView: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Mock product data based on the image
  const products: Product[] = [
    {
      id: '10010800',
      name: 'PA FR AC UNC C/PO SX 3/16X3/4 RI POL',
      category: 'PARAFUSO | FRANCÊS',
      image: '/lovable-uploads/2788c2d3-5626-462a-b33e-48c3c0dfdf77.png',
      description: 'Parafuso AC UNC com porca sextavada 3/16X3/4 RI Polido',
      stock: '5 CE'
    },
    {
      id: '10010801',
      name: 'PA FR AC UNC C/PO SX 3/16X3/4 RI ZB',
      category: 'PARAFUSO | FRANCÊS',
      image: '/lovable-uploads/2788c2d3-5626-462a-b33e-48c3c0dfdf77.png',
      description: 'Parafuso AC UNC com porca sextavada 3/16X3/4 RI Zincado Branco',
      stock: '5 CE'
    },
    {
      id: '10011000',
      name: 'PA FR AC UNC C/PO SX 3/16X1 RI POL',
      category: 'PARAFUSO | FRANCÊS',
      image: '/lovable-uploads/2788c2d3-5626-462a-b33e-48c3c0dfdf77.png',
      description: 'Parafuso AC UNC com porca sextavada 3/16X1 RI Polido',
      stock: '5 CE'
    },
    {
      id: '10011001',
      name: 'PA FR AC UNC C/PO SX 3/16X1 RI ZB',
      category: 'PARAFUSO | FRANCÊS',
      image: '/lovable-uploads/2788c2d3-5626-462a-b33e-48c3c0dfdf77.png',
      description: 'Parafuso AC UNC com porca sextavada 3/16X1 RI Zincado Branco',
      stock: '5 CE'
    },
    {
      id: '10011002',
      name: 'PA FR AC UNC C/PO SX 3/16X1 RI BC',
      category: 'PARAFUSO | FRANCÊS',
      image: '/lovable-uploads/2788c2d3-5626-462a-b33e-48c3c0dfdf77.png',
      description: 'Parafuso AC UNC com porca sextavada 3/16X1 RI Bicromado',
      stock: '5 CE'
    },
    {
      id: '10011100',
      name: 'PA FR AC UNC C/PO SX 3/16X1.1/4 RI POL',
      category: 'PARAFUSO | FRANCÊS',
      image: '/lovable-uploads/2788c2d3-5626-462a-b33e-48c3c0dfdf77.png',
      description: 'Parafuso AC UNC com porca sextavada 3/16X1.1/4 RI Polido',
      stock: '5 CE'
    },
    {
      id: '10011101',
      name: 'PA FR AC UNC C/PO SX 3/16X1.1/4 RI ZB',
      category: 'PARAFUSO | FRANCÊS',
      image: '/lovable-uploads/2788c2d3-5626-462a-b33e-48c3c0dfdf77.png',
      description: 'Parafuso AC UNC com porca sextavada 3/16X1.1/4 RI Zincado Branco',
      stock: '5 CE'
    },
    {
      id: '10011102',
      name: 'PA FR AC UNC C/PO SX 3/16X1.1/4 RI BC',
      category: 'PARAFUSO | FRANCÊS',
      image: '/lovable-uploads/2788c2d3-5626-462a-b33e-48c3c0dfdf77.png',
      description: 'Parafuso AC UNC com porca sextavada 3/16X1.1/4 RI Bicromado',
      stock: '5 CE'
    }
  ];

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.id.includes(searchQuery) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-sfa-dark dark:text-white mb-1">Catálogo (19684)</h1>
          <p className="text-sfa-secondary dark:text-gray-400">Consulte todos os produtos disponíveis</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex border border-sfa-border dark:border-gray-700 rounded overflow-hidden">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'ghost'} 
              size="sm" 
              className="rounded-none" 
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'ghost'} 
              size="sm" 
              className="rounded-none" 
              onClick={() => setViewMode('list')}
            >
              <ListIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="rounded-none">
              <ColumnsIcon className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" className="border-sfa-border dark:border-gray-700 dark:text-white">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <div className="grow">
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
        <div className="w-44">
          <Select>
            <SelectTrigger className="border-sfa-border dark:border-gray-700 dark:bg-gray-800 dark:text-white">
              <SelectValue placeholder="Família" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="parafusos">Parafusos</SelectItem>
              <SelectItem value="porcas">Porcas</SelectItem>
              <SelectItem value="arruelas">Arruelas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-44">
          <Select>
            <SelectTrigger className="border-sfa-border dark:border-gray-700 dark:bg-gray-800 dark:text-white">
              <SelectValue placeholder="Subfamília" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="frances">Francês</SelectItem>
              <SelectItem value="sextavado">Sextavado</SelectItem>
              <SelectItem value="fenda">Fenda</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden border border-sfa-border dark:border-gray-700 dark:bg-gray-800">
              <div className="p-2 bg-sfa-primary/10 dark:bg-sfa-primary/20 flex justify-between items-center">
                <span className="text-xs font-medium text-sfa-dark dark:text-white">{product.id}</span>
                <span className="text-xs text-sfa-secondary dark:text-gray-300">{product.category}</span>
              </div>
              <div className="p-4 flex justify-center">
                <img src={product.image} alt={product.name} className="h-40 object-contain" />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-sfa-dark dark:text-white text-sm mb-2">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-sfa-secondary dark:text-gray-300">{product.stock}</span>
                  <span className="text-xs font-bold w-5 h-5 flex items-center justify-center bg-blue-900 text-white rounded-sm">N</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border border-sfa-border dark:border-gray-700 dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-sfa-border dark:border-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-sfa-secondary dark:text-gray-300">ID</th>
                  <th className="px-4 py-3 text-left font-medium text-sfa-secondary dark:text-gray-300">Imagem</th>
                  <th className="px-4 py-3 text-left font-medium text-sfa-secondary dark:text-gray-300">Nome</th>
                  <th className="px-4 py-3 text-left font-medium text-sfa-secondary dark:text-gray-300">Categoria</th>
                  <th className="px-4 py-3 text-center font-medium text-sfa-secondary dark:text-gray-300">Estoque</th>
                  <th className="px-4 py-3 text-center font-medium text-sfa-secondary dark:text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sfa-border dark:divide-gray-700">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 text-sfa-dark dark:text-white">{product.id}</td>
                    <td className="px-4 py-3">
                      <img src={product.image} alt={product.name} className="h-10 w-10 object-contain" />
                    </td>
                    <td className="px-4 py-3 text-sfa-dark dark:text-white">{product.name}</td>
                    <td className="px-4 py-3 text-sfa-dark dark:text-white">{product.category}</td>
                    <td className="px-4 py-3 text-center text-sfa-dark dark:text-white">{product.stock}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block w-5 h-5 flex items-center justify-center bg-blue-900 text-white rounded-sm text-xs font-bold">N</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProductCatalogView;
