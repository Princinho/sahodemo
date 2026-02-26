import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Package, FileText, LogOut, LayoutDashboard, FolderOpen } from "lucide-react";
import { authApi } from "@/api/authApi";
import { useToast } from "@/hooks/use-toast";

export const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    toast({ title: "Déconnexion", description: "Vous avez été déconnecté." });
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-primary text-primary-foreground flex flex-col">
        <div className="p-6">
          <Link to="/admin" className="block">
            <h1 className="text-2xl font-bold">SAHO Admin</h1>
            <p className="text-sm opacity-75">Back-Office</p>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link to="/admin">
            <Button
              variant={isActive("/admin") ? "secondary" : "ghost"}
              className={`w-full justify-start ${isActive("/admin") ? "bg-primary-foreground text-primary" : "text-primary-foreground hover:bg-primary-foreground/10"}`}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Tableau de Bord
            </Button>
          </Link>
          <Link to="/admin/products">
            <Button
              variant={isActive("/admin/products") ? "secondary" : "ghost"}
              className={`w-full justify-start ${isActive("/admin/products") ? "bg-primary-foreground text-primary" : "text-primary-foreground hover:bg-primary-foreground/10"}`}
            >
              <Package className="mr-2 h-4 w-4" />
              Produits
            </Button>
          </Link>
          <Link to="/admin/categories">
            <Button
              variant={isActive("/admin/categories") ? "secondary" : "ghost"}
              className={`w-full justify-start ${isActive("/admin/categories") ? "bg-primary-foreground text-primary" : "text-primary-foreground hover:bg-primary-foreground/10"}`}
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              Catégories
            </Button>
          </Link>
          <Link to="/admin/quotes">
            <Button
              variant={isActive("/admin/quotes") ? "secondary" : "ghost"}
              className={`w-full justify-start ${isActive("/admin/quotes") ? "bg-primary-foreground text-primary" : "text-primary-foreground hover:bg-primary-foreground/10"}`}
            >
              <FileText className="mr-2 h-4 w-4" />
              Demandes de Devis
            </Button>
          </Link>
        </nav>

        <div className="p-4 space-y-2">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start text-primary-foreground hover:bg-primary-foreground/10">
              <Home className="mr-2 h-4 w-4" />
              Retour au Site
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start text-primary-foreground hover:bg-primary-foreground/10"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </aside>

      <main className="flex-1 bg-background">
        <div className="container mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
