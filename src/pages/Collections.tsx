import { COLLECTIONS } from '@/data/collections';
import { CollectionCard } from '@/components/CollectionCard';
import { MOCK_PRODUCTS } from '@/data/mockProducts';

export default function Collections() {
  const getCollectionProductCount = (collectionId: string) => {
    return MOCK_PRODUCTS.filter(p => p.collection === collectionId).length;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Nuestras Colecciones
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explora nuestras 5 colecciones exclusivas, cada una cuidadosamente curada para diferentes estilos y ocasiones
          </p>
        </div>

        {/* Collections Grid */}
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
    </div>
  );
}
