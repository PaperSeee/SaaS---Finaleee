"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ReviewCard from "@/components/businesses/ReviewCard";
import { Review, Platform } from "@/lib/types";
import ReviewFilters from "@/components/businesses/ReviewFilters";

export default function BusinessDetails({ params }: { params: { id: string } }) {
  // Unwrap params with React.use() to access properties safely
  const unwrappedParams = React.use(params);
  const businessId = unwrappedParams.id;
  
  const [business, setBusiness] = useState({
    id: businessId,
    name: "Loading...",
    reviewCount: 0,
    averageRating: 0,
  });
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [currentReviewId, setCurrentReviewId] = useState<string>("");
  const [currentReviewPlatform, setCurrentReviewPlatform] = useState<Platform | "">("");
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState<{
    loading: boolean;
    error?: string;
    success?: string;
  }>({ loading: false });
  const [filters, setFilters] = useState({
    platform: "all" as Platform | "all",
    rating: 0,
    dateFrom: "",
    dateTo: "",
  });

  useEffect(() => {
    // Using businessId instead of params.id
    setTimeout(() => {
      setBusiness({
        id: businessId,
        name: businessId === "1" ? "Coffee Shop" : "Business " + businessId,
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
          businessId: businessId,
        },
        {
          id: "r2",
          author: "Sarah Johnson",
          content: "Good selection but a bit pricey.",
          rating: 4,
          date: "2023-11-30",
          platform: "facebook",
          businessId: businessId,
        },
        {
          id: "r3",
          author: "Mike Williams",
          content: "Average experience. Nothing special.",
          rating: 3,
          date: "2023-11-10",
          platform: "google",
          businessId: businessId,
        },
      ]);
      
      setLoading(false);
    }, 1000);
  }, [businessId]);

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

  const handleReply = (reviewId: string, platform: Platform) => {
    setCurrentReviewId(reviewId);
    setCurrentReviewPlatform(platform);
    setReplyText("");
    setReplyStatus({ loading: false });
    setReplyModalOpen(true);
  };

  const closeReplyModal = () => {
    setReplyModalOpen(false);
    setCurrentReviewId("");
    setCurrentReviewPlatform("");
    setReplyText("");
  };

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
        throw new Error(data.error || 'Failed to submit reply');
      }

      if (data.fallbackUrl) {
        // If we received a fallback URL, show it to the user
        setReplyStatus({ 
          loading: false, 
          success: 'API connection not available. Please use the direct link below to reply manually.',
          error: `<a href="${data.fallbackUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">Reply on ${currentReviewPlatform}</a>`
        });
      } else {
        setReplyStatus({ loading: false, success: 'Reply submitted successfully!' });
        
        // Close the modal after a short delay
        setTimeout(() => {
          closeReplyModal();
        }, 2000);
      }
    } catch (err) {
      setReplyStatus({ 
        loading: false, 
        error: err instanceof Error ? err.message : 'An unexpected error occurred'
      });
    }
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
                    onReply={() => handleReply(review.id, review.platform)}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Reply Modal */}
      {replyModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              onClick={closeReplyModal}
              aria-hidden="true"
            ></div>

            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Reply to Review
                    </h3>
                    <div className="mt-2">
                      <textarea
                        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        rows={4}
                        placeholder="Type your reply here..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      ></textarea>
                    </div>

                    {replyStatus.error && (
                      <div 
                        className="mt-2 text-sm text-red-600" 
                        dangerouslySetInnerHTML={{ __html: replyStatus.error }}
                      ></div>
                    )}
                    
                    {replyStatus.success && (
                      <div className="mt-2 text-sm text-green-600">
                        {replyStatus.success}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={submitReply}
                  disabled={replyStatus.loading || !replyText.trim()}
                >
                  {replyStatus.loading ? 'Submitting...' : 'Submit Reply'}
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={closeReplyModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
