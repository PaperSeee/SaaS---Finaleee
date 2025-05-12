import { NextRequest, NextResponse } from "next/server";
import { Platform } from "@/lib/types";

interface ReplyRequestBody {
  reviewId: string;
  platform: Platform;
  message: string;
  businessId?: string;
}

// Update the error type to be more specific instead of using ApiError
interface GoogleApiError extends Error {
  message: string;
  code?: string;
  status?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: ReplyRequestBody = await request.json();
    const { reviewId, platform, message, businessId } = body;

    // Validate request
    if (!reviewId || !platform || !message) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Missing required fields: reviewId, platform, and message are required" 
        },
        { status: 400 }
      );
    }

    // Handle Google reviews
    if (platform === "google") {
      try {
        // Check if Google API access is available
        const apiKey = process.env.GOOGLE_MY_BUSINESS_API_KEY;
        const accountId = process.env.GOOGLE_MY_BUSINESS_ACCOUNT_ID;
        const locationId = process.env.GOOGLE_MY_BUSINESS_LOCATION_ID || 
                          (businessId ? `locations/${businessId}` : null);
        
        if (!apiKey || !accountId || !locationId) {
          // Return manual reply link if API key is not available
          return NextResponse.json({
            success: false,
            fallbackUrl: `https://business.google.com/reviews/l/${businessId || ''}`,
            message: "Google API configuration incomplete. Please use the fallback link to reply manually."
          });
        }

        // Call the Google My Business API with the exact endpoint format provided
        const url = `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews/${reviewId}/reply`;
        
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ comment: message })
        });

        if (!response.ok) {
          throw new Error(`Google API error: ${response.status} ${await response.text()}`);
        }

        const data = await response.json();

        return NextResponse.json({
          success: true,
          message: "Reply submitted successfully to Google review",
          data
        });
      } catch (error: any) {
        console.error("Error replying to Google review:", error);
        const msg = (error as Error).message || "Failed to send reply to Google review";
        return NextResponse.json({
          success: false,
          fallbackUrl: `https://business.google.com/reviews/l/${businessId || ''}`,
          error: msg
        }, { status: 500 });
      }
    }
    
    // Handle Facebook reviews
    if (platform === "facebook") {
      try {
        // Check if Facebook access token exists
        const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
        if (!accessToken) {
          // Return manual reply link if access token is not available
          return NextResponse.json({
            success: false,
            fallbackUrl: `https://business.facebook.com/${businessId || ''}/reviews`,
            message: "Facebook page access token not configured. Please use the fallback link to reply manually."
          });
        }

        // Using the Facebook Graph API endpoint format provided
        const url = `https://graph.facebook.com/v19.0/${reviewId}/comments?access_token=${accessToken}`;
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message })
        });

        if (!response.ok) {
          throw new Error(`Facebook API error: ${response.status} ${await response.text()}`);
        }

        const data = await response.json();

        return NextResponse.json({
          success: true,
          message: "Reply submitted successfully to Facebook review",
          data
        });
      } catch (error: any) {
        console.error("Error replying to Facebook review:", error);
        return NextResponse.json(
          {
            success: false,
            fallbackUrl: `https://business.facebook.com/${businessId || ''}/reviews`,
            error: error.message || "Failed to send reply to Facebook review"
          },
          { status: 500 }
        );
      }
    }

    // Handle unsupported platforms
    return NextResponse.json(
      { 
        success: false, 
        error: `Platform '${platform}' is not supported` 
      },
      { status: 400 }
    );

  } catch (error: any) {
    console.error("Error processing review reply:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to process review reply" 
      },
      { status: 500 }
    );
  }
}
