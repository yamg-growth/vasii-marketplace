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
    const message = `${WHATSAPP_MESSAGE_TEMPLATES[product.collection]}%0A%0AProducto: ${product.subcategory}%0ACódigo: ${product.code}%0ATalla: ${product.size}%0APrecio: ${formatPrice(product.price)}`;
    window.open(`${collection?.whatsappLink}?text=${message}`, '_blank');
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={product.imageUrl}
          alt={product.subcategory}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {product.isPlus && (
          <Badge className="absolute top-2 left-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white border-0">
            Plus Size
          </Badge>
        )}
        {product.stock <= 3 && product.stock > 0 && (
          <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
            ¡Últimas {product.stock}!
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground line-clamp-2 flex-1">
            {product.subcategory}
          </h3>
          <Badge variant="outline" className="shrink-0 text-xs">
            {product.size}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-primary">
            {formatPrice(product.price)}
          </p>
          <p className="text-xs text-muted-foreground">
            Ref: {product.code}
          </p>
        </div>
        
        {collection && (
          <Badge 
            variant="secondary" 
            className={`text-xs bg-gradient-to-r ${collection.color} text-white border-0`}
          >
            {collection.icon} {collection.name}
          </Badge>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onViewDetails?.(product)}
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          Ver detalles
        </Button>
        <Button
          size="sm"
          className="flex-1"
          onClick={handleWhatsAppClick}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Comprar
        </Button>
      </CardFooter>
    </Card>
  );
}
