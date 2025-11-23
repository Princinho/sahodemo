import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { products } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Send, Package } from "lucide-react";

const QuoteRequest = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const cartProducts = items.map((item) => ({
    ...products.find((p) => p.id === item.productId)!,
    quantity: item.quantity,
  }));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const total = cartProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Votre demande de devis a été envoyée avec succès!", {
      description: "Nous vous contacterons sous 24-48h",
    });

    clearCart();
    setIsSubmitting(false);
    navigate("/");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="text-center">
          <Package className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">
            Aucun produit sélectionné
          </h1>
          <p className="text-muted-foreground mb-6">
            Ajoutez des produits à votre sélection avant de demander un devis
          </p>
          <Button onClick={() => navigate("/catalog")}>
            Découvrir nos produits
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl font-bold mb-8">Demande de Devis</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Vos coordonnées</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">
                      Nom complet <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Jean Dupont"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="jean.dupont@email.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">
                      Téléphone <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+225 07 00 00 00 00"
                    />
                  </div>

                  <div>
                    <Label htmlFor="company">
                      Entreprise <span className="text-muted-foreground">(optionnel)</span>
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Nom de votre entreprise"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">
                      Message <span className="text-muted-foreground">(optionnel)</span>
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Précisez vos besoins, délais souhaités..."
                      rows={4}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full shadow-gold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Envoi en cours..."
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Envoyer la demande
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Produits sélectionnés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-4">
                  {cartProducts.map((product) => (
                    <div key={product.id} className="flex gap-4">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{product.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          Quantité: {product.quantity}
                        </p>
                        <p className="text-sm font-semibold text-primary">
                          {formatPrice(product.price * product.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Total articles ({items.reduce((s, i) => s + i.quantity, 0)})
                    </span>
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
                    <strong>Note:</strong> Ce montant est indicatif. Le devis final
                    pourra varier en fonction de vos besoins spécifiques, des
                    options de livraison et d'installation.
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
