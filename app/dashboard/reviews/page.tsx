"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

interface Business {
  id: string;
  name: string;
  review_count: number;
  average_rating: number;
}

interface Review {
  id: string;
  author: string;
  content: string;
  rating: number;
  date: string;
  platform: 'google' | 'facebook' | 'other';
  businessId: string;
  businessName?: string;
  response?: {
    content: string;
    date: string;
  };
}

export default function ReviewsPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState<string>("all");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    const fetchBusinesses = async () => {
      if (!user) return;
      
      try {
        console.log("Fetching businesses for user:", user.id);
        
        // Fetch businesses from Supabase - modified to select only columns that exist
        // and handle missing review_count and average_rating columns
        const { data, error } = await supabase
          .from('companies')
          .select('id, name, user_id')
          .eq('user_id', user.id);
          
        if (error) {
          console.error('Supabase error details:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
          });
          throw new Error(`Database query failed: ${error.message || 'Unknown error'}`);
        }
        
        // Add default values for missing columns
        const businessesWithDefaults = data?.map(business => ({
          ...business,
          review_count: 0, // Default value since column doesn't exist
          average_rating: 0 // Default value since column might not exist
        })) || [];
        
        console.log(`Successfully fetched ${businessesWithDefaults.length || 0} businesses`);
        setBusinesses(businessesWithDefaults);
      } catch (err) {
        console.error('Error fetching businesses:', err);
        
        let errorMessage = "Failed to fetch businesses";
        if (err instanceof Error) {
          errorMessage += `: ${err.message}`;
        } else if (err && typeof err === 'object' && Object.keys(err).length === 0) {
          errorMessage += ": Received empty error object from Supabase";
          // Add additional diagnostic information for empty error objects
          console.error("Supabase connection might have issues. Check your API keys and network connection.");
        }
        
        setError(errorMessage);
        // Return empty array to avoid undefined errors
        setBusinesses([]);
      }
    };
    
    const fetchAllReviews = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (!user) return;
        
        // First get all the user's businesses
        await fetchBusinesses();
        
        // In a real app, you would fetch reviews from all businesses
        // For this example, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 700));
        
        // Mock reviews data
        const mockReviews: Review[] = [
          {
            id: '1',
            author: 'Jean Dupont',
            content: 'Service excellent et personnel très accueillant. Je recommande vivement!',
            rating: 5,
            date: new Date(Date.now() - 86400000).toISOString(),
            platform: 'google',
            businessId: '1',
            businessName: 'Café de Paris',
            response: {
              content: 'Merci beaucoup pour votre commentaire positif! Nous sommes ravis que vous ayez apprécié votre visite.',
              date: new Date(Date.now() - 43200000).toISOString()
            }
          },
          {
            id: '2',
            author: 'Marie Martin',
            content: 'Bonne ambiance mais service un peu lent. La nourriture était correcte.',
            rating: 3,
            date: new Date(Date.now() - 172800000).toISOString(),
            platform: 'google',
            businessId: '1',
            businessName: 'Café de Paris'
          },
          {
            id: '3',
            author: 'Pierre Richard',
            content: 'Expérience décevante. Le plat était froid et le service laissait à désirer.',
            rating: 2,
            date: new Date(Date.now() - 259200000).toISOString(),
            platform: 'facebook',
            businessId: '2',
            businessName: 'Restaurant Le Gourmet'
          },
          {
            id: '4',
            author: 'Sophie Leclerc',
            content: 'Parfait pour un déjeuner d\'affaires. Cuisine raffinée et cadre élégant.',
            rating: 5,
            date: new Date(Date.now() - 432000000).toISOString(),
            platform: 'google',
            businessId: '2',
            businessName: 'Restaurant Le Gourmet',
            response: {
              content: 'Merci pour votre confiance, Sophie! Nous sommes heureux que votre déjeuner d\'affaires se soit bien passé.',
              date: new Date(Date.now() - 345600000).toISOString()
            }
          },
          {
            id: '5',
            author: 'Thomas Bernard',
            content: 'Une expérience exceptionnelle. Le chef est venu nous saluer à table!',
            rating: 5,
            date: new Date(Date.now() - 604800000).toISOString(),
            platform: 'facebook',
            businessId: '2',
            businessName: 'Restaurant Le Gourmet',
            response: {
              content: 'Merci Thomas! Notre chef adore rencontrer nos clients. Au plaisir de vous accueillir à nouveau!',
              date: new Date(Date.now() - 518400000).toISOString()
            }
          }
        ];
        
        setReviews(mockReviews);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Impossible de charger vos avis. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllReviews();
  }, [user, supabase]);

  // Filter reviews based on selected business, platform, and rating
  const filteredReviews = reviews.filter((review) => {
    if (selectedBusiness !== "all" && review.businessId !== selectedBusiness) return false;
    if (selectedPlatform !== "all" && review.platform !== selectedPlatform) return false;
    if (selectedRating > 0 && review.rating !== selectedRating) return false;
    return true;
  });

  // Function to render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            className={`h-4 w-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // Format date in French locale
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Platform badge style and icon
  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case 'google':
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            <svg className="mr-1 h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
            </svg>
            Google
          </span>
        );
      case 'facebook':
        return (
          <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
            <svg className="mr-1 h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            Autre
          </span>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tous les avis</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gérez et répondez à tous vos avis clients
            </p>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="business" className="block text-sm font-medium text-gray-700 mb-1">
                Entreprise
              </label>
              <select
                id="business"
                className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                value={selectedBusiness}
                onChange={(e) => setSelectedBusiness(e.target.value)}
              >
                <option value="all">Toutes les entreprises</option>
                {businesses.map((business) => (
                  <option key={business.id} value={business.id}>
                    {business.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
                Plateforme
              </label>
              <select
                id="platform"
                className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
              >
                <option value="all">Toutes les plateformes</option>
                <option value="google">Google</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                Note
              </label>
              <select
                id="rating"
                className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                value={selectedRating}
                onChange={(e) => setSelectedRating(Number(e.target.value))}
              >
                <option value="0">Toutes les notes</option>
                <option value="5">5 étoiles</option>
                <option value="4">4 étoiles</option>
                <option value="3">3 étoiles</option>
                <option value="2">2 étoiles</option>
                <option value="1">1 étoile</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Reviews list */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : filteredReviews.length > 0 ? (
          <div className="space-y-6">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {review.author.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{review.author}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {renderStars(review.rating)}
                          <span className="text-gray-500 text-sm">
                            {formatDate(review.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0 flex space-x-2">
                      {getPlatformBadge(review.platform)}
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        {review.businessName}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-gray-700">{review.content}</p>
                  </div>
                  
                  {review.response && (
                    <div className="mt-4 bg-gray-50 rounded-md p-4 border-l-4 border-blue-500">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <p className="text-sm font-medium text-gray-900">Votre réponse</p>
                        <span className="text-xs text-gray-500">
                          {formatDate(review.response.date)}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{review.response.content}</p>
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-end">
                    <Link
                      href={`/dashboard/businesses/${review.businessId}/reviews`}
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                      prefetch={false}
                    >
                      {review.response ? "Modifier la réponse" : "Répondre"} →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-12">
            <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun avis trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              Aucun avis ne correspond à vos critères de filtrage.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
