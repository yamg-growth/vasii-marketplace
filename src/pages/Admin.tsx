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
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadProductsFromSupabase();
  }, []);

  const loadProductsFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) throw error;
      
      const products: Partial<Product>[] = (data || []).map(row => ({
        id: row.id.toString(),
        code: row.id.toString(),
        category: row.category || '',
        subcategory: row.subcategory || '',
        size: row.size || 'Única',
        fabric: row.details || 'N/A',
        price: row.price || 0,
        imageUrl: row.image_url || '/placeholder.svg',
        box: row.subcategory || row.category || '',
        stock: 1,
        collection: row.collection as Collection || 'inbox',
        isPlus: /\b(XL|XXL|XXXL|PLUS|CURVY)\b/i.test(row.size || '')
      }));
      
      setAllProducts(products);
    } catch (e) {
      console.error('Error loading products:', e);
      toast.error('Error al cargar productos');
    }
  };

  const handleBulkUpload = async () => {
    if (!textInput.trim()) {
      toast.error('Por favor pega el contenido del archivo');
      return;
    }

    setIsLoading(true);
    const products = parseCSVFile(textInput);
    
    let successCount = 0;
    let failCount = 0;

    for (const product of products) {
      try {
        const { error } = await supabase
          .from('products')
          .upsert({
            id: parseInt(product.id!),
            category: product.category,
            subcategory: product.subcategory,
            size: product.size,
            details: product.fabric,
            price: product.price,
            image_url: product.imageUrl,
            collection: 'inbox'
          });
        
        if (error) {
          console.error('Error upserting product:', product.id, error);
          failCount++;
        } else {
          successCount++;
        }
      } catch (e) {
        console.error('Error processing product:', product.id, e);
        failCount++;
      }
    }

    setIsLoading(false);
    toast.success(`✅ ${successCount} productos cargados${failCount > 0 ? `, ${failCount} fallidos` : ''}`);
    setTextInput('');
    loadProductsFromSupabase();
  };

  const handleResetDatabase = async () => {
    const confirm1 = window.confirm('⚠️ ¿ELIMINAR TODO EL INVENTARIO? Esta acción NO se puede deshacer.');
    if (!confirm1) return;
    
    const confirm2 = window.confirm('⚠️ CONFIRMACIÓN FINAL: ¿Estás 100% seguro de eliminar todos los productos?');
    if (!confirm2) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .neq('id', 0);
      
      if (error) throw error;
      
      toast.success('Base de datos limpiada exitosamente');
      setAllProducts([]);
    } catch (e) {
      console.error('Error resetting database:', e);
      toast.error('Error al limpiar la base de datos');
    }
  };

  const handleClassify = async (productId: string, collection: Collection) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ collection })
        .eq('id', parseInt(productId));
      
      if (error) throw error;
      
      setAllProducts(prev => 
        prev.map(p => 
          p.id === productId ? { ...p, collection } : p
        )
      );
      toast.success('Producto clasificado exitosamente');
    } catch (e) {
      console.error('Error classifying product:', e);
      toast.error('Error al clasificar producto');
    }
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
                <p className="text-muted-foreground mt-1">Gestiona tu inventario con Supabase</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="destructive" onClick={handleResetDatabase}>
                <Trash2 className="h-4 w-4 mr-2" />
                Reset Database
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Carga Masiva (PARSER V2)</CardTitle>
              <CardDescription>
                Pega el contenido del archivo TXT o CSV. El parser detectará automáticamente el formato.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Pega aquí el contenido del archivo..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                rows={10}
                className="font-mono text-sm"
              />
              <Button 
                onClick={handleBulkUpload} 
                disabled={isLoading || !textInput.trim()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isLoading ? 'Procesando...' : 'Cargar Productos a Supabase'}
              </Button>
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
