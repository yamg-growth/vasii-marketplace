import { CollectionConfig } from '@/types/product';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CollectionCardProps {
  collection: CollectionConfig;
  productCount?: number;
}

export function CollectionCard({ collection, productCount = 0 }: CollectionCardProps) {
  return (
    <Link to={`/coleccion/${collection.id}`} className="block">
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
        <div className={`h-48 bg-gradient-to-br ${collection.color} flex items-center justify-center`}>
          <span className="text-8xl">{collection.icon}</span>
        </div>
        
        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {collection.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {collection.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              {productCount} productos
            </span>
            <Button size="sm" className="group-hover:translate-x-1 transition-transform">
              Ver colección
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
