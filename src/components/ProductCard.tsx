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
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-background">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted/30">
        <img
          src={product.imageUrl}
          alt={product.subcategory}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        {product.stock <= 3 && product.stock > 0 && (
          <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground px-3 py-1 text-xs font-medium uppercase tracking-wider">
            ÚLTIMAS UNIDADES
          </div>
        )}
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="font-serif font-semibold text-foreground uppercase tracking-wide text-sm">
            {product.subcategory}
          </h3>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Talla: {product.size}
          </p>
        </div>
        
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-bold text-foreground">
            {formatPrice(product.price)}
          </p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Ref: {product.code}
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-foreground text-background hover:bg-foreground/90 font-medium uppercase tracking-wider"
          onClick={handleWhatsAppClick}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Comprar en WhatsApp
        </Button>
      </CardFooter>
    </Card>
  );
}
