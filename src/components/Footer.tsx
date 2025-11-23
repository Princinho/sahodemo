import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gradient-gold">SAHO</h3>
            <p className="text-sm opacity-90">
              Vous servir, notre vocation. Découvrez notre sélection de produits de qualité pour votre intérieur.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/catalog" className="opacity-90 hover:opacity-100 transition-smooth">
                  Catalogue
                </Link>
              </li>
              <li>
                <Link to="/about" className="opacity-90 hover:opacity-100 transition-smooth">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="opacity-90 hover:opacity-100 transition-smooth">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/request-product" className="opacity-90 hover:opacity-100 transition-smooth">
                  Demande spéciale
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Catégories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/catalog?category=Mobilier" className="opacity-90 hover:opacity-100 transition-smooth">
                  Mobilier
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=Décoration" className="opacity-90 hover:opacity-100 transition-smooth">
                  Décoration
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=Textile" className="opacity-90 hover:opacity-100 transition-smooth">
                  Textile
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=Accessoires" className="opacity-90 hover:opacity-100 transition-smooth">
                  Accessoires
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span className="opacity-90">Abidjan, Côte d'Ivoire</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span className="opacity-90">+225 07 00 00 00 00</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="opacity-90">contact@saho.ci</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-75">
          <p>&copy; {new Date().getFullYear()} SAHO. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};
