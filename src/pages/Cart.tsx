import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, XCircle, Loader2 } from "lucide-react";
import { Product } from "@/models/Product";
import { productsApi } from "@/api/productsApi";

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    productsApi.getAll({ limit: 100 }).then((res) => setProducts(res.items)).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  const cartProducts = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { ...product, quantity: item.quantity, selectedColor: item.selectedColor } : null;
    })
    .filter(Boolean) as (Product & { quantity: number; selectedColor?: string })[];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF", minimumFractionDigits: 0 }).format(price);

  const subtotal = cartProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Votre sélection est vide</h1>
          <p className="text-muted-foreground mb-6">Commencez à explorer notre catalogue pour ajouter des produits</p>
          <Link to="/catalog">
            <Button size="lg">
              Découvrir nos produits
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Ma Sélection</h1>
          <Button variant="outline" size="sm" onClick={clearCart} className="text-destructive hover:text-destructive">
            <XCircle className="h-4 w-4 mr-2" />
            Tout supprimer
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2].map((i) => (
                <Card key={i}><CardContent className="p-6"><div className="flex gap-6"><Skeleton className="w-24 h-24 rounded-lg" /><div className="flex-1 space-y-3"><Skeleton className="h-5 w-48" /><Skeleton className="h-4 w-32" /><Skeleton className="h-8 w-40" /></div></div></CardContent></Card>
              ))}
            </div>
            <div><Skeleton className="h-64 rounded-lg" /></div>
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartProducts.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <Link to={`/product/${product.id}`} className="flex-shrink-0">
                      <img src={product.imageUrls?.[0] || "/placeholder.svg"} alt={product.name} className="w-24 h-24 object-cover rounded-lg hover:opacity-80 transition-smooth" />
                    </Link>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Link to={`/product/${product.id}`}>
                            <h3 className="font-semibold text-lg hover:text-primary transition-smooth">{product.name}</h3>
                          </Link>
                          {product.selectedColor && (
                            <p className="text-sm text-muted-foreground">Coloris: {product.selectedColor}</p>
                          )}
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeItem(product.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(product.id, Math.max(1, product.quantity - 1))}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input type="number" value={product.quantity} onChange={(e) => updateQuantity(product.id, Math.max(1, parseInt(e.target.value) || 1))} className="w-16 text-center" min="1" />
                          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(product.id, product.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">{formatPrice(product.price * product.quantity)}</div>
                          {product.quantity > 1 && (
                            <div className="text-xs text-muted-foreground">{formatPrice(product.price)} / unité</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Récapitulatif</h2>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Articles ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between text-lg font-bold mb-6">
                  <span>Total indicatif</span>
                  <span className="text-primary">{formatPrice(subtotal)}</span>
                </div>
                <Link to="/quote-request">
                  <Button size="lg" className="w-full shadow-gold">
                    Demander un devis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Le prix final sera déterminé après validation de votre demande
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
