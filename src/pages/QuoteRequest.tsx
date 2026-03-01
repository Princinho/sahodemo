import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Send, Package, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/models/Product";
import { productsApi } from "@/api/productsApi";
import { quoteRequestsApi } from "@/api/quoteRequestsApi";

const QuoteRequest = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    message: "",
  });

  useEffect(() => {
    setIsLoading(true);
    productsApi.getAll({ limit: 100 }).then((res) => setProducts(res.items)).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  const cartProducts = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { ...product, quantity: item.quantity } : null;
    })
    .filter(Boolean) as (Product & { quantity: number })[];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF", minimumFractionDigits: 0 }).format(price);

  const total = cartProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await quoteRequestsApi.create({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
        country: formData.country || undefined,
        city: formData.city || undefined,
        address: formData.address || undefined,
        message: formData.message || undefined,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });

      toast.success("Votre demande de devis a été envoyée avec succès!", {
        description: "Nous vous contacterons sous 24-48h",
      });
      clearCart();
      navigate("/");
    } catch {
      toast.error("Erreur lors de l'envoi de la demande. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="text-center">
          <Package className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Aucun produit sélectionné</h1>
          <p className="text-muted-foreground mb-6">Ajoutez des produits à votre sélection avant de demander un devis</p>
          <Button onClick={() => navigate("/catalog")}>Découvrir nos produits</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl font-bold mb-8">Demande de Devis</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Vos coordonnées</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Nom complet <span className="text-destructive">*</span></Label>
                    <Input id="fullName" name="fullName" required value={formData.fullName} onChange={handleInputChange} placeholder="Jean Dupont" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                    <Input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange} placeholder="jean.dupont@email.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+225 07 00 00 00 00" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country">Pays</Label>
                      <Input id="country" name="country" value={formData.country} onChange={handleInputChange} placeholder="Togo" />
                    </div>
                    <div>
                      <Label htmlFor="city">Ville</Label>
                      <Input id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="Lomé" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Adresse</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Rue des Fleurs, 12" />
                  </div>
                  <div>
                    <Label htmlFor="message">Message <span className="text-muted-foreground">(optionnel)</span></Label>
                    <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} placeholder="Précisez vos besoins, délais souhaités..." rows={4} />
                  </div>
                  <Button type="submit" size="lg" className="w-full shadow-gold" disabled={isSubmitting}>
                    {isSubmitting ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" />Envoi en cours...</>) : (<><Send className="mr-2 h-5 w-5" />Envoyer la demande</>)}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Produits sélectionnés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-4">
                  {cartProducts.map((product) => (
                    <div key={product.id} className="flex gap-4">
                      <img src={product.imageUrls?.[0] || "/placeholder.svg"} alt={product.name} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{product.name}</h4>
                        <p className="text-xs text-muted-foreground">Quantité: {product.quantity}</p>
                        <p className="text-sm font-semibold text-primary">{formatPrice(product.price * product.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total articles ({items.reduce((s, i) => s + i.quantity, 0)})</span>
                    <span className="font-semibold">{formatPrice(total)}</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total indicatif</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong>Note:</strong> Ce montant est indicatif. Le devis final pourra varier en fonction de vos besoins spécifiques, des options de livraison et d'installation.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteRequest;
