"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";

export default function AddCompany() {
  const [name, setName] = useState("");
  const [googleUrl, setGoogleUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError("Vous devez être connecté pour ajouter une entreprise");
      return;
    }

    if (!name.trim()) {
      setError("Le nom de l'entreprise est requis");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Vérifier que l'utilisateur est bien connecté
      console.log("Utilisateur connecté:", JSON.stringify(user, null, 2));
      
      // Préparer les données à insérer
      const companyData = {
        name: name.trim(),
        user_id: user.id,
        google_url: googleUrl.trim() || null,
        facebook_url: facebookUrl.trim() || null,
        created_at: new Date().toISOString(),
      };
      
      console.log("Données à insérer:", companyData);
      
      // Vérification de la structure de la table companies
      try {
        const { data: tableInfo, error: tableError } = await supabase
          .from('companies')
          .select('*')
          .limit(0);
          
        if (tableError) {
          console.error("Erreur lors de la vérification de la table companies:", tableError);
          throw new Error(`Problème d'accès à la table: ${tableError.message || 'Erreur inconnue'}`);
        } else {
          console.log("Table companies accessible");
        }
      } catch (tableCheckErr) {
        console.error("Erreur lors de la vérification de la table:", tableCheckErr);
      }
      
      // Insertion dans Supabase - Essayons sans .select() d'abord
      console.log("Tentative d'insertion des données...");
      const insertResult = await supabase
        .from('companies')
        .insert(companyData);
      
      // Vérifier l'erreur d'insertion
      if (insertResult.error) {
        console.error("Erreur d'insertion détaillée:", insertResult.error);
        console.error("Code d'erreur:", insertResult.error.code);
        console.error("Message d'erreur:", insertResult.error.message);
        console.error("Détails:", insertResult.error.details);
        
        throw new Error(`Erreur d'insertion: ${insertResult.error.message || "Erreur inconnue"} (Code: ${insertResult.error.code || "inconnu"})`);
      }
      
      console.log("Entreprise créée avec succès:", insertResult.data);
      
      // Redirection vers le tableau de bord
      router.push("/dashboard");
      router.refresh(); // Force un rafraîchissement pour montrer la nouvelle entreprise
    } catch (err: any) {
      console.error("Erreur lors de l'ajout de l'entreprise:", err);
      
      // Message d'erreur plus détaillé
      if (err.message) {
        setError(`Erreur: ${err.message}`);
      } else if (typeof err === 'object' && err !== null) {
        setError(`Erreur: ${JSON.stringify(err)}`);
      } else {
        setError("Une erreur s'est produite lors de l'ajout de l'entreprise");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Ajouter une nouvelle entreprise</h1>
          <p className="mt-1 text-sm text-gray-500">
            Ajoutez les détails de votre entreprise pour commencer à collecter des avis
          </p>
        </div>
        
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Nom de l&apos;entreprise
            </label>
            <input
              id="name"
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="Entrez le nom de l'entreprise"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="googleUrl" className="block text-sm font-medium">
              URL Google Business
            </label>
            <input
              id="googleUrl"
              type="url"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="https://g.page/votre-entreprise"
              value={googleUrl}
              onChange={(e) => setGoogleUrl(e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-500">
              URL de votre profil Google Business (optionnel)
            </p>
          </div>
          
          <div>
            <label htmlFor="facebookUrl" className="block text-sm font-medium">
              URL Page Facebook
            </label>
            <input
              id="facebookUrl"
              type="url"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="https://facebook.com/votre-entreprise"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-500">
              URL de votre page Facebook (optionnel)
            </p>
          </div>
          
          <div className="flex items-center space-x-4 pt-4">
            <button
              type="button"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              onClick={() => router.push("/dashboard")}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !name}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:bg-blue-300"
            >
              {loading ? "Création en cours..." : "Créer l'entreprise"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
