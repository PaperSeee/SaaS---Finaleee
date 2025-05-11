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
 * Validates a Place ID format
 */
export function validatePlaceId(placeId: string): {
  valid: boolean;
  message?: string;
  cleanedPlaceId?: string;
} {
  if (!placeId) {
    return { valid: false, message: "Place ID is empty" };
  }
  
  // Trim whitespace
  let cleaned = placeId.trim();
  
  // Remove quotes and backslashes
  cleaned = cleaned.replace(/['"\\]/g, '');
  
  // Remove any URL fragments if present
  if (cleaned.includes('?') || cleaned.includes('#')) {
    cleaned = cleaned.split(/[?#]/)[0];
  }
  
  // Check if it matches the expected format after cleaning
  if (!/^[a-zA-Z0-9_\-:]+$/.test(cleaned)) {
    return { 
      valid: false, 
      message: "Place ID contains invalid characters",
      cleanedPlaceId: cleaned.replace(/[^a-zA-Z0-9_\-:]/g, '')
    };
  }
  
  // Most Google Place IDs start with 'ChI' or '0x'
  // Format 1: ChIJ... (base64-like encoding)
  // Format 2: 0x... (hexadecimal encoding)
  const isCommonFormat = (cleaned.startsWith('ChI') || cleaned.startsWith('0x'));
  if (!isCommonFormat) {
    return { 
      valid: true, 
      message: "Warning: Place ID format is unusual but acceptable",
      cleanedPlaceId: cleaned
    };
  }
  
  // Additional validation for length
  // ChIJ... format is typically around 27 characters
  // 0x... format is typically 0x[16 chars]:0x[16 chars]
  if (cleaned.startsWith('ChI') && cleaned.length < 20) {
    return {
      valid: false,
      message: "Place ID with ChI prefix seems too short",
      cleanedPlaceId: cleaned
    };
  }
  
  if (cleaned.startsWith('0x') && !cleaned.includes(':0x')) {
    return {
      valid: false,
      message: "Hexadecimal Place ID is missing expected format with :0x",
      cleanedPlaceId: cleaned
    };
  }
  
  return { valid: true, cleanedPlaceId: cleaned };
}

/**
 * Safely parse JSON response with error handling
 */
export async function safeJsonParse(response: Response): Promise<any> {
  try {
    return await response.json();
  } catch (error) {
    console.error("Failed to parse response as JSON:", error);
    
    try {
      // Try to get the response as text if JSON parsing fails
      const textContent = await response.text();
      console.error("Response content:", textContent);
      return { error: "Invalid JSON response", text: textContent };
    } catch (textError) {
      console.error("Could not read response as text either:", textError);
      return { error: "Unable to read response body" };
    }
  }
}
