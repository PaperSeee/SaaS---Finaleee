import { NextRequest, NextResponse } from 'next/server';
import { Review } from '@/lib/types';
import { createClient } from '@supabase/supabase-js';
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

// Initialize Supabase client (use environment variables in production)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    // Get the place_id from the query string
    const searchParams = request.nextUrl.searchParams;
    const rawPlaceId = searchParams.get('place_id');
    const previewMode = searchParams.get('preview') === 'true';
    
    if (!rawPlaceId) {
      return NextResponse.json(
        { error: "Missing place_id parameter" },
        { status: 400 }
      );
    }

    // Validate and clean place_id format
    const validation = validatePlaceId(rawPlaceId);
    
    if (!validation.valid) {
      console.error(`Invalid place_id format: ${rawPlaceId}, reason: ${validation.message}`);
      return NextResponse.json(
        { 
          error: "Invalid place_id format", 
          details: validation.message,
          suggestedPlaceId: validation.cleanedPlaceId
        },
        { status: 400 }
      );
    }
    
    // Use the cleaned version
    const placeId = validation.cleanedPlaceId;
    console.log(`Fetching reviews for place_id: ${placeId}`);
    
    // Get Google Places API key from environment
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      console.error("Google Places API key not found in environment variables");
      return NextResponse.json(
        { error: "Google Places API key not configured" },
        { status: 500 }
      );
    }
    
    // Get optional filter parameters
    const platform = searchParams.get('platform');
    const rating = searchParams.get('rating');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    
    // Call the Google Places API with fields parameter to get reviews
    const fieldsParam = previewMode
      ? 'name,rating,user_ratings_total' // Only basic info in preview mode
      : 'name,rating,user_ratings_total,reviews'; // Include reviews in full mode
      
    // Add language=fr parameter to prioritize French reviews
    const googleApiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId || '')}&fields=${fieldsParam}&language=fr&key=${apiKey}`;
    
    console.log(`Making API request to Google Places API with place_id: ${placeId}`);
    
    const response = await fetch(googleApiUrl);
    
    if (!response.ok) {
      // Use safe parsing to avoid "body stream already read" errors
      const errorData = await safeJsonParse(response);
      console.error(`Google Places API error (${response.status}):`, errorData);
      
      return NextResponse.json(
        { 
          error: "Failed to fetch data from Google Places API", 
          status: response.status,
          statusText: response.statusText,
          details: errorData
        },
        { status: response.status }
      );
    }
    
    // Parse JSON safely
    const data = await safeJsonParse(response);
    
    if (data.status !== "OK" || !data.result) {
      console.error(`Google API returned status: ${data.status}`);
      console.error("Error details:", JSON.stringify(data.error_message || data));
      
      return NextResponse.json(
        { 
          error: "Invalid response from Google Places API", 
          status: data.status,
          message: data.error_message || "No error message provided" 
        },
        { status: 400 }
      );
    }
    
    // Format the business information
    const business = {
      name: data.result.name || "Unknown Business",
      rating: data.result.rating || 0,
      reviewCount: data.result.user_ratings_total || 0
    };
    
    // If in preview mode, just return the business info without reviews
    if (previewMode) {
      return NextResponse.json({ business });
    }
    
    // Format the reviews from Google's response
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
          platform: "google" as const,
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
    
    // Apply filters
    let filteredReviews = reviews;
    
    // Platform filter
    if (platform && platform !== "all") {
      filteredReviews = filteredReviews.filter(review => review.platform === platform);
    }
    
    // Rating filter
    if (rating) {
      const ratingValue = parseInt(rating);
      filteredReviews = filteredReviews.filter(review => review.rating === ratingValue);
    }
    
    // Date range filters
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filteredReviews = filteredReviews.filter(review => new Date(review.date) >= fromDate);
    }
    
    if (dateTo) {
      const toDate = new Date(dateTo);
      filteredReviews = filteredReviews.filter(review => new Date(review.date) <= toDate);
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
    
    // Return the response with limitations warning
    return NextResponse.json({
      business,
      reviews: filteredReviews,
      limitations: {
        maxReviews: 5,
        sortingLimited: true,
        message: "Pour des raisons techniques imposées par Google, seuls 5 avis peuvent être affichés. Ils ne représentent pas l'ensemble des avis disponibles sur votre fiche Google."
      }
    });
    
  } catch (error) {
    console.error("Error in Google Reviews API:", error);
    return NextResponse.json(
      { error: "Internal server error", message: (error as Error).message },
      { status: 500 }
    );
  }
}
