import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product, Collection } from '@/types/product';
import { classifyProduct } from '@/utils/csvParser';

interface ProductClassificationModalProps {
  products: Partial<Product>[];
  onComplete: (classifiedProducts: Product[]) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const subcategoryOptions = [
  'Vestidos',
  'Dos piezas',
  'Blazers',
  'Jumpsuits',
  'Vestidos de fiesta',
  'Blusas',
  'Pantalones',
  'Camisetas',
  'Cardigans',
  'Faldas',
  'Jeans',
  'Vestidos Plus Size',
  'Cardigans Plus Size',
  'Coat Plus',
  'Jeans Plus',
  'Pantalones Plus',
  'Coat & Jackets',
  'Sweaters',
  'Men',
  'Baby',
  'Maternity',
  'Tenis',
  'Sport',
  'Lingerie',
  'Pijamas',
  'Tops',
  'Shorts'
];

export function ProductClassificationModal({
  products,
  onComplete,
  open,
  onOpenChange
}: ProductClassificationModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [classifications, setClassifications] = useState<Map<string, { subcategory: string; collection: Collection; stock: number }>>(new Map());
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [stock, setStock] = useState(1);

  const currentProduct = products[currentIndex];
  const totalProducts = products.length;
  const progress = ((currentIndex + 1) / totalProducts) * 100;

  const handleClassify = () => {
    if (!currentProduct || !selectedSubcategory) return;

    const collection = classifyProduct(currentProduct, selectedSubcategory);
    
    classifications.set(currentProduct.id!, {
      subcategory: selectedSubcategory,
      collection,
      stock
    });

    if (currentIndex < totalProducts - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedSubcategory('');
      setStock(1);
    } else {
      // Finish classification
      const classifiedProducts: Product[] = products.map(p => {
        const classification = classifications.get(p.id!);
        return {
          ...p,
          subcategory: classification?.subcategory || p.subcategory!,
          collection: classification?.collection || p.collection!,
          stock: classification?.stock || 1,
          isPlus: classification?.subcategory.toLowerCase().includes('plus') || false
        } as Product;
      });
      
      onComplete(classifiedProducts);
      onOpenChange(false);
      setCurrentIndex(0);
      setClassifications(new Map());
    }
  };

  const handleSkip = () => {
    if (currentIndex < totalProducts - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedSubcategory('');
      setStock(1);
    }
  };

  if (!currentProduct) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Clasificar Productos</DialogTitle>
          <DialogDescription>
            Producto {currentIndex + 1} de {totalProducts}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Product Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Código</p>
              <p className="font-medium">{currentProduct.code}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Categoría Original</p>
              <p className="font-medium">{currentProduct.category}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Talla</p>
              <p className="font-medium">{currentProduct.size}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Precio</p>
              <p className="font-medium">${currentProduct.price?.toLocaleString('es-CO')}</p>
            </div>
          </div>

          {/* Classification Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="subcategory">Subcategoría</Label>
              <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                <SelectTrigger id="subcategory">
                  <SelectValue placeholder="Selecciona una subcategoría" />
                </SelectTrigger>
                <SelectContent>
                  {subcategoryOptions.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="stock">Stock Disponible</Label>
              <Input
                id="stock"
                type="number"
                min="1"
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleSkip}>
            Omitir
          </Button>
          <Button onClick={handleClassify} disabled={!selectedSubcategory}>
            {currentIndex < totalProducts - 1 ? 'Siguiente' : 'Finalizar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
