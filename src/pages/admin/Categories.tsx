import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { Search, Plus, Edit, Trash2, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { categoriesApi, ApiCategory } from "@/api/categoriesApi";

const Categories = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ApiCategory | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  const fetchCategories = () => {
    setIsFetchingData(true);
    categoriesApi.getAll({ limit: 200 }).then((res) => setCategories(res.items)).catch(() => {
      toast({ title: "Erreur", description: "Impossible de charger les catégories", variant: "destructive" });
    }).finally(() => setIsFetchingData(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({ name: "", description: "", isActive: true });
    setEditingCategory(null);
    setImageFile(null);
  };

  const openAddDialog = () => { resetForm(); setIsDialogOpen(true); };

  const openEditDialog = (category: ApiCategory) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description, isActive: category.isActive });
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({ title: "Erreur", description: "Le nom est requis", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, formData, imageFile || undefined);
        toast({ title: "Catégorie modifiée", description: "La catégorie a été modifiée avec succès." });
      } else {
        await categoriesApi.create(formData, imageFile || undefined);
        toast({ title: "Catégorie ajoutée", description: "La catégorie a été ajoutée avec succès." });
      }
      setIsDialogOpen(false);
      resetForm();
      fetchCategories();
    } catch (error: any) {
      const msg = error.response?.data?.error || "Une erreur est survenue";
      toast({ title: "Erreur", description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCategoryId) return;
    setIsLoading(true);
    try {
      await categoriesApi.delete(deletingCategoryId);
      toast({ title: "Catégorie supprimée", description: "La catégorie a été supprimée avec succès." });
      setIsDeleteDialogOpen(false);
      setDeletingCategoryId(null);
      fetchCategories();
    } catch (error: any) {
      const msg = error.response?.data?.error || "Impossible de supprimer la catégorie";
      toast({ title: "Erreur", description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Catégories</h1>
          <p className="text-muted-foreground mt-1">{filteredCategories.length} catégorie(s) au total</p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Catégorie
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input type="text" placeholder="Rechercher une catégorie..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetchingData ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="w-12 h-12 rounded" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : (
              <>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      {category.imageUrl ? (
                        <img src={category.imageUrl} alt={category.name} className="w-12 h-12 object-cover rounded" />
                      ) : (
                        <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                          <Image className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{category.slug}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm">{category.description}</TableCell>
                    <TableCell>
                      {category.isActive ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-muted text-muted-foreground">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(category)} title="Modifier">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { setDeletingCategoryId(category.id); setIsDeleteDialogOpen(true); }} title="Supprimer">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCategories.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Aucune catégorie trouvée</TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Modifier la catégorie" : "Ajouter une catégorie"}</DialogTitle>
            <DialogDescription>{editingCategory ? "Modifiez les informations de la catégorie." : "Remplissez les informations de la nouvelle catégorie."}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cat-name">Nom</Label>
              <Input id="cat-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: Canapés & Sofas" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cat-desc">Description</Label>
              <Textarea id="cat-desc" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description de la catégorie..." rows={3} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cat-image">Image</Label>
              <Input id="cat-image" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="cursor-pointer" />
              {editingCategory?.imageUrl && !imageFile && (
                <img src={editingCategory.imageUrl} alt="Aperçu" className="w-full h-32 object-cover rounded border mt-1" />
              )}
            </div>
            <div className="flex items-center gap-3">
              <Switch id="cat-active" checked={formData.isActive} onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })} />
              <Label htmlFor="cat-active">Catégorie active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSubmit} disabled={isLoading}>{isLoading ? "Enregistrement..." : editingCategory ? "Modifier" : "Ajouter"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette catégorie ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible. La catégorie sera définitivement supprimée.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isLoading}>{isLoading ? "Suppression..." : "Supprimer"}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Categories;
