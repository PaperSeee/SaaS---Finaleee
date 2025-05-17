"use client";

import { useState } from "react";
import Link from "next/link";
import { CustomLogo } from "@/components/CustomLogo";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur s'est produite");
      }

      // Toujours afficher un message de succès, même si l'email n'existe pas
      // pour des raisons de sécurité (éviter de révéler quels emails sont enregistrés)
      setMessage({
        text: "Si cette adresse e-mail est associée à un compte, vous recevrez un lien pour réinitialiser votre mot de passe.",
        type: "success"
      });
      
      // Effacer le formulaire
      setEmail("");
    } catch (error) {
      console.error("Erreur lors de la demande de réinitialisation:", error);
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
          <h2 className="mt-4 text-2xl font-semibold">Récupération de mot de passe</h2>
          <p className="mt-2 text-sm text-gray-600">
            Entrez votre adresse e-mail pour recevoir un lien de réinitialisation
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
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !email}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
            >
              {loading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
            </button>
          </div>
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
