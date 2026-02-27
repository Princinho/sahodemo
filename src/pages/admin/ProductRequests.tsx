import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, Eye, Mail, Phone, Plus, Send, Download, FileText, Image, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  productRequestsApi,
  ProductRequest,
  ProductRequestNote,
} from "@/api/productRequestsApi";

const ProductRequests = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ProductRequest | null>(null);
  const [newNote, setNewNote] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchRequests = () => {
    productRequestsApi
      .getAll({ limit: 100 })
      .then((res) => setRequests(res.items))
      .catch(() => {
        toast({ title: "Erreur", description: "Impossible de charger les demandes", variant: "destructive" });
      });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleViewRequest = async (req: ProductRequest) => {
    try {
      const detail = await productRequestsApi.getById(req.id);
      setSelectedRequest(detail);
    } catch {
      setSelectedRequest(req);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !selectedRequest) return;
    setIsLoading(true);
    try {
      await productRequestsApi.addNote(selectedRequest.id, newNote, uploadedFile || undefined);
      toast({ title: "Note ajoutée" });
      setNewNote("");
      setUploadedFile(null);
      const detail = await productRequestsApi.getById(selectedRequest.id);
      setSelectedRequest(detail);
      fetchRequests();
    } catch (error: any) {
      toast({ title: "Erreur", description: error.response?.data?.error || "Impossible d'ajouter la note", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!selectedRequest) return;
    try {
      await productRequestsApi.updateStatus(selectedRequest.id, status);
      toast({ title: "Statut mis à jour" });
      const detail = await productRequestsApi.getById(selectedRequest.id);
      setSelectedRequest(detail);
      fetchRequests();
    } catch (error: any) {
      toast({ title: "Erreur", description: error.response?.data?.error || "Impossible de mettre à jour le statut", variant: "destructive" });
    }
  };

  const filteredRequests = requests.filter(
    (r) =>
      r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW": return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Nouveau</Badge>;
      case "IN_PROGRESS": return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En cours</Badge>;
      case "ANSWERED": return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Répondu</Badge>;
      case "REJECTED": return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Refusé</Badge>;
      case "CLOSED": return <Badge variant="outline">Clôturé</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Demandes de Produit Sur Mesure</h1>
        <p className="text-muted-foreground mt-1">{filteredRequests.length} demande(s) au total</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input type="text" placeholder="Rechercher une demande..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Qté</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((req) => (
              <TableRow key={req.id}>
                <TableCell>
                  <p className="font-medium">{req.fullName}</p>
                  {req.company && <p className="text-xs text-muted-foreground">{req.company}</p>}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p className="flex items-center gap-1"><Mail className="h-3 w-3" />{req.email}</p>
                    {req.phone && <p className="flex items-center gap-1 text-muted-foreground"><Phone className="h-3 w-3" />{req.phone}</p>}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm max-w-[200px] truncate">{req.description}</p>
                </TableCell>
                <TableCell>{req.quantity || 1}</TableCell>
                <TableCell>{new Date(req.createdAt).toLocaleDateString("fr-FR")}</TableCell>
                <TableCell>{getStatusBadge(req.status)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleViewRequest(req)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredRequests.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Aucune demande trouvée</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle>Demande de Produit Sur Mesure</DialogTitle>
                <DialogDescription>
                  Reçue le {new Date(selectedRequest.createdAt).toLocaleDateString("fr-FR")} - {getStatusBadge(selectedRequest.status)}
                </DialogDescription>
              </DialogHeader>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-medium">Changer le statut :</span>
                <Select value={selectedRequest.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">Nouveau</SelectItem>
                    <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                    <SelectItem value="ANSWERED">Répondu</SelectItem>
                    <SelectItem value="REJECTED">Refusé</SelectItem>
                    <SelectItem value="CLOSED">Clôturé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Détails</TabsTrigger>
                  <TabsTrigger value="suivi">Suivi ({selectedRequest.notes?.length || 0})</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Informations Client</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Nom:</strong> {selectedRequest.fullName}</p>
                      <p><strong>Email:</strong> {selectedRequest.email}</p>
                      {selectedRequest.phone && <p><strong>Téléphone:</strong> {selectedRequest.phone}</p>}
                      {selectedRequest.company && <p><strong>Entreprise:</strong> {selectedRequest.company}</p>}
                      {selectedRequest.country && <p><strong>Pays:</strong> {selectedRequest.country}</p>}
                      {selectedRequest.city && <p><strong>Ville:</strong> {selectedRequest.city}</p>}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Détails du Produit</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Description:</strong>
                        <p className="mt-1 p-3 bg-muted/50 rounded-lg whitespace-pre-wrap">{selectedRequest.description}</p>
                      </div>
                      <p><strong>Quantité:</strong> {selectedRequest.quantity || 1}</p>
                      {selectedRequest.budget && <p><strong>Budget:</strong> {selectedRequest.budget}</p>}
                      {selectedRequest.desiredDeadline && (
                        <p><strong>Délai souhaité:</strong> {new Date(selectedRequest.desiredDeadline).toLocaleDateString("fr-FR")}</p>
                      )}
                      {selectedRequest.referenceUrl && (
                        <p className="flex items-center gap-1">
                          <strong>Référence:</strong>
                          <a href={selectedRequest.referenceUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline flex items-center gap-1">
                            Voir <ExternalLink className="h-3 w-3" />
                          </a>
                        </p>
                      )}
                    </div>
                  </div>

                  {selectedRequest.referenceImage && (
                    <div>
                      <h3 className="font-semibold mb-3">Image de Référence</h3>
                      <div className="border rounded-lg overflow-hidden max-w-sm">
                        <img
                          src={selectedRequest.referenceImage.imageUrl}
                          alt="Référence"
                          className="w-full h-auto object-contain"
                        />
                        <div className="p-2 text-xs text-muted-foreground flex items-center gap-1">
                          <Image className="h-3 w-3" />
                          {selectedRequest.referenceImage.fileName}
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="suivi" className="space-y-6">
                  <div className="border rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Ajouter une note
                    </h3>
                    <Textarea placeholder="Écrivez une note..." value={newNote} onChange={(e) => setNewNote(e.target.value)} rows={3} />
                    <div>
                      <label className="text-sm font-medium mb-2 block">Pièce jointe (optionnel)</label>
                      <Input type="file" accept=".pdf,image/*" onChange={(e) => setUploadedFile(e.target.files?.[0] || null)} className="cursor-pointer" />
                      {uploadedFile && <p className="text-sm text-muted-foreground mt-1">Fichier: {uploadedFile.name}</p>}
                    </div>
                    <Button onClick={handleAddNote} disabled={!newNote.trim() || isLoading} className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      {isLoading ? "Envoi..." : "Ajouter la note"}
                    </Button>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Historique</h3>
                    {!selectedRequest.notes?.length ? (
                      <p className="text-sm text-muted-foreground text-center py-8">Aucune note pour le moment</p>
                    ) : (
                      <div className="space-y-3">
                        {selectedRequest.notes.map((note: ProductRequestNote) => (
                          <div key={note.id} className="p-3 border rounded-lg bg-muted/30">
                            <p className="text-sm mb-2">{note.content}</p>
                            {note.attachment && (
                              <div className="flex items-center gap-2 mt-2 p-2 border rounded bg-background">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium flex-1">{note.attachment.fileName}</span>
                                <a href={note.attachment.imageUrl} target="_blank" rel="noopener noreferrer">
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </a>
                              </div>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(note.createdAt).toLocaleString("fr-FR")} - {note.authorEmail}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductRequests;
