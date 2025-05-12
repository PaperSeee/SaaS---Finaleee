/**
 * Utility functions for API-related operations
 */

/**
 * Validates a Google Places API key by making a simple request
 */
export async function validateGoogleApiKey(apiKey: string) {
  try {
    // Make a simple test request with minimal fields
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJN1t_tDeuEmsRUsoyG83frY4&fields=name&key=${apiKey}`
    );

    const data = await response.json();
    
    if (data.status === 'OK') {
      return { valid: true, message: 'API key is valid' };
    } else {
      return { 
        valid: false, 
        message: `API key validation failed: ${data.status}`,
        details: data.error_message || 'No error details provided'
      };
    }
  } catch (error) {
    return { 
      valid: false, 
      message: `API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Validates and cleans a Google Place ID
 */
export function validatePlaceId(placeId: string) {
  // Handle null or undefined cases
  if (!placeId) {
    return { 
      valid: false, 
      message: 'Place ID cannot be empty', 
      cleanedPlaceId: null 
    };
  }
  
  // Trim whitespace
  const cleanedPlaceId = placeId.trim();
  
  // Check if empty after trimming
  if (!cleanedPlaceId) {
    return { 
      valid: false, 
      message: 'Place ID cannot be empty', 
      cleanedPlaceId: null 
    };
  }
  
  // Basic format check (typically starts with "ChIJ" and is ~27 chars)
  // This is a simplified check - Google doesn't publish exact format specs
  if (cleanedPlaceId.length < 20) {
    // Too short to be valid
    return { 
      valid: false, 
      message: 'Place ID too short (should be approximately 27 characters)', 
      cleanedPlaceId 
    };
  }
  
  // Most place IDs begin with "ChIJ" or "Eh" or are in hex format
  const isStandardFormat = cleanedPlaceId.startsWith('ChIJ') || cleanedPlaceId.startsWith('Eh');
  const isHexFormat = cleanedPlaceId.startsWith('0x') && cleanedPlaceId.includes(':');
  
  if (!isStandardFormat && !isHexFormat && cleanedPlaceId.length < 27) {
    return { 
      valid: false, 
      message: 'Place ID has an unusual format', 
      cleanedPlaceId 
    };
  }
  
  // Accept the ID if it meets our relaxed criteria
  return { 
    valid: true, 
    message: 'Format appears valid', 
    cleanedPlaceId 
  };
}

/**
 * Safely parse JSON from a response, handling errors and already read bodies
 */
export async function safeJsonParse(response: Response) {
  try {
    return await response.json();
  } catch (error) {
    console.error('Error parsing JSON from response:', error);
    return { error: 'Failed to parse response body' };
  }
}

/**
 * Extract Place ID from a Google Maps URL
 * This handles various Google Maps URL formats
 */
export function extractPlaceIdFromUrl(url: string): string | null {
  if (!url) return null;
  
  try {
    // Handle canonical place URLs format
    // https://maps.google.com/maps/place?cid=12345
    const cidMatch = url.match(/[?&]cid=([^&]+)/);
    if (cidMatch && cidMatch[1]) {
      return `ChIJ${cidMatch[1]}`; // Not guaranteed format, needs validation
    }
    
    // Handle maps.google.com/maps?q=... format
    const qMatch = url.match(/maps\?q=([^&]+)/);
    if (qMatch && qMatch[1]) {
      // This is just a search query, not a place ID
      return null;
    }
    
    // Handle place_id parameter in URL
    const placeIdMatch = url.match(/[?&]place_id=([^&]+)/);
    if (placeIdMatch && placeIdMatch[1]) {
      return decodeURIComponent(placeIdMatch[1]);
    }
    
    // Handle maps.app.goo.gl shortened URLs
    // These require expanding the URL first
    if (url.includes('goo.gl/maps') || url.includes('maps.app.goo.gl')) {
      // We would need to make a request to expand this URL
      return null; // To expand, you would need an async function
    }
    
    // Handle '/maps/place/' path format
    // https://www.google.com/maps/place/.../@-33.8,151.2,17z/data=!3m1!...
    if (url.includes('/maps/place/')) {
      // This URL format doesn't directly expose the place ID
      // Would need to use the Places API to look it up by name/location
      return null;
    }

    return null;
  } catch (error) {
    console.error('Error extracting Place ID from URL:', error);
    return null;
  }
}
