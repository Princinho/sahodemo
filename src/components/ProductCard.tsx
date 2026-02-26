import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Product } from "@/models/Product";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product.id);
    toast.success(`${product.name} ajouté à votre sélection`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const inStock = product.quantity > 0;

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="group overflow-hidden hover:shadow-large transition-slow cursor-pointer h-full flex flex-col">
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={product.imageUrls?.[0] || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-slow"
          />
          {product.isTrending && (
            <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground shadow-gold">
              En vedette
            </Badge>
          )}
          {!inStock && (
            <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground">
              Rupture
            </Badge>
          )}
        </div>
        <CardContent className="p-4 flex-1">
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-smooth mt-1">
              {product.name}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between gap-2">
          <div className="text-xl font-bold text-primary flex-1">
            {formatPrice(Number(product.price))}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="shadow-soft hover:shadow-gold transition-smooth shrink-0"
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ajouter au panier</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardFooter>
      </Card>
    </Link>
  );
};
