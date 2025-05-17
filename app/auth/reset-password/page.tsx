"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CustomLogo } from "@/components/CustomLogo";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Récupérer le token de réinitialisation depuis l'URL
  const token = searchParams?.get("token");
  
  useEffect(() => {
    if (!token) {
      setMessage({
        text: "Le lien de réinitialisation n'est pas valide ou a expiré.",
        type: "error"
      });
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier que les mots de passe correspondent
    if (password !== confirmPassword) {
      setMessage({
        text: "Les mots de passe ne correspondent pas.",
        type: "error"
      });
      return;
    }
    
    // Vérifier la longueur minimale du mot de passe
    if (password.length < 6) {
      setMessage({
        text: "Le mot de passe doit contenir au moins 6 caractères.",
        type: "error"
      });
      return;
    }
    
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur s'est produite");
      }

      setMessage({
        text: "Votre mot de passe a été réinitialisé avec succès.",
        type: "success"
      });
      
      // Rediriger vers la page de connexion après quelques secondes
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
      
    } catch (error) {
      console.error("Erreur lors de la réinitialisation du mot de passe:", error);
      setMessage({
        text: error instanceof Error ? error.message : "Une erreur inattendue s'est produite",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border p-8 shadow-md">
        <div className="text-center">
          <CustomLogo width={120} height={120} className="mx-auto" />
          <h2 className="mt-4 text-2xl font-semibold">Réinitialisation du mot de passe</h2>
          <p className="mt-2 text-sm text-gray-600">
            Veuillez définir votre nouveau mot de passe
          </p>
        </div>

        {message && (
          <div 
            className={`rounded-md p-4 text-sm ${
              message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {token ? (
            <div className="space-y-4 rounded-md">
              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Nouveau mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="Minimum 6 caractères"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium">
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="Répétez le mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={loading || !password || !confirmPassword}
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
                >
                  {loading ? "Réinitialisation en cours..." : "Réinitialiser le mot de passe"}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Le lien de réinitialisation n'est pas valide ou a expiré.
              </p>
            </div>
          )}
        </form>

        <div className="text-center text-sm">
          <p>
            <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500" prefetch={false}>
              Retour à la connexion
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
