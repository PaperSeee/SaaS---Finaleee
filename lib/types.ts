// Business Types
export interface Business {
  id: string;
  name: string;
  reviewCount?: number;
  averageRating?: number;
  placeId?: string;
  googleUrl?: string;
  facebookUrl?: string;
  user_id?: string;
  facebookPageId?: string;
  facebookPageName?: string;
  facebookPageAccessToken?: string;
}

// Review Types
export type Platform = 'google' | 'facebook' | 'trustpilot' | 'yelp';

// Platform-specific configuration and requirements
export interface PlatformConfig {
  name: string;
  color: string; // For UI styling
  icon: string;  // Icon identifier
  idFieldName: string; // What the ID field is called (e.g., "Place ID" for Google)
  idPattern?: RegExp; // Regex pattern for validation if available
  idRequired: boolean;
}

export const PLATFORM_CONFIGS: Record<Platform, PlatformConfig> = {
  google: {
    name: "Google Business",
    color: "blue",
    icon: "google",
    idFieldName: "Place ID",
    idPattern: /^Ch[A-Za-z0-9_-]{10,}$/,
    idRequired: true
  },
  facebook: {
    name: "Facebook",
    color: "indigo",
    icon: "facebook",
    idFieldName: "Page ID",
    idRequired: false
  },
  trustpilot: {
    name: "Trustpilot",
    color: "green",
    icon: "trustpilot",
    idFieldName: "Business ID",
    idRequired: false
  },
  yelp: {
    name: "Yelp",
    color: "red",
    icon: "yelp",
    idFieldName: "Business ID",
    idRequired: false
  }
};

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

// Add the Language type that LanguageSelector.tsx is trying to import
export type Language = "en" | "fr" | "nl";

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  businesses?: string[]; // Business IDs
}
