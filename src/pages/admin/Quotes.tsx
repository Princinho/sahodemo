import { useState } from "react";
import { mockQuoteRequests, products } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Search, Eye, Mail, Phone } from "lucide-react";

const Quotes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuote, setSelectedQuote] = useState<any>(null);

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
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedQuote && (
            <>
              <DialogHeader>
                <DialogTitle>Demande de Devis #{selectedQuote.id}</DialogTitle>
                <DialogDescription>
                  Reçue le {selectedQuote.date}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="font-semibold mb-3">Informations Client</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Nom:</strong> {selectedQuote.customerName}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedQuote.customerEmail}
                    </p>
                    <p>
                      <strong>Téléphone:</strong> {selectedQuote.customerPhone}
                    </p>
                    {selectedQuote.company && (
                      <p>
                        <strong>Entreprise:</strong> {selectedQuote.company}
                      </p>
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

                {/* Actions */}
                <div className="flex gap-3">
                  <Button className="flex-1">Envoyer un Devis</Button>
                  <Button variant="outline" className="flex-1">
                    Contacter le Client
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Quotes;
