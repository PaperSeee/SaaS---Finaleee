// Business Types
export interface Business {
  id?: string;
  name: string;
  reviewCount: number;
  averageRating: number;
  googleUrl?: string;
  facebookUrl?: string;
  placeId: string;  // Make this non-optional to ensure it's always defined (empty string if null)
  placeIdVerified?: boolean; // Add a flag to indicate if the Place ID has been verified
  rating?: number; // Allow rating field for compatibility
}

// Review Types
export type Platform = 'google' | 'facebook' | 'trustpilot' | 'yelp';

export type SortOption = "date_desc" | "date_asc" | "rating_desc" | "rating_asc";

export interface FilterOptions {
  platform: Platform | "all";
  rating: number;
  dateFrom: string;
  dateTo: string;
  sortBy: SortOption;
  hasResponse: boolean | null;
}

export interface Review {
  id: string;
  author: string;
  content: string;
  rating: number; // 1-5
  date: string;
  platform: Platform;
  businessId: string;
  profilePhoto?: string;
  language?: string;
  relativeTimeDescription?: string;
  response?: {
    content: string;
    date: string;
  };
}

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  businesses?: string[]; // Business IDs
}
