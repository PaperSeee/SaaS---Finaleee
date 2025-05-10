import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { Review, Platform } from "@/lib/types";

async function fetchGoogleReviews(placeId, apiKey): Promise<Review[]> {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}`;
  const response = await fetch(url);

  if (!response.ok) return [];

  const data = await response.json();
  if (data.status !== "OK" || !data.result?.reviews) return [];

  return data.result.reviews.map((review) => ({
    id: `google_${review.time}`,
    author: review.author_name,
    content: review.text || '',
    rating: review.rating,
    date: new Date(review.time * 1000).toISOString(),
    platform: "google",
    businessId: placeId,
    response: review.author_reply
      ? {
          content: review.author_reply.text || '',
          date: new Date(review.author_reply.time * 1000).toISOString(),
        }
      : undefined,
    profilePhoto: review.profile_photo_url,
  }));
}

async function getBusinessPlatformIds(businessId) {
  const supabase = createServerClient({ cookies });
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
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const { googlePlaceId } = await getBusinessPlatformIds(businessId);
    let allReviews = [];
    let businessInfo = { name: "", rating: 0, reviewCount: 0 };

    if (googlePlaceId) {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${googlePlaceId}&fields=name,rating,user_ratings_total,reviews&key=${apiKey}`;
      const res = await fetch(url);

      if (res.ok) {
        const data = await res.json();

        if (data.status === "OK" && data.result) {
          businessInfo = {
            name: data.result.name || "",
            rating: data.result.rating || 0,
            reviewCount: data.result.user_ratings_total || 0,
          };

          if (data.result.reviews) {
            allReviews = await fetchGoogleReviews(googlePlaceId, apiKey);
          }
        }
      }
    }

    const { searchParams } = new URL(req.url);
    let filteredReviews = [...allReviews];

    const platform = searchParams.get("platform");
    if (platform && platform !== "all") {
      filteredReviews = filteredReviews.filter(r => r.platform === platform);
    }

    const rating = searchParams.get("rating");
    if (rating) {
      filteredReviews = filteredReviews.filter(r => r.rating === parseInt(rating));
    }

    const dateFrom = searchParams.get("dateFrom");
    if (dateFrom) {
      filteredReviews = filteredReviews.filter(r => new Date(r.date) >= new Date(dateFrom));
    }

    const dateTo = searchParams.get("dateTo");
    if (dateTo) {
      filteredReviews = filteredReviews.filter(r => new Date(r.date) <= new Date(dateTo));
    }

    filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date));

    return NextResponse.json({
      business: businessInfo,
      reviews: filteredReviews,
    });
  } catch (err) {
    console.error("Handler error:", err);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
