import { Link } from 'react-router-dom';
import { ShoppingBag, Instagram, Facebook, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-foreground">
              <ShoppingBag className="h-8 w-8 text-primary" />
              VaSii
            </Link>
            <p className="text-sm text-muted-foreground">
              Tu destino de moda con más de 1,467 productos en 5 colecciones exclusivas.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/catalogo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link to="/colecciones" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Colecciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Colecciones</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/coleccion/glamour-fiesta" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Glamour & Fiesta
                </Link>
              </li>
              <li>
                <Link to="/coleccion/work-casual" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Work & Casual
                </Link>
              </li>
              <li>
                <Link to="/coleccion/curvy-edition" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Curvy Edition
                </Link>
              </li>
              <li>
                <Link to="/coleccion/winter" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Winter
                </Link>
              </li>
              <li>
                <Link to="/coleccion/el-bazar" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  El Bazar
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Síguenos</h3>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <MessageCircle className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} VaSii Marketplace. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
