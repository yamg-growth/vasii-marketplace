import { useState, useEffect, useMemo } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { ProductFilters, ProductFilters as Filters } from '@/components/ProductFilters';
import { loadAllProducts, getUniqueCategories, getUniqueSubcategories, getUniqueSizes, getPriceRange } from '@/data/loadProducts';
import { Product, FilterOptions } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function Catalog() {
  const [products] = useState<Product[]>(loadAllProducts());
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    subcategories: [],
    sizes: [],
    priceRange: getPriceRange(),
    collections: []
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const availableFilters: FilterOptions = useMemo(() => ({
    categories: getUniqueCategories(),
    subcategories: getUniqueSubcategories(),
    sizes: getUniqueSizes(),
    priceRange: getPriceRange(),
    collections: []
  }), []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }

      // Subcategory filter
      if (filters.subcategories.length > 0 && !filters.subcategories.includes(product.subcategory)) {
        return false;
      }

      // Size filter
      if (filters.sizes.length > 0 && !filters.sizes.includes(product.size)) {
        return false;
      }

      // Price filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      return true;
    });
  }, [products, filters]);

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Catálogo Completo
          </h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} de {products.length} productos
          </p>
        </div>

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

            {/* Products */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <X className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-muted-foreground mb-6">
                  Intenta ajustar tus filtros para ver más resultados
                </p>
                <Button
                  variant="outline"
                  onClick={() => setFilters({
                    categories: [],
                    subcategories: [],
                    sizes: [],
                    priceRange: getPriceRange(),
                    collections: []
                  })}
                >
                  Limpiar filtros
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
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
