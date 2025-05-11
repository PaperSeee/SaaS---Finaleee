"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Review, FilterOptions, SortOption, Platform } from "@/lib/types";
import ReviewCard from "@/components/businesses/ReviewCard";
import ReviewFilters from "@/components/businesses/ReviewFilters";

export default function CompanyReviews({ params }: { params: { companyId: string } }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [filters, setFilters] = useState<FilterOptions>({
    platform: "all",
    rating: 0,
    dateFrom: "",
    dateTo: "",
    sortBy: "date_desc",
    hasResponse: null
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
        
        if (filters.sortBy && filters.sortBy !== "date_desc") {
          queryParams.append("sortBy", filters.sortBy);
        }
        
        if (filters.hasResponse !== null) {
          queryParams.append("hasResponse", filters.hasResponse.toString());
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

        {/* Improved filters using our enhanced ReviewFilters component */}
        <div className="mb-8 rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="mb-4 font-medium">Filtrer les avis</h2>
          <ReviewFilters filters={filters} setFilters={setFilters} />
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
