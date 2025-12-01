import { useState, useEffect } from 'react';
import { InboxProductCard } from '@/components/InboxProductCard';
import { parseCSVFile } from '@/utils/csvParser';
import { Product, Collection } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Inbox, LogOut, Trash2, Upload } from 'lucide-react';
import { COLLECTIONS } from '@/data/collections';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function Admin() {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState<Partial<Product>[]>([]);
  const [bulkText, setBulkText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loadProductsFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Map DB rows to Product type
      const products: Partial<Product>[] = (data || []).map(row => ({
        id: row.id.toString(),
        code: row.id.toString(),
        category: row.category || '',
        subcategory: row.subcategory || '',
        size: row.size || '',
        fabric: row.details || '',
        price: row.price || 0,
        imageUrl: row.image_url || '/placeholder.svg',
        box: row.subcategory || row.category || '',
        stock: 1,
        collection: row.collection as any,
        isPlus: /\b(XL|XXL|XXXL|PLUS|CURVY)\b/i.test(row.size || '')
      }));
      
      setAllProducts(products);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Error al cargar productos');
    }
  };

  useEffect(() => {
    loadProductsFromSupabase();
  }, []);

  const handlePurgeDatabase = async () => {
    if (!window.confirm('⚠️ ADVERTENCIA: Esto borrará TODOS los productos de la base de datos. ¿Estás seguro?')) {
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .neq('id', 0);
      
      if (error) throw error;
      
      setAllProducts([]);
      toast.success('Base de datos limpiada exitosamente');
    } catch (error) {
      console.error('Error purging database:', error);
      toast.error('Error al limpiar la base de datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkText.trim()) {
      toast.error('Por favor ingresa datos para cargar');
      return;
    }

    setIsLoading(true);
    const products = parseCSVFile(bulkText);
    let successCount = 0;
    let errorCount = 0;

    try {
      // Insert productos en lotes de 100
      const batchSize = 100;
      for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);
        
        const { error } = await supabase
          .from('products')
          .upsert(batch.map(p => ({
            id: parseInt(p.id!) || Math.floor(Math.random() * 1000000),
            category: p.category,
            subcategory: p.subcategory,
            size: p.size,
            details: p.fabric,
            price: p.price,
            image_url: p.imageUrl,
            collection: null // INBOX
          })));
        
        if (error) {
          console.error('Batch error:', error);
          errorCount += batch.length;
        } else {
          successCount += batch.length;
        }
      }

      toast.success(`✅ ${successCount} productos cargados. ${errorCount > 0 ? `❌ ${errorCount} errores.` : ''}`);
      setBulkText('');
      await loadProductsFromSupabase();
    } catch (error) {
      console.error('Error bulk upload:', error);
      toast.error('Error en la carga masiva');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClassify = async (productId: string, collection: Collection) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ collection })
        .eq('id', parseInt(productId));
      
      if (error) throw error;
      
      // Optimistic UI update
      setAllProducts(prev =>
        prev.map(p =>
          p.id === productId ? { ...p, collection } : p
        )
      );
      
      toast.success('Producto clasificado exitosamente');
    } catch (error) {
      console.error('Error classifying product:', error);
      toast.error('Error al clasificar producto');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('vasii-admin-auth');
    navigate('/login');
  };

  const inboxProducts = allProducts.filter(p => !p.collection || p.collection === 'inbox');
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
              <Button 
                variant="destructive" 
                onClick={handlePurgeDatabase}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Borrar Todo
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Carga Masiva de Inventario
              </CardTitle>
              <CardDescription>
                Pega el contenido del archivo TXT aquí. Cada línea será procesada automáticamente.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Pega aquí el contenido del archivo de inventario..."
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={handleBulkUpload}
                  disabled={isLoading || !bulkText.trim()}
                  className="flex-1"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isLoading ? 'Procesando...' : 'Procesar y Cargar'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setBulkText('')}
                  disabled={isLoading}
                >
                  Limpiar
                </Button>
              </div>
            </CardContent>
          </Card>

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
