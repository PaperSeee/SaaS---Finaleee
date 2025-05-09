import { NextRequest, NextResponse } from "next/server";
import type { Review } from "@/lib/types";

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

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const businessId = context.params.id;
  
  // Get reviews for the business
  const reviews = mockReviews[businessId] || [];
  
  // Parse URL for query parameters
  const { searchParams } = new URL(request.url);
  
  // Apply filters if provided
  let filteredReviews = [...reviews];
  
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
  
  return NextResponse.json(filteredReviews);
}
