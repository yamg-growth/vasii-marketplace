import { useState, useEffect } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { InboxProductCard } from '@/components/InboxProductCard';
import { parseCSVFile } from '@/utils/csvParser';
import { Product, Collection } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Inbox, LogOut, Save } from 'lucide-react';
import { COLLECTIONS } from '@/data/collections';
import { toast } from 'sonner';

export default function Admin() {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState<Partial<Product>[]>([]);
  const [loadedFileName, setLoadedFileName] = useState('');

  useEffect(() => {
    // Load existing products from localStorage
    const stored = localStorage.getItem('vasii-products');
    if (stored) {
      try {
        const products = JSON.parse(stored);
        setAllProducts(products);
      } catch (e) {
        console.error('Error loading products:', e);
      }
    }
  }, []);

  const handleFileLoaded = (content: string, filename: string) => {
    const products = parseCSVFile(content);
    setLoadedFileName(filename);
    setAllProducts(prev => [...prev, ...products]);
    toast.success(`${products.length} productos cargados en INBOX`);
  };

  const handleClassify = (productId: string, collection: Collection) => {
    setAllProducts(prev => 
      prev.map(p => 
        p.id === productId ? { ...p, collection } : p
      )
    );
    toast.success('Producto movido exitosamente');
  };

  const handleSaveChanges = () => {
    localStorage.setItem('vasii-products', JSON.stringify(allProducts));
    localStorage.setItem('vasii-products-timestamp', Date.now().toString());
    toast.success('Cambios guardados');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('vasii-admin-auth');
    navigate('/login');
  };

  const inboxProducts = allProducts.filter(p => p.collection === 'inbox');
  const availableCollections = COLLECTIONS.filter(c => c.id !== 'inbox');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Tienda
              </Button>
              <div>
                <h1 className="text-4xl font-serif font-bold">VaSii Command Center</h1>
                <p className="text-muted-foreground mt-1">Gestiona tu inventario visualmente</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveChanges}>
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>

          <FileUpload onFileLoaded={handleFileLoaded} />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventario Total: {allProducts.length} productos
              </CardTitle>
              <CardDescription>
                {inboxProducts.length > 0 
                  ? `${inboxProducts.length} productos sin clasificar en INBOX`
                  : 'Todos los productos están clasificados'}
              </CardDescription>
            </CardHeader>
          </Card>

          <Tabs defaultValue="inbox" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="inbox" className="gap-2">
                <Inbox className="h-4 w-4" />
                INBOX ({inboxProducts.length})
              </TabsTrigger>
              {availableCollections.map(collection => (
                <TabsTrigger key={collection.id} value={collection.id}>
                  {collection.icon} {collection.name.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="inbox" className="mt-6">
              {inboxProducts.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Inbox className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No hay productos sin clasificar</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {inboxProducts.map(product => (
                    <InboxProductCard
                      key={product.id}
                      product={product}
                      onClassify={handleClassify}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {availableCollections.map(collection => {
              const collectionProducts = allProducts.filter(p => p.collection === collection.id);
              return (
                <TabsContent key={collection.id} value={collection.id} className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{collection.name}</CardTitle>
                      <CardDescription>
                        {collectionProducts.length} productos clasificados
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {collectionProducts.map(product => (
                          <InboxProductCard
                            key={product.id}
                            product={product}
                            onClassify={handleClassify}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
