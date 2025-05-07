"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ReviewCard from "@/components/businesses/ReviewCard";
import { Review, Platform } from "@/lib/types";
import ReviewFilters from "@/components/businesses/ReviewFilters";

export default function BusinessDetails({ params }: { params: { id: string } }) {
  const [business, setBusiness] = useState({
    id: params.id,
    name: "Loading...",
    reviewCount: 0,
    averageRating: 0,
  });
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    platform: "all" as Platform | "all",
    rating: 0,
    dateFrom: "",
    dateTo: "",
  });

  useEffect(() => {
    // In a real app, fetch data from API
    setTimeout(() => {
      setBusiness({
        id: params.id,
        name: params.id === "1" ? "Coffee Shop" : "Business " + params.id,
        reviewCount: 12,
        averageRating: 4.2,
      });
      
      setReviews([
        {
          id: "r1",
          author: "John Smith",
          content: "Great service and friendly staff!",
          rating: 5,
          date: "2023-12-15",
          platform: "google",
          businessId: params.id,
        },
        {
          id: "r2",
          author: "Sarah Johnson",
          content: "Good selection but a bit pricey.",
          rating: 4,
          date: "2023-11-30",
          platform: "facebook",
          businessId: params.id,
        },
        {
          id: "r3",
          author: "Mike Williams",
          content: "Average experience. Nothing special.",
          rating: 3,
          date: "2023-11-10",
          platform: "google",
          businessId: params.id,
        },
      ]);
      
      setLoading(false);
    }, 1000);
  }, [params.id]);

  // Filter reviews based on selected filters
  const filteredReviews = reviews.filter((review) => {
    if (filters.platform !== "all" && review.platform !== filters.platform) {
      return false;
    }
    
    if (filters.rating > 0 && review.rating !== filters.rating) {
      return false;
    }
    
    if (filters.dateFrom && new Date(review.date) < new Date(filters.dateFrom)) {
      return false;
    }
    
    if (filters.dateTo && new Date(review.date) > new Date(filters.dateTo)) {
      return false;
    }
    
    return true;
  });

  const handleReply = (reviewId: string) => {
    alert(`Opening reply interface for review ${reviewId}`);
    // In a real app, this would open a modal or navigate to a reply page
  };

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p>Loading business details...</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-semibold">{business.name}</h1>
              <div className="mt-2 flex items-center text-sm">
                <span className="flex items-center text-yellow-500">
                  {business.averageRating}
                  <svg
                    className="ml-1 h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </span>
                <span className="mx-2">•</span>
                <span>{business.reviewCount} reviews</span>
              </div>
            </div>

            <ReviewFilters filters={filters} setFilters={setFilters} />

            <div className="mt-6 space-y-4">
              {filteredReviews.length === 0 ? (
                <p className="py-4 text-center text-gray-500">
                  No reviews match the selected filters
                </p>
              ) : (
                filteredReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onReply={() => handleReply(review.id)}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
