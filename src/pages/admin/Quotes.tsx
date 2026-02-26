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
import { Search, Eye, Mail, Phone, Plus, Send, Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { quoteRequestsApi, QuoteRequest, QuoteNote } from "@/api/quoteRequestsApi";

const Quotes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [newNote, setNewNote] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchQuotes = () => {
    quoteRequestsApi.getAll({ limit: 100 }).then((res) => setQuotes(res.items)).catch(() => {
      toast({ title: "Erreur", description: "Impossible de charger les demandes", variant: "destructive" });
    });
  };

  useEffect(() => { fetchQuotes(); }, []);

  const handleViewQuote = async (quote: QuoteRequest) => {
    try {
      const detail = await quoteRequestsApi.getById(quote.id);
      setSelectedQuote(detail);
    } catch {
      setSelectedQuote(quote);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !selectedQuote) return;
    setIsLoading(true);
    try {
      await quoteRequestsApi.addNote(selectedQuote.id, newNote, uploadedFile || undefined);
      toast({
        title: uploadedFile ? "Note et devis ajoutés" : "Note ajoutée",
        description: uploadedFile ? "La note et le devis ont été envoyés" : "La note a été ajoutée avec succès",
      });
      setNewNote("");
      setUploadedFile(null);
      // Refresh quote detail
      const detail = await quoteRequestsApi.getById(selectedQuote.id);
      setSelectedQuote(detail);
      fetchQuotes();
    } catch (error: any) {
      toast({ title: "Erreur", description: error.response?.data?.error || "Impossible d'ajouter la note", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!selectedQuote) return;
    try {
      await quoteRequestsApi.updateStatus(selectedQuote.id, status);
      toast({ title: "Statut mis à jour" });
      const detail = await quoteRequestsApi.getById(selectedQuote.id);
      setSelectedQuote(detail);
      fetchQuotes();
    } catch (error: any) {
      toast({ title: "Erreur", description: error.response?.data?.error || "Impossible de mettre à jour le statut", variant: "destructive" });
    }
  };

  const filteredQuotes = quotes.filter(
    (q) =>
      q.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW": return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Nouveau</Badge>;
      case "IN_PROGRESS": return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En cours</Badge>;
      case "QUOTED": return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Devis envoyé</Badge>;
      case "REJECTED": return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Refusé</Badge>;
      case "CLOSED": return <Badge variant="outline">Clôturé</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF", minimumFractionDigits: 0 }).format(price);

  const calculateQuoteTotal = (quote: QuoteRequest) =>
    quote.items.reduce((sum, item) => sum + (item.unitPrice || 0) * item.quantity, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Demandes de Devis</h1>
        <p className="text-muted-foreground mt-1">{filteredQuotes.length} demande(s) au total</p>
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
              <TableHead>Date</TableHead>
              <TableHead>Articles</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuotes.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell>
                  <p className="font-medium">{quote.fullName}</p>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p className="flex items-center gap-1"><Mail className="h-3 w-3" />{quote.email}</p>
                    {quote.phone && <p className="flex items-center gap-1 text-muted-foreground"><Phone className="h-3 w-3" />{quote.phone}</p>}
                  </div>
                </TableCell>
                <TableCell>{new Date(quote.createdAt).toLocaleDateString("fr-FR")}</TableCell>
                <TableCell>{quote.items.length} article(s)</TableCell>
                <TableCell className="font-semibold">{formatPrice(calculateQuoteTotal(quote))}</TableCell>
                <TableCell>{getStatusBadge(quote.status)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleViewQuote(quote)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredQuotes.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Aucune demande trouvée</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedQuote} onOpenChange={() => setSelectedQuote(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          {selectedQuote && (
            <>
              <DialogHeader>
                <DialogTitle>Demande de Devis</DialogTitle>
                <DialogDescription>
                  Reçue le {new Date(selectedQuote.createdAt).toLocaleDateString("fr-FR")} - {getStatusBadge(selectedQuote.status)}
                </DialogDescription>
              </DialogHeader>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-medium">Changer le statut :</span>
                <Select value={selectedQuote.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">Nouveau</SelectItem>
                    <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                    <SelectItem value="QUOTED">Devis envoyé</SelectItem>
                    <SelectItem value="REJECTED">Refusé</SelectItem>
                    <SelectItem value="CLOSED">Clôturé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Détails</TabsTrigger>
                  <TabsTrigger value="suivi">Suivi ({selectedQuote.notes?.length || 0})</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Informations Client</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Nom:</strong> {selectedQuote.fullName}</p>
                      <p><strong>Email:</strong> {selectedQuote.email}</p>
                      {selectedQuote.phone && <p><strong>Téléphone:</strong> {selectedQuote.phone}</p>}
                      {selectedQuote.country && <p><strong>Pays:</strong> {selectedQuote.country}</p>}
                      {selectedQuote.city && <p><strong>Ville:</strong> {selectedQuote.city}</p>}
                      {selectedQuote.address && <p><strong>Adresse:</strong> {selectedQuote.address}</p>}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Produits Demandés</h3>
                    <div className="space-y-3">
                      {selectedQuote.items.map((item, i) => (
                        <div key={i} className="flex gap-3 p-3 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{item.productName || item.productId}</p>
                            <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                            {item.unitPrice && (
                              <p className="text-sm font-semibold text-primary">{formatPrice(item.unitPrice * item.quantity)}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedQuote.message && (
                    <div>
                      <h3 className="font-semibold mb-3">Message du Client</h3>
                      <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">{selectedQuote.message}</p>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total Indicatif</span>
                      <span className="text-primary">{formatPrice(calculateQuoteTotal(selectedQuote))}</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="suivi" className="space-y-6">
                  <div className="border rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Ajouter une note
                    </h3>
                    <Textarea placeholder="Écrivez une note pour suivre ce client..." value={newNote} onChange={(e) => setNewNote(e.target.value)} rows={3} />
                    <div>
                      <label className="text-sm font-medium mb-2 block">Devis en pièce jointe (optionnel)</label>
                      <Input type="file" accept=".pdf" onChange={(e) => setUploadedFile(e.target.files?.[0] || null)} className="cursor-pointer" />
                      {uploadedFile && <p className="text-sm text-muted-foreground mt-1">Fichier sélectionné: {uploadedFile.name}</p>}
                    </div>
                    <Button onClick={handleAddNote} disabled={!newNote.trim() || isLoading} className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      {isLoading ? "Envoi..." : uploadedFile ? "Ajouter la note et envoyer le devis" : "Ajouter la note"}
                    </Button>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Historique de suivi</h3>
                    {!selectedQuote.notes?.length ? (
                      <p className="text-sm text-muted-foreground text-center py-8">Aucune note pour le moment</p>
                    ) : (
                      <div className="space-y-3">
                        {selectedQuote.notes.map((note: QuoteNote) => (
                          <div key={note.id} className="p-3 border rounded-lg bg-muted/30">
                            <p className="text-sm mb-2">{note.content}</p>
                            {note.quotePdf && (
                              <div className="flex items-center gap-2 mt-2 p-2 border rounded bg-background">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium flex-1">Devis PDF</span>
                                <Badge variant="outline" className="text-xs">
                                  <Mail className="h-3 w-3 mr-1" />
                                  Envoyé
                                </Badge>
                                <a href={note.quotePdf.publicUrl} target="_blank" rel="noopener noreferrer">
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

export default Quotes;
