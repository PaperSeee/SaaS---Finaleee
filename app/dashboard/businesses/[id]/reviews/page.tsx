"use client";

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ReviewFilters from '@/components/businesses/ReviewFilters';
import ReviewCard from '@/components/businesses/ReviewCard';
import { Review, FilterOptions } from '@/lib/types'; // Make sure to import Review type

export default function ReviewsPage() {
  // Get the business ID from URL params
  const params = useParams();
  const businessId = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClientComponentClient();

  const [business, setBusiness] = useState({
    name: "Loading...",
    rating: 0,
    reviewCount: 0,
    averageRating: 0
  });
  const [reviews, setReviews] = useState<Review[]>([]); // Add explicit type annotation
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
  const [currentReviewId, setCurrentReviewId] = useState("");
  const [currentReviewPlatform, setCurrentReviewPlatform] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState<{ loading: boolean; error?: string }>({ loading: false });
  const [limitationsWarning, setLimitationsWarning] = useState(null);

  // Filtered reviews based on selected filters
  const filteredReviews = useMemo(() => {
    // Filter logic implementation
    if (!reviews) return [];
    
    return reviews.filter(review => {
      // Filter by platform
      if (filters.platform !== "all" && review.platform !== filters.platform) {
        return false;
      }
      
      // Filter by rating
      if (filters.rating > 0 && review.rating !== filters.rating) {
        return false;
      }
      
      // Filter by date range
      if (filters.dateFrom && new Date(review.date) < new Date(filters.dateFrom)) {
        return false;
      }
      
      if (filters.dateTo && new Date(review.date) > new Date(filters.dateTo)) {
        return false;
      }
      
      // Filter by response status
      if (filters.hasResponse === true && !review.response) {
        return false;
      }
      
      if (filters.hasResponse === false && review.response) {
        return false;
      }
      
      return true;
    }).sort((a, b) => {
      // Sort logic
      switch (filters.sortBy) {
        case "date_desc":
          // use numeric timestamps instead of Date objects
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date_asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "rating_desc":
          return b.rating - a.rating;
        case "rating_asc":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });
  }, [reviews, filters]);

  // Improved fetch business and reviews function with better error handling
  useEffect(() => {
    const fetchBusinessAndReviews = async () => {
      if (!businessId || !user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch business data
        const { data: businessData, error: businessError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', businessId)
          .single();
          
        if (businessError) {
          console.error('Business error details:', JSON.stringify(businessError));
          throw new Error(`Failed to fetch business: ${businessError.message || 'Unknown error'}`);
        }

        if (!businessData) {
          throw new Error('Business not found');
        }
        
        // Log the business data for debugging
        console.log('Business data from database:', businessData);
        console.log('Place ID from database:', businessData.place_id);
        
        // Fetch reviews data with detailed logging
        console.log(`Fetching reviews for business ID: ${businessId}`);
        const reviewsResponse = await fetch(`/api/businesses/${businessId}/reviews`);
        
        if (!reviewsResponse.ok) {
          const errorText = await reviewsResponse.text();
          console.error('Reviews API error response:', errorText);
          throw new Error(`Failed to fetch reviews: ${reviewsResponse.statusText}`);
        }
        
        const reviewsData = await reviewsResponse.json();
        console.log('Reviews API response:', reviewsData);
        
        if (!reviewsData.reviews || !Array.isArray(reviewsData.reviews)) {
          console.warn('No reviews array in response or invalid format:', reviewsData);
        }
        
        // Calculate average rating safely
        const reviews = reviewsData.reviews || [];
        const totalRating = reviews.length > 0 ? 
          reviews.reduce((sum, review) => sum + (review.rating || 0), 0) : 0;
        const averageRating = reviews.length > 0 ? 
          totalRating / reviews.length : 0;
        
        setBusiness({
          ...businessData,
          reviewCount: reviews.length,
          averageRating: averageRating !== null && averageRating !== undefined 
            ? parseFloat(averageRating.toFixed(1)) 
            : 0
        });
        
        setReviews(reviews);
        
        // Check if we received any reviews
        if (reviews.length === 0) {
          console.log('No reviews returned from API');
          if (reviewsData.message) {
            console.log('API message:', reviewsData.message);
          }
          if (reviewsData.limitations) {
            setLimitationsWarning(reviewsData.limitations.message);
          }
        }
        
      } catch (err) {
        console.error('Error fetching data:', err instanceof Error ? err.message : 'Unknown error');
        console.error('Error object:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
        setError(err instanceof Error ? err.message : 'Failed to load business data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBusinessAndReviews();
  }, [businessId, user]);

  // Handle opening reply modal
  const handleReply = (id, platform) => {
    setCurrentReviewId(id);
    setCurrentReviewPlatform(platform);
    setReplyText('');
    setReplyModalOpen(true);
  };

  // Close reply modal
  const closeReplyModal = () => {
    setReplyModalOpen(false);
    setReplyText('');
    setReplyStatus({ loading: false });
  };

  // Submit reply to review
  const submitReply = async () => {
    if (!replyText.trim() || !currentReviewId) return;
    
    setReplyStatus({ loading: true });
    
    try {
      // API call to submit reply
      const response = await fetch(`/api/reviews/${currentReviewId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: replyText,
          platform: currentReviewPlatform
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit reply');
      }
      
      // Update the local reviews state
      const updatedReviews = reviews.map(review => {
        if (review.id === currentReviewId) {
          return {
            ...review,
            response: {
              content: replyText,
              date: new Date().toISOString()
            }
          };
        }
        return review;
      });
      
      setReviews(updatedReviews);
      closeReplyModal();
      
    } catch (error) {
      setReplyStatus({
        loading: false,
        error: 'Failed to submit reply. Please try again.'
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/dashboard/businesses" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Businesses
          </Link>
          
          <h1 className="text-2xl font-bold mt-2 text-gray-900">{business.name} Reviews</h1>
          
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex items-center">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg 
                    key={star}
                    className={`h-5 w-5 ${star <= (business.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">
                {business.averageRating !== undefined && business.averageRating !== null 
                  ? business.averageRating.toFixed(1) 
                  : "0.0"} 
                ({business.reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>

        <ReviewFilters filters={filters} setFilters={setFilters} />

        {loading ? (
          <div className="mt-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-500">Loading reviews...</p>
          </div>
        ) : error ? (
          <div className="mt-8 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="mt-8 p-6 text-center bg-gray-50 rounded-xl border border-gray-100">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No reviews found</h3>
            <p className="mt-1 text-gray-500">
              {reviews.length === 0
                ? "We couldn't find any reviews for this business. This could be because the business has no reviews yet or because of API limitations."
                : "There are no reviews matching your selected filters."}
            </p>
            {limitationsWarning && (
              <p className="mt-2 text-sm text-amber-600">
                {limitationsWarning}
              </p>
            )}
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onReply={() => handleReply(review.id, review.platform)}
              />
            ))}
          </div>
        )}

        {/* Reply Modal */}
        {replyModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-1">Reply to Review</h3>
                  <p className="text-sm text-gray-500 mb-4">Your response will be public and visible to anyone who can see this review.</p>
                  
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your reply here..."
                  />
                  
                  {replyStatus.error && (
                    <div className="mt-3 text-sm text-red-600">{replyStatus.error}</div>
                  )}
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={submitReply}
                    disabled={replyStatus.loading || !replyText.trim()}
                  >
                    {replyStatus.loading ? 'Submitting...' : 'Submit Reply'}
                  </button>
                  
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={closeReplyModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
