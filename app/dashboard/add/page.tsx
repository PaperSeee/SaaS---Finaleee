"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

// Use the interface or remove it if not needed
interface _GooglePlaceResult {
  place_id: string;
  formatted_address?: string;
  name?: string;
}

export default function AddCompany() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { user } = useAuth();

  // Get place_id and name from query parameters
  const placeidParam = searchParams.get('placeId');
  const nameParam = searchParams.get('name');
  
  const [name, setName] = useState(nameParam || "");
  const [googleUrl, setGoogleUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [placeId, setPlaceId] = useState(placeidParam || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placeIdStatus, setPlaceIdStatus] = useState<{
    status: 'idle' | 'searching' | 'found' | 'not-found';
    placeId?: string;
    businessInfo?: {
      name: string;
      rating: number;
      reviewCount: number;
    };
  }>({ 
    status: placeidParam ? 'found' : 'idle',
    placeId: placeidParam || undefined
  });

  // Fonction améliorée pour extraire le place_id de l'URL Google Maps
  const fetchPlaceId = async (input: string): Promise<string | null> => {
    try {
      setPlaceIdStatus({ status: 'searching' });
      
      // Vérifier si l'entrée ressemble à une URL Google Maps
      const searchInput = input.trim();
      let placeId = null;
      
      // Si c'est une URL Google Maps, essayer d'extraire directement le place_id
      if (searchInput.includes('google.com/maps')) {
        console.log("URL Google Maps détectée, tentative d'extraction du Place ID");
        
        // Format 1: https://www.google.com/maps/place/.../@lat,lng,...?...!1s0x...!...
        // Match after !1s pattern
        const placeIdMatch1 = searchInput.match(/!1s([^!]+)/);
        if (placeIdMatch1 && placeIdMatch1[1]) {
          placeId = placeIdMatch1[1].trim();
          console.log("Format 1: Place ID extrait de l'URL:", placeId);
        }
        
        // Format 2: https://www.google.com/maps/place/...?...&cid=12345...
        // Extract CID which can be used as a reference
        if (!placeId) {
          const cidMatch = searchInput.match(/[?&]cid=(\d+)/);
          if (cidMatch && cidMatch[1]) {
            const cid = cidMatch[1];
            console.log("Format 2: CID extrait:", cid);
            // Store the CID for future reference
            // In a real implementation, you would convert this to a place_id
          }
        }
        
        // Format 3: https://goo.gl/maps/abcdefg...
        // For shortened URLs, we need to expand them first
        if (!placeId && (searchInput.includes('goo.gl/maps') || searchInput.includes('maps.app.goo.gl'))) {
          console.log("Format 3: URL courte Google Maps détectée");
          // In production, you would implement URL expansion here
          // For this example, we'll use Place Search API
        }
        
        // Format 4: https://maps.google.com/?q=...&ftid=0x12345...
        // Another format with a different parameter
        if (!placeId) {
          const ftidMatch = searchInput.match(/[?&]ftid=([^&]+)/);
          if (ftidMatch && ftidMatch[1]) {
            placeId = ftidMatch[1].trim();
            console.log("Format 4: FTID extrait:", placeId);
          }
        }
        
        // Format 5: Look for "0x" style place ID anywhere in the URL
        if (!placeId) {
          const hexPlaceIdMatch = searchInput.match(/0x[0-9a-fA-F]{16}:0x[0-9a-fA-F]{16}/);
          if (hexPlaceIdMatch) {
            placeId = hexPlaceIdMatch[0];
            console.log("Format 5: Hex Place ID extrait:", placeId);
          }
        }
        
        // If we found a place ID directly, use it
        if (placeId) {
          setPlaceIdStatus({ 
            status: 'found', 
            placeId 
          });
          
          // Récupérer les informations de l'entreprise pour confirmation
          try {
            const previewResponse = await fetch(`/api/google-reviews?place_id=${encodeURIComponent(placeId)}&preview=true`);
            if (previewResponse.ok) {
              const previewData = await previewResponse.json();
              if (previewData.business) {
                setPlaceIdStatus({ 
                  status: 'found', 
                  placeId,
                  businessInfo: previewData.business
                });
              }
            } else {
              const errorData = await previewResponse.json();
              console.error("Erreur lors de la récupération de l'aperçu:", errorData);
              // If the direct extraction failed, try the Place Search API as fallback
              placeId = null; // Reset so we try the API below
            }
          } catch (err) {
            console.error("Erreur lors de la récupération des informations de l'entreprise:", err);
            placeId = null; // Reset so we try the API below
          }
          
          if (placeId) {
            return placeId;
          }
        }
      }
      
      // If we couldn't extract the place_id directly, try the Places API
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
        
        if (!apiKey) {
          console.error("Google Places API key not found in environment variables");
          throw new Error("Configuration error: Google Places API key not available");
        }

        // Use search query if URL extraction failed
        // If it's a URL, try to extract business name for a more accurate search
        const searchQuery = searchInput.includes('google.com/maps') 
          ? extractBusinessNameFromUrl(searchInput) || searchInput
          : searchInput;

        // Appeler l'API findplacefromtext
        const url = new URL(
          `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?` +
          `input=${encodeURIComponent(searchQuery)}` +
          `&inputtype=textquery` +
          `&fields=place_id,formatted_address,name` +
          `&key=${apiKey}`
        );

        console.log("Fetching place ID from Google Places API...");
        
        const response = await fetch(`/api/proxy/places?url=${encodeURIComponent(url.toString())}`);
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        console.log("API Response:", data);
        
        if (data.status !== "OK" || !data.candidates || data.candidates.length === 0) {
          setPlaceIdStatus({ status: 'not-found' });
          return null;
        }
        
        placeId = data.candidates[0].place_id;
        
        setPlaceIdStatus({ 
          status: 'found', 
          placeId 
        });
        
        // Once found, fetch preview of reviews to confirm
        try {
          const previewResponse = await fetch(`/api/google-reviews?place_id=${encodeURIComponent(placeId)}&preview=true`);
          if (previewResponse.ok) {
            const previewData = await previewResponse.json();
            if (previewData.business) {
              setPlaceIdStatus({ 
                status: 'found', 
                placeId,
                businessInfo: {
                  name: previewData.business.name,
                  rating: previewData.business.rating,
                  reviewCount: previewData.business.reviewCount
                }
              });
            }
          }
        } catch (previewError) {
          console.error("Erreur lors de la récupération de l'aperçu:", previewError);
        }
      } catch (apiError) {
        console.error("Error calling Places API:", apiError);
        setPlaceIdStatus({ status: 'not-found' });
      }
      
      return placeId;
    } catch (err) {
      console.error("Error fetching place ID:", err);
      setPlaceIdStatus({ status: 'not-found' });
      return null;
    }
  };

  // Helper function to try to extract business name from a Google Maps URL
  const extractBusinessNameFromUrl = (url: string): string | null => {
    try {
      // Extract the part after /place/ and before the next /
      const placeMatch = url.match(/\/place\/([^\/]+)/);
      if (placeMatch && placeMatch[1]) {
        // Convert plus signs back to spaces and decode URL entities
        return decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      }
      return null;
    } catch (e) {
      console.error("Error extracting business name from URL:", e);
      return null;
    }
  };

  // Get business preview when place ID is entered directly
  useEffect(() => {
    const verifyPlaceId = async () => {
      if (placeId && placeIdStatus.status !== 'found') {
        setPlaceIdStatus({ status: 'searching' });
        
        try {
          // Fetch preview of business information using the Place ID
          const previewResponse = await fetch(`/api/google-reviews?place_id=${encodeURIComponent(placeId)}&preview=true`);
          
          if (previewResponse.ok) {
            const previewData = await previewResponse.json();
            
            if (previewData.business) {
              setPlaceIdStatus({ 
                status: 'found', 
                placeId,
                businessInfo: previewData.business
              });
              
              // If we don't have a name yet, use the one from Google
              if (!name && previewData.business.name) {
                setName(previewData.business.name);
              }
            } else {
              setPlaceIdStatus({ status: 'not-found' });
            }
          } else {
            setPlaceIdStatus({ status: 'not-found' });
          }
        } catch (err) {
          console.error("Error verifying Place ID:", err);
          setPlaceIdStatus({ status: 'not-found' });
        }
      }
    };
    
    verifyPlaceId();
  }, [placeId, placeIdStatus.status, name]);

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
      
      // Use the direct place_id if provided, otherwise try to extract from URL
      let finalPlaceId = placeId;
      if (!finalPlaceId && googleUrl.trim()) {
        finalPlaceId = await fetchPlaceId(googleUrl.trim()) || '';
      }
      
      // Préparer les données à insérer
      const companyData = {
        name: name.trim(),
        user_id: user.id,
        google_url: googleUrl.trim() || null,
        facebook_url: facebookUrl.trim() || null,
        place_id: finalPlaceId, // Add the place_id field
        created_at: new Date().toISOString(),
      };
      
      console.log("Données à insérer:", companyData);
      
      // Vérification si la table existe et la créer si nécessaire
      try {
        const { data: _tableInfo, error: tableError } = await supabase
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
              place_id TEXT,
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
          setError(`La table 'companies' n'existe pas dans votre base de données. Veuillez la créer dans l'interface Supabase avec les champs: id (uuid), name (text), user_id (uuid), google_url (text), facebook_url (text), place_id (text), created_at (timestamp), logo_url (text), review_count (integer), average_rating (numeric).`);
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
          
          {/* Place ID field - highlighted */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
            <label htmlFor="placeId" className="block text-sm font-medium text-blue-700">
              Google Place ID
              <span className="ml-2 text-xs font-normal text-blue-600">
                (<Link href="/dashboard/find-place-id" className="text-blue-700 hover:text-blue-600 hover:underline">Trouver mon Place ID</Link>)
              </span>
            </label>
            <input
              id="placeId"
              type="text"
              className="mt-1 block w-full rounded-md border border-blue-300 px-3 py-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 bg-white"
              placeholder="Ex: ChIJN1t_tDeuEmsRUsoyG83frY4"
              value={placeId}
              onChange={(e) => setPlaceId(e.target.value)}
            />
            <p className="mt-1 text-xs text-blue-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
              Le Place ID est l&apos;identifiant unique attribué par Google à votre entreprise. Il est requis pour importer automatiquement vos avis.
            </p>
            
            {placeIdStatus.status === 'searching' && (
              <p className="mt-1 text-xs text-blue-600 flex items-center">
                <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Vérification du Place ID...
              </p>
            )}
            
            {placeIdStatus.status === 'found' && placeIdStatus.businessInfo && (
              <div className="mt-2 rounded-md bg-blue-100 p-2 text-sm">
                <p className="font-medium text-blue-900 flex items-center">
                  <svg className="h-4 w-4 text-blue-700 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Entreprise trouvée sur Google
                </p>
                <p className="text-xs text-blue-800">
                  {placeIdStatus.businessInfo.name} - {placeIdStatus.businessInfo.rating}★ ({placeIdStatus.businessInfo.reviewCount} avis)
                </p>
              </div>
            )}
            
            {placeIdStatus.status === 'not-found' && placeId && (
              <p className="mt-1 text-xs text-red-600 flex items-center">
                <svg className="h-4 w-4 text-red-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                Place ID non valide ou entreprise non trouvée.
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="googleUrl" className="block text-sm font-medium">
              URL Google Maps (alternative au Place ID)
            </label>
            <input
              id="googleUrl"
              type="url"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="https://www.google.com/maps/place/votre-entreprise"
              value={googleUrl}
              onChange={(e) => setGoogleUrl(e.target.value)}
              onBlur={() => googleUrl && fetchPlaceId(googleUrl)}
            />
            <p className="mt-1 text-xs text-gray-500 flex items-center">
              Si vous n&apos;avez pas le Place ID, vous pouvez fournir l&apos;URL Google Maps de votre entreprise.
            </p>
            
            {/* ...existing status messages... */}
          </div>
          
          {/* ...existing form fields... */}
          
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
