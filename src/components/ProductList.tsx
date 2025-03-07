
import { Card } from '@/components/ui/card';

type Product = {
  code: string;
  mixCode: string;
  mixType: string;
  reference: string;
  description: string;
  stock: number;
  stockUnit: string;
  clientCode?: string;
};

const ProductList = () => {
  // Mock products data similar to the image
  const products: Product[] = [
    {
      code: '10010800',
      mixCode: 'MIX: B',
      mixType: 'B',
      reference: 'PA FR AC UNC C/PO SX 3/16X3/4 RI POL',
      description: 'Parafuso AC UNC com porca sextavada 3/16X3/4 RI Polido',
      stock: 150.01,
      stockUnit: 'CE'
    },
    {
      code: '10010801',
      mixCode: 'MIX: B',
      mixType: 'B',
      reference: 'PA FR AC UNC C/PO SX 3/16X3/4 RI ZB',
      description: 'Parafuso AC UNC com porca sextavada 3/16X3/4 RI Zincado Branco',
      stock: 113.7,
      stockUnit: 'CE'
    },
    {
      code: '10011000',
      mixCode: 'MIX: B',
      mixType: 'B',
      reference: 'PA FR AC UNC C/PO SX 3/16X1 RI POL',
      description: 'Parafuso AC UNC com porca sextavada 3/16X1 RI Polido',
      stock: 398.1,
      stockUnit: 'CE'
    },
    {
      code: '10011001',
      mixCode: 'MIX: B',
      mixType: 'B',
      reference: 'PA FR AC UNC C/PO SX 3/16X1 RI ZB',
      description: 'Parafuso AC UNC com porca sextavada 3/16X1 RI Zincado Branco',
      stock: 1402.17,
      stockUnit: 'CE'
    }
  ];

  return (
    <Card className="border border-sfa-border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-sfa-border">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-sfa-secondary">Cód</th>
              <th className="px-4 py-3 text-left font-medium text-sfa-secondary">Referência</th>
              <th className="px-4 py-3 text-left font-medium text-sfa-secondary">MIX</th>
              <th className="px-4 py-3 text-left font-medium text-sfa-secondary">Cód.Cli.</th>
              <th className="px-4 py-3 text-left font-medium text-sfa-secondary">Ordem de Compra</th>
              <th className="px-4 py-3 text-left font-medium text-sfa-secondary">Descrição</th>
              <th className="px-4 py-3 text-center font-medium text-sfa-secondary">Qtd</th>
              <th className="px-4 py-3 text-center font-medium text-sfa-secondary">UMV</th>
              <th className="px-4 py-3 text-center font-medium text-sfa-secondary">Múltiplo</th>
              <th className="px-4 py-3 text-right font-medium text-sfa-secondary">Preço Líquido</th>
              <th className="px-4 py-3 text-right font-medium text-sfa-secondary">Último Preço</th>
              <th className="px-4 py-3 text-right font-medium text-sfa-secondary">Desconto</th>
              <th className="px-4 py-3 text-center font-medium text-sfa-secondary">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sfa-border">
            {products.length === 0 ? (
              <tr>
                <td colSpan={13} className="px-4 py-4 text-center text-sfa-secondary">
                  Nenhum Item
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sfa-dark">{product.code}</td>
                  <td className="px-4 py-3 text-sfa-dark max-w-xs truncate">{product.reference}</td>
                  <td className="px-4 py-3 text-sfa-dark">{product.mixType}</td>
                  <td className="px-4 py-3 text-sfa-dark">{product.clientCode || '-'}</td>
                  <td className="px-4 py-3 text-sfa-dark">-</td>
                  <td className="px-4 py-3 text-sfa-dark max-w-xs truncate">{product.description}</td>
                  <td className="px-4 py-3 text-center text-sfa-dark">-</td>
                  <td className="px-4 py-3 text-center text-sfa-dark">UN</td>
                  <td className="px-4 py-3 text-center text-sfa-dark">100</td>
                  <td className="px-4 py-3 text-right text-sfa-dark">-</td>
                  <td className="px-4 py-3 text-right text-sfa-dark">-</td>
                  <td className="px-4 py-3 text-right text-sfa-dark">-</td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-sfa-primary hover:text-sfa-accent">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 flex justify-between items-center bg-gray-50 border-t border-sfa-border">
        <div className="text-sm text-sfa-secondary">
          Mostrando {products.length} produtos
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-sfa-secondary">Itens por página:</span>
          <select className="text-sm bg-white border border-sfa-border rounded px-2 py-1">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
        </div>
      </div>
    </Card>
  );
};

export default ProductList;
