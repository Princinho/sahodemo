import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Users, Award, Sparkles } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">À Propos de SAHO</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Vous servir, notre vocation depuis toujours
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Notre Histoire</h2>
            <div className="space-y-4 text-lg text-muted-foreground">
              <p>
                SAHO est née d'une passion pour l'art de vivre et la volonté de
                rendre accessible des produits de qualité exceptionnelle. Depuis
                notre création, nous avons pour mission de transformer les espaces
                de vie en véritables havres de paix et d'élégance.
              </p>
              <p>
                Chaque produit de notre catalogue est soigneusement sélectionné
                pour sa qualité, son design et sa durabilité. Nous croyons que
                votre intérieur mérite le meilleur, et c'est pourquoi nous
                travaillons sans relâche pour vous offrir une collection unique et
                raffinée.
              </p>
              <p>
                Notre équipe d'experts est à votre écoute pour vous conseiller et
                vous accompagner dans tous vos projets d'aménagement, qu'ils
                soient personnels ou professionnels.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=400&fit=crop"
              alt="Showroom SAHO"
              className="rounded-lg shadow-medium object-cover w-full h-48"
            />
            <img
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop"
              alt="Produits SAHO"
              className="rounded-lg shadow-medium object-cover w-full h-48 mt-8"
            />
            <img
              src="https://images.unsplash.com/photo-1565183928294-7d22f2d4c6de?w=600&h=400&fit=crop"
              alt="Décoration intérieure"
              className="rounded-lg shadow-medium object-cover w-full h-48"
            />
            <img
              src="https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=600&h=400&fit=crop"
              alt="Espace SAHO"
              className="rounded-lg shadow-medium object-cover w-full h-48 mt-8"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Nos Valeurs</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Les principes qui guident notre action au quotidien
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Qualité</h3>
              <p className="text-muted-foreground">
                Nous sélectionnons uniquement des produits d'exception, durables
                et authentiques
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
                <Heart className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Passion</h3>
              <p className="text-muted-foreground">
                Notre amour pour le beau et le bien-fait transparaît dans chaque
                détail
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Proximité</h3>
              <p className="text-muted-foreground">
                Un service personnalisé et une écoute attentive de vos besoins
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
                <Award className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Excellence</h3>
              <p className="text-muted-foreground">
                Un engagement constant vers l'excellence dans tout ce que nous
                faisons
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 container mx-auto px-4">
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-12 text-center text-primary-foreground shadow-large">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à découvrir notre univers ?
          </h2>
          <p className="text-lg md:text-xl opacity-95 mb-8 max-w-2xl mx-auto">
            Explorez notre catalogue et trouvez les pièces parfaites pour votre
            intérieur
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/catalog">
              <Button size="lg" variant="secondary" className="shadow-gold">
                Voir le catalogue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              >
                Nous contacter
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
