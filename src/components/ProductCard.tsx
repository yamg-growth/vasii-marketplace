import { Product } from '@/types/product';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/productClassifier';
import { COLLECTIONS, WHATSAPP_MESSAGE_TEMPLATES } from '@/data/collections';
import { MessageCircle, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const collection = COLLECTIONS.find(c => c.id === product.collection);
  
  const handleWhatsAppClick = () => {
    const productInfo = `%0A%0AProducto: ${product.subcategory}%0ACódigo: ${product.code}%0ATalla: ${product.size}%0APrecio: ${formatPrice(product.price)}`;
    window.open(`${collection?.whatsappLink}${productInfo}`, '_blank');
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={product.imageUrl}
          alt={product.subcategory}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {product.isPlus && (
          <Badge className="absolute top-2 left-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white border-0 text-xs">
            Plus
          </Badge>
        )}
        {product.stock <= 3 && product.stock > 0 && (
          <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs">
            ¡{product.stock} left!
          </Badge>
        )}
      </div>
      
      <CardContent className="p-3 space-y-2 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-sm text-foreground line-clamp-2 flex-1">
            {product.subcategory}
          </h3>
          <Badge variant="outline" className="shrink-0 text-xs">
            {product.size}
          </Badge>
        </div>
        
        <div className="flex items-baseline justify-between mt-auto">
          <p className="text-xl font-bold text-primary">
            {formatPrice(product.price)}
          </p>
          <p className="text-xs text-muted-foreground">
            {product.code}
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 pt-0 gap-2">
        <Button
          size="sm"
          className="w-full"
          onClick={handleWhatsAppClick}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Comprar
        </Button>
      </CardFooter>
    </Card>
  );
}
