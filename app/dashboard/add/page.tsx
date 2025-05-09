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
      
      // Vérification si la table existe et la créer si nécessaire
      try {
        const { data: tableInfo, error: tableError } = await supabase
          .from('companies')
          .select('*')
          .limit(0);
          
        // Si l'erreur indique que la table n'existe pas
        if (tableError && tableError.message && tableError.message.includes('does not exist')) {
          console.log("La table 'companies' n'existe pas. Tentative de création...");
          
          // Créer la table companies
          const createTableSQL = `
            CREATE TABLE IF NOT EXISTS public.companies (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              name TEXT NOT NULL,
              user_id UUID NOT NULL,
              google_url TEXT,
              facebook_url TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              logo_url TEXT,
              review_count INTEGER DEFAULT 0,
              average_rating NUMERIC(3,2) DEFAULT 0
            );
          `;
          
          // Exécuter la requête SQL pour créer la table
          try {
            // Note: Pour que cela fonctionne, vous devez activer les fonctions SQL dans les paramètres de Supabase
            const { error: createError } = await supabase.rpc('execute_sql', { 
              query: createTableSQL 
            });
            
            if (createError) {
              throw new Error(`Impossible de créer la table: ${createError.message}`);
            }
            
            console.log("Table 'companies' créée avec succès");
          } catch (createErr) {
            console.error("Erreur lors de la création de la table:", createErr);
            throw new Error(`Pour résoudre ce problème: veuillez créer la table 'companies' manuellement dans l'interface Supabase ou contacter l'administrateur.`);
          }
        } else if (tableError) {
          // Cas d'autres erreurs
          console.error("Erreur lors de la vérification de la table companies:", tableError);
          console.debug("Error type:", typeof tableError);
          console.debug("Error is object:", tableError instanceof Object);
          console.debug("Error keys:", tableError ? Object.keys(tableError) : "null/undefined");
          
          // Improved error message construction
          let errorMessage = "Erreur inconnue";
          
          if (tableError) {
            if (tableError.message) {
              errorMessage = tableError.message;
            } else if (Object.keys(tableError).length > 0) {
              errorMessage = JSON.stringify(tableError);
            } else {
              errorMessage = "Erreur de structure vide";
              console.warn("Empty error object received while verifying table structure");
            }
          }
          
          throw new Error(`Problème d'accès à la table: ${errorMessage}`);
        } else {
          console.log("Table companies accessible");
        }
      } catch (tableCheckErr: any) {
        console.error("Erreur lors de la vérification/création de la table:", tableCheckErr);
        
        // Si l'erreur est liée à l'absence de la table, donner des instructions claires
        if (tableCheckErr.message?.includes('does not exist')) {
          setError(`La table 'companies' n'existe pas dans votre base de données. Veuillez la créer dans l'interface Supabase avec les champs: id (uuid), name (text), user_id (uuid), google_url (text), facebook_url (text), created_at (timestamp), logo_url (text), review_count (integer), average_rating (numeric).`);
          setLoading(false);
          return;
        }
        
        throw tableCheckErr;
      }
      
      // Insertion dans Supabase
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
      
      // Add enhanced debugging for the main form submission error
      console.debug("Error type:", typeof err);
      console.debug("Error is object:", err instanceof Object);
      console.debug("Error keys:", err ? Object.keys(err) : "null/undefined");
      
      // Message d'erreur plus détaillé
      try {
        if (err) {
          if (err.message) {
            setError(`Erreur: ${err.message}`);
          } else if (typeof err === 'object' && err !== null) {
            if (Object.keys(err).length > 0) {
              setError(`Erreur: ${JSON.stringify(err)}`);
            } else {
              // Handle empty object error case
              setError("Une erreur inconnue s'est produite (objet d'erreur vide)");
            }
          } else {
            setError(`Erreur: ${String(err)}`);
          }
        } else {
          setError("Une erreur s'est produite lors de l'ajout de l'entreprise");
        }
      } catch (parseErr) {
        console.error("Erreur lors de l'analyse de l'erreur:", parseErr);
        setError("Erreur système lors du traitement");
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
