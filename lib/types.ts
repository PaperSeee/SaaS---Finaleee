// Business Types
export interface Business {
  id: string;
  name: string;
  reviewCount: number;
  averageRating: number;
  googleUrl?: string;
  facebookUrl?: string;
}

// Review Types
export type Platform = "google" | "facebook";

export interface Review {
  id: string;
  author: string;
  content: string;
  rating: number; // 1-5
  date: string;
  platform: Platform;
  businessId: string;
  response?: {
    content: string;
    date: string;
  };
  // Nouveaux champs pour Google Reviews
  profilePhoto?: string;
  language?: string;
  relativeTimeDescription?: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  businesses?: string[]; // Business IDs
}
