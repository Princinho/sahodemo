import { useState } from "react";
import { products as initialProducts } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis").max(100),
  description: z.string().trim().min(1, "La description est requise").max(500),
  longDescription: z.string().trim().min(1, "La description longue est requise"),
  price: z.number().min(0, "Le prix doit être positif"),
  category: z.string().trim().min(1, "La catégorie est requise"),
  images: z.string().trim().url("URL invalide").min(1, "Au moins une image est requise"),
  material: z.string().trim().min(1, "Le matériau est requis"),
  dimensions: z.string().trim().min(1, "Les dimensions sont requises"),
  colors: z.string().trim().min(1, "Au moins une couleur est requise"),
  inStock: z.boolean(),
  featured: z.boolean(),
});

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState(initialProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<typeof products[0] | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    longDescription: "",
    price: 0,
    category: "",
    images: "",
    material: "",
    dimensions: "",
    colors: "",
    inStock: true,
    featured: false,
  });

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      longDescription: "",
      price: 0,
      category: "",
      images: "",
      material: "",
      dimensions: "",
      colors: "",
      inStock: true,
      featured: false,
    });
    setEditingProduct(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: typeof products[0]) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      longDescription: product.longDescription,
      price: product.price,
      category: product.category,
      images: product.images[0] || "",
      material: product.material,
      dimensions: product.dimensions,
      colors: product.colors.join(", "),
      inStock: product.inStock,
      featured: product.featured || false,
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (productId: string) => {
    setDeletingProductId(productId);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = () => {
    try {
      const validatedData = productSchema.parse(formData);
      const colorsArray = validatedData.colors.split(",").map(c => c.trim());
      
      if (editingProduct) {
        setProducts(products.map(p => 
          p.id === editingProduct.id 
            ? {
                ...p,
                name: validatedData.name,
                description: validatedData.description,
                longDescription: validatedData.longDescription,
                price: validatedData.price,
                category: validatedData.category,
                images: [validatedData.images],
                material: validatedData.material,
                dimensions: validatedData.dimensions,
                colors: colorsArray,
                inStock: validatedData.inStock,
                featured: validatedData.featured,
                slug: createSlug(validatedData.name),
              }
            : p
        ));
        toast({
          title: "Produit modifié",
          description: "Le produit a été modifié avec succès.",
        });
      } else {
        const newProduct = {
          id: String(Math.max(...products.map(p => parseInt(p.id))) + 1),
          name: validatedData.name,
          description: validatedData.description,
          longDescription: validatedData.longDescription,
          price: validatedData.price,
          category: validatedData.category,
          images: [validatedData.images],
          material: validatedData.material,
          dimensions: validatedData.dimensions,
          colors: colorsArray,
          inStock: validatedData.inStock,
          featured: validatedData.featured,
          slug: createSlug(validatedData.name),
        };
        setProducts([...products, newProduct]);
        toast({
          title: "Produit ajouté",
          description: "Le produit a été ajouté avec succès.",
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Erreur de validation",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    }
  };

  const handleDelete = () => {
    if (deletingProductId) {
      setProducts(products.filter(p => p.id !== deletingProductId));
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès.",
      });
      setIsDeleteDialogOpen(false);
      setDeletingProductId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Produits</h1>
          <p className="text-muted-foreground mt-1">
            {filteredProducts.length} produit(s) au total
          </p>
        </div>
        <Button onClick={openAddDialog} className="shadow-gold">
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Produit
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Rechercher un produit..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Products Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell>
                  {product.inStock ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      En stock
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      Rupture
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {product.featured && (
                    <Badge className="bg-accent text-accent-foreground">
                      Vedette
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link to={`/product/${product.slug}`} target="_blank">
                      <Button variant="ghost" size="icon" title="Aperçu">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openEditDialog(product)}
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openDeleteDialog(product.id)}
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Modifier le produit" : "Ajouter un produit"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct 
                ? "Modifiez les informations du produit ci-dessous."
                : "Remplissez les informations du nouveau produit."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom du produit</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Table basse Natura"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description courte</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description courte du produit..."
                rows={2}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="longDescription">Description longue</Label>
              <Textarea
                id="longDescription"
                value={formData.longDescription}
                onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                placeholder="Description détaillée du produit..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Prix (XOF)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Catégorie</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Ex: Mobilier"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="images">URL de l'image</Label>
              <Input
                id="images"
                value={formData.images}
                onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                placeholder="https://..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="material">Matériau</Label>
                <Input
                  id="material"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  placeholder="Ex: Bois de chêne"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input
                  id="dimensions"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  placeholder="Ex: 120x60x45 cm"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="colors">Couleurs disponibles</Label>
              <Input
                id="colors"
                value={formData.colors}
                onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                placeholder="Séparez les couleurs par des virgules: Naturel, Blanc, Noir"
              />
            </div>
            
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="inStock" className="cursor-pointer">En stock</Label>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="featured" className="cursor-pointer">Produit vedette</Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              {editingProduct ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Products;
