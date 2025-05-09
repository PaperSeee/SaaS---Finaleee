import { NextRequest, NextResponse } from "next/server";
import type { Review, Platform } from "@/lib/types";

// Mock database for demo
const mockReviews: Record<string, Review[]> = {
  "1": [
    {
      id: "r1",
      author: "John Smith",
      content: "Great service and friendly staff!",
      rating: 5,
      date: "2023-12-15",
      platform: "google",
      businessId: "1",
    },
    {
      id: "r2",
      author: "Sarah Johnson",
      content: "Good selection but a bit pricey.",
      rating: 4,
      date: "2023-11-30",
      platform: "facebook",
      businessId: "1",
    },
    {
      id: "r3",
      author: "Mike Williams",
      content: "Average experience. Nothing special.",
      rating: 3,
      date: "2023-11-10",
      platform: "google",
      businessId: "1",
    },
  ],
  "2": [
    {
      id: "r4",
      author: "Emily Davis",
      content: "Great tech selection and knowledgeable staff.",
      rating: 5,
      date: "2023-12-05",
      platform: "google",
      businessId: "2",
    },
    {
      id: "r5",
      author: "Robert Johnson",
      content: "Prices are a bit high compared to online retailers.",
      rating: 3,
      date: "2023-11-22",
      platform: "facebook",
      businessId: "2",
    },
  ],
  "3": [
    {
      id: "r6",
      author: "Jessica Brown",
      content: "Amazing food and atmosphere!",
      rating: 5,
      date: "2023-12-18",
      platform: "google",
      businessId: "3",
    },
    {
      id: "r7",
      author: "David Miller",
      content: "Service was slow but the food was great.",
      rating: 4,
      date: "2023-12-02",
      platform: "facebook",
      businessId: "3",
    },
    {
      id: "r8",
      author: "Lisa Wilson",
      content: "Best restaurant in town!",
      rating: 5,
      date: "2023-11-29",
      platform: "google",
      businessId: "3",
    },
  ],
};

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
    if (!data.result || !data.result.reviews) {
      return [];
    }
    
    // Mapper les avis de Google dans notre format
    return data.result.reviews.map((review: any) => ({
      id: `google_${review.time}`, // Créer un ID unique
      author: review.author_name,
      content: review.text,
      rating: review.rating,
      date: new Date(review.time * 1000).toISOString(),
      platform: "google" as Platform,
      businessId: placeId,
      response: review.owner_response ? {
        content: review.owner_response.text,
        date: new Date(review.owner_response.time * 1000).toISOString()
      } : undefined
    }));
  } catch (error) {
    console.error("Error fetching Google reviews:", error);
    return [];
  }
}

// Fonction pour récupérer les avis de Facebook Graph API
async function fetchFacebookReviews(pageId: string): Promise<Review[]> {
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  if (!accessToken) {
    console.warn("Facebook access token not configured");
    return [];
  }

  try {
    // Construire l'URL de l'API Facebook Graph
    const url = `https://graph.facebook.com/v18.0/${pageId}/ratings?fields=reviewer{name},created_time,rating,review_text&access_token=${accessToken}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Facebook API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Vérifier si la réponse contient des avis
    if (!data.data || !Array.isArray(data.data)) {
      return [];
    }
    
    // Mapper les avis de Facebook dans notre format
    return data.data.map((review: any) => ({
      id: `fb_${review.id}`,
      author: review.reviewer?.name || "Anonymous",
      content: review.review_text || "",
      rating: review.rating,
      date: review.created_time,
      platform: "facebook" as Platform,
      businessId: pageId,
      response: undefined
    }));
  } catch (error) {
    console.error("Error fetching Facebook reviews:", error);
    return [];
  }
}

// Fonction pour récupérer les IDs des plateformes pour une entreprise
async function getBusinessPlatformIds(businessId: string) {
  // En production, ceci serait remplacé par une requête à la base de données
  // Pour l'exemple, nous utilisons des données mock
  const businessPlatforms: Record<string, { googlePlaceId?: string; facebookPageId?: string }> = {
    "1": {
      googlePlaceId: "ChIJN1t_tDeuEmsRUsoyG83frY4", // Exemple d'ID
      facebookPageId: "123456789", 
    },
    "2": {
      googlePlaceId: "ChIJP3Sa8ziYEmsRUKgyFmh9AQM",
      facebookPageId: "987654321",
    },
    "3": {
      googlePlaceId: "ChIJIQBpAG2ahYAR_6128GcTUEo",
      facebookPageId: "543216789",
    }
  };
  
  return businessPlatforms[businessId] || { googlePlaceId: undefined, facebookPageId: undefined };
}

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const businessId = context.params.id;
  
  try {
    // Récupérer les identifiants des plateformes pour cette entreprise
    const { googlePlaceId, facebookPageId } = await getBusinessPlatformIds(businessId);
    
    let allReviews: Review[] = [];
    
    // Mode production: essayer de récupérer des avis réels si les IDs sont disponibles
    if (googlePlaceId || facebookPageId) {
      const [googleReviews, facebookReviews] = await Promise.all([
        googlePlaceId ? fetchGoogleReviews(googlePlaceId) : [],
        facebookPageId ? fetchFacebookReviews(facebookPageId) : []
      ]);
      
      allReviews = [...googleReviews, ...facebookReviews];
    }
    
    // Si aucun avis réel n'a été trouvé ou en mode dev, utiliser les données mock
    if (allReviews.length === 0) {
      console.log("Using mock reviews data for business ID:", businessId);
      allReviews = mockReviews[businessId] || [];
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
    
    // Formater les critiques pour n'inclure que les informations demandées
    const formattedReviews = filteredReviews.map(review => {
      // Formater la date pour qu'elle soit plus lisible
      const formattedDate = new Date(review.date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      return {
        auteur: review.author,
        texte: review.content,
        note: review.rating,
        date: formattedDate,
        plateforme: review.platform === 'google' ? 'Google' : 'Facebook'
      };
    });
    
    return NextResponse.json(formattedReviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
