import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockQuoteRequests, products } from "@/data/mockData";
import { Package, ShoppingCart, FileText, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const stats = {
    totalProducts: products.length,
    inStock: products.filter((p) => p.inStock).length,
    totalQuotes: mockQuoteRequests.length,
    newQuotes: mockQuoteRequests.filter((q) => q.status === "new").length,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Tableau de Bord</h1>
        <p className="text-muted-foreground">
          Bienvenue sur votre espace d'administration SAHO
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Produits Total
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.inStock} en stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Demandes de Devis
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuotes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.newQuotes} nouvelles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Catégories
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground mt-1">
              Mobilier, Décoration, Textile, Accessoires
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Taux de Conversion
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5%</div>
            <p className="text-xs text-green-600 mt-1">+2.4% ce mois</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
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
          <Button variant="outline" className="w-full">
            <TrendingUp className="mr-2 h-4 w-4" />
            Rapports
          </Button>
        </CardContent>
      </Card>

      {/* Recent Quotes */}
      <Card>
        <CardHeader>
          <CardTitle>Demandes de Devis Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockQuoteRequests.slice(0, 3).map((quote) => (
              <div
                key={quote.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-semibold">{quote.customerName}</p>
                  <p className="text-sm text-muted-foreground">
                    {quote.customerEmail} • {quote.date}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      quote.status === "new"
                        ? "bg-blue-100 text-blue-800"
                        : quote.status === "in-progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {quote.status === "new"
                      ? "Nouveau"
                      : quote.status === "in-progress"
                      ? "En cours"
                      : "Terminé"}
                  </span>
                  <Link to={`/admin/quotes`}>
                    <Button size="sm" variant="outline">
                      Voir
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
