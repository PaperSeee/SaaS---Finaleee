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
  // Validate place_id before sending to Google API
  const validation = validatePlaceId(placeId);
  if (!validation.valid) {
    console.error(`Invalid place_id format: ${placeId}, reason: ${validation.message}`);
    return { 
      reviews: [], 
      businessInfo: { name: "", rating: 0, reviewCount: 0 },
      error: `Invalid place_id: ${validation.message}`
    };
  }
  
  // Use the cleaned place_id
  const cleanedPlaceId = validation.cleanedPlaceId!;
  
  // Use the same fields and format as our google-reviews endpoint
  // Add language=fr parameter to prioritize French reviews
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(cleanedPlaceId)}&fields=name,rating,user_ratings_total,reviews&language=fr&key=${apiKey}`;
  
  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Google API error: ${response.status}`);
      // Use safe parsing to avoid "body stream already read" errors
      const errorData = await safeJsonParse(response);
      return { 
        reviews: [], 
        businessInfo: { name: "", rating: 0, reviewCount: 0 },
        error: `Google API error: ${JSON.stringify(errorData)}`
      };
    }

    // Parse JSON safely
    const data = await safeJsonParse(response);
    
    if (data.status !== "OK" || !data.result) {
      console.error(`Invalid Google API response: ${data.status}`);
      return { 
        reviews: [], 
        businessInfo: { name: "", rating: 0, reviewCount: 0 },
        error: `Google API returned status: ${data.status}. ${data.error_message || ""}`
      };
    }

    // Extract business info
    const businessInfo = {
      name: data.result.name || "",
      rating: data.result.rating || 0,
      reviewCount: data.result.user_ratings_total || 0,
    };

    // Extract and format reviews
    let reviews: Review[] = [];
    
    if (data.result.reviews && Array.isArray(data.result.reviews)) {
      reviews = data.result.reviews.map((googleReview: GooglePlacesReview) => {
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
    }

    return { reviews, businessInfo };
  } catch (error) {
    console.error("Error fetching Google reviews:", error);
    return {
      reviews: [],
      businessInfo: { name: "", rating: 0, reviewCount: 0 },
      error: error instanceof Error ? error.message : "Unknown error fetching reviews"
    };
  }
}

async function getBusinessPlatformIds(businessId) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  
  const { data, error } = await supabase
    .from("companies")
    .select("place_id, facebook_id")
    .eq("id", businessId)
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return { googlePlaceId: null, facebookPageId: null };
  }

  return {
    googlePlaceId: data?.place_id || null,
    facebookPageId: data?.facebook_id || null,
  };
}

// ✅ NO TYPE ON ARGUMENTS — TO FIX BUILD IN NEXT 15
export async function GET(req, { params }) {
  const businessId = params.id;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Google Places API key not configured" }, { status: 500 });
  }

  try {
    const { googlePlaceId } = await getBusinessPlatformIds(businessId);
    
    if (!googlePlaceId) {
      return NextResponse.json({ 
        business: { name: "", rating: 0, reviewCount: 0 },
        reviews: [],
        error: "No Google Place ID found for this business"
      }, { status: 200 }); // Return empty data but with 200 status
    }
    
    // Fetch reviews from Google
    const { reviews: googleReviews, businessInfo } = await fetchGoogleReviews(googlePlaceId, apiKey);
    
    // Apply filters from request
    const { searchParams } = new URL(req.url);
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
    console.error("Handler error:", err);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
