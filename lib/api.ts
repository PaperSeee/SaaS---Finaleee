import { Business, Review } from "./types";

// API client functions to interact with backend
export const api = {
  // Business endpoints
  businesses: {
    list: async (): Promise<Business[]> => {
      const res = await fetch('/api/businesses', { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!res.ok) throw new Error('Failed to fetch businesses');
      
      const data = await res.json();
      return data.businesses || [];
    },
    
    get: async (id: string): Promise<Business> => {
      const res = await fetch(`/api/businesses/${id}`);
      if (!res.ok) throw new Error(`Failed to fetch business ${id}`);
      return res.json();
    },
    
    create: async (data: Partial<Business>): Promise<Business> => {
      const res = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create business');
      return res.json();
    },
  },
  
  // Reviews endpoints
  reviews: {
    list: async (
      businessId: string,
      filters?: {
        platform?: string;
        rating?: number;
        dateFrom?: string;
        dateTo?: string;
        sortBy?: string;
        hasResponse?: boolean | null;
      }
    ): Promise<Review[]> => {
      // Construct query params
      const params = new URLSearchParams();
      if (filters?.platform) params.append('platform', filters.platform);
      if (filters?.rating) params.append('rating', filters.rating.toString());
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      
      // extract hasResponse safely
      const hasResponse = filters?.hasResponse;
      if (hasResponse != null) {
        params.append('hasResponse', hasResponse.toString());
      }
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      
      try {
        const res = await fetch(`/api/businesses/${businessId}/reviews${queryString}`);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error(`API error (${res.status}):`, errorText);
          throw new Error(`Failed to fetch reviews: ${res.statusText}`);
        }
        
        const data = await res.json();
        return data.reviews || [];
      } catch (error) {
        console.error(`Error fetching reviews for business ${businessId}:`, error);
        throw error;
      }
    },
    
    respond: async (
      businessId: string,
      reviewId: string,
      response: string
    ): Promise<Review> => {
      const res = await fetch(`/api/businesses/${businessId}/reviews/${reviewId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: response })
      });
      if (!res.ok) throw new Error('Failed to submit response');
      return res.json();
    }
  }
};
