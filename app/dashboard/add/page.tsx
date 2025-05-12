"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Platform, PLATFORM_CONFIGS } from "@/lib/types";
import { validatePlaceId } from "@/lib/googlePlaces";

interface BusinessForm {
  name: string;
  platforms: Record<Platform, boolean>;
  platformData: {
    google: {
      placeId: string;
      url: string;
      verified: boolean;
      verificationStatus: "idle" | "searching" | "found" | "not-found";
      businessInfo?: {
        name: string;
        rating: number;
        reviewCount: number;
      };
    };
    facebook: {
      pageId: string;
      url: string;
    };
    trustpilot: {
      businessId: string;
      url: string;
    };
    yelp: {
      businessId: string;
      url: string;
    };
  };
}

export default function AddPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { user } = useAuth();

  // Get search params
  const placeIdParam = searchParams.get("placeId");
  const nameParam = searchParams.get("name");

  // Initialize form state with all platforms
  const [form, setForm] = useState<BusinessForm>({
    name: nameParam || "",
    platforms: {
      google: true,  // Default to Google enabled
      facebook: false,
      trustpilot: false,
      yelp: false
    },
    platformData: {
      google: {
        placeId: placeIdParam || "",
        url: "",
        verified: false,
        verificationStatus: placeIdParam ? "found" : "idle"
      },
      facebook: {
        pageId: "",
        url: ""
      },
      trustpilot: {
        businessId: "",
        url: ""
      },
      yelp: {
        businessId: "",
        url: ""
      }
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Add debounce effect to verify Google Place ID when user types
  useEffect(() => {
    const placeId = form.platformData.google.placeId;
    
    if (form.platforms.google && placeId && 
        form.platformData.google.verificationStatus !== "searching") {
      const timer = setTimeout(() => {
        verifyGooglePlaceId(placeId);
      }, 800); // Debounce for 800ms
      
      return () => clearTimeout(timer);
    }
  }, [form.platformData.google.placeId, form.platforms.google]);
  
  // Verify Google Place ID
  const verifyGooglePlaceId = async (placeId: string) => {
    if (!placeId.trim()) {
      updatePlatformData("google", "verificationStatus", "idle");
      return;
    }
    
    updatePlatformData("google", "verificationStatus", "searching");
    
    try {
      // Call our API to verify the Place ID and get business info
      const response = await fetch(`/api/google-reviews?place_id=${encodeURIComponent(placeId)}&preview=true`);
      const data = await response.json();
      
      if (response.ok && data.business) {
        updatePlatformData("google", "verificationStatus", "found");
        updatePlatformData("google", "verified", true);
        updatePlatformData("google", "businessInfo", {
          name: data.business.name,
          rating: data.business.averageRating,
          reviewCount: data.business.reviewCount
        });
        
        // Update the business name if it's empty
        if (!form.name) {
          setForm(prev => ({...prev, name: data.business.name}));
        }
      } else {
        updatePlatformData("google", "verificationStatus", "not-found");
        updatePlatformData("google", "verified", false);
      }
    } catch (err) {
      console.error("Error verifying Place ID:", err);
      updatePlatformData("google", "verificationStatus", "not-found");
      updatePlatformData("google", "verified", false);
    }
  };
  
  // Update a specific value in the platformData
  const updatePlatformData = (
    platform: Platform,
    field: string, 
    value: any
  ) => {
    setForm(prev => ({
      ...prev,
      platformData: {
        ...prev.platformData,
        [platform]: {
          ...prev.platformData[platform],
          [field]: value
        }
      }
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (!user) {
      setError("You must be logged in to add a business");
      setLoading(false);
      return;
    }
    
    if (!form.name.trim()) {
      setError("Business name is required");
      setLoading(false);
      return;
    }
    
    // Check that at least one platform is enabled
    if (!Object.values(form.platforms).some(enabled => enabled)) {
      setError("You must enable at least one platform");
      setLoading(false);
      return;
    }
    
    // Check that required platform IDs are provided when enabled
    for (const platform of Object.keys(form.platforms) as Platform[]) {
      if (form.platforms[platform] && PLATFORM_CONFIGS[platform].idRequired) {
        const idField = platform === "google" ? "placeId" : 
                        platform === "facebook" ? "pageId" : "businessId";
        
        if (!form.platformData[platform][idField]) {
          setError(`${PLATFORM_CONFIGS[platform].name} ${PLATFORM_CONFIGS[platform].idFieldName} is required`);
          setLoading(false);
          return;
        }
      }
    }
    
    try {
      // Collect all enabled platform data
      const platformIds: Record<string, string> = {};
      const platformUrls: Record<string, string> = {};
      
      for (const platform of Object.keys(form.platforms) as Platform[]) {
        if (form.platforms[platform]) {
          // Add platform-specific IDs to the database fields
          if (platform === "google") {
            platformIds.google_place_id = form.platformData.google.placeId.trim();
            platformUrls.google_url = form.platformData.google.url.trim();
          } else if (platform === "facebook") {
            platformIds.facebook_page_id = form.platformData.facebook.pageId.trim();
            platformUrls.facebook_url = form.platformData.facebook.url.trim();
          } else if (platform === "trustpilot") {
            platformIds.trustpilot_business_id = form.platformData.trustpilot.businessId.trim();
            platformUrls.trustpilot_url = form.platformData.trustpilot.url.trim();
          } else if (platform === "yelp") {
            platformIds.yelp_business_id = form.platformData.yelp.businessId.trim();
            platformUrls.yelp_url = form.platformData.yelp.url.trim();
          }
        }
      }
      
      // Construct the enabled platforms array
      const enabledPlatforms = Object.keys(form.platforms)
        .filter(platform => form.platforms[platform as Platform]) as Platform[];
      
      // Prepare the business data for insertion
      const businessData = {
        name: form.name.trim(),
        user_id: user.id,
        
        // For backward compatibility, map the Google Place ID to placeId field
        place_id: form.platforms.google ? form.platformData.google.placeId.trim() : null,
        place_id_verified: form.platforms.google ? form.platformData.google.verified : false,
        
        // Add boolean flags to indicate which platforms are enabled
        google_enabled: form.platforms.google,
        facebook_enabled: form.platforms.facebook,
        trustpilot_enabled: form.platforms.trustpilot,
        yelp_enabled: form.platforms.yelp,
        
        // Add all platform IDs and URLs
        ...platformIds,
        ...platformUrls
      };
      
      console.log("Inserting business with data:", businessData);
      
      // Insert the business into the database
      const { data, error: insertError } = await supabase
        .from('companies')
        .insert(businessData)
        .select();
      
      if (insertError) {
        console.error("Supabase insert error:", insertError);
        // Log detailed error information for debugging
        console.error("Error details:", JSON.stringify(insertError, Object.getOwnPropertyNames(insertError)));
        throw insertError;
      }
      
      console.log("Business added successfully with ID:", data?.[0]?.id);
      setSuccess("Business added successfully!");
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/dashboard/businesses');
      }, 1500);
    } catch (err: any) {
      console.error("Error adding business:", err);
      
      // Try to extract meaningful error information
      let errorMessage = "Failed to add business. Please try again.";
      
      if (err) {
        if (err.message) {
          errorMessage = err.message;
        } else if (err.error_description) {
          errorMessage = err.error_description;
        } else if (err.details) {
          errorMessage = err.details;
        } else if (typeof err === 'object') {
          // Try to stringify the error object for more details
          try {
            const errorObj = JSON.stringify(err, Object.getOwnPropertyNames(err));
            errorMessage = `Database error: ${errorObj}`;
          } catch (jsonErr) {
            console.error("Error stringifying error:", jsonErr);
          }
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle platform toggle
  const handlePlatformToggle = (platform: Platform) => {
    setForm(prev => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [platform]: !prev.platforms[platform]
      }
    }));
  };
  
  // Handle input changes for platform data
  const handlePlatformInputChange = (
    platform: Platform, 
    field: string, 
    value: string
  ) => {
    setForm(prev => ({
      ...prev,
      platformData: {
        ...prev.platformData,
        [platform]: {
          ...prev.platformData[platform],
          [field]: value
        }
      }
    }));
  };

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Add New Business</h1>
          <p className="mt-1 text-sm text-gray-500">
            Enter business details to start collecting reviews from multiple platforms
          </p>
        </div>
        
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-4 rounded-md bg-green-50 p-4">
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
        
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
          {/* Business Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Business Name
            </label>
            <input
              id="name"
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="Enter business name"
              value={form.name}
              onChange={(e) => setForm(prev => ({...prev, name: e.target.value}))}
              required
            />
          </div>
          
          {/* Platform Selection */}
          <div>
            <h2 className="text-base font-medium text-gray-900 mb-3">Select Review Platforms</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(Object.keys(form.platforms) as Platform[]).map(platform => (
                <div 
                  key={platform}
                  className={`relative rounded-lg border p-4 cursor-pointer ${
                    form.platforms[platform] 
                      ? `bg-${PLATFORM_CONFIGS[platform].color}-50 border-${PLATFORM_CONFIGS[platform].color}-300` 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => handlePlatformToggle(platform)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${PLATFORM_CONFIGS[platform].color}-100`}>
                        {/* You can replace this with actual platform icons */}
                        <span className={`text-${PLATFORM_CONFIGS[platform].color}-600`}>
                          {platform.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">
                          {PLATFORM_CONFIGS[platform].name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Import reviews from {PLATFORM_CONFIGS[platform].name}
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={form.platforms[platform]}
                      onChange={() => handlePlatformToggle(platform)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Google-specific fields */}
          {form.platforms.google && (
            <div className="border rounded-lg p-4 bg-blue-50 space-y-4">
              <h3 className="text-base font-medium text-blue-700">Google Business Settings</h3>
              
              <div>
                <label htmlFor="googlePlaceId" className="block text-sm font-medium text-blue-700">
                  Google Place ID
                  <span className="ml-2 text-xs font-normal text-blue-600">
                    (<Link href="/dashboard/find-place-id" className="text-blue-700 hover:text-blue-600 hover:underline">Find my Place ID</Link>)
                  </span>
                </label>
                <input
                  id="googlePlaceId"
                  type="text"
                  className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  value={form.platformData.google.placeId}
                  onChange={(e) => handlePlatformInputChange("google", "placeId", e.target.value)}
                  placeholder="Ex: ChIJN1t_tDeuEmsRUsoyG83frY4"
                  required={PLATFORM_CONFIGS.google.idRequired}
                />
                <p className="mt-1 text-xs text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                  </svg>
                  Required to automatically retrieve Google reviews
                </p>
                
                {form.platformData.google.verificationStatus === "searching" && (
                  <div className="mt-2 flex items-center text-blue-600">
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-blue-600 rounded-full border-t-transparent"></div>
                    <span className="text-sm">Verifying Place ID...</span>
                  </div>
                )}
                
                {form.platformData.google.verificationStatus === "found" && 
                 form.platformData.google.businessInfo && (
                  <div className="mt-3 bg-green-50 border border-green-200 rounded-md p-3">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">Business found!</h3>
                        <div className="mt-2 text-sm text-green-700">
                          <p>{form.platformData.google.businessInfo.name}</p>
                          <p className="flex items-center mt-1">
                            <span className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <svg 
                                  key={i} 
                                  className={`h-4 w-4 ${i < Math.round(form.platformData.google.businessInfo!.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                                  fill="currentColor" 
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                                </svg>
                              ))}
                              <span className="ml-1 text-sm">{form.platformData.google.businessInfo.rating}</span>
                            </span>
                            <span className="mx-2">•</span>
                            <span>{form.platformData.google.businessInfo.reviewCount} reviews</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {form.platformData.google.verificationStatus === "not-found" && (
                  <div className="mt-2 text-sm text-red-600">
                    This Place ID doesn't seem valid or couldn't be found.
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="googleUrl" className="block text-sm font-medium text-blue-700">
                  Google Business URL (Optional)
                </label>
                <input
                  id="googleUrl"
                  type="url"
                  className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  value={form.platformData.google.url}
                  onChange={(e) => handlePlatformInputChange("google", "url", e.target.value)}
                  placeholder="https://g.page/your-business"
                />
                <p className="mt-1 text-xs text-blue-600">
                  URL to your Google Business profile
                </p>
              </div>
            </div>
          )}
          
          {/* Facebook-specific fields */}
          {form.platforms.facebook && (
            <div className="border rounded-lg p-4 bg-indigo-50 space-y-4">
              <h3 className="text-base font-medium text-indigo-700">Facebook Settings</h3>
              
              <div>
                <label htmlFor="facebookPageId" className="block text-sm font-medium text-indigo-700">
                  Facebook Page ID (Optional)
                </label>
                <input
                  id="facebookPageId"
                  type="text"
                  className="mt-1 block w-full rounded-md border-indigo-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  value={form.platformData.facebook.pageId}
                  onChange={(e) => handlePlatformInputChange("facebook", "pageId", e.target.value)}
                  placeholder="123456789012345"
                  required={PLATFORM_CONFIGS.facebook.idRequired}
                />
                <p className="mt-1 text-xs text-indigo-600">
                  Your Facebook page's unique identifier
                </p>
              </div>
              
              <div>
                <label htmlFor="facebookUrl" className="block text-sm font-medium text-indigo-700">
                  Facebook Page URL
                </label>
                <input
                  id="facebookUrl"
                  type="url"
                  className="mt-1 block w-full rounded-md border-indigo-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  value={form.platformData.facebook.url}
                  onChange={(e) => handlePlatformInputChange("facebook", "url", e.target.value)}
                  placeholder="https://facebook.com/your-business"
                />
                <p className="mt-1 text-xs text-indigo-600">
                  URL to your Facebook business page
                </p>
              </div>
            </div>
          )}
          
          {/* Trustpilot-specific fields */}
          {form.platforms.trustpilot && (
            <div className="border rounded-lg p-4 bg-green-50 space-y-4">
              <h3 className="text-base font-medium text-green-700">Trustpilot Settings</h3>
              
              <div>
                <label htmlFor="trustpilotBusinessId" className="block text-sm font-medium text-green-700">
                  Trustpilot Business ID (Optional)
                </label>
                <input
                  id="trustpilotBusinessId"
                  type="text"
                  className="mt-1 block w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                  value={form.platformData.trustpilot.businessId}
                  onChange={(e) => handlePlatformInputChange("trustpilot", "businessId", e.target.value)}
                  placeholder="your-business-id"
                  required={PLATFORM_CONFIGS.trustpilot.idRequired}
                />
                <p className="mt-1 text-xs text-green-600">
                  Your Trustpilot business identifier
                </p>
              </div>
              
              <div>
                <label htmlFor="trustpilotUrl" className="block text-sm font-medium text-green-700">
                  Trustpilot URL
                </label>
                <input
                  id="trustpilotUrl"
                  type="url"
                  className="mt-1 block w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                  value={form.platformData.trustpilot.url}
                  onChange={(e) => handlePlatformInputChange("trustpilot", "url", e.target.value)}
                  placeholder="https://trustpilot.com/review/your-business"
                />
                <p className="mt-1 text-xs text-green-600">
                  URL to your Trustpilot business page
                </p>
              </div>
            </div>
          )}
          
          {/* Yelp-specific fields */}
          {form.platforms.yelp && (
            <div className="border rounded-lg p-4 bg-red-50 space-y-4">
              <h3 className="text-base font-medium text-red-700">Yelp Settings</h3>
              
              <div>
                <label htmlFor="yelpBusinessId" className="block text-sm font-medium text-red-700">
                  Yelp Business ID (Optional)
                </label>
                <input
                  id="yelpBusinessId"
                  type="text"
                  className="mt-1 block w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 border"
                  value={form.platformData.yelp.businessId}
                  onChange={(e) => handlePlatformInputChange("yelp", "businessId", e.target.value)}
                  placeholder="your-business-id"
                  required={PLATFORM_CONFIGS.yelp.idRequired}
                />
                <p className="mt-1 text-xs text-red-600">
                  Your Yelp business identifier
                </p>
              </div>
              
              <div>
                <label htmlFor="yelpUrl" className="block text-sm font-medium text-red-700">
                  Yelp URL
                </label>
                <input
                  id="yelpUrl"
                  type="url"
                  className="mt-1 block w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 border"
                  value={form.platformData.yelp.url}
                  onChange={(e) => handlePlatformInputChange("yelp", "url", e.target.value)}
                  placeholder="https://yelp.com/biz/your-business"
                />
                <p className="mt-1 text-xs text-red-600">
                  URL to your Yelp business page
                </p>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-4 pt-4">
            <button
              type="button"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              onClick={() => router.push("/dashboard/businesses")}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !form.name || !Object.values(form.platforms).some(Boolean)}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:bg-blue-300"
            >
              {loading ? "Creating..." : "Create Business"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
