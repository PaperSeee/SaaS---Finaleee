import { NextRequest, NextResponse } from "next/server";
import type { Review, Platform } from "@/lib/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Fonction pour récupérer les avis de Google Places API
async function fetchGoogleReviews(placeId: string): Promise<Review[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.warn("Google Places API key not configured");
    return [];
  }

  try {
    // Construire l'URL de l'API Google Places
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Vérifier si la réponse contient des avis
    if (data.status !== 'OK' || !data.result || !data.result.reviews) {
      return [];
    }
    
    // Mapper les avis de Google dans notre format
    return data.result.reviews.map((review: any) => ({
      id: `google_${review.time}`, // Créer un ID unique
      author: review.author_name,
      content: review.text || '',
      rating: review.rating,
      date: new Date(review.time * 1000).toISOString(),
      platform: "google" as Platform,
      businessId: placeId,
      response: review.author_reply ? {
        content: review.author_reply.text || '',
        date: new Date(review.author_reply.time * 1000).toISOString()
      } : undefined,
      profilePhoto: review.profile_photo_url
    }));
  } catch (error) {
    console.error("Error fetching Google reviews:", error);
    return [];
  }
}

// Fonction pour récupérer les IDs des plateformes pour une entreprise
async function getBusinessPlatformIds(businessId: string) {
  try {
    const supabase = createClientComponentClient();
    const { data, error } = await supabase
      .from('companies')
      .select('place_id, facebook_id')
      .eq('id', businessId)
      .single();
      
    if (error) {
      console.error("Error fetching business platform IDs:", error);
      return { googlePlaceId: null, facebookPageId: null };
    }
    
    return {
      googlePlaceId: data?.place_id || null,
      facebookPageId: data?.facebook_id || null
    };
  } catch (error) {
    console.error("Error in getBusinessPlatformIds:", error);
    return { googlePlaceId: null, facebookPageId: null };
  }
}

// Fix: Change the parameter type from destructured to a named parameter
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const businessId = context.params.id;
  
  try {
    // Récupérer les identifiants des plateformes pour cette entreprise
    const { googlePlaceId, facebookPageId } = await getBusinessPlatformIds(businessId);
    
    let allReviews: Review[] = [];
    let businessInfo = { name: "", rating: 0, reviewCount: 0 };
    
    // Mode production: récupérer des avis réels si les IDs sont disponibles
    if (googlePlaceId) {
      try {
        // Récupérer à la fois les infos de l'entreprise et les avis
        const apiKey = process.env.GOOGLE_PLACES_API_KEY;
        if (apiKey) {
          const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${googlePlaceId}&fields=name,rating,user_ratings_total,reviews&key=${apiKey}`;
          
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            
            if (data.status === 'OK' && data.result) {
              // Mettre à jour les infos de l'entreprise
              businessInfo = {
                name: data.result.name || "",
                rating: data.result.rating || 0,
                reviewCount: data.result.user_ratings_total || 0
              };
              
              // Récupérer les avis
              if (data.result.reviews) {
                const googleReviews = data.result.reviews.map((review: any) => ({
                  id: `google_${review.time}`,
                  author: review.author_name,
                  content: review.text || '',
                  rating: review.rating,
                  date: new Date(review.time * 1000).toISOString(),
                  platform: "google" as Platform,
                  businessId: googlePlaceId,
                  response: review.author_reply ? {
                    content: review.author_reply.text || '',
                    date: new Date(review.author_reply.time * 1000).toISOString()
                  } : undefined,
                  profilePhoto: review.profile_photo_url
                }));
                
                allReviews = [...allReviews, ...googleReviews];
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching Google place details:", error);
      }
    } else {
      // Si aucun place_id n'est disponible, utiliser des données simulées
      console.log("No Google Place ID found for business", businessId);
    }
    
    // Parse URL for query parameters
    const { searchParams } = new URL(request.url);
    
    // Apply filters if provided
    let filteredReviews = [...allReviews];
    
    const platform = searchParams.get("platform");
    if (platform && platform !== "all") {
      filteredReviews = filteredReviews.filter(
        (review) => review.platform === platform
      );
    }
    
    const rating = searchParams.get("rating");
    if (rating && parseInt(rating) > 0) {
      filteredReviews = filteredReviews.filter(
        (review) => review.rating === parseInt(rating)
      );
    }
    
    const dateFrom = searchParams.get("dateFrom");
    if (dateFrom) {
      filteredReviews = filteredReviews.filter(
        (review) => new Date(review.date) >= new Date(dateFrom)
      );
    }
    
    const dateTo = searchParams.get("dateTo");
    if (dateTo) {
      filteredReviews = filteredReviews.filter(
        (review) => new Date(review.date) <= new Date(dateTo)
      );
    }
    
    // Trier par date (plus récent d'abord)
    filteredReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return NextResponse.json({
      business: businessInfo,
      reviews: filteredReviews
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
