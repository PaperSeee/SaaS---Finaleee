import { NextRequest, NextResponse } from "next/server";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Review } from "@/lib/types";

// Données fictives pour les tests
const mockCompanies = {
  "1": { id: "1", name: "Café de Paris" },
  "2": { id: "2", name: "Tech Solutions" },
  "3": { id: "3", name: "Restaurant Méditerranéen" },
};

const mockReviews: Record<string, Review[]> = {
  "1": [
    {
      id: "r1",
      author: "Jean Dupont",
      content: "Excellent café et service agréable !",
      rating: 5,
      date: "2023-12-15",
      platform: "google",
      businessId: "1",
    },
    {
      id: "r2",
      author: "Marie Leroy",
      content: "Bon choix de pâtisseries mais un peu cher.",
      rating: 4,
      date: "2023-11-30",
      platform: "facebook",
      businessId: "1",
    },
    {
      id: "r3",
      author: "Michel Bernard",
      content: "Cadre agréable mais service lent.",
      rating: 3,
      date: "2023-11-10",
      platform: "google",
      businessId: "1",
    },
  ],
  "2": [
    {
      id: "r4",
      author: "Sophie Martin",
      content: "Techniciens très professionnels et rapides.",
      rating: 5,
      date: "2023-12-05",
      platform: "google",
      businessId: "2",
    },
    {
      id: "r5",
      author: "Thomas Petit",
      content: "Prix élevés par rapport à la concurrence.",
      rating: 3,
      date: "2023-11-22",
      platform: "facebook",
      businessId: "2",
    },
    {
      id: "r6",
      author: "Camille Dubois",
      content: "Service après-vente à améliorer.",
      rating: 2,
      date: "2023-10-18",
      platform: "trustpilot",
      businessId: "2",
    },
  ],
  "3": [
    {
      id: "r7",
      author: "Lucas Moreau",
      content: "Excellente cuisine méditerranéenne !",
      rating: 5,
      date: "2023-12-20",
      platform: "google",
      businessId: "3",
    },
    {
      id: "r8",
      author: "Emilie Roux",
      content: "Très bon mais l'attente était longue.",
      rating: 4,
      date: "2023-12-02",
      platform: "facebook",
      businessId: "3",
    },
  ],
};

export async function GET(
  request: NextRequest,
  { params }: { params: { companyId: string } }
) {
  try {
    const companyId = params.companyId;
    
    // Récupération de l'entreprise (en production, cela viendrait de Supabase)
    const company = mockCompanies[companyId];
    if (!company) {
      return NextResponse.json(
        { error: "Entreprise non trouvée" },
        { status: 404 }
      );
    }
    
    // Récupération des avis pour cette entreprise
    let reviews = mockReviews[companyId] || [];
    
    // Appliquer les filtres si fournis
    const { searchParams } = new URL(request.url);
    
    const platform = searchParams.get("platform");
    if (platform && platform !== "all") {
      reviews = reviews.filter((review) => review.platform === platform);
    }
    
    const rating = searchParams.get("rating");
    if (rating && parseInt(rating) > 0) {
      reviews = reviews.filter((review) => review.rating >= parseInt(rating));
    }
    
    const dateFrom = searchParams.get("dateFrom");
    if (dateFrom) {
      reviews = reviews.filter(
        (review) => new Date(review.date) >= new Date(dateFrom)
      );
    }
    
    const dateTo = searchParams.get("dateTo");
    if (dateTo) {
      reviews = reviews.filter(
        (review) => new Date(review.date) <= new Date(dateTo)
      );
    }
    
    // En production, vous remplaceriez cette logique avec un appel à Supabase
    // Exemple (commenté pour utiliser les données de test):
    /*
    const supabase = createClientComponentClient();
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('business_id', companyId)
      .order('date', { ascending: false });
    
    if (error) {
      console.error("Erreur Supabase:", error);
      return NextResponse.json(
        { error: "Erreur lors de la récupération des avis" },
        { status: 500 }
      );
    }
    */
    
    return NextResponse.json({
      companyName: company.name,
      reviews: reviews,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des avis:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des avis" },
      { status: 500 }
    );
  }
}
