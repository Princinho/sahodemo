import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, KeyRound, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usersApi } from "@/api/usersApi";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  // Create user state
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createConfirm, setCreateConfirm] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Change password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isChanging, setIsChanging] = useState(false);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (createPassword !== createConfirm) {
      toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas", variant: "destructive" });
      return;
    }
    if (createPassword.length < 8) {
      toast({ title: "Erreur", description: "Le mot de passe doit contenir au moins 8 caractères", variant: "destructive" });
      return;
    }
    setIsCreating(true);
    try {
      const user = await usersApi.create({ email: createEmail, password: createPassword });
      toast({ title: "Utilisateur créé", description: `${user.email} a été créé avec succès` });
      setCreateEmail("");
      setCreatePassword("");
      setCreateConfirm("");
    } catch (error: any) {
      toast({ title: "Erreur", description: error.response?.data?.error || "Impossible de créer l'utilisateur", variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas", variant: "destructive" });
      return;
    }
    if (newPassword.length < 8) {
      toast({ title: "Erreur", description: "Le nouveau mot de passe doit contenir au moins 8 caractères", variant: "destructive" });
      return;
    }
    setIsChanging(true);
    try {
      await usersApi.changePassword({ currentPassword, newPassword });
      toast({ title: "Mot de passe modifié", description: "Vous allez être redirigé vers la page de connexion" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      // API revokes all tokens, must re-login
      setTimeout(() => {
        logout();
        navigate("/admin/login");
      }, 1500);
    } catch (error: any) {
      toast({ title: "Erreur", description: error.response?.data?.error || "Impossible de changer le mot de passe", variant: "destructive" });
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Gestion des Utilisateurs</h1>
        <p className="text-muted-foreground">Créez des comptes admin et gérez votre mot de passe</p>
      </div>

      <Tabs defaultValue="create" className="max-w-xl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Créer un Utilisateur</TabsTrigger>
          <TabsTrigger value="password">Changer mon Mot de Passe</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Nouveau Compte Admin
              </CardTitle>
              <CardDescription>Créez un nouveau compte administrateur pour accéder au back-office.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="create-email">Email</Label>
                  <Input
                    id="create-email"
                    type="email"
                    required
                    value={createEmail}
                    onChange={(e) => setCreateEmail(e.target.value)}
                    placeholder="admin@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-password">Mot de passe</Label>
                  <Input
                    id="create-password"
                    type="password"
                    required
                    minLength={8}
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                    placeholder="Minimum 8 caractères"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-confirm">Confirmer le mot de passe</Label>
                  <Input
                    id="create-confirm"
                    type="password"
                    required
                    value={createConfirm}
                    onChange={(e) => setCreateConfirm(e.target.value)}
                    placeholder="Retapez le mot de passe"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isCreating}>
                  {isCreating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Création...</> : <><UserPlus className="h-4 w-4 mr-2" />Créer le compte</>}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5" />
                Changer mon Mot de Passe
              </CardTitle>
              <CardDescription>Après le changement, vous serez déconnecté et devrez vous reconnecter.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Mot de passe actuel</Label>
                  <Input
                    id="current-password"
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nouveau mot de passe</Label>
                  <Input
                    id="new-password"
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 caractères"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-new-password">Confirmer le nouveau mot de passe</Label>
                  <Input
                    id="confirm-new-password"
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isChanging}>
                  {isChanging ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Modification...</> : <><KeyRound className="h-4 w-4 mr-2" />Changer le mot de passe</>}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Users;
