import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Send, FileImage } from "lucide-react";
import { productRequestsApi } from "@/api/productRequestsApi";

const RequestProduct = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    country: "",
    city: "",
    description: "",
    quantity: "1",
    desiredDeadline: "",
    budget: "",
    referenceUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await productRequestsApi.create(
        {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone || undefined,
          company: formData.company || undefined,
          country: formData.country || undefined,
          city: formData.city || undefined,
          description: formData.description,
          quantity: parseInt(formData.quantity) || 1,
          desiredDeadline: formData.desiredDeadline ? new Date(formData.desiredDeadline).toISOString() : undefined,
          budget: formData.budget || undefined,
          referenceUrl: formData.referenceUrl || undefined,
        },
        imageFile || undefined
      );

      toast.success("Votre demande a été envoyée avec succès!", {
        description: "Nous reviendrons vers vous rapidement",
      });
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Une erreur est survenue lors de l'envoi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Demande de Produit Spécifique
          </h1>
          <p className="text-xl text-muted-foreground">
            Vous ne trouvez pas ce que vous cherchez ? Décrivez-nous votre besoin
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Détails de votre demande</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Vos coordonnées</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">
                      Nom complet <span className="text-destructive">*</span>
                    </Label>
                    <Input id="fullName" name="fullName" required value={formData.fullName} onChange={handleInputChange} placeholder="Jean Dupont" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+228 90 00 00 00" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange} placeholder="jean.dupont@email.com" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company">Entreprise <span className="text-muted-foreground">(optionnel)</span></Label>
                    <Input id="company" name="company" value={formData.company} onChange={handleInputChange} placeholder="Nom de votre entreprise" />
                  </div>
                  <div>
                    <Label htmlFor="country">Pays <span className="text-muted-foreground">(optionnel)</span></Label>
                    <Input id="country" name="country" value={formData.country} onChange={handleInputChange} placeholder="Togo" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="city">Ville <span className="text-muted-foreground">(optionnel)</span></Label>
                  <Input id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="Lomé" />
                </div>
              </div>

              {/* Product Information */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold">Produit recherché</h3>

                <div>
                  <Label htmlFor="description">
                    Description détaillée <span className="text-destructive">*</span>
                  </Label>
                  <Textarea id="description" name="description" required minLength={5} value={formData.description} onChange={handleInputChange} placeholder="Décrivez le produit (dimensions, matériaux, couleur, style...)" rows={5} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity">Quantité souhaitée</Label>
                    <Input id="quantity" name="quantity" type="number" min="1" value={formData.quantity} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="budget">Budget indicatif <span className="text-muted-foreground">(optionnel)</span></Label>
                    <Input id="budget" name="budget" value={formData.budget} onChange={handleInputChange} placeholder="Ex: 150 000 FCFA" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="desiredDeadline">Délai souhaité <span className="text-muted-foreground">(optionnel)</span></Label>
                    <Input id="desiredDeadline" name="desiredDeadline" type="date" value={formData.desiredDeadline} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="referenceUrl">URL de référence <span className="text-muted-foreground">(optionnel)</span></Label>
                    <Input id="referenceUrl" name="referenceUrl" type="url" value={formData.referenceUrl} onChange={handleInputChange} placeholder="https://..." />
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/30">
                  <div className="text-center">
                    <FileImage className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-semibold mb-1">Joindre une photo (optionnel)</p>
                    <p className="text-xs text-muted-foreground mb-3">Image ou PDF de référence pour nous aider à mieux comprendre votre besoin</p>
                    <Input type="file" accept="image/*,.pdf" className="max-w-xs mx-auto" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                    {imageFile && <p className="text-sm text-muted-foreground mt-2">Fichier: {imageFile.name}</p>}
                  </div>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full shadow-gold" disabled={isSubmitting}>
                {isSubmitting ? "Envoi en cours..." : (
                  <><Send className="mr-2 h-5 w-5" />Envoyer ma demande</>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Notre équipe étudiera votre demande et vous contactera sous 24-48h pour vous proposer une solution personnalisée
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RequestProduct;
