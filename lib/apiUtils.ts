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
export function validatePlaceId(placeId: string | null | undefined): { 
  valid: boolean; 
  message?: string;
  cleanedPlaceId?: string;
} {
  if (!placeId) {
    return { valid: false, message: "Place ID is required" };
  }
  
  const trimmedPlaceId = placeId.trim();
  
  if (!trimmedPlaceId) {
    return { valid: false, message: "Place ID cannot be empty" };
  }
  
  // Google Place IDs typically start with ChI and are alphanumeric with some special chars
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmedPlaceId)) {
    return { 
      valid: false, 
      message: "Place ID contains invalid characters",
      cleanedPlaceId: trimmedPlaceId.replace(/[^a-zA-Z0-9_-]/g, '')
    };
  }
  
  return { valid: true, cleanedPlaceId: trimmedPlaceId };
}

/**
 * Safely parse JSON from a response, handling errors and already read bodies
 */
export async function safeJsonParse(response: Response) {
  try {
    return await response.json();
  } catch (error) {
    console.error("Error parsing JSON response:", error);
    return { error: "Invalid JSON response" };
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

/**
 * Extract useful error information from various error objects
 */
export function extractErrorMessage(error: any): string {
  if (!error) {
    return "An unknown error occurred";
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  // Handle Supabase errors
  if (error.message) {
    return error.message;
  } else if (error.error_description) {
    return error.error_description;
  } else if (error.details) {
    return error.details;
  } else if (error.code) {
    return `Error code: ${error.code}`;
  }
  
  try {
    return JSON.stringify(error, Object.getOwnPropertyNames(error));
  } catch (e) {
    return "Error could not be serialized";
  }
}
