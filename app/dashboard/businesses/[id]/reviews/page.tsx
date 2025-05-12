"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ReviewFilters from "@/components/businesses/ReviewFilters";
import ReviewCard from "@/components/businesses/ReviewCard";
import Link from "next/link";

// Simplified type definitions
type Platform = "google" | "facebook" | "yelp" | "all";

interface FilterOptions {
  platform: Platform | "all";
  rating: number;
  dateFrom: string;
  dateTo: string;
  sortBy: string;
  hasResponse: boolean | null;
}

interface Review {
  id: string;
  author: string;
  content: string;
  rating: number;
  date: string;
  platform: Platform;
  businessId: string;
  response?: {
    content: string;
    date: string;
  };
}

interface Business {
  name: string;
  rating: number;
  reviewCount: number;
  averageRating: number;
}

export default function ReviewsPage() {
  // Get the business ID from URL params
  const params = useParams();
  const businessId = Array.isArray(params.id) ? params.id[0] : params.id!;

  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClientComponentClient();

  const [business, setBusiness] = useState<Business>({
    name: "Loading...",
    rating: 0,
    reviewCount: 0,
    averageRating: 0
  });

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    platform: "all",
    rating: 0,
    dateFrom: "",
    dateTo: "",
    sortBy: "date_desc",
    hasResponse: null
  });

  // Modal state for replying to reviews
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [currentReviewId, setCurrentReviewId] = useState<string>("");
  const [currentReviewPlatform, setCurrentReviewPlatform] = useState<Platform | "">("");
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState<{
    loading: boolean;
    error?: string;
    success?: string;
  }>({ loading: false });

  // For Google limitations warning
  const [limitationsWarning, setLimitationsWarning] = useState<string | null>(null);

  // Filtered reviews based on selected filters
  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      if (filters.platform !== "all" && review.platform !== filters.platform) return false;
      if (filters.rating > 0 && review.rating !== filters.rating) return false;
      if (filters.dateFrom && new Date(review.date) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(review.date) > new Date(filters.dateTo)) return false;
      if (filters.hasResponse === true && !review.response) return false;
      if (filters.hasResponse === false && review.response) return false;
      return true;
    });
  }, [reviews, filters]);

  // Load business and reviews data
  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        // First, fetch business details
        const { data: companyData, error: companyError } = await supabase
          .from("companies")
          .select("*")
          .eq("id", businessId)
          .eq("user_id", user.id)
          .single();

        if (companyError) {
          throw new Error(companyError.message || "Business not found");
        }

        setBusiness({
          name: companyData.name || "Unnamed Business",
          rating: companyData.rating || 0,
          reviewCount: companyData.review_count || 0,
          averageRating: companyData.average_rating || 0
        });

        // Then, fetch reviews - for now we'll use mock data
        // In a real app, you would call your API with the proper filters
        // Example: const res = await fetch(`/api/businesses/${businessId}/reviews`);

        // Mock data for testing
        setReviews([
          {
            id: "1",
            author: "John Doe",
            content: "Great service, really enjoyed it!",
            rating: 5,
            date: "2023-01-15",
            platform: "google",
            businessId
          },
          {
            id: "2",
            author: "Jane Smith",
            content: "Good experience overall but could be better.",
            rating: 4,
            date: "2023-02-20",
            platform: "facebook",
            businessId,
            response: {
              content: "Thank you for your feedback!",
              date: "2023-02-21"
            }
          },
          {
            id: "3",
            author: "Mike Johnson",
            content: "Average service, nothing special.",
            rating: 3,
            date: "2023-03-05",
            platform: "google",
            businessId
          }
        ]);

        setLimitationsWarning("Due to Google API limitations, only a limited set of reviews are available.");

      } catch (e: any) {
        setError(e.message || "An error occurred while loading data");
        console.error("Error loading reviews:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [businessId, user, supabase]);

  // Handle opening reply modal
  const handleReply = (id: string, platform: Platform) => {
    setCurrentReviewId(id);
    setCurrentReviewPlatform(platform);
    setReplyText("");
    setReplyStatus({ loading: false });
    setReplyModalOpen(true);
  };

  // Close reply modal
  const closeReplyModal = () => {
    setReplyModalOpen(false);
    setCurrentReviewId("");
    setCurrentReviewPlatform("");
    setReplyText("");
  };

  // Submit reply to review
  const submitReply = async () => {
    if (!replyText.trim()) return;
    
    setReplyStatus({ loading: true });
    
    try {
      // Mock API call - in a real app, you would call your API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the local state to show the reply
      setReviews(prev => 
        prev.map(review => 
          review.id === currentReviewId 
            ? {
                ...review,
                response: {
                  content: replyText,
                  date: new Date().toISOString().split('T')[0]
                }
              }
            : review
        )
      );
      
      setReplyStatus({ loading: false, success: "Reply sent successfully!" });
      
      // Close modal after a brief delay to show success message
      setTimeout(closeReplyModal, 1500);
      
    } catch (e: any) {
      setReplyStatus({ loading: false, error: e.message || "Failed to send reply" });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 min-h-screen bg-gradient-to-tr from-gray-50 to-blue-50">
        {/* Back link and header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <Link href={`/dashboard/businesses/${businessId}`} className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Business Details
            </Link>
            
            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mt-2">
              {business.name} - Reviews
            </h1>
            
            <div className="mt-2 flex items-center">
              <div className="flex items-center px-3 py-1 bg-yellow-50 rounded-full">
                <span className="text-yellow-600 font-medium text-sm">{business.averageRating.toFixed(1)}</span>
                <svg className="ml-1 h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span className="ml-2 text-sm text-gray-600">{business.reviewCount} reviews</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Review filters */}
        <div className="mb-8">
          <div className="p-4 sm:p-5 bg-white rounded-xl shadow-sm border border-gray-100">
            <ReviewFilters 
              filters={filters} 
              setFilters={setFilters} 
              showGoogleLimitationWarning={Boolean(limitationsWarning)}
            />
          </div>
        </div>

        {/* Reviews list */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-blue-600 font-medium">Loading reviews...</p>
            </div>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p className="text-lg font-medium text-gray-500">No reviews match your filters</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filter criteria</p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onReply={() => handleReply(review.id, review.platform)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {replyModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm">
          <div className="flex min-h-screen items-end sm:items-center justify-center p-4 sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity" 
              onClick={closeReplyModal}
              aria-hidden="true"
            ></div>

            <div className="inline-block w-full transform overflow-hidden rounded-t-xl sm:rounded-2xl bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 sm:px-6 pt-5 pb-4 sm:pt-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div className="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Reply to Review
                    </h3>
                    <div className="mt-4">
                      <textarea
                        className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                        rows={4}
                        placeholder="Type your reply here..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      ></textarea>
                      <p className="mt-2 text-xs text-gray-500">Your reply will be visible to the public</p>
                    </div>

                    {replyStatus.error && (
                      <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                        {replyStatus.error}
                      </div>
                    )}
                    
                    {replyStatus.success && (
                      <div className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-600">
                        <div className="flex">
                          <svg className="h-5 w-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          {replyStatus.success}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex flex-col-reverse sm:flex-row-reverse gap-2 sm:gap-0">
                <button
                  type="button"
                  className="w-full sm:w-auto sm:ml-3 inline-flex justify-center rounded-lg border border-transparent bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={submitReply}
                  disabled={replyStatus.loading || !replyText.trim()}
                >
                  {replyStatus.loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : 'Submit Reply'}
                </button>
                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
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
