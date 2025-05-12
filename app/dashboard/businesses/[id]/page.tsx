"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ReviewCard from "@/components/businesses/ReviewCard";
import { Review, Platform } from "@/lib/types";
import ReviewFilters from "@/components/businesses/ReviewFilters";
import Link from "next/link";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/contexts/AuthContext";

export default function BusinessDetails() {
  // Access the ID from route parameters using useParams()
  const { id: businessId } = useParams() as { id: string };
  
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  
  const [business, setBusiness] = useState({
    id: businessId,
    name: "Loading...",
    reviewCount: 0,
    averageRating: 0,
    googleUrl: "",
    facebookUrl: "",
  });
  
  // New state for edit form
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    googleUrl: "",
    facebookUrl: "",
    placeId: "",  // Add Place ID to form data
  });
  const [editStatus, setEditStatus] = useState<{
    loading: boolean;
    error?: string;
    success?: string;
  }>({ loading: false });
  
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

  // Add error state
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch business details from Supabase
        const { data: businessData, error: businessError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', businessId)
          .eq('user_id', user.id)
          .single();
          
        if (businessError) {
          throw new Error(`Failed to fetch business data: ${businessError.message}`);
        }
        
        if (!businessData) {
          throw new Error("Business not found or you don't have access");
        }
        
        // Get place_id if available
        const placeId = businessData.place_id;
        
        // Update local state with business data
        setBusiness({
          id: businessId,
          name: businessData.name || "Unnamed Business",
          reviewCount: businessData.review_count || 0,
          averageRating: businessData.average_rating || 0,
          googleUrl: businessData.google_url || "",
          facebookUrl: businessData.facebook_url || "",
        });
        
        // If we have a place_id, fetch reviews
        if (placeId) {
          try {
            const queryParams = new URLSearchParams();
            
            if (filters.platform !== "all") {
              queryParams.append("platform", filters.platform);
            }
            
            if (filters.rating > 0) {
              queryParams.append("rating", filters.rating.toString());
            }
            
            // Important: Send as place_id not placeId (parameter name matters)
            const reviewsUrl = `/api/businesses/${businessId}/reviews?${queryParams.toString()}`;
            const response = await fetch(reviewsUrl);
            
            if (!response.ok) {
              const errorData = await response.json().catch(() => null);
              const errorMessage = errorData?.error || response.statusText;
              throw new Error(`API error: ${errorMessage}`);
            }
            
            const data = await response.json();
            setReviews(data.reviews || []);
          } catch (reviewError: any) {
            console.error("Error fetching reviews:", reviewError);
            setError(`Failed to load reviews: ${reviewError.message}`);
          }
        } else {
          // No place_id available
          setReviews([]);
        }
      } catch (err: any) {
        console.error("Error in fetchBusinessData:", err);
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
    
    // Only run if we have a user
    if (user) {
      fetchBusinessData();
    } else {
      // For demo purposes, keep the mock data loading
      setTimeout(() => {
        setBusiness({
          id: businessId,
          name: businessId === "1" ? "Coffee Shop" : "Business " + businessId,
          reviewCount: 12,
          averageRating: 4.2,
          googleUrl: "https://maps.google.com/place?id=example",
          facebookUrl: "https://facebook.com/example",
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
    }
  }, [businessId, user, filters, supabase]);

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
    // ...existing code...
  };

  // New functions for edit modal
  const openEditModal = () => {
    setEditFormData({
      name: business.name,
      googleUrl: business.googleUrl,
      facebookUrl: business.facebookUrl,
      placeId: business.placeId || '',  // Include Place ID
    });
    setEditModalOpen(true);
    setEditStatus({ loading: false });
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditStatus({ loading: false });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Modify submitBusinessEdit to update Supabase too
  const submitBusinessEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditStatus({ loading: true });
    
    // Validate form data
    if (!editFormData.name.trim()) {
      setEditStatus({ 
        loading: false, 
        error: "Business name is required" 
      });
      return;
    }
    
    try {
      // Update in Supabase if user is logged in
      if (user) {
        const { error: updateError } = await supabase
          .from('companies')
          .update({
            name: editFormData.name.trim(),
            google_url: editFormData.googleUrl.trim(),
            facebook_url: editFormData.facebookUrl.trim(),
            place_id: editFormData.placeId.trim() || null,  // Include Place ID
          })
          .eq('id', businessId)
          .eq('user_id', user.id);
          
        if (updateError) {
          throw new Error(`Failed to update business: ${updateError.message}`);
        }
      } else {
        // Simulate API call for demo mode
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Update local state
      setBusiness(prev => ({
        ...prev,
        name: editFormData.name.trim(),
        googleUrl: editFormData.googleUrl.trim(),
        facebookUrl: editFormData.facebookUrl.trim(),
        placeId: editFormData.placeId.trim(),  // Include Place ID
      }));
      
      setEditStatus({ 
        loading: false, 
        success: "Business details updated successfully!"
      });
      
      // Close the modal after a delay
      setTimeout(() => {
        closeEditModal();
      }, 1500);
    } catch (error: any) {
      setEditStatus({
        loading: false,
        error: error.message || "Failed to update business details. Please try again."
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 min-h-screen bg-gradient-to-tr from-gray-50 to-blue-50">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-blue-600 font-medium">Loading business details...</p>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 rounded-lg border bg-red-50 p-4 text-sm text-red-700">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">Error</h3>
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <div className="flex flex-wrap items-center mb-3 gap-2">
                  <Link href="/dashboard/businesses" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back to Businesses
                  </Link>
                  
                  <div className="flex items-center ml-0 sm:ml-4">
                    <Image 
                      src="/logo.png" 
                      alt="Kritiqo Logo" 
                      width={40} 
                      height={40} 
                      className="mr-2"
                    />
                    <span className="text-lg font-bold text-gray-800">Kritiqo</span>
                  </div>
                </div>
                
                <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  {business.name}
                </h1>
                
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <div className="flex items-center px-3 py-1 bg-yellow-50 rounded-full">
                    <span className="text-yellow-600 font-medium text-sm">{business.averageRating.toFixed(1)}</span>
                    <svg className="ml-1 h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="flex items-center">
                    <span className="hidden sm:inline-block mx-2 text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{business.reviewCount} reviews</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button 
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  onClick={openEditModal}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Edit Business
                </button>
                <button className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                  Request Reviews
                </button>
              </div>
            </div>

            <div className="mb-8 overflow-x-auto">
              <div className="p-4 sm:p-5 bg-white rounded-xl shadow-sm border border-gray-100 min-w-[320px]">
                <h2 className="text-lg font-semibold mb-4">Review Filters</h2>
                <ReviewFilters filters={filters} setFilters={setFilters} />
              </div>
            </div>

            <div className="space-y-5">
              {filteredReviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <p className="text-lg font-medium text-gray-500">No reviews match your filters</p>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your filter criteria</p>
                </div>
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
                      <div 
                        className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600" 
                        dangerouslySetInnerHTML={{ __html: replyStatus.error }}
                      ></div>
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

      {/* Edit Business Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm">
          <div className="flex min-h-screen items-end sm:items-center justify-center p-4 sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity" 
              onClick={closeEditModal}
              aria-hidden="true"
            ></div>

            <div className="inline-block w-full transform overflow-hidden rounded-t-xl sm:rounded-2xl bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:max-w-lg sm:align-middle">
              <form onSubmit={submitBusinessEdit}>
                <div className="bg-white px-4 sm:px-6 pt-5 pb-4 sm:pt-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                    <div className="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Modifier les détails de l'entreprise
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Nom de l'entreprise
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            value={editFormData.name}
                            onChange={handleEditInputChange}
                            required
                          />
                        </div>
                        
                        {/* Place ID field - prioritized position */}
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-md">
                          <label htmlFor="placeId" className="block text-sm font-medium text-blue-700">
                            Google Place ID
                            <span className="ml-2 text-xs font-normal text-blue-600">
                              (<Link href="/dashboard/find-place-id" className="text-blue-700 hover:text-blue-600 hover:underline">Trouver mon Place ID</Link>)
                            </span>
                          </label>
                          <input
                            type="text"
                            name="placeId"
                            id="placeId"
                            className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white"
                            value={editFormData.placeId}
                            onChange={handleEditInputChange}
                            placeholder="Ex: ChIJN1t_tDeuEmsRUsoyG83frY4"
                          />
                          <p className="mt-1 text-xs text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                            </svg>
                            Le Place ID est nécessaire pour récupérer automatiquement les avis Google
                          </p>
                        </div>
                        
                        <div>
                          <label htmlFor="googleUrl" className="block text-sm font-medium text-gray-700">
                            URL Google Maps (alternative)
                          </label>
                          <input
                            type="url"
                            name="googleUrl"
                            id="googleUrl"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            value={editFormData.googleUrl}
                            onChange={handleEditInputChange}
                            placeholder="https://maps.google.com/place/your-business"
                          />
                          <p className="mt-1 text-xs text-gray-500">URL vers votre profil Google Business (si vous n'avez pas le Place ID)</p>
                        </div>
                        <div>
                          <label htmlFor="facebookUrl" className="block text-sm font-medium text-gray-700">
                            URL Page Facebook
                          </label>
                          <input
                            type="url"
                            name="facebookUrl"
                            id="facebookUrl"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            value={editFormData.facebookUrl}
                            onChange={handleEditInputChange}
                            placeholder="https://facebook.com/your-business"
                          />
                          <p className="mt-1 text-xs text-gray-500">URL vers votre page Facebook professionnelle</p>
                        </div>
                      </div>

                      {editStatus.error && (
                        <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
                          {editStatus.error}
                        </div>
                      )}
                      
                      {editStatus.success && (
                        <div className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-600 flex items-center">
                          <svg className="h-5 w-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          {editStatus.success}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex flex-col-reverse sm:flex-row-reverse gap-2 sm:gap-0">
                  <button
                    type="submit"
                    className="w-full sm:w-auto sm:ml-3 inline-flex justify-center rounded-lg border border-transparent bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={editStatus.loading || !editFormData.name.trim()}
                  >
                    {editStatus.loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                    onClick={closeEditModal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
