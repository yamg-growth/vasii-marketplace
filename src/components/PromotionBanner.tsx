import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const promotions = [
  "Envío GRATIS por compras superiores a $170k",
  "Descuento Amigas: 10% en 3 unidades | 30% en 6 unidades",
  "Entrega inmediata - Compra ahora por WhatsApp"
];

export function PromotionBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promotions.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sticky top-0 z-50 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-10 gap-4">
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + promotions.length) % promotions.length)}
            className="hover:opacity-70 transition-opacity"
            aria-label="Promoción anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <div className="flex-1 text-center overflow-hidden">
            <p className="text-sm font-medium tracking-wide uppercase animate-in fade-in-0 duration-500">
              {promotions[currentIndex]}
            </p>
          </div>
          
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % promotions.length)}
            className="hover:opacity-70 transition-opacity"
            aria-label="Siguiente promoción"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
