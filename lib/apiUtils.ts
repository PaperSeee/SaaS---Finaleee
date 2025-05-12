/**
 * Utility functions for API-related operations
 */

/**
 * Validates a Google Places API key by making a simple request
 */
export async function validateGoogleApiKey(apiKey: string) {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJN1t_tDeuEmsRUsoyG83frY4&fields=name&key=${apiKey}`
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        valid: false,
        error: errorData.error_message || response.statusText
      };
    }
    
    const data = await response.json();
    
    if (data.status === 'OK') {
      return { valid: true };
    } else {
      return {
        valid: false,
        error: data.error_message || 'Invalid API key'
      };
    }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
}

/**
 * Validates and cleans a Google Place ID
 */
export function validatePlaceId(placeId: string | null): {
  valid: boolean;
  message?: string;
  cleanedPlaceId?: string;
} {
  if (!placeId) {
    return { valid: false, message: "Place ID is null or empty" };
  }
  
  // Trim whitespace
  const cleaned = placeId.trim();
  
  if (cleaned.length === 0) {
    return { valid: false, message: "Place ID is empty after trimming" };
  }
  
  // Check for common formatting issues
  if (cleaned.includes(" ")) {
    return {
      valid: false,
      message: "Place ID contains spaces",
      cleanedPlaceId: cleaned.replace(/\s+/g, "")
    };
  }
  
  // Most valid Place IDs are at least 20 characters
  if (cleaned.length < 20) {
    return {
      valid: false,
      message: "Place ID seems too short to be valid",
      cleanedPlaceId: cleaned
    };
  }
  
  return { valid: true, cleanedPlaceId: cleaned };
}

/**
 * Safely parse JSON from a response, handling potential errors
 */
export async function safeJsonParse(response: Response): Promise<any> {
  try {
    return await response.json();
  } catch (e) {
    console.error("Error parsing JSON response:", e);
    const text = await response.text();
    console.error("Response text:", text);
    return { error: "Invalid JSON response", text };
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
