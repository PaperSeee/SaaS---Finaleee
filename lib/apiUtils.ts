/**
 * Utility functions for API-related operations
 */

/**
 * Validates a Google Places API key by making a simple request
 */
export async function validateGoogleApiKey(apiKey: string): Promise<{
  valid: boolean;
  message?: string;
}> {
  try {
    // Make a simple request to validate the API key
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJN1t_tDeuEmsRUsoyG83frY4&fields=name&key=${apiKey}`
    );
    
    const data = await response.json();
    
    if (data.status === "OK") {
      return { valid: true };
    } else if (data.status === "REQUEST_DENIED") {
      return { 
        valid: false, 
        message: `API key invalid: ${data.error_message || 'No error message provided'}` 
      };
    } else {
      return { 
        valid: false, 
        message: `API validation failed: ${data.status} - ${data.error_message || 'Unknown error'}` 
      };
    }
  } catch (error) {
    return { 
      valid: false, 
      message: `API validation request failed: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}

/**
 * Validates a Google Place ID format
 * 
 * @param placeId - The Place ID to validate
 * @returns An object with validation results
 */
export function validatePlaceId(placeId: string): { 
  valid: boolean; 
  cleanedPlaceId: string | null;
  message?: string;
} {
  if (!placeId) {
    return {
      valid: false,
      cleanedPlaceId: null,
      message: "Place ID is empty"
    };
  }

  // Trim the Place ID and remove any surrounding quotes
  const trimmedId = placeId.trim().replace(/^["']|["']$/g, '');
  
  if (trimmedId.length < 4) {
    return {
      valid: false,
      cleanedPlaceId: null,
      message: "Place ID too short"
    };
  }

  // Check for ChIJ prefixed IDs (typical format)
  if (trimmedId.startsWith('ChIJ') && trimmedId.length >= 25) {
    return {
      valid: true,
      cleanedPlaceId: trimmedId
    };
  }
  
  // Check for 0x hex format: e.g. 0x1234:0x5678
  if (trimmedId.includes(':') && trimmedId.startsWith('0x')) {
    return {
      valid: true,
      cleanedPlaceId: trimmedId
    };
  }

  // If it's not in a recognized format but still seems reasonable length
  if (trimmedId.length >= 25) {
    return {
      valid: true,
      cleanedPlaceId: trimmedId,
      message: "Format not recognized but length seems appropriate"
    };
  }

  return {
    valid: false,
    cleanedPlaceId: trimmedId,
    message: "Place ID format not recognized"
  };
}

/**
 * Safely parse JSON from a Response object to avoid "body stream already read" errors
 * 
 * @param response - The fetch Response object
 * @returns Parsed JSON data
 */
export async function safeJsonParse(response: Response): Promise<any> {
  try {
    // Clone the response to avoid "body stream already read" errors
    const clonedResponse = response.clone();
    return await clonedResponse.json();
  } catch (error) {
    console.error("Error parsing response JSON:", error);
    return { error: "Failed to parse response" };
  }
}
