import { useState } from 'react';
import { Product, Collection } from '@/types/product';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COLLECTIONS } from '@/data/collections';
import { formatPrice } from '@/utils/productClassifier';
import { MoveRight } from 'lucide-react';

interface InboxProductCardProps {
  product: Partial<Product>;
  onClassify: (productId: string, collection: Collection) => void;
}

export function InboxProductCard({ product, onClassify }: InboxProductCardProps) {
  const [selectedCollection, setSelectedCollection] = useState<Collection | ''>('');

  const handleMove = () => {
    if (selectedCollection && selectedCollection !== 'inbox' && product.id) {
      onClassify(product.id, selectedCollection);
    }
  };

  const availableCollections = COLLECTIONS.filter(c => c.id !== 'inbox');

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted/30">
        <img
          src={product.imageUrl || '/placeholder.svg'}
          alt={product.subcategory || 'Producto'}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        {product.isPlus && (
          <Badge className="absolute top-2 left-2 bg-primary">
            CURVY
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="font-serif font-semibold text-sm uppercase">
            {product.subcategory || product.category}
          </h3>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Talla: {product.size}</span>
            <span className="font-bold text-foreground text-base">
              {product.price ? formatPrice(product.price) : 'N/A'}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Select value={selectedCollection} onValueChange={(value) => setSelectedCollection(value as Collection)}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Mover a..." />
            </SelectTrigger>
            <SelectContent>
              {availableCollections.map(collection => (
                <SelectItem key={collection.id} value={collection.id}>
                  {collection.icon} {collection.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            onClick={handleMove}
            disabled={!selectedCollection || selectedCollection === 'inbox'}
            size="icon"
            className="shrink-0"
          >
            <MoveRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
