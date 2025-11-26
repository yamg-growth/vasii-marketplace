import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { FilterOptions } from '@/types/product';
import { formatPrice } from '@/utils/productClassifier';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface ProductFiltersProps {
  availableFilters: FilterOptions;
  onFilterChange: (filters: Partial<ProductFilters>) => void;
  currentFilters: ProductFilters;
}

export interface ProductFilters {
  categories: string[];
  subcategories: string[];
  sizes: string[];
  priceRange: [number, number];
  collections: string[];
}

export function ProductFilters({ 
  availableFilters, 
  onFilterChange,
  currentFilters 
}: ProductFiltersProps) {
  const [localFilters, setLocalFilters] = useState<ProductFilters>(currentFilters);

  const handleCategoryToggle = (category: string) => {
    const updated = localFilters.categories.includes(category)
      ? localFilters.categories.filter(c => c !== category)
      : [...localFilters.categories, category];
    
    const newFilters = { ...localFilters, categories: updated };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSubcategoryToggle = (subcategory: string) => {
    const updated = localFilters.subcategories.includes(subcategory)
      ? localFilters.subcategories.filter(s => s !== subcategory)
      : [...localFilters.subcategories, subcategory];
    
    const newFilters = { ...localFilters, subcategories: updated };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSizeToggle = (size: string) => {
    const updated = localFilters.sizes.includes(size)
      ? localFilters.sizes.filter(s => s !== size)
      : [...localFilters.sizes, size];
    
    const newFilters = { ...localFilters, sizes: updated };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (value: number[]) => {
    const newFilters = { ...localFilters, priceRange: [value[0], value[1]] as [number, number] };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: ProductFilters = {
      categories: [],
      subcategories: [],
      sizes: [],
      priceRange: availableFilters.priceRange,
      collections: []
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Filtros</CardTitle>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          Limpiar
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <ScrollArea className="h-[600px] pr-4">
          {/* Price Range */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold">Precio</Label>
            <div className="space-y-4">
              <Slider
                min={availableFilters.priceRange[0]}
                max={availableFilters.priceRange[1]}
                step={5000}
                value={localFilters.priceRange}
                onValueChange={handlePriceChange}
                className="w-full"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatPrice(localFilters.priceRange[0])}</span>
                <span>{formatPrice(localFilters.priceRange[1])}</span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Categories */}
          {availableFilters.categories.length > 0 && (
            <>
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Categoría</Label>
                <div className="space-y-2">
                  {availableFilters.categories.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={localFilters.categories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <label
                        htmlFor={`category-${category}`}
                        className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <Separator className="my-6" />
            </>
          )}

          {/* Subcategories */}
          {availableFilters.subcategories.length > 0 && (
            <>
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Subcategoría</Label>
                <ScrollArea className="h-48">
                  <div className="space-y-2 pr-4">
                    {availableFilters.subcategories.map(subcategory => (
                      <div key={subcategory} className="flex items-center space-x-2">
                        <Checkbox
                          id={`subcategory-${subcategory}`}
                          checked={localFilters.subcategories.includes(subcategory)}
                          onCheckedChange={() => handleSubcategoryToggle(subcategory)}
                        />
                        <label
                          htmlFor={`subcategory-${subcategory}`}
                          className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {subcategory}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              <Separator className="my-6" />
            </>
          )}

          {/* Sizes */}
          {availableFilters.sizes.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Talla</Label>
              <div className="flex flex-wrap gap-2">
                {availableFilters.sizes.map(size => (
                  <Button
                    key={size}
                    variant={localFilters.sizes.includes(size) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSizeToggle(size)}
                    className="h-8 px-3"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
