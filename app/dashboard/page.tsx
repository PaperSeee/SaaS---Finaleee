"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";

// Import chart components for the stats
type Company = {
  id: string;
  name: string;
  created_at: string;
  logo_url?: string;
  review_count?: number;
  average_rating?: number;
  user_id: string;
};

type Review = {
  id: string;
  author: string;
  content: string;
  rating: number;
  date: string;
  platform: 'google' | 'facebook' | 'other';
  businessId: string;
  businessName?: string;
};

// Add this type definition for chart data
interface ChartDataItem {
  name: string;
  reviews: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalReviews: 0,
    unreadReviews: 0,
    criticalNotifications: 0,
    averageRating: 0,
  });
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  // Fix the chartData state by adding proper type
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  
  const { user } = useAuth();
  const supabase = createClientComponentClient();

  // Placeholder data for chart
  useEffect(() => {
    const data: ChartDataItem[] = [
      { name: 'Jan', reviews: 4 },
      { name: 'Feb', reviews: 7 },
      { name: 'Mar', reviews: 5 },
      { name: 'Apr', reviews: 10 },
      { name: 'May', reviews: 8 },
      { name: 'Jun', reviews: 12 },
      { name: 'Jul', reviews: 15 },
    ];
    setChartData(data);
  }, []);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        if (!user) return;
        
        setLoading(true);
        
        // In a real app, we would fetch all data from the API
        // For now, we'll use mock data for the UI
        
        // Simulate API calls with timeout
        setTimeout(() => {
          // Mock stats data
          setStats({
            totalReviews: 47,
            unreadReviews: 5,
            criticalNotifications: 2,
            averageRating: 4.2,
          });
          
          // Mock recent reviews
          setRecentReviews([
            {
              id: '1',
              author: 'Jean Dupont',
              content: 'Service excellent et personnel très accueillant. Je recommande vivement!',
              rating: 5,
              date: new Date(Date.now() - 86400000).toISOString(),
              platform: 'google',
              businessId: '1',
              businessName: 'Café de Paris',
            },
            {
              id: '2',
              author: 'Marie Martin',
              content: 'Bonne ambiance mais service un peu lent. La nourriture était correcte.',
              rating: 3,
              date: new Date(Date.now() - 172800000).toISOString(),
              platform: 'google',
              businessId: '1',
              businessName: 'Café de Paris',
            },
            {
              id: '3',
              author: 'Pierre Richard',
              content: 'Expérience décevante. Le plat était froid et le service laissait à désirer.',
              rating: 2,
              date: new Date(Date.now() - 259200000).toISOString(),
              platform: 'facebook',
              businessId: '2',
              businessName: 'Restaurant Le Gourmet',
            },
          ]);

          // Get business data from Supabase
          fetchBusinesses();
          
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setLoading(false);
      }
    }
    
    async function fetchBusinesses() {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setCompanies(data || []);
      } catch (err) {
        console.error("Error fetching businesses:", err);
      }
    }
    
    fetchDashboardData();
  }, [user, supabase]);

  // Format date in French locale
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }).format(date);
  };

  // Function to render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg 
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="mt-1 text-sm text-gray-500">
            Bienvenue sur votre espace de gestion des avis clients
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total des avis</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">{stats.totalReviews}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Avis non lus</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">{stats.unreadReviews}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Notif. critiques</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">{stats.criticalNotifications}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Note moyenne</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">{stats.averageRating.toFixed(1)}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main content grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Recent Reviews */}
              <div className="lg:col-span-2">
                <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">Avis récents</h2>
                    <Link href="/dashboard/reviews" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      Voir tous les avis →
                    </Link>
                  </div>
                  <div className="border-t border-gray-200 divide-y divide-gray-200">
                    {recentReviews.length > 0 ? (
                      recentReviews.map((review) => (
                        <div key={review.id} className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <span className="text-blue-600 font-medium">
                                    {review.author.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{review.author}</p>
                                <div className="flex items-center">
                                  {renderStars(review.rating)}
                                  <span className="ml-2 text-xs text-gray-500">
                                    {formatDate(review.date)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="ml-2 flex-shrink-0 flex">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                review.platform === 'google' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : review.platform === 'facebook' 
                                  ? 'bg-indigo-100 text-indigo-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {review.platform === 'google' ? 'Google' : review.platform === 'facebook' ? 'Facebook' : 'Autre'}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-gray-700">
                            <p>{review.content}</p>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            {review.businessName && (
                              <span>Pour: {review.businessName}</span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-6 sm:px-6 text-center">
                        <p className="text-gray-500">Aucun avis récent à afficher</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Business List */}
              <div>
                <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">Vos entreprises</h2>
                    <Link href="/dashboard/businesses" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      Gérer →
                    </Link>
                  </div>
                  
                  <div className="border-t border-gray-200">
                    {companies.length > 0 ? (
                      <div className="divide-y divide-gray-200">
                        {companies.slice(0, 3).map((company) => (
                          <Link
                            key={company.id}
                            href={`/dashboard/businesses/${company.id}`}
                            className="block px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors duration-150"
                          >
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                {company.logo_url ? (
                                  <Image
                                    src={company.logo_url}
                                    alt={company.name}
                                    width={40}
                                    height={40}
                                    className="h-10 w-10 rounded-full"
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-blue-600 font-medium">
                                      {company.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{company.name}</div>
                                <div className="text-sm text-gray-500">
                                  {company.review_count || 0} avis • {(company.average_rating || 0).toFixed(1)}
                                  <svg 
                                    className="ml-1 inline-block h-3 w-3 text-yellow-400" 
                                    fill="currentColor" 
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-6 sm:px-6 text-center">
                        <p className="text-gray-500 mb-4">Aucune entreprise configurée</p>
                        <Link
                          href="/dashboard/businesses/new"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          Ajouter une entreprise
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
