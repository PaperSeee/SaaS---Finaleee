"use client";

import { useState, useEffect, use, useMemo, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ReviewCard from "@/components/businesses/ReviewCard";
import ReviewFilters from "@/components/businesses/ReviewFilters";
import { Review, Platform } from "@/lib/types";
import { useRouter } from "next/navigation";
import { throttle } from "@/lib/utils";

interface Business {
  name: string;
  rating: number;
  reviewCount: number;
}

interface FiltersState {
  platform: Platform | "all";
  rating: number;
  dateFrom: string;
  dateTo: string;
}

export default function BusinessReviews({ params }: { params: { id: string } }) {
  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const businessId = unwrappedParams.id;
  
  const router = useRouter();
  const { user } = useAuth();
  const [business, setBusiness] = useState<Business>({
    name: "Chargement...",
    rating: 0,
    reviewCount: 0
  });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FiltersState>({
    platform: "all",
    rating: 0,
    dateFrom: "",
    dateTo: ""
  });
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [currentReviewId, setCurrentReviewId] = useState<string>("");
  const [currentReviewPlatform, setCurrentReviewPlatform] = useState<Platform | "">("");
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState<{
    loading: boolean;
    error?: string;
    success?: string;
  }>({ loading: false });

  const supabase = createClientComponentClient();

  // Memoize the filter function to improve performance
  const filteredReviews = useMemo(() => {
    if (!reviews.length) return [];
    
    return reviews.filter(review => {
      // Apply platform filter
      if (filters.platform !== "all" && review.platform !== filters.platform) {
        return false;
      }
      
      // Apply rating filter
      if (filters.rating > 0 && review.rating !== filters.rating) {
        return false;
      }
      
      // Apply date filters
      if (filters.dateFrom && new Date(review.date) < new Date(filters.dateFrom)) {
        return false;
      }
      
      if (filters.dateTo && new Date(review.date) > new Date(filters.dateTo)) {
        return false;
      }
      
      return true;
    });
  }, [reviews, filters]);

  // Récupérer les informations de l'entreprise et ses avis
  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // 1. Récupérer les informations de base de l'entreprise
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', businessId)
          .eq('user_id', user.id)
          .single();
          
        if (companyError) {
          throw new Error(`Impossible de récupérer les informations de l'entreprise: ${companyError.message}`);
        }
        
        if (!companyData) {
          throw new Error("Entreprise non trouvée ou accès non autorisé");
        }
        
        console.log("Données de l'entreprise:", companyData);
        
        // 2. Récupérer le Place ID si nécessaire
        let placeId = companyData.place_id;
        let placeIdRefreshNeeded = false;
        
        if (!placeId && companyData.google_url) {
          console.log("Tentative d'extraction du place_id depuis l'URL Google:", companyData.google_url);
          try {
            placeId = await extractPlaceIdFromUrl(companyData.google_url, companyData.id);
          } catch (extractError) {
            console.error("Erreur d'extraction du Place ID:", extractError);
          }
        }
        
        // Valider et nettoyer le Place ID si présent
        if (placeId) {
          console.log(`Place ID avant nettoyage: "${placeId}"`);
          
          // Supprimer les espaces et caractères spéciaux qui pourraient causer des problèmes
          placeId = placeId.trim().replace(/['"\\]/g, '');
          
          // Valider le format du Place ID
          if (!(placeId.startsWith('ChI') || placeId.startsWith('0x'))) {
            console.warn("Format de Place ID non standard:", placeId);
          }
          
          console.log(`Place ID après nettoyage: "${placeId}"`);
          
          // Mettre à jour la base de données avec la version nettoyée
          await supabase
            .from('companies')
            .update({ place_id: placeId })
            .eq('id', businessId);
        }
        
        if (!placeId) {
          setBusiness({
            name: companyData.name,
            rating: 0,
            reviewCount: 0
          });
          setReviews([]);
          setLoading(false);
          setError("Aucun Place ID trouvé pour cette entreprise. Veuillez ajouter une URL Google Business valide dans les paramètres de l'entreprise.");
          return;
        }
        
        console.log("Place ID utilisé:", placeId);
        
        // 3. Construire les paramètres pour filtrer les avis
        const queryParams = new URLSearchParams();
        
        if (filters.platform !== "all") {
          queryParams.append("platform", filters.platform);
        }
        
        if (filters.rating > 0) {
          queryParams.append("rating", filters.rating.toString());
        }
        
        if (filters.dateFrom) {
          queryParams.append("dateFrom", filters.dateFrom);
        }
        
        if (filters.dateTo) {
          queryParams.append("dateTo", filters.dateTo);
        }

        // 4. Récupérer les avis depuis l'API Google
        // Important: Utiliser "place_id" et non "placeId" comme nom de paramètre 
        const googleReviewsUrl = `/api/google-reviews?place_id=${encodeURIComponent(placeId)}&${queryParams.toString()}`;
        console.log("Appel à l'API:", googleReviewsUrl);
        
        try {
          const response = await fetch(googleReviewsUrl);
          
          if (!response.ok) {
            // Log détaillé de la réponse d'erreur
            console.error(`Réponse API non valide: ${response.status} ${response.statusText}`);
            let errorResponse;
            try {
              errorResponse = await response.json();
              console.error("Détails de l'erreur:", errorResponse);
            } catch (parseError) {
              console.error("Impossible de parser la réponse d'erreur:", parseError);
              errorResponse = { error: `Erreur ${response.status}`, message: "Détails non disponibles" };
            }
            
            // Vérifier si c'est une erreur de Place ID invalide
            if ((response.status === 400) && 
                (errorResponse.error?.includes("NOT_FOUND") || 
                errorResponse.message?.includes("Invalid") ||
                errorResponse.message?.includes("invalid") ||
                errorResponse.message?.includes("place"))) {
              // Marquer le Place ID comme nécessitant une mise à jour
              placeIdRefreshNeeded = true;
              
              // Supprimer le Place ID invalide de la base de données
              await supabase
                .from('companies')
                .update({ place_id: null })
                .eq('id', companyId);
                
              throw new Error(
                "Le Place ID Google n'est plus valide. " +
                "Veuillez mettre à jour l'URL Google Business dans les paramètres de l'entreprise."
              );
            }
            
            throw new Error(`Erreur lors de la récupération des avis: ${errorResponse.message || response.statusText}`);
          }
          
          const responseData = await response.json();
          console.log("Données reçues:", responseData);
          
          setBusiness({
            name: companyData.name,
            rating: responseData.business?.rating || 0,
            reviewCount: responseData.business?.reviewCount || 0
          });
          
          setReviews(responseData.reviews || []);
          
        } catch (apiError) {
          console.error("Erreur API:", apiError);
          
          // Si l'API échoue mais que nous avons les données de base de l'entreprise
          setBusiness({
            name: companyData.name,
            rating: 0,
            reviewCount: 0
          });
          setReviews([]);
          
          // Construire un message d'erreur informatif selon le type d'erreur
          let errorMessage = apiError instanceof Error ? apiError.message : "Erreur lors de la récupération des avis";
          
          if (placeIdRefreshNeeded) {
            errorMessage = "Le Place ID Google n'est plus valide. Veuillez mettre à jour l'URL Google Business dans les paramètres de votre entreprise.";
          }
          
          setError(errorMessage);
        }
        
      } catch (err) {
        console.error("Erreur:", err);
        setError(err instanceof Error ? err.message : "Une erreur inattendue s'est produite");
      } finally {
        setLoading(false);
      }
    };
    
    fetchBusinessData();
  }, [businessId, user, filters, supabase]);

  // Extraction du Place ID à partir d'une URL Google
  const extractPlaceIdFromUrl = async (googleUrl: string, companyId: string): Promise<string | null> => {
    try {
      if (!googleUrl) {
        return null;
      }

      let placeId: string | null = null;
      
      // Essayer d'extraire le Place ID directement de l'URL
      // Format 1: https://maps.app.goo.gl/abcdef123456
      if (googleUrl.includes('maps.app.goo.gl')) {
        // Pour ce format, on ne peut pas extraire le Place ID directement
        // Il faut utiliser l'API Place Search pour le trouver
        console.log("Format URL Google Maps App détecté");
      } 
      // Format 2: https://www.google.com/maps/place/...
      else if (googleUrl.includes('google.com/maps/place')) {
        // Essayer d'extraire le CID (identifiant client) qui peut être utilisé
        const cidMatch = googleUrl.match(/[?&]cid=([0-9]+)/);
        if (cidMatch && cidMatch[1]) {
          console.log("CID extrait de l'URL:", cidMatch[1]);
          
          // Le CID peut être utilisé pour une recherche via l'API
          // Mais ce n'est pas directement un Place ID
        }
      }
      // Format 3: ...1s0x47c3c4c540b6a63f:0xe5a41277f4ce276!...
      else if (googleUrl.includes('!1s')) {
        const placeIdMatch = googleUrl.match(/!1s([^:!]+)/);
        if (placeIdMatch && placeIdMatch[1]) {
          placeId = placeIdMatch[1];
          console.log("Place ID extrait de l'URL:", placeId);
        }
      }
      
      // Si on a trouvé un Place ID, mettre à jour la base de données
      if (placeId) {
        const { error } = await supabase
          .from('companies')
          .update({ place_id: placeId })
          .eq('id', companyId);
        
        if (error) {
          console.error("Erreur lors de la mise à jour du Place ID:", error);
        } else {
          console.log("Place ID mis à jour avec succès:", placeId);
        }
      } else {
        console.log("Aucun Place ID n'a pu être extrait de l'URL");
        
        // À ce stade, on pourrait implémenter un appel à l'API de geocoding pour essayer
        // de trouver le Place ID à partir du nom ou de l'adresse de l'entreprise
        // Mais pour cet exemple, on ne l'implémente pas
      }
      
      return placeId;
    } catch (error) {
      console.error("Erreur lors de l'extraction du Place ID:", error);
      return null;
    }
  };

  // Throttled functions for better performance
  const handleReply = useCallback((reviewId: string, platform: Platform) => {
    setCurrentReviewId(reviewId);
    setCurrentReviewPlatform(platform);
    setReplyText("");
    setReplyStatus({ loading: false });
    setReplyModalOpen(true);
  }, []);

  const closeReplyModal = useCallback(() => {
    setReplyModalOpen(false);
    setCurrentReviewId("");
    setCurrentReviewPlatform("");
    setReplyText("");
  }, []);

  const submitReply = async () => {
    if (!replyText.trim()) {
      return;
    }

    setReplyStatus({ loading: true });

    try {
      const response = await fetch('/api/reviews/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reviewId: currentReviewId,
          platform: currentReviewPlatform,
          message: replyText,
          businessId: businessId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Échec de l\'envoi de la réponse');
      }

      if (data.fallbackUrl) {
        setReplyStatus({ 
          loading: false, 
          success: 'Connexion API non disponible. Veuillez utiliser le lien direct ci-dessous pour répondre manuellement.',
          error: `<a href="${data.fallbackUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">Répondre sur ${currentReviewPlatform}</a>`
        });
      } else {
        setReplyStatus({ loading: false, success: 'Réponse envoyée avec succès !' });
        
        // Fermer la modale après un court délai
        setTimeout(() => {
          closeReplyModal();
        }, 2000);
      }
    } catch (err) {
      setReplyStatus({ 
        loading: false, 
        error: err instanceof Error ? err.message : 'Une erreur inattendue est survenue'
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8 min-h-[calc(100vh-64px)] bg-gradient-to-br from-white to-blue-50">
        {loading ? (
          <div className="space-y-6">
            {/* Animated Business Info Skeleton */}
            <div className="animate-pulse flex items-center justify-between">
              <div className="space-y-3">
                <div className="h-8 bg-gray-200 rounded w-64"></div>
                <div className="h-4 bg-gray-200 rounded w-40"></div>
              </div>
              <div className="h-9 bg-gray-200 rounded w-20"></div>
            </div>
            
            {/* Skeleton for Filters */}
            <div className="animate-pulse rounded-xl bg-white border border-gray-200 shadow-sm p-5">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            
            {/* Skeleton for Reviews */}
            <div className="space-y-4 mt-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl bg-white border border-gray-200 shadow-sm p-5">
                  <div className="flex justify-between">
                    <div className="flex space-x-3">
                      <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-40"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="rounded-xl bg-red-50 border border-red-100 p-5 text-sm text-red-700 shadow-sm animate-fade-in">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="font-medium">Une erreur est survenue</h3>
                <div className="mt-2">{error}</div>
                <div className="mt-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 transition-colors"
                  >
                    <svg className="mr-2 -ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Réessayer
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                  {business.name}
                  {business.rating > 0 && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Validé
                    </span>
                  )}
                </h1>
                <div className="mt-2 flex items-center text-sm">
                  <div className="flex items-center text-yellow-500 bg-yellow-50 px-2.5 py-1 rounded-md">
                    {business.rating.toFixed(1)}
                    <div className="ml-1 flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${i < Math.round(business.rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <div className="mx-2 h-4 w-0.5 bg-gray-300 rounded-full"></div>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-blue-500 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span className="font-medium">{business.reviewCount}</span> <span className="text-gray-600 ml-1">avis</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => router.back()}
                className="rounded-lg bg-white border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-sm flex items-center"
              >
                <svg className="mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour
              </button>
            </div>

            {/* Enhanced Filter Component */}
            <div className="mb-6 transition-all duration-200 ease-in-out transform hover:shadow-md rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
              <ReviewFilters filters={filters} setFilters={setFilters} />
            </div>

            <div className="mt-6 space-y-4">
              {filteredReviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 rounded-xl bg-white border border-gray-200 text-center">
                  <svg className="h-16 w-16 text-gray-300 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <p className="text-lg font-medium text-gray-900 mb-1">Aucun avis trouvé</p>
                  <p className="text-sm text-gray-500 max-w-sm">
                    Aucun avis trouvé pour cette entreprise ou selon les filtres appliqués.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  {filteredReviews.map((review) => (
                    <div key={review.id} className="transform transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md">
                      <ReviewCard
                        review={review}
                        onReply={() => handleReply(review.id, review.platform)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Enhanced Modal for Review Replies */}
      {replyModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              onClick={closeReplyModal}
              aria-hidden="true"
            ></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={closeReplyModal}
                >
                  <span className="sr-only">Fermer</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Répondre à l&apos;avis
                    </h3>
                    <div className="mt-4">
                      <textarea
                        className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-3 bg-gray-50 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                        rows={4}
                        placeholder="Saisissez votre réponse ici..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      ></textarea>
                      <p className="mt-1 text-xs text-gray-500">Votre réponse sera visible publiquement</p>
                    </div>

                    {replyStatus.error && (
                      <div className="mt-3 rounded-md bg-red-50 p-3">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3" dangerouslySetInnerHTML={{ __html: replyStatus.error }}></div>
                        </div>
                      </div>
                    )}
                    
                    {replyStatus.success && (
                      <div className="mt-3 rounded-md bg-green-50 p-3">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-green-800">{replyStatus.success}</h3>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${
                    replyStatus.loading || !replyText.trim()
                      ? 'bg-blue-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                  onClick={submitReply}
                  disabled={replyStatus.loading || !replyText.trim()}
                >
                  {replyStatus.loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi...
                    </span>
                  ) : 'Envoyer la réponse'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                  onClick={closeReplyModal}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
