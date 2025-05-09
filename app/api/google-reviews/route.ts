import { NextRequest, NextResponse } from 'next/server';
import { Review } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    // Récupérer les paramètres de la requête
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get('placeId');
    const preview = searchParams.get('preview') === 'true';

    if (!placeId) {
      return NextResponse.json({ error: 'place_id est requis' }, { status: 400 });
    }

    // Récupérer la clé API Google Places depuis les variables d'environnement
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    
    if (!apiKey) {
      console.error('Clé API Google Places non configurée');
      return NextResponse.json(
        { error: 'Configuration serveur incorrecte. GOOGLE_PLACES_API_KEY manquante.' },
        { status: 500 }
      );
    }

    console.log(`Récupération des avis pour le place_id: ${placeId}`);

    // Construire l'URL de l'API Google Places Details
    const fields = preview 
      ? 'name,rating,user_ratings_total'
      : 'name,rating,user_ratings_total,reviews';
    
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&language=fr&key=${apiKey}`;
    
    // Appel à l'API Google Places
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Google API a répondu avec le statut : ${response.status}`);
      return NextResponse.json(
        { error: `Google API a répondu avec le statut : ${response.status}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    if (data.status !== 'OK') {
      console.error('Erreur API Google:', data);
      return NextResponse.json(
        { 
          error: `Erreur API Google Places: ${data.status}`,
          message: data.error_message || 'Aucun détail disponible'
        },
        { status: 400 }
      );
    }

    // Extraire les informations de base du lieu
    const result = data.result || {};
    const businessInfo = {
      name: result.name || '',
      rating: result.rating || 0,
      reviewCount: result.user_ratings_total || 0
    };

    // Si c'est juste un aperçu, ne pas récupérer tous les avis
    if (preview) {
      return NextResponse.json({ business: businessInfo });
    }

    // Convertir les avis Google au format attendu par l'application
    const reviews: Review[] = (result.reviews || []).map((review: any) => ({
      id: `google_${review.time}`,
      author: review.author_name,
      content: review.text || '',
      rating: review.rating,
      date: new Date(review.time * 1000).toISOString(),
      platform: 'google',
      businessId: placeId,
      profilePhoto: review.profile_photo_url,
      relativeTimeDescription: review.relative_time_description,
      language: review.language
    }));

    return NextResponse.json({
      business: businessInfo,
      reviews: reviews
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des avis Google:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur inconnue' },
      { status: 500 }
    );
  }
}
