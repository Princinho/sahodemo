import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary">SAHO</div>
            <div className="hidden sm:block text-sm text-muted-foreground italic">
              Vous servir, notre vocation
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/catalog"
              className="text-foreground hover:text-primary transition-smooth"
            >
              Catalogue
            </Link>
            <Link
              to="/about"
              className="text-foreground hover:text-primary transition-smooth"
            >
              À propos
            </Link>
            <Link
              to="/contact"
              className="text-foreground hover:text-primary transition-smooth"
            >
              Contact
            </Link>
            <Link to="/cart" className="relative">
              <Button variant="outline" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center shadow-gold">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <Link
                to="/catalog"
                className="text-foreground hover:text-primary transition-smooth px-2"
                onClick={() => setIsOpen(false)}
              >
                Catalogue
              </Link>
              <Link
                to="/about"
                className="text-foreground hover:text-primary transition-smooth px-2"
                onClick={() => setIsOpen(false)}
              >
                À propos
              </Link>
              <Link
                to="/contact"
                className="text-foreground hover:text-primary transition-smooth px-2"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
