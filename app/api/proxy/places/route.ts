import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the URL parameter
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');
    
    if (!url) {
      return NextResponse.json(
        { error: "Missing url parameter" },
        { status: 400 }
      );
    }
    
    // Validate that the URL is for Google Maps API
    if (!url.startsWith('https://maps.googleapis.com/')) {
      return NextResponse.json(
        { error: "Invalid API URL" },
        { status: 400 }
      );
    }
    
    // Forward the request to Google Places API
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    // Get the response data
    const data = await response.json();
    
    // Return the response
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("Error in proxy API:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request", message: (error as Error).message },
      { status: 500 }
    );
  }
}
