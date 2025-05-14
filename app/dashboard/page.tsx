"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";

// Import chart components for the stats
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  const [chartData, setChartData] = useState([]);
  
  const { user } = useAuth();
  const supabase = createClientComponentClient();

  // Placeholder data for chart
  useEffect(() => {
    const data = [
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
          
          // Mock companies data
          setCompanies([
            {
              id: '1',
              name: 'Café de Paris',
              created_at: '2023-01-15',
              review_count: 32,
              average_rating: 4.5,
              user_id: user.id,
            },
            {
              id: '2',
              name: 'Restaurant Le Gourmet',
              created_at: '2023-02-28',
              review_count: 15,
              average_rating: 3.8,
              user_id: user.id,
            },
          ]);
          
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setLoading(false);
      }
    }
    
    fetchDashboardData();
  }, [user, supabase]);

  // Format date in French locale
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

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

  return (
    <DashboardLayout title="Tableau de bord">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex h-64 w-full items-center justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* Stats section */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 rounded-md bg-blue-100 p-3">
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total des avis</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{stats.totalReviews}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <Link href="/dashboard/reviews" className="font-medium text-blue-600 hover:text-blue-500">
                      Voir tous les avis
                    </Link>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 rounded-md bg-orange-100 p-3">
                      <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Avis non lus</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{stats.unreadReviews}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <Link href="/dashboard/reviews" className="font-medium text-blue-600 hover:text-blue-500">
                      Voir les avis non lus
                    </Link>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 rounded-md bg-red-100 p-3">
                      <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Notifications critiques</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{stats.criticalNotifications}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <Link href="/dashboard/notifications" className="font-medium text-blue-600 hover:text-blue-500">
                      Voir les notifications
                    </Link>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 rounded-md bg-green-100 p-3">
                      <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Note moyenne</dt>
                        <dd className="flex items-center">
                          <div className="text-2xl font-semibold text-gray-900 mr-2">{stats.averageRating.toFixed(1)}</div>
                          {renderStars(Math.round(stats.averageRating))}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <Link href="/dashboard/businesses" className="font-medium text-blue-600 hover:text-blue-500">
                      Voir les entreprises
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Chart section */}
            <div className="mt-8">
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Évolution des avis</h3>
                  <div className="mt-2 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="reviews" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent reviews section */}
            <div className="mt-8">
              <div className="sm:flex sm:items-center mb-4">
                <div className="sm:flex-auto">
                  <h2 className="text-lg font-medium text-gray-900">Derniers avis</h2>
                  <p className="mt-1 text-sm text-gray-500">Les avis les plus récents laissés sur vos entreprises.</p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                  <Link
                    href="/dashboard/reviews"
                    className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Tous les avis
                  </Link>
                </div>
              </div>
              <div className="space-y-6">
                {recentReviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row justify-between pb-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                            {review.author.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{review.author}</p>
                            <div className="flex items-center">
                              {renderStars(review.rating)}
                              <span className="ml-2 text-sm text-gray-500">{formatDate(review.date)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-2 sm:mt-0 flex items-center">
                          <span className={`mr-2 px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${review.platform === 'google' ? 'bg-blue-100 text-blue-800' : 'bg-indigo-100 text-indigo-800'}`}>
                            {review.platform === 'google' ? 'Google' : 'Facebook'}
                          </span>
                          
                          <Link href={`/dashboard/businesses/${review.businessId}`} className="text-sm text-gray-600 hover:text-gray-900">
                            {review.businessName}
                          </Link>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-700">
                        {review.content}
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Répondre
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Companies section */}
            <div className="mt-8 mb-6">
              <div className="sm:flex sm:items-center mb-4">
                <div className="sm:flex-auto">
                  <h2 className="text-lg font-medium text-gray-900">Vos entreprises</h2>
                  <p className="mt-1 text-sm text-gray-500">Aperçu de vos entreprises et leurs statistiques.</p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                  <Link
                    href="/dashboard/businesses"
                    className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Toutes les entreprises
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {companies.map((company) => (
                  <div key={company.id} className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-md bg-blue-100 flex items-center justify-center text-blue-700 font-medium text-xl">
                          {company.name.charAt(0)}
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{company.name}</h3>
                          <div className="mt-1 flex items-center">
                            {renderStars(Math.round(company.average_rating || 0))}
                            <span className="ml-2 text-sm text-gray-500">
                              {company.average_rating?.toFixed(1)} ({company.review_count} avis)
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end space-x-3">
                        <Link
                          href={`/dashboard/businesses/${company.id}`}
                          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Voir les avis
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
