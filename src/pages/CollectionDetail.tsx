import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { COLLECTIONS, WHATSAPP_MESSAGE_TEMPLATES } from '@/data/collections';
import { ProductCard } from '@/components/ProductCard';
import { ProductFilters, ProductFilters as Filters } from '@/components/ProductFilters';
import { MOCK_PRODUCTS, getUniqueCategories, getUniqueSubcategories, getUniqueSizes, getPriceRange } from '@/data/mockProducts';
import { Product, FilterOptions } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, MessageCircle, ArrowLeft } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function CollectionDetail() {
  const { collectionId } = useParams<{ collectionId: string }>();
  const collection = COLLECTIONS.find(c => c.id === collectionId);
  
  const collectionProducts = useMemo(() => 
    MOCK_PRODUCTS.filter(p => p.collection === collectionId),
    [collectionId]
  );

  const [filters, setFilters] = useState<Filters>({
    categories: [],
    subcategories: [],
    sizes: [],
    priceRange: getPriceRange(collectionProducts),
    collections: []
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const availableFilters: FilterOptions = useMemo(() => ({
    categories: getUniqueCategories(collectionProducts),
    subcategories: getUniqueSubcategories(collectionProducts),
    sizes: getUniqueSizes(collectionProducts),
    priceRange: getPriceRange(collectionProducts),
    collections: []
  }), [collectionProducts]);

  const filteredProducts = useMemo(() => {
    return collectionProducts.filter(product => {
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }
      if (filters.subcategories.length > 0 && !filters.subcategories.includes(product.subcategory)) {
        return false;
      }
      if (filters.sizes.length > 0 && !filters.sizes.includes(product.size)) {
        return false;
      }
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }
      return true;
    });
  }, [collectionProducts, filters]);

  if (!collection) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Colección no encontrada
          </h1>
          <Button asChild>
            <Link to="/colecciones">Ver todas las colecciones</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleWhatsAppClick = () => {
    window.open(collection.whatsappLink, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className={`bg-gradient-to-br ${collection.color} py-16 text-white`}>
        <div className="container mx-auto px-4">
          <Button variant="ghost" asChild className="mb-6 text-white hover:bg-white/20">
            <Link to="/colecciones">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a colecciones
            </Link>
          </Button>
          
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-6xl">{collection.icon}</span>
              <h1 className="text-4xl md:text-5xl font-bold">
                {collection.name}
              </h1>
            </div>
            <p className="text-xl text-white/90 mb-6">
              {collection.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Badge variant="secondary" className="text-lg py-2 px-4 bg-white text-foreground">
                {collectionProducts.length} productos disponibles
              </Badge>
              <Button size="lg" variant="secondary" onClick={handleWhatsAppClick}>
                <MessageCircle className="h-5 w-5 mr-2" />
                Contactar por WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block">
            <ProductFilters
              availableFilters={availableFilters}
              currentFilters={filters}
              onFilterChange={handleFilterChange}
            />
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <ProductFilters
                      availableFilters={availableFilters}
                      currentFilters={filters}
                      onFilterChange={handleFilterChange}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Results */}
            <div className="mb-6">
              <p className="text-muted-foreground">
                Mostrando {filteredProducts.length} de {collectionProducts.length} productos
              </p>
            </div>

            {/* Pack Amigas Info (Only for Work & Casual) */}
            {collection.id === 'work-casual' && (
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-500/10 to-cyan-600/10 rounded-lg border border-blue-500/20">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  🎁 Pack Amigas - Compra por Paquete
                </h3>
                <p className="text-muted-foreground mb-4">
                  ¡Compra en grupo y ahorra! Disponible en Pack Amigas 3x y Pack Amigas 6x
                </p>
                <Button onClick={handleWhatsAppClick}>
                  Consultar Pack Amigas
                  <MessageCircle className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-muted-foreground mb-6">
                  Intenta ajustar tus filtros
                </p>
                <Button
                  variant="outline"
                  onClick={() => setFilters({
                    categories: [],
                    subcategories: [],
                    sizes: [],
                    priceRange: getPriceRange(collectionProducts),
                    collections: []
                  })}
                >
                  Limpiar filtros
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
