import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { Product } from "@/models/Product";
import { productsApi } from "@/api/productsApi";
import { categoriesApi, ApiCategory } from "@/api/categoriesApi";

const Catalog = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || "all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory("all");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [categoryParam]);

  useEffect(() => {
    productsApi.getAll({ limit: 100 }).then((res) => setProducts(res.items)).catch(() => {});
    categoriesApi.getAll({ limit: 50 }).then((res) => setCategories(res.items)).catch(() => {});
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory && selectedCategory !== "all") {
      // Match by category slug
      const cat = categories.find((c) => c.slug === selectedCategory || c.name === selectedCategory);
      if (cat) {
        filtered = filtered.filter((p) => p.categoryIds?.includes(cat.id));
      }
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "featured":
      default:
        filtered.sort((a, b) => {
          if (a.isTrending && !b.isTrending) return -1;
          if (!a.isTrending && b.isTrending) return 1;
          return 0;
        });
    }
    return filtered;
  }, [selectedCategory, searchQuery, sortBy, products, categories]);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Notre Catalogue</h1>
          <p className="text-xl text-muted-foreground">Découvrez l'ensemble de nos produits</p>
        </div>

        <div className="bg-card rounded-lg shadow-soft p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Filtres et Recherche</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">En vedette</SelectItem>
                <SelectItem value="name">Nom (A-Z)</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix décroissant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(selectedCategory !== "all" || searchQuery) && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground">Filtres actifs:</span>
              {selectedCategory !== "all" && (
                <Button variant="secondary" size="sm" onClick={() => setSelectedCategory("all")}>
                  {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory} ×
                </Button>
              )}
              {searchQuery && (
                <Button variant="secondary" size="sm" onClick={() => setSearchQuery("")}>
                  "{searchQuery}" ×
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="mb-6">
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">{filteredAndSortedProducts.length}</span>{" "}
            produit{filteredAndSortedProducts.length > 1 ? "s" : ""} trouvé{filteredAndSortedProducts.length > 1 ? "s" : ""}
          </p>
        </div>

        {filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground mb-4">Aucun produit ne correspond à vos critères</p>
            <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}>
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
