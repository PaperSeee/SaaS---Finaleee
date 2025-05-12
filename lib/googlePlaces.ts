/**
 * Utility functions for interacting with Google Places API
 */

import { validatePlaceId as validatePlaceIdApi } from "./apiUtils";

/**
 * Vérifie et valide un Place ID Google ou recherche le Place ID correspondant à un nom d'entreprise
 * 
 * @param input - Le Place ID à valider ou le nom de l'entreprise à rechercher
 * @returns Promise resolving to the place_id or null if not found
 */
export async function getPlaceId(input: string): Promise<string | null> {
  try {
    if (!input || !input.trim()) {
      return null;
    }
    
    const trimmedInput = input.trim();
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    
    if (!apiKey) {
      console.error("Google Places API key not found in environment variables");
      return null;
    }
    
    // Vérifier si l'input ressemble à un Place ID
    // Les Place ID Google commencent généralement par "ChI" ou "0x"
    if (trimmedInput.startsWith("ChI") || trimmedInput.startsWith("0x")) {
      // Valider le format du Place ID
      const { valid, cleanedPlaceId } = validatePlaceId(trimmedInput);
      
      if (valid && cleanedPlaceId) {
        console.log("Input a été reconnu comme un Place ID valide:", cleanedPlaceId);
        return cleanedPlaceId;
      }
    }
    
    // Si ce n'est pas un Place ID valide, considérer comme un nom d'entreprise
    console.log("Input considéré comme un nom d'entreprise, recherche du Place ID...");
    
    // Create the Google Places API URL
    const url = new URL(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?` +
      `input=${encodeURIComponent(trimmedInput)}` +
      `&inputtype=textquery` +
      `&fields=place_id,formatted_address,name` +
      `&key=${apiKey}`
    );

    // Using the proxy to avoid CORS issues
    const response = await fetch(`/api/proxy/places?url=${encodeURIComponent(url.toString())}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status !== "OK" || !data.candidates || data.candidates.length === 0) {
      console.log(`No places found for "${trimmedInput}"`);
      return null;
    }
    
    return data.candidates[0].place_id;
  } catch (error) {
    console.error("Error fetching place ID:", error);
    return null;
  }
}

/**
 * Extraits le Place ID d'une URL Google Maps si possible
 * 
 * @param url - The Google Maps URL
 * @returns The extracted place_id or null if not found
 */
export function extractPlaceIdFromUrl(url: string): string | null {
  try {
    if (!url) return null;
    
    const urlStr = url.trim();
    let placeId: string | null = null;
    
    // Format 1: !1s0x12345... ou !1sChIJ...
    const match1 = urlStr.match(/!1s([0-9a-zA-Z_-]+)/);
    if (match1 && match1[1]) {
      placeId = match1[1];
    }
    
    // Format 2: ?q=...&ftid=0x12345...
    if (!placeId) {
      const match2 = urlStr.match(/[?&]ftid=([^&]+)/);
      if (match2 && match2[1]) {
        placeId = match2[1];
      }
    }
    
    // Format 3: ...0x12345:0x67890... (hex format)
    if (!placeId) {
      const match3 = urlStr.match(/0x[0-9a-fA-F]{16}:0x[0-9a-fA-F]{16}/);
      if (match3) {
        placeId = match3[0];
      }
    }
    
    // Format 4: ...maps/place/.../@...data=!...!3m1!...!4m...!3m...!1s0x12345...!2s
    if (!placeId) {
      const match4 = urlStr.match(/!1s([^!]+)/);
      if (match4 && match4[1]) {
        placeId = match4[1];
      }
    }
    
    // Nettoyage supplémentaire du Place ID
    if (placeId) {
      // Supprimer les paramètres supplémentaires si présents
      placeId = placeId.split('?')[0];
      
      // Vérifier et nettoyer le format
      const { valid, cleanedPlaceId } = validatePlaceIdApi(placeId!);
      if (valid && cleanedPlaceId) {
        return cleanedPlaceId;
      }
    }
    
    return placeId;
  } catch (e) {
    console.error("Error extracting place ID from URL:", e);
    return null;
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
 * Extrait un nom d'entreprise d'une URL Google Maps si possible
 * 
 * @param url - The Google Maps URL
 * @returns The extracted business name or null if not found
 */
export function extractBusinessNameFromUrl(url: string): string | null {
  try {
    // Extract the part after /place/ and before the next /
    const placeMatch = url.match(/\/place\/([^\/]+)/);
    if (placeMatch && placeMatch[1]) {
      // Convert plus signs back to spaces and decode URL entities
      return decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
    }
    return null;
  } catch (e) {
    console.error("Error extracting business name from URL:", e);
    return null;
  }
}
