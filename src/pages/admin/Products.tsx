import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/models/Product";
import { productsApi } from "@/api/productsApi";
import { categoriesApi, ApiCategory } from "@/api/categoriesApi";

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    descriptionFull: "",
    price: 0,
    quantity: 0,
    categoryIds: [] as string[],
    materials: "",
    colors: "",
    dimensions: "",
    weight: "",
    isTrending: false,
    isDisabled: false,
  });

  const fetchProducts = () => {
    setIsFetchingData(true);
    productsApi.getAll({ limit: 100 }).then((res) => setProducts(res.items)).catch(() => {
      toast({ title: "Erreur", description: "Impossible de charger les produits", variant: "destructive" });
    }).finally(() => setIsFetchingData(false));
  };

  useEffect(() => {
    fetchProducts();
    categoriesApi.getAll({ limit: 200 }).then((res) => setCategories(res.items)).catch(() => { });
  }, []);

  const filteredProducts = products.filter(
    (p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF", minimumFractionDigits: 0 }).format(price);

  const resetForm = () => {
    setFormData({
      name: "", description: "", descriptionFull: "", price: 0, quantity: 0,
      categoryIds: [], materials: "", colors: "", dimensions: "", weight: "",
      isTrending: false, isDisabled: false,
    });
    setImageFiles([]);
    setEditingProduct(null);
  };

  const openAddDialog = () => { resetForm(); setIsDialogOpen(true); };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      descriptionFull: product.descriptionFull || "",
      price: product.price,
      quantity: product.quantity,
      categoryIds: product.categoryIds || [],
      materials: product.materials?.join(", ") || "",
      colors: product.colors?.join(", ") || "",
      dimensions: product.dimensions || "",
      weight: product.weight || "",
      isTrending: product.isTrending,
      isDisabled: product.isDisabled,
    });
    setImageFiles([]);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({ title: "Erreur", description: "Le nom est requis", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        descriptionFull: formData.descriptionFull,
        price: formData.price,
        quantity: formData.quantity,
        categoryIds: formData.categoryIds,
        materials: formData.materials.split(",").map((m) => m.trim()).filter(Boolean),
        colors: formData.colors.split(",").map((c) => c.trim()).filter(Boolean),
        dimensions: formData.dimensions || undefined,
        weight: formData.weight || undefined,
        isTrending: formData.isTrending,
        isDisabled: formData.isDisabled,
      };

      if (editingProduct) {
        await productsApi.update(editingProduct.id, productData, imageFiles.length > 0 ? imageFiles : undefined);
        toast({ title: "Produit modifié" });
      } else {
        await productsApi.create(productData, imageFiles.length > 0 ? imageFiles : undefined);
        toast({ title: "Produit ajouté" });
      }
      setIsDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error: any) {
      toast({ title: "Erreur", description: error.response?.data?.error || "Une erreur est survenue", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    // Note: The API doc doesn't show a delete product endpoint
    // For now we just close the dialog
    toast({ title: "Info", description: "La suppression de produits n'est pas encore supportée par l'API" });
    setIsDeleteDialogOpen(false);
    setDeletingProductId(null);
  };

  const handleCategoryToggle = (catId: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(catId)
        ? prev.categoryIds.filter((id) => id !== catId)
        : [...prev.categoryIds, catId],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Produits</h1>
          <p className="text-muted-foreground mt-1">{filteredProducts.length} produit(s) au total</p>
        </div>
        <Button onClick={openAddDialog} className="shadow-gold">
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Produit
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input type="text" placeholder="Rechercher un produit..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetchingData ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="w-12 h-12 rounded" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : (
              <>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img src={product.imageUrls?.[0] || "/placeholder.svg"} alt={product.name} className="w-12 h-12 object-cover rounded" />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell>
                      {product.quantity > 0 ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {product.quantity} en stock
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rupture</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {product.isTrending && <Badge className="bg-accent text-accent-foreground">Vedette</Badge>}
                        {product.isDisabled && <Badge variant="outline">Désactivé</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/product/${product.id}`} target="_blank">
                          <Button variant="ghost" size="icon" title="Aperçu"><Eye className="h-4 w-4" /></Button>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(product)} title="Modifier">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { setDeletingProductId(product.id); setIsDeleteDialogOpen(true); }} title="Supprimer">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Aucun produit trouvé</TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Modifier le produit" : "Ajouter un produit"}</DialogTitle>
            <DialogDescription>{editingProduct ? "Modifiez les informations du produit." : "Remplissez les informations du nouveau produit."}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nom du produit</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: Table basse Natura" />
            </div>

            <div className="grid gap-2">
              <Label>Description courte</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} />
            </div>

            <div className="grid gap-2">
              <Label>Description longue</Label>
              <Textarea value={formData.descriptionFull} onChange={(e) => setFormData({ ...formData, descriptionFull: e.target.value })} rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Prix (XOF)</Label>
                <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="grid gap-2">
                <Label>Quantité en stock</Label>
                <Input type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Catégories</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Badge
                    key={cat.id}
                    variant={formData.categoryIds.includes(cat.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleCategoryToggle(cat.id)}
                  >
                    {cat.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Images</Label>
              {editingProduct?.imageUrls?.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {editingProduct.imageUrls.map((url, i) => (
                    <img key={i} src={url} alt="" className="w-full h-20 object-cover rounded border" />
                  ))}
                </div>
              )}
              <Input type="file" accept="image/*" multiple onChange={(e) => setImageFiles(Array.from(e.target.files || []))} className="cursor-pointer" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Matériaux (séparés par virgule)</Label>
                <Input value={formData.materials} onChange={(e) => setFormData({ ...formData, materials: e.target.value })} placeholder="Bois, Métal" />
              </div>
              <div className="grid gap-2">
                <Label>Couleurs (séparées par virgule)</Label>
                <Input value={formData.colors} onChange={(e) => setFormData({ ...formData, colors: e.target.value })} placeholder="Noir, Blanc" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Dimensions</Label>
                <Input value={formData.dimensions} onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })} placeholder="120x60x40 cm" />
              </div>
              <div className="grid gap-2">
                <Label>Poids</Label>
                <Input value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} placeholder="12 kg" />
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isTrending" checked={formData.isTrending} onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })} className="h-4 w-4" />
                <Label htmlFor="isTrending" className="cursor-pointer">Produit vedette</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isDisabled" checked={formData.isDisabled} onChange={(e) => setFormData({ ...formData, isDisabled: e.target.checked })} className="h-4 w-4" />
                <Label htmlFor="isDisabled" className="cursor-pointer">Désactivé</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSubmit} disabled={isLoading}>{isLoading ? "Enregistrement..." : editingProduct ? "Enregistrer" : "Ajouter"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Products;
