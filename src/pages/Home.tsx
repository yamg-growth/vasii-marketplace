import { useState, useEffect } from 'react';
import { COLLECTIONS } from '@/data/collections';
import { CollectionCard } from '@/components/CollectionCard';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { loadAllProducts } from '@/data/loadProducts';
import { Product } from '@/types/product';
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);

  useEffect(() => {
    // Load products from inventory
    const allProducts = loadAllProducts();
    setFeaturedProducts(allProducts.slice(0, 6));
    setBestSellers(allProducts.slice(0, 8));
  }, []);

  const getCollectionProductCount = (collectionId: string) => {
    const allProducts = loadAllProducts();
    return allProducts.filter(p => p.collection === collectionId).length;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              VaSii Marketplace
            </h1>
            <p className="text-xl text-muted-foreground">
              Más de 1,467 productos en 5 colecciones exclusivas
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/catalogo">
                  Ver catálogo completo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/colecciones">
                  Explorar colecciones
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nuestras Colecciones
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubre nuestras 5 colecciones exclusivas, cada una diseñada para diferentes estilos y ocasiones
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">
                Productos Destacados
              </h2>
            </div>
            <Button variant="outline" asChild>
              <Link to="/catalogo">
                Ver todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">
                Bestsellers de Temporada
              </h2>
            </div>
            <Button variant="outline" asChild>
              <Link to="/catalogo">
                Ver más
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary/90 to-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            ¿Lista para renovar tu guardarropa?
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
            Explora nuestro catálogo completo y encuentra las prendas perfectas para ti
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/catalogo">
                Explorar catálogo
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link to="/colecciones">
                Ver por colección
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
