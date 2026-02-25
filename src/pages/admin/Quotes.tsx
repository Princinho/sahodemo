import { useState } from "react";
import { mockQuoteRequests, mockQuoteNotes, products, QuoteNote } from "@/data/mockData";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Eye, Mail, Phone, Upload, FileText, Plus, Send, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Quotes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  
  const [quoteNotes, setQuoteNotes] = useState<QuoteNote[]>(mockQuoteNotes);
  const [newNote, setNewNote] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  // Fonctions simulées pour l'API
  const simulateFileUpload = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(URL.createObjectURL(file));
      }, 1000);
    });
  };

  const simulateSendEmail = async (email: string, fileName: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Email simulé envoyé à ${email} avec le fichier ${fileName}`);
        resolve(true);
      }, 500);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !selectedQuote) return;

    let fileUrl: string | undefined;
    let fileName: string | undefined;

    if (uploadedFile) {
      try {
        fileUrl = await simulateFileUpload(uploadedFile);
        fileName = uploadedFile.name;
        await simulateSendEmail(selectedQuote.customerEmail, uploadedFile.name);
      } catch {
        toast({ title: "Erreur", description: "Erreur lors de l'upload du fichier", variant: "destructive" });
        return;
      }
    }

    const note: QuoteNote = {
      id: `QN${String(quoteNotes.length + 1).padStart(3, '0')}`,
      quoteRequestId: selectedQuote.id,
      content: newNote,
      createdDate: new Date().toLocaleString('fr-FR'),
      createdBy: 'Admin',
      fileName,
      fileUrl,
    };

    setQuoteNotes([...quoteNotes, note]);
    setNewNote("");
    setUploadedFile(null);

    toast({
      title: uploadedFile ? "Note et devis ajoutés" : "Note ajoutée",
      description: uploadedFile
        ? `La note et le devis ont été envoyés à ${selectedQuote.customerEmail}`
        : "La note a été ajoutée avec succès",
    });
  };

  

  const getQuoteNotes = (quoteId: string) => {
    return quoteNotes.filter(n => n.quoteRequestId === quoteId);
  };

  const filteredQuotes = mockQuoteRequests.filter(
    (q) =>
      q.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Nouveau</Badge>;
      case "in-progress":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En cours</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Terminé</Badge>;
      case "archived":
        return <Badge variant="outline">Archivé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateQuoteTotal = (quote: any) => {
    return quote.products.reduce((sum: number, item: any) => {
      const product = products.find((p) => p.id === item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Demandes de Devis</h1>
        <p className="text-muted-foreground mt-1">
          {filteredQuotes.length} demande(s) au total
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Rechercher une demande..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quotes Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Référence</TableHead>
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
                <TableCell className="font-medium">{quote.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{quote.customerName}</p>
                    {quote.company && (
                      <p className="text-xs text-muted-foreground">
                        {quote.company}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {quote.customerEmail}
                    </p>
                    <p className="flex items-center gap-1 text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {quote.customerPhone}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{quote.date}</TableCell>
                <TableCell>{quote.products.length} article(s)</TableCell>
                <TableCell className="font-semibold">
                  {formatPrice(calculateQuoteTotal(quote))}
                </TableCell>
                <TableCell>{getStatusBadge(quote.status)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedQuote(quote)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Quote Detail Dialog */}
      <Dialog open={!!selectedQuote} onOpenChange={() => setSelectedQuote(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          {selectedQuote && (
            <>
              <DialogHeader>
                <DialogTitle>Demande de Devis #{selectedQuote.id}</DialogTitle>
                <DialogDescription>
                  Reçue le {selectedQuote.date} - {getStatusBadge(selectedQuote.status)}
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Détails</TabsTrigger>
                  <TabsTrigger value="suivi">
                    Suivi ({getQuoteNotes(selectedQuote.id).length})
                  </TabsTrigger>
                </TabsList>

                {/* Onglet Détails */}
                <TabsContent value="details" className="space-y-6">
                  {/* Customer Info */}
                  <div>
                    <h3 className="font-semibold mb-3">Informations Client</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Nom:</strong> {selectedQuote.customerName}</p>
                      <p><strong>Email:</strong> {selectedQuote.customerEmail}</p>
                      <p><strong>Téléphone:</strong> {selectedQuote.customerPhone}</p>
                      {selectedQuote.company && (
                        <p><strong>Entreprise:</strong> {selectedQuote.company}</p>
                      )}
                    </div>
                  </div>

                  {/* Products */}
                  <div>
                    <h3 className="font-semibold mb-3">Produits Demandés</h3>
                    <div className="space-y-3">
                      {selectedQuote.products.map((item: any) => {
                        const product = products.find((p) => p.id === item.productId);
                        return product ? (
                          <div key={item.productId} className="flex gap-3 p-3 border rounded-lg">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Quantité: {item.quantity}
                              </p>
                              <p className="text-sm font-semibold text-primary">
                                {formatPrice(product.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>

                  {/* Message */}
                  {selectedQuote.message && (
                    <div>
                      <h3 className="font-semibold mb-3">Message du Client</h3>
                      <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                        {selectedQuote.message}
                      </p>
                    </div>
                  )}

                  {/* Total */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total Indicatif</span>
                      <span className="text-primary">
                        {formatPrice(calculateQuoteTotal(selectedQuote))}
                      </span>
                    </div>
                  </div>
                </TabsContent>

                {/* Onglet Suivi */}
                <TabsContent value="suivi" className="space-y-6">
                  {/* Ajout de note */}
                  <div className="border rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Ajouter une note
                    </h3>
                    <Textarea
                      placeholder="Écrivez une note pour suivre ce client..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={3}
                    />
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Devis en pièce jointe (optionnel)
                      </label>
                      <Input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="cursor-pointer"
                      />
                      {uploadedFile && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Fichier sélectionné: {uploadedFile.name}
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={handleAddNote}
                      disabled={!newNote.trim()}
                      className="w-full"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {uploadedFile ? "Ajouter la note et envoyer le devis" : "Ajouter la note"}
                    </Button>
                  </div>

                  {/* Historique des notes et devis */}
                  <div>
                    <h3 className="font-semibold mb-3">Historique de suivi</h3>
                    {getQuoteNotes(selectedQuote.id).length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        Aucune note pour le moment
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {getQuoteNotes(selectedQuote.id).map((note) => (
                          <div
                            key={note.id}
                            className="p-3 border rounded-lg bg-muted/30"
                          >
                            <p className="text-sm mb-2">{note.content}</p>
                            {note.fileName && (
                              <div className="flex items-center gap-2 mt-2 p-2 border rounded bg-background">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium flex-1">{note.fileName}</span>
                                <Badge variant="outline" className="text-xs">
                                  <Mail className="h-3 w-3 mr-1" />
                                  Envoyé
                                </Badge>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                              {note.createdDate} - {note.createdBy}
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
