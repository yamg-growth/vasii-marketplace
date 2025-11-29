import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ProductClassificationModal } from '@/components/ProductClassificationModal';
import { parseCSVFile } from '@/utils/csvParser';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';

export default function Admin() {
  const navigate = useNavigate();
  const [parsedProducts, setParsedProducts] = useState<Partial<Product>[]>([]);
  const [showClassificationModal, setShowClassificationModal] = useState(false);
  const [loadedFileName, setLoadedFileName] = useState('');

  const handleFileLoaded = (content: string, filename: string) => {
    const products = parseCSVFile(content);
    setParsedProducts(products);
    setLoadedFileName(filename);
    setShowClassificationModal(true);
  };

  const handleClassificationComplete = (classifiedProducts: Product[]) => {
    // Save to localStorage for now (in production, this would go to a database)
    localStorage.setItem('vasii-products', JSON.stringify(classifiedProducts));
    localStorage.setItem('vasii-products-timestamp', Date.now().toString());
    
    // Navigate back to catalog
    navigate('/catalogo');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-4xl font-serif font-bold">Administración</h1>
              <p className="text-muted-foreground mt-1">Gestiona tu inventario de productos</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventario Actual
              </CardTitle>
              <CardDescription>
                {parsedProducts.length > 0 
                  ? `${parsedProducts.length} productos cargados desde ${loadedFileName}`
                  : 'No hay productos cargados'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {parsedProducts.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Último archivo cargado: <span className="font-medium">{loadedFileName}</span>
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setShowClassificationModal(true)}
                  >
                    Reclasificar productos
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <FileUpload onFileLoaded={handleFileLoaded} />

          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="font-semibold">Instrucciones</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Sube un archivo CSV con tu inventario</li>
              <li>El sistema parseará automáticamente los productos</li>
              <li>Clasifica cada producto en su subcategoría correspondiente</li>
              <li>Los productos se organizarán automáticamente en los 5 Universos</li>
              <li>El catálogo se actualizará inmediatamente</li>
            </ol>
          </div>
        </div>
      </div>

      <ProductClassificationModal
        products={parsedProducts}
        onComplete={handleClassificationComplete}
        open={showClassificationModal}
        onOpenChange={setShowClassificationModal}
      />
    </div>
  );
}
