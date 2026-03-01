import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from "lucide-react";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Message envoyé avec succès!", {
      description: "Nous vous répondrons dans les plus brefs délais",
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contactez-nous</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Notre équipe est à votre écoute pour répondre à toutes vos questions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Info Cards */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Adresse</h3>
              <p className="text-sm text-muted-foreground">
                Cocody, Abidjan
                <br />
                Côte d'Ivoire
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-4">
                <Phone className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Téléphone</h3>
              <p className="text-sm text-muted-foreground">
                +225 07 00 00 00 00
                <br />
                +225 05 00 00 00 00
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-sm text-muted-foreground">
                contact@saho.ci
                <br />
                commercial@saho.ci
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                <div>
                  <Label htmlFor="subject">
                    Sujet <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Demande d'information"
                  />
                </div>

                <div>
                  <Label htmlFor="message">
                    Message <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Votre message..."
                    rows={6}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full shadow-gold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Envoi en cours...</>
                  ) : (
                    <><Send className="mr-2 h-5 w-5" />Envoyer le message</>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Horaires d'ouverture</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Lundi - Vendredi: 8h00 - 18h00</p>
                      <p>Samedi: 9h00 - 17h00</p>
                      <p>Dimanche: Fermé</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="h-64 bg-muted relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63704.06502018616!2d-4.062806!3d5.359952!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1eb4a974b9175%3A0xb7c58d3667f4f44e!2sCocody%2C%20Abidjan%2C%20C%C3%B4te%20d&#39;Ivoire!5e0!3m2!1sen!2s!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="SAHO Location"
                />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">
                  Besoin d'un devis ?
                </h3>
                <p className="text-sm opacity-90 mb-4">
                  Parcourez notre catalogue et créez votre sélection pour
                  recevoir un devis personnalisé rapidement
                </p>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => (window.location.href = "/catalog")}
                >
                  Explorer le catalogue
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
