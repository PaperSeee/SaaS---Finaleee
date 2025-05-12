'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Review {
  id: string;
  title: string;
  content: string;
  rating: number;
  author: string;
  date: string;
  platform: string;
}

export default function ReviewsPage() {
  const params = useParams();
  const companyId = params.companyId as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  
  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch(`/api/reviews/${companyId}`, {
          cache: 'no-store'
        });
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setReviews(data.reviews || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching reviews');
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchReviews();
  }, [companyId]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <p className="font-medium">Error loading reviews</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }
  
  if (reviews.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 text-gray-700 p-6 rounded-md text-center">
        <p className="text-lg font-medium">No reviews found</p>
        <p className="text-sm">This company doesn't have any reviews yet.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Customer Reviews</h1>
      <div className="grid gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium">{review.author}</h3>
                <p className="text-sm text-gray-500">{review.date}</p>
              </div>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  {review.platform}
                </span>
              </div>
            </div>
            
            <div className="mt-4">
              {review.title && (
                <h4 className="font-medium">{review.title}</h4>
              )}
              <p className="mt-1 text-gray-600">{review.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
