"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Review } from "@/lib/types";
import ReviewCard from "@/components/businesses/ReviewCard";

interface FiltersState {
  platform: string;
  rating: number;
  dateFrom: string;
  dateTo: string;
}

export default function CompanyReviews({ params }: { params: { companyId: string } }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [filters, setFilters] = useState<FiltersState>({
    platform: "all",
    rating: 0,
    dateFrom: "",
    dateTo: ""
  });

  // Charger les avis lors du chargement de la page
  useEffect(() => {
    async function fetchReviews() {
      setLoading(true);
      setError(null);
      try {
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
        
        const url = `/api/reviews/${params.companyId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error("Impossible de récupérer les avis");
        }
        
        const data = await response.json();
        setReviews(data.reviews);
        setCompanyName(data.companyName || "Entreprise");
      } catch (err) {
        console.error("Erreur lors de la récupération des avis:", err);
        setError("Une erreur s'est produite lors de la récupération des avis");
      } finally {
        setLoading(false);
      }
    }
    
    fetchReviews();
  }, [params.companyId, filters]);

  // Gérer les changements de filtres
  const handleFilterChange = (name: keyof FiltersState, value: string | number) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleReply = (reviewId: string) => {
    // Implémentation de la réponse aux avis
    console.log(`Répondre à l'avis ${reviewId}`);
    // Ici, vous pourriez ouvrir une modal ou naviguer vers une page de réponse
  };

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{companyName}</h1>
            <p className="text-sm text-gray-500">
              {reviews.length} avis
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Filtres */}
        <div className="mb-8 rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="mb-4 font-medium">Filtrer les avis</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <label htmlFor="platform" className="block text-sm font-medium">
                Plateforme
              </label>
              <select
                id="platform"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                value={filters.platform}
                onChange={(e) => handleFilterChange("platform", e.target.value)}
              >
                <option value="all">Toutes les plateformes</option>
                <option value="google">Google</option>
                <option value="facebook">Facebook</option>
                <option value="trustpilot">Trustpilot</option>
              </select>
            </div>

            <div>
              <label htmlFor="rating" className="block text-sm font-medium">
                Note minimale
              </label>
              <select
                id="rating"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                value={filters.rating}
                onChange={(e) => handleFilterChange("rating", parseInt(e.target.value))}
              >
                <option value="0">Toutes les notes</option>
                <option value="5">5 étoiles</option>
                <option value="4">4 étoiles ou plus</option>
                <option value="3">3 étoiles ou plus</option>
                <option value="2">2 étoiles ou plus</option>
                <option value="1">1 étoile ou plus</option>
              </select>
            </div>

            <div>
              <label htmlFor="dateFrom" className="block text-sm font-medium">
                À partir de
              </label>
              <input
                id="dateFrom"
                type="date"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="dateTo" className="block text-sm font-medium">
                Jusqu'à
              </label>
              <input
                id="dateTo"
                type="date"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Liste des avis */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
            <span className="ml-2">Chargement des avis...</span>
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {reviews.map((review) => (
              <ReviewCard 
                key={review.id} 
                review={review} 
                onReply={() => handleReply(review.id)} 
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border bg-white p-12 text-center shadow-sm">
            <h3 className="text-lg font-medium">Aucun avis trouvé</h3>
            <p className="mt-2 text-gray-500">
              Aucun avis ne correspond à vos critères de filtrage ou cette entreprise n'a pas encore reçu d'avis.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
