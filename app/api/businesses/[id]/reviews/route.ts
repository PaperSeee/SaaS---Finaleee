import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { Review, Platform } from "@/lib/types";
import { validatePlaceId, safeJsonParse } from '@/lib/apiUtils';

// Define Google Places review structure
interface GooglePlacesReview {
  time: number;
  author_name: string;
  text?: string;
  rating: number;
  profile_photo_url?: string;
  language?: string;
  relative_time_description?: string;
  author_reply?: {
    text: string;
    time: number;
  };
}

// Helper function to fetch reviews from Google API directly
async function fetchGoogleReviews(placeId: string, apiKey: string): Promise<{
  reviews: Review[];
  businessInfo: { name: string; rating: number; reviewCount: number };
  error?: string;
}> {
  // Log the request
  console.log(`🔍 Fetching reviews for Place ID: ${placeId}`);
  
  // Validate place_id before sending to Google API
  const validation = validatePlaceId(placeId);
  if (!validation.valid) {
    console.error(`Invalid place_id format: ${placeId}, reason: ${validation.message}`);
    return { 
      reviews: [], 
      businessInfo: { name: "", rating: 0, reviewCount: 0 },
      error: `Invalid place_id format: ${validation.message}`
    };
  }
  
  // Use the cleaned place_id
  const cleanedPlaceId = validation.cleanedPlaceId!;
  console.log(`🔑 Using cleaned Place ID: ${cleanedPlaceId}`);
  
  // Use the same fields and format as our google-reviews endpoint
  // Add language=fr parameter to prioritize French reviews
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(cleanedPlaceId)}&fields=name,rating,user_ratings_total,reviews&language=fr&key=${apiKey}`;
  
  try {
    console.log(`📡 Making request to Google API...`);
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`❌ Google API error: ${response.status}`);
      // Use safe parsing to avoid "body stream already read" errors
      const errorData = await safeJsonParse(response);
      console.error("Google API error details:", JSON.stringify(errorData));
      return { 
        reviews: [], 
        businessInfo: { name: "", rating: 0, reviewCount: 0 },
        error: `Google API error: ${JSON.stringify(errorData)}`
      };
    }

    // Parse JSON safely
    const data = await safeJsonParse(response);
    console.log(`📊 Google API response status: ${data.status}`);
    
    if (data.status !== "OK" || !data.result) {
      console.error(`❌ Invalid Google API response: ${data.status}`);
      console.error("Error message:", data.error_message || "No error message provided");
      return { 
        reviews: [], 
        businessInfo: { name: "", rating: 0, reviewCount: 0 },
        error: `Google API returned status: ${data.status}. ${data.error_message || ""}`
      };
    }

    // Extract business info
    const result = data.result as any;
    const name = result.name || "";
    const rating = result.rating || 0;
    const reviewCount = result.user_ratings_total || 0;
    
    console.log(`📋 Business info - Name: ${name}, Rating: ${rating}, Review Count: ${reviewCount}`);

    // Extract and format reviews
    let reviews: Review[] = [];
    
    if (Array.isArray(result.reviews)) {
      console.log(`✅ Found ${result.reviews.length} reviews in response`);
      reviews = (result.reviews as GooglePlacesReview[]).map(googleReview => {
        const reviewDate = new Date(googleReview.time * 1000);
        
        return {
          id: `google_${googleReview.time}_${Math.random().toString(36).substring(2, 10)}`,
          author: googleReview.author_name,
          content: googleReview.text || "",
          rating: googleReview.rating,
          date: reviewDate.toISOString(),
          platform: "google" as Platform,
          businessId: placeId,
          profilePhoto: googleReview.profile_photo_url,
          language: googleReview.language || "en",
          relativeTimeDescription: googleReview.relative_time_description || "",
          response: googleReview.author_reply ? {
            content: googleReview.author_reply.text || "",
            date: new Date(googleReview.author_reply.time * 1000).toISOString()
          } : undefined
        };
      });
    } else {
      console.warn(`⚠️ No reviews array in Google API response`);
    }

    return { reviews, businessInfo: { name, rating, reviewCount } };
  } catch (error) {
    console.error("Error fetching Google reviews:", error);
    return {
      reviews: [],
      businessInfo: { name: "", rating: 0, reviewCount: 0 },
      error: error instanceof Error ? error.message : "Unknown error fetching reviews"
    };
  }
}

async function getBusinessPlatformIds(businessId: string) {
  // Pass cookies function directly to createRouteHandlerClient
  const supabase = createRouteHandlerClient({ cookies });
  
  console.log(`🔍 Looking up platform IDs for business: ${businessId}`);
  
  const { data, error } = await supabase
    .from("companies")
    .select("place_id, facebook_url") // Changed from facebook_id to facebook_url
    .eq("id", businessId)
    .single();

  if (error) {
    console.error("❌ Supabase error:", error);
    return { googlePlaceId: null, facebookPageId: null };
  }
  
  // Log raw data for debugging
  console.log("📄 Raw company data:", data);

  // Ensure place_id isn't an empty string - more careful check
  let placeId = null;
  if (data?.place_id) {
    placeId = data.place_id.trim();
    if (placeId === "") placeId = null;
  }
  
  console.log(`✅ Business platform IDs found:`, {
    googlePlaceId: placeId || 'none',
    facebookPageId: data?.facebook_url || 'none' // Changed from facebook_id to facebook_url
  });
  
  return {
    googlePlaceId: placeId,
    facebookPageId: data?.facebook_url || null, // Changed from facebook_id to facebook_url
  };
}

export async function GET(request: Request) {
  // Récupère businessId depuis le path de l'URL
  const { pathname } = new URL(request.url);
  const segments = pathname.split("/");
  const businessId = segments[segments.indexOf("businesses") + 1];

  if (!businessId) {
    console.error("Missing business ID in URL");
    return NextResponse.json({ error: "Business ID is required" }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.error("No Google Places API key found");
    return NextResponse.json({ error: "Google Places API key not configured" }, { status: 500 });
  }

  try {
    const { googlePlaceId } = await getBusinessPlatformIds(businessId);
    console.log(`🏢 Business ${businessId} has Google Place ID: ${googlePlaceId || 'none'}`);
    
    if (!googlePlaceId) {
      console.log(`⚠️ No Google Place ID found for business ${businessId}`);
      return NextResponse.json(
        {
          business: { name: "", rating: 0, reviewCount: 0 },
          reviews: [],
          message: "No Google Place ID found for this business. Please add a Google Place ID to view reviews.",
        },
        { status: 200 }
      );
    }

    // Fetch reviews from Google
    const { reviews: googleReviews, businessInfo, error: googleError } = await fetchGoogleReviews(googlePlaceId, apiKey);
    
    if (googleError) {
      console.error(`❌ Error fetching Google reviews: ${googleError}`);
      return NextResponse.json({
        business: businessInfo,
        reviews: [],
        error: googleError,
        message: "There was a problem retrieving reviews from Google. Please check your Google Place ID and try again."
      });
    }
    
    if (googleReviews.length === 0) {
      console.log(`ℹ️ No reviews returned from Google API for place ID ${googlePlaceId}`);
    }
    
    // Apply filters from request
    const { searchParams } = new URL(request.url);
    let filteredReviews = [...googleReviews];

    // Platform filter
    const platform = searchParams.get("platform");
    if (platform && platform !== "all") {
      filteredReviews = filteredReviews.filter(r => r.platform === platform);
    }

    // Rating filter
    const rating = searchParams.get("rating");
    if (rating) {
      const ratingValue = parseInt(rating);
      filteredReviews = filteredReviews.filter(r => r.rating === ratingValue);
    }

    // Date range filters
    const dateFrom = searchParams.get("dateFrom");
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filteredReviews = filteredReviews.filter(r => new Date(r.date) >= fromDate);
    }

    const dateTo = searchParams.get("dateTo");
    if (dateTo) {
      const toDate = new Date(dateTo);
      filteredReviews = filteredReviews.filter(r => new Date(r.date) <= toDate);
    }
    
    // Response status filter
    const hasResponse = searchParams.get('hasResponse');
    if (hasResponse === 'true') {
      filteredReviews = filteredReviews.filter(review => review.response !== undefined);
    } else if (hasResponse === 'false') {
      filteredReviews = filteredReviews.filter(review => review.response === undefined);
    }

    // Sorting
    const sortBy = searchParams.get('sortBy') || 'date_desc';
    switch (sortBy) {
      case 'date_asc':
        filteredReviews.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'rating_desc':
        filteredReviews.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating_asc':
        filteredReviews.sort((a, b) => a.rating - b.rating);
        break;
      case 'date_desc':
      default:
        filteredReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
    }

    console.log(`📊 Returning ${filteredReviews.length} reviews after filtering`);
    
    return NextResponse.json({
      business: businessInfo,
      reviews: filteredReviews,
      limitations: {
        maxReviews: 5,
        sortingLimited: true,
        message: "Pour des raisons techniques imposées par Google, seuls 5 avis peuvent être affichés. Ils ne représentent pas l'ensemble des avis disponibles sur votre fiche Google."
      }
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Handler error:", errorMessage);
    console.error("Error details:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
    return NextResponse.json({ 
      error: "Failed to fetch reviews",
      message: errorMessage
    }, { status: 500 });
  }
}
