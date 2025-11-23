import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { products } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import {
  ArrowLeft,
  ShoppingCart,
  Package,
  Ruler,
  Palette,
  CheckCircle2,
} from "lucide-react";
import { ProductCard } from "@/components/ProductCard";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addItem } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product?.colors[0]
  );

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
          <Link to="/catalog">
            <Button>Retour au catalogue</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product.id, selectedColor);
    toast.success(`${product.name} ajouté à votre sélection`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/catalog"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-smooth"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au catalogue
          </Link>
        </div>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-lg overflow-hidden shadow-medium mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-smooth ${
                      selectedImage === index
                        ? "border-primary shadow-soft"
                        : "border-transparent hover:border-muted"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <Badge variant="outline" className="mb-2">
                {product.category}
              </Badge>
              {product.featured && (
                <Badge className="ml-2 bg-accent text-accent-foreground">
                  En vedette
                </Badge>
              )}
            </div>

            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

            <div className="text-3xl font-bold text-primary mb-6">
              {formatPrice(product.price)}
            </div>

            <p className="text-lg text-muted-foreground mb-6">
              {product.description}
            </p>

            <Separator className="my-6" />

            {/* Specifications */}
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-accent mt-0.5" />
                <div>
                  <p className="font-semibold">Matériaux</p>
                  <p className="text-muted-foreground">{product.material}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Ruler className="h-5 w-5 text-accent mt-0.5" />
                <div>
                  <p className="font-semibold">Dimensions</p>
                  <p className="text-muted-foreground">{product.dimensions}</p>
                </div>
              </div>

              {product.colors.length > 0 && (
                <div className="flex items-start gap-3">
                  <Palette className="h-5 w-5 text-accent mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold mb-2">Coloris disponibles</p>
                    <Select value={selectedColor} onValueChange={setSelectedColor}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choisir un coloris" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.colors.map((color) => (
                          <SelectItem key={color} value={color}>
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                {product.inStock ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-green-600 font-semibold">En stock</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-destructive" />
                    <span className="text-destructive font-semibold">
                      Rupture de stock
                    </span>
                  </>
                )}
              </div>
            </div>

            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full shadow-soft hover:shadow-gold transition-smooth"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Ajouter à ma sélection
            </Button>

            <p className="text-sm text-muted-foreground mt-4 text-center">
              Demandez un devis personnalisé après avoir sélectionné vos produits
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-4">Description détaillée</h2>
          <p className="text-muted-foreground leading-relaxed">
            {product.longDescription}
          </p>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
