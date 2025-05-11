import { NextRequest, NextResponse } from 'next/server';
import { validateGoogleApiKey } from '@/lib/apiUtils';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        status: 'error',
        message: 'Google Places API key not configured',
        details: {
          defined: false,
          infoMessage: 'Please add NEXT_PUBLIC_GOOGLE_PLACES_API_KEY to your environment variables'
        }
      }, { status: 500 });
    }
    
    // Get information about the API key without exposing it
    const keyInfo = {
      defined: true,
      length: apiKey.length,
      firstChars: apiKey.substring(0, 4) + '...',
      lastChars: '...' + apiKey.substring(apiKey.length - 4),
      environment: process.env.NODE_ENV,
    };
    
    // Basic validation of key structure
    const keyFormatValid = apiKey.startsWith('AIza');
    
    // Check if the key works by making a simple request
    const validation = await validateGoogleApiKey(apiKey);
    
    return NextResponse.json({
      status: validation.valid ? 'ok' : 'error',
      keyInfo,
      keyFormatValid,
      validation,
    });
    
  } catch (error) {
    console.error('Error in API debug endpoint:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
