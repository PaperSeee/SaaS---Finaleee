import { NextRequest, NextResponse } from "next/server";
import type { Business } from "@/lib/types";

// Mock database for demo
const businesses: Business[] = [
  { id: "1", name: "Coffee Shop", reviewCount: 12, averageRating: 4.2, placeId: "ChIJxxxxxxx1" },
  { id: "2", name: "Tech Store", reviewCount: 47, averageRating: 3.8, placeId: "ChIJxxxxxxx2" },
  { id: "3", name: "Restaurant", reviewCount: 86, averageRating: 4.5, placeId: "ChIJxxxxxxx3" },
];

export async function GET() {
  return NextResponse.json(businesses);
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name) {
      return NextResponse.json(
        { error: "Business name is required" },
        { status: 400 }
      );
    }
    
    // Create new business
    const newBusiness: Business = {
      id: Date.now().toString(), // Simple ID generation
      name: data.name,
      reviewCount: 0,
      averageRating: 0,
      googleUrl: data.googleUrl,
      facebookUrl: data.facebookUrl,
      placeId: data.placeId || "", // Add placeId property, empty string if not provided
    };
    
    // Add to "database"
    businesses.push(newBusiness);
    
    return NextResponse.json(newBusiness, { status: 201 });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to create business" },
      { status: 500 }
    );
  }
}
