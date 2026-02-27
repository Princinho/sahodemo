import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, FileText, TrendingUp, Hammer } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { productsApi } from "@/api/productsApi";
import { categoriesApi } from "@/api/categoriesApi";
import { quoteRequestsApi, QuoteRequest } from "@/api/quoteRequestsApi";
import { productRequestsApi, ProductRequest } from "@/api/productRequestsApi";

const Dashboard = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [totalQuotes, setTotalQuotes] = useState(0);
  const [totalProductRequests, setTotalProductRequests] = useState(0);

  useEffect(() => {
    productsApi.getAll({ limit: 1 }).then((res) => setTotalProducts(res.total)).catch(() => {});
    categoriesApi.getAll({ limit: 1 }).then((res) => setTotalCategories(res.total)).catch(() => {});
    quoteRequestsApi.getAll({ limit: 5 }).then((res) => {
      setQuotes(res.items);
      setTotalQuotes(res.total);
    }).catch(() => {});
    productRequestsApi.getAll({ limit: 1 }).then((res) => setTotalProductRequests(res.total)).catch(() => {});
  }, []);

  const newQuotes = quotes.filter((q) => q.status === "NEW").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Nouveau</Badge>;
      case "IN_PROGRESS":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En cours</Badge>;
      case "QUOTED":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Devis envoyé</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Refusé</Badge>;
      case "CLOSED":
        return <Badge variant="outline">Clôturé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Tableau de Bord</h1>
        <p className="text-muted-foreground">Bienvenue sur votre espace d'administration SAHO</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Produits Total</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Demandes de Devis</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuotes}</div>
            <p className="text-xs text-muted-foreground mt-1">{newQuotes} nouvelles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Catégories</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Produits Sur Mesure</CardTitle>
            <Hammer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProductRequests}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/products">
            <Button variant="outline" className="w-full">
              <Package className="mr-2 h-4 w-4" />
              Gérer les Produits
            </Button>
          </Link>
          <Link to="/admin/quotes">
            <Button variant="outline" className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              Voir les Demandes
            </Button>
          </Link>
          <Link to="/admin/categories">
            <Button variant="outline" className="w-full">
              <TrendingUp className="mr-2 h-4 w-4" />
              Gérer les Catégories
            </Button>
          </Link>
          <Link to="/admin/product-requests">
            <Button variant="outline" className="w-full">
              <Hammer className="mr-2 h-4 w-4" />
              Produits Sur Mesure
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Demandes de Devis Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quotes.slice(0, 3).map((quote) => (
              <div key={quote.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">{quote.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    {quote.email} • {new Date(quote.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(quote.status)}
                  <Link to="/admin/quotes">
                    <Button size="sm" variant="outline">Voir</Button>
                  </Link>
                </div>
              </div>
            ))}
            {quotes.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Aucune demande récente</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
