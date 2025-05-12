import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Review, Platform } from "@/lib/types";

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

// Replace 'any' with proper interface

export async function GET(
  request: NextRequest,
  { params }: { params: { companyId: string } }
) {
  try {
    const companyId = params.companyId;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!apiKey || !supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Missing configuration (API key or Supabase)" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("name, place_id")
      .eq("id", companyId)
      .single();

    if (companyError || !company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    if (!company.place_id) {
      return NextResponse.json({
        companyName: company.name,
        reviews: [],
        message: "No Google Place ID associated with this company",
      });
    }

    const googleApiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
      company.place_id
    )}&fields=name,rating,reviews&key=${apiKey}`;

    const response = await fetch(googleApiUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch reviews from Google API" },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.status !== "OK" || !data.result) {
      return NextResponse.json({
        companyName: company.name,
        reviews: [],
        message: `Invalid response from Google API: ${data.status}`,
      });
    }

    let reviews: Review[] = [];

    if (Array.isArray(data.result.reviews)) {
      reviews = data.result.reviews.map((googleReview: GooglePlacesReview) => {
        const reviewDate = new Date(googleReview.time * 1000);
        return {
          id: `google_${googleReview.time}_${Math.random()
            .toString(36)
            .substring(2, 10)}`,
          author: googleReview.author_name,
          content: googleReview.text || "",
          rating: googleReview.rating,
          date: reviewDate.toISOString(),
          platform: "google" as Platform,
          businessId: companyId,
          profilePhoto: googleReview.profile_photo_url,
          language: googleReview.language || "en",
          relativeTimeDescription:
            googleReview.relative_time_description || "",
          response: googleReview.author_reply
            ? {
                content: googleReview.author_reply.text || "",
                date: new Date(
                  googleReview.author_reply.time * 1000
                ).toISOString(),
              }
            : undefined,
        };
      });
    }

    const { searchParams } = new URL(request.url);

    const platform = searchParams.get("platform");
    if (platform && platform !== "all") {
      reviews = reviews.filter((review) => review.platform === platform);
    }

    const rating = searchParams.get("rating");
    if (rating) {
      const ratingValue = parseInt(rating);
      reviews = reviews.filter((review) => review.rating === ratingValue);
    }

    const dateFrom = searchParams.get("dateFrom");
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      reviews = reviews.filter(
        (review) => new Date(review.date) >= fromDate
      );
    }

    const dateTo = searchParams.get("dateTo");
    if (dateTo) {
      const toDate = new Date(dateTo);
      reviews = reviews.filter(
        (review) => new Date(review.date) <= toDate
      );
    }

    reviews.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json({
      companyName: company.name,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Error fetching reviews" },
      { status: 500 }
    );
  }
}
