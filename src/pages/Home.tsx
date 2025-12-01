import { useState, useEffect } from 'react';
import { COLLECTIONS } from '@/data/collections';
import { CollectionCard } from '@/components/CollectionCard';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { loadAllProducts } from '@/data/loadProducts';
import { Product } from '@/types/product';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);

  useEffect(() => {
    loadAllProducts().then(products => {
      setAllProducts(products);
      setFeaturedProducts(products.slice(0, 6));
      setBestSellers(products.slice(0, 8));
    });
  }, []);

  const getCollectionProductCount = (collectionId: string) => {
    return allProducts.filter(p => p.collection === collectionId).length;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-20 md:py-32 border-b">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-5 py-2 border border-foreground/10 rounded-full">
              <Sparkles className="h-4 w-4 text-foreground" />
              <span className="text-sm font-medium uppercase tracking-wider">Venta Privada SHEIN</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground leading-tight">
              Moda Exclusiva
              <br />
              <span className="font-light italic">Entrega Inmediata</span>
            </h1>
            
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto font-light">
              Descubre las últimas tendencias SHEIN con envío gratis en compras superiores a $170k.
              <br />
              Descuentos especiales para compras en grupo.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                asChild 
                className="text-sm bg-foreground text-background hover:bg-foreground/90 uppercase tracking-wider font-medium"
              >
                <Link to="/catalogo">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Ver Catálogo
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild 
                className="text-sm uppercase tracking-wider font-medium border-foreground/20 hover:bg-foreground/5"
              >
                <Link to="/colecciones">
                  Explorar Colecciones
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-24 bg-background">
        <div className="container px-4 mx-auto">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold">Nuestras Colecciones</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-light text-base">
              Explora nuestras colecciones exclusivas diseñadas para cada ocasión
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {COLLECTIONS.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                productCount={getCollectionProductCount(collection.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold">Productos Destacados</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-light text-base">
              Descubre nuestros productos más populares de la temporada
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Button 
              size="lg" 
              variant="outline" 
              asChild
              className="uppercase tracking-wider font-medium border-foreground/20 hover:bg-foreground/5"
            >
              <Link to="/catalogo">
                Ver Catálogo Completo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="py-24 bg-background">
        <div className="container px-4 mx-auto">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold">Bestsellers de Temporada</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-light text-base">
              Los favoritos de nuestras clientas
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
