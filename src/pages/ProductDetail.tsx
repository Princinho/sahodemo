import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/models/Product";
import { productsApi } from "@/api/productsApi";

const AUTO_SLIDE_INTERVAL = 5000;

const ProductDetail = () => {
  const { slug } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    setLoading(true);
    productsApi
      .getAll({ limit: 100 })
      .then((res) => {
        setAllProducts(res.items);
        const found = res.items.find((p) => p.id === slug || p.slug === slug);
        setProduct(found || null);
        if (found?.colors?.length) setSelectedColor(found.colors[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const imageCount = product?.imageUrls?.length || 0;

  const goToNext = useCallback(() => {
    if (imageCount <= 1) return;
    setSelectedImage((prev) => (prev + 1) % imageCount);
    setProgress(0);
    lastTimeRef.current = 0;
  }, [imageCount]);

  const goToPrev = useCallback(() => {
    if (imageCount <= 1) return;
    setSelectedImage((prev) => (prev - 1 + imageCount) % imageCount);
    setProgress(0);
    lastTimeRef.current = 0;
  }, [imageCount]);

  // Auto-slide with progress
  useEffect(() => {
    if (imageCount <= 1) return;

    setProgress(0);
    lastTimeRef.current = 0;

    const tick = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const elapsed = timestamp - lastTimeRef.current;
      const pct = Math.min((elapsed / AUTO_SLIDE_INTERVAL) * 100, 100);
      setProgress(pct);

      if (elapsed >= AUTO_SLIDE_INTERVAL) {
        setSelectedImage((prev) => (prev + 1) % imageCount);
        lastTimeRef.current = 0;
        setProgress(0);
      }

      progressRef.current = requestAnimationFrame(tick);
    };

    progressRef.current = requestAnimationFrame(tick);
    return () => {
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
    };
  }, [imageCount, selectedImage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

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

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price);

  const inStock = product.quantity > 0;
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.categoryIds?.some((cid) => product.categoryIds?.includes(cid)))
    .slice(0, 4);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link to="/catalog" className="inline-flex items-center text-muted-foreground hover:text-primary transition-smooth">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au catalogue
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-medium mb-4 group">
              <img
                src={product.imageUrls?.[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              {imageCount > 1 && (
                <>
                  <button
                    onClick={goToPrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-background"
                  >
                    <ChevronLeft className="h-5 w-5 text-foreground" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-background"
                  >
                    <ChevronRight className="h-5 w-5 text-foreground" />
                  </button>

                  {/* Dot indicators with progress */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {product.imageUrls.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedImage(index);
                          setProgress(0);
                          lastTimeRef.current = 0;
                        }}
                        className="relative h-2 rounded-full overflow-hidden transition-all duration-300"
                        style={{ width: selectedImage === index ? 32 : 8 }}
                      >
                        <span className="absolute inset-0 bg-foreground/30 rounded-full" />
                        {selectedImage === index ? (
                          <span
                            className="absolute inset-y-0 left-0 bg-primary-foreground rounded-full"
                            style={{ width: `${progress}%`, transition: "width 50ms linear" }}
                          />
                        ) : (
                          <span className="absolute inset-0 bg-foreground/50 rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            {product.imageUrls?.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.imageUrls.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(index);
                      setProgress(0);
                      lastTimeRef.current = 0;
                    }}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-smooth ${selectedImage === index ? "border-primary shadow-soft" : "border-transparent hover:border-muted"}`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="mb-4">
              {product.isTrending && (
                <Badge className="bg-accent text-accent-foreground">En vedette</Badge>
              )}
            </div>

            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <div className="text-3xl font-bold text-primary mb-6">{formatPrice(product.price)}</div>
            <p className="text-lg text-muted-foreground mb-6">{product.description}</p>

            <Separator className="my-6" />

            <div className="space-y-4 mb-6">
              {product.materials?.length > 0 && (
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <p className="font-semibold">Matériaux</p>
                    <p className="text-muted-foreground">{product.materials.join(", ")}</p>
                  </div>
                </div>
              )}

              {product.dimensions && (
                <div className="flex items-start gap-3">
                  <Ruler className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <p className="font-semibold">Dimensions</p>
                    <p className="text-muted-foreground">{product.dimensions}</p>
                  </div>
                </div>
              )}

              {product.colors?.length > 0 && (
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
                          <SelectItem key={color} value={color}>{color}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                {inStock ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-green-600 font-semibold">En stock ({product.quantity})</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-destructive" />
                    <span className="text-destructive font-semibold">Rupture de stock</span>
                  </>
                )}
              </div>
            </div>

            <Button size="lg" onClick={handleAddToCart} disabled={!inStock} className="w-full shadow-soft hover:shadow-gold transition-smooth">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Ajouter à ma sélection
            </Button>

            <p className="text-sm text-muted-foreground mt-4 text-center">
              Demandez un devis personnalisé après avoir sélectionné vos produits
            </p>
          </div>
        </div>

        {product.descriptionFull && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-4">Description détaillée</h2>
            <p className="text-muted-foreground leading-relaxed">{product.descriptionFull}</p>
          </div>
        )}

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
