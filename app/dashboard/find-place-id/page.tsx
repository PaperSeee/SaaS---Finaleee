"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Link from "next/link";

interface SearchResult {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  user_ratings_total?: number;
}

export default function FindPlaceIdPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const _router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError("Veuillez saisir un nom d'entreprise ou une adresse");
      return;
    }
    
    setLoading(true);
    setError(null);
    setResults([]);
    
    try {
      // Use the Google Places API to find places matching the query
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
      
      if (!apiKey) {
        throw new Error("La clé API Google Places n'est pas configurée");
      }
      
      const url = new URL(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?` +
        `query=${encodeURIComponent(searchQuery)}` +
        `&fields=place_id,name,formatted_address,rating,user_ratings_total` +
        `&key=${apiKey}`
      );
      
      // Use our proxy endpoint to avoid CORS issues
      const response = await fetch(`/api/proxy/places?url=${encodeURIComponent(url.toString())}`);
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la recherche: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.status !== "OK" || !data.results) {
        throw new Error(`Aucun résultat trouvé: ${data.status}`);
      }
      
      setResults(data.results.map((place: any) => ({
        place_id: place.place_id,
        name: place.name,
        formatted_address: place.formatted_address,
        rating: place.rating,
        user_ratings_total: place.user_ratings_total
      })));
      
    } catch (err: unknown) {
      const typedError = err as Error;
      setError(typedError.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPlaceId = (placeId: string) => {
    navigator.clipboard.writeText(placeId);
    setSuccess(`Place ID copié: ${placeId}`);
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Trouver mon Place ID Google</h1>
          <p className="mt-1 text-sm text-gray-500">
            Recherchez votre entreprise pour obtenir son identifiant unique Google (Place ID)
          </p>
        </div>
        
        <div className="max-w-3xl">
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 mb-6">
            <h2 className="text-lg font-medium mb-4">Pourquoi ai-je besoin d'un Place ID ?</h2>
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 mt-1">
                <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-gray-600">
                  Le Place ID est un identifiant unique attribué par Google à chaque lieu. 
                  <strong> C&apos;est le moyen le plus fiable pour importer automatiquement vos avis Google</strong> et les gérer dans Kritiqo.
                </p>
                <p className="text-gray-600 mt-2">
                  Exemples de Place ID valides :
                </p>
                <ul className="list-disc pl-5 mt-1 text-sm text-gray-500 space-y-1">
                  <li><code className="bg-gray-100 px-1.5 py-0.5 rounded">ChIJLcM5xSvCw0cR9r-keVL__Yo</code> (Quick Bruxelles)</li>
                  <li><code className="bg-gray-100 px-1.5 py-0.5 rounded">ChIJD3uTd9hx5kcR1IQvGfr8dbk</code> (Tour Eiffel)</li>
                </ul>
              </div>
            </div>
            <p className="text-gray-600">
              Recherchez votre entreprise ci-dessous par son nom et son adresse pour trouver son Place ID.
            </p>
          </div>
          
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label htmlFor="searchQuery" className="block text-sm font-medium">
                  Nom et adresse de l'entreprise
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    name="searchQuery"
                    id="searchQuery"
                    className="block w-full flex-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
                    placeholder="Ex: Restaurant Le Gourmet, Paris"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={loading || !searchQuery.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Recherche...
                    </>
                  ) : "Rechercher"}
                </button>
              </div>
            </form>
            
            {error && (
              <div className="mt-4 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {success && (
              <div className="mt-4 rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">{success}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {results.length > 0 && (
            <div className="mt-8 rounded-lg bg-white p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-medium mb-4">Résultats de recherche</h2>
              <div className="space-y-6">
                {results.map((place) => (
                  <div key={place.place_id} className="border border-gray-200 rounded-md p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{place.name}</h3>
                        <p className="text-sm text-gray-500">{place.formatted_address}</p>
                        {place.rating && (
                          <div className="mt-1 flex items-center">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <svg 
                                  key={i} 
                                  className={`h-4 w-4 ${i < Math.floor(place.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} 
                                  fill="currentColor" 
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                                </svg>
                              ))}
                              <span className="ml-1 text-sm text-gray-600">{place.rating} ({place.user_ratings_total})</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                            {place.place_id}
                          </span>
                          <button
                            onClick={() => handleCopyPlaceId(place.place_id)}
                            className="inline-flex items-center rounded-md bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            title="Copier le Place ID"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                        <Link
                          href={`/dashboard/add?placeId=${place.place_id}&name=${encodeURIComponent(place.name)}`}
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                          prefetch={false}
                        >
                          Utiliser pour une nouvelle entreprise →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-8">
            <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500" prefetch={false}>
              <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour au tableau de bord
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
