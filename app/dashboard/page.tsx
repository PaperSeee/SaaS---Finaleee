"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";

// ===== TYPES =====
interface Review {
  id: string;
  title: string;
  content: string;
  rating: number;
  author: string;
  date: string;
  platform: string;
  isRead: boolean;
  isCritical: boolean;
}

interface Email {
  id: string;
  subject: string;
  sender: string;
  preview: string;
  date: string;
  isRead: boolean;
  isUrgent: boolean;
  isToProcess: boolean;
}

interface KpiData {
  reviews: {
    total: number;
    unread: number;
    critical: number;
    averageRating: number;
  };
  emails: {
    total: number;
    unread: number;
    urgent: number;
    toProcess: number;
  };
}

// ===== DASHBOARD PAGE COMPONENT =====
export default function DashboardPage() {
  // State for KPIs
  const [kpiData, setKpiData] = useState<KpiData>({
    reviews: { total: 0, unread: 0, critical: 0, averageRating: 0 },
    emails: { total: 0, unread: 0, urgent: 0, toProcess: 0 }
  });
  
  // State for reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsFilter, setReviewsFilter] = useState('all');
  
  // State for emails
  const [emails, setEmails] = useState<Email[]>([]);
  const [emailsLoading, setEmailsLoading] = useState(true);
  const [emailsFilter, setEmailsFilter] = useState('all');
  const [isMailboxConnected, setIsMailboxConnected] = useState(false);
  const [showMailboxModal, setShowMailboxModal] = useState(false);
  
  const supabase = createClientComponentClient();
  const { user } = useAuth();

  // Fetch reviews data
  useEffect(() => {
    async function fetchReviews() {
      try {
        setReviewsLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch('/api/reviews');
        // const data = await response.json();
        
        // Mocked data for demo
        const mockReviews: Review[] = [
          {
            id: '1',
            title: 'Excellent service',
            content: 'Super expérience, service client au top !',
            rating: 5,
            author: 'Jean Dupont',
            date: '2023-11-15',
            platform: 'Google',
            isRead: true,
            isCritical: false
          },
          {
            id: '2',
            title: 'Service décevant',
            content: 'Livraison en retard et produit de mauvaise qualité.',
            rating: 2,
            author: 'Marie Martin',
            date: '2023-11-14',
            platform: 'Facebook',
            isRead: false,
            isCritical: true
          },
          {
            id: '3',
            title: 'Bonne experience globale',
            content: 'Produit conforme à la description, livraison rapide.',
            rating: 4,
            author: 'Sophie Bernard',
            date: '2023-11-13',
            platform: 'Google',
            isRead: false,
            isCritical: false
          }
        ];
        
        setReviews(mockReviews);
        
        // Update KPIs
        setKpiData(prev => ({
          ...prev,
          reviews: {
            total: mockReviews.length,
            unread: mockReviews.filter(r => !r.isRead).length,
            critical: mockReviews.filter(r => r.isCritical).length,
            averageRating: mockReviews.reduce((acc, r) => acc + r.rating, 0) / mockReviews.length
          }
        }));
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setReviewsLoading(false);
      }
    }
    
    fetchReviews();
  }, []);
  
  // Fetch emails data
  useEffect(() => {
    async function fetchEmails() {
      try {
        setEmailsLoading(true);
        
        // Check if mailbox is connected
        // TODO: Replace with actual API call
        // const connectionStatus = await fetch('/api/emails/status');
        // const { connected } = await connectionStatus.json();
        const connected = false; // For demo, assume not connected initially
        
        setIsMailboxConnected(connected);
        
        if (connected) {
          // TODO: Replace with actual API call
          // const response = await fetch('/api/emails');
          // const data = await response.json();
          
          // Mocked data for demo
          const mockEmails: Email[] = [
            {
              id: '1',
              subject: 'Question sur votre service',
              sender: 'client@example.com',
              preview: 'Bonjour, je souhaiterais avoir plus d\'informations...',
              date: '2023-11-15',
              isRead: false,
              isUrgent: true,
              isToProcess: true
            },
            {
              id: '2',
              subject: 'Demande de devis',
              sender: 'entreprise@example.com',
              preview: 'Suite à notre conversation téléphonique, pourriez-vous...',
              date: '2023-11-14',
              isRead: true,
              isUrgent: false,
              isToProcess: true
            },
            {
              id: '3',
              subject: 'Newsletter mensuelle',
              sender: 'marketing@example.com',
              preview: 'Découvrez nos dernières offres et actualités...',
              date: '2023-11-13',
              isRead: true,
              isUrgent: false,
              isToProcess: false
            }
          ];
          
          setEmails(mockEmails);
          
          // Update KPIs
          setKpiData(prev => ({
            ...prev,
            emails: {
              total: mockEmails.length,
              unread: mockEmails.filter(e => !e.isRead).length,
              urgent: mockEmails.filter(e => e.isUrgent).length,
              toProcess: mockEmails.filter(e => e.isToProcess).length
            }
          }));
        }
      } catch (error) {
        console.error('Error fetching emails:', error);
      } finally {
        setEmailsLoading(false);
      }
    }
    
    fetchEmails();
  }, []);
  
  // Filter reviews based on selected filter
  const filteredReviews = reviews.filter(review => {
    switch (reviewsFilter) {
      case 'critical':
        return review.isCritical;
      case 'unread':
        return !review.isRead;
      case 'positive':
        return review.rating >= 4;
      default:
        return true;
    }
  });
  
  // Filter emails based on selected filter
  const filteredEmails = emails.filter(email => {
    switch (emailsFilter) {
      case 'urgent':
        return email.isUrgent;
      case 'toProcess':
        return email.isToProcess;
      case 'unread':
        return !email.isRead;
      default:
        return true;
    }
  });
  
  // Review actions
  const markReviewAsRead = (id: string) => {
    setReviews(reviews.map(review => 
      review.id === id ? { ...review, isRead: true } : review
    ));
    // TODO: API call to update review status
    // await fetch(`/api/reviews/${id}/read`, { method: 'POST' });
  };
  
  const archiveReview = (id: string) => {
    setReviews(reviews.filter(review => review.id !== id));
    // TODO: API call to archive review
    // await fetch(`/api/reviews/${id}/archive`, { method: 'POST' });
  };
  
  // Email actions
  const markEmailAsRead = (id: string) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, isRead: true } : email
    ));
    // TODO: API call to update email status
    // await fetch(`/api/emails/${id}/read`, { method: 'POST' });
  };
  
  const markEmailAsUrgent = (id: string) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, isUrgent: !email.isUrgent } : email
    ));
    // TODO: API call to update email status
    // await fetch(`/api/emails/${id}/urgent`, { method: 'POST' });
  };
  
  const archiveEmail = (id: string) => {
    setEmails(emails.filter(email => email.id !== id));
    // TODO: API call to archive email
    // await fetch(`/api/emails/${id}/archive`, { method: 'POST' });
  };
  
  // Connect mailbox
  const connectMailbox = async () => {
    // TODO: Implement OAuth flow to connect mailbox
    // For demo, we'll just toggle the state
    setIsMailboxConnected(true);
    setShowMailboxModal(false);
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

        {/* Reviews Section */}
        <section aria-labelledby="reviews-heading" className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 id="reviews-heading" className="text-lg font-medium text-gray-900">Avis clients</h2>
            <Link href="/dashboard/reviews" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Voir tous les avis &rarr;
            </Link>
          </div>
          
          {/* KPI Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <KpiCard 
              title="Total"
              value={kpiData.reviews.total.toString()}
              icon={
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
            
            <KpiCard 
              title="Non lus"
              value={kpiData.reviews.unread.toString()}
              color="yellow"
              icon={
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              }
            />
            
            <KpiCard 
              title="Critiques"
              value={kpiData.reviews.critical.toString()}
              color="red"
              icon={
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              }
            />
            
            <KpiCard 
              title="Note moyenne"
              value={kpiData.reviews.averageRating.toFixed(1)}
              icon={
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              }
            />
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              className={`px-3 py-1 text-sm font-medium rounded-full ${
                reviewsFilter === 'all' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setReviewsFilter('all')}
            >
              Tous
            </button>
            <button
              className={`px-3 py-1 text-sm font-medium rounded-full ${
                reviewsFilter === 'critical' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setReviewsFilter('critical')}
            >
              Critiques
            </button>
            <button
              className={`px-3 py-1 text-sm font-medium rounded-full ${
                reviewsFilter === 'unread' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setReviewsFilter('unread')}
            >
              Non lus
            </button>
            <button
              className={`px-3 py-1 text-sm font-medium rounded-full ${
                reviewsFilter === 'positive' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setReviewsFilter('positive')}
            >
              Positifs
            </button>
          </div>
          
          {/* Reviews List */}
          {reviewsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun avis ne correspond aux critères sélectionnés.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <ReviewCard 
                  key={review.id}
                  review={review}
                  onMarkAsRead={() => markReviewAsRead(review.id)}
                  onArchive={() => archiveReview(review.id)}
                />
              ))}
            </div>
          )}
        </section>
        
        {/* Emails Section */}
        <section aria-labelledby="emails-heading" className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 id="emails-heading" className="text-lg font-medium text-gray-900">Emails</h2>
            <Link href="/dashboard/emails" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Voir tous les emails &rarr;
            </Link>
          </div>
          
          {!isMailboxConnected ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune boîte mail connectée</h3>
              <p className="mt-1 text-sm text-gray-500">
                Connectez votre boîte mail pour afficher et gérer vos emails.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setShowMailboxModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Connecter ma boîte mail
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Email KPI Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <KpiCard 
                  title="Total"
                  value={kpiData.emails.total.toString()}
                  icon={
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                />
                
                <KpiCard 
                  title="Non lus"
                  value={kpiData.emails.unread.toString()}
                  color="yellow"
                  icon={
                    <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  }
                />
                
                <KpiCard 
                  title="Urgents"
                  value={kpiData.emails.urgent.toString()}
                  color="red"
                  icon={
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />
                
                <KpiCard 
                  title="À traiter"
                  value={kpiData.emails.toProcess.toString()}
                  color="orange"
                  icon={
                    <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  }
                />
              </div>
              
              {/* Email Filters */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    emailsFilter === 'all' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setEmailsFilter('all')}
                >
                  Tous
                </button>
                <button
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    emailsFilter === 'urgent' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setEmailsFilter('urgent')}
                >
                  Urgents
                </button>
                <button
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    emailsFilter === 'toProcess' 
                      ? 'bg-orange-100 text-orange-800' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setEmailsFilter('toProcess')}
                >
                  À traiter
                </button>
                <button
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    emailsFilter === 'unread' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setEmailsFilter('unread')}
                >
                  Non lus
                </button>
              </div>
              
              {/* Emails List */}
              {emailsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredEmails.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucun email ne correspond aux critères sélectionnés.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEmails.map((email) => (
                    <EmailCard 
                      key={email.id}
                      email={email}
                      onMarkAsRead={() => markEmailAsRead(email.id)}
                      onMarkAsUrgent={() => markEmailAsUrgent(email.id)}
                      onArchive={() => archiveEmail(email.id)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
        
        {/* Connect Mailbox Modal */}
        {showMailboxModal && (
          <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowMailboxModal(false)}></div>
              
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        Connecter votre boîte mail
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Sélectionnez votre fournisseur de messagerie pour vous connecter et synchroniser vos emails avec Kritiqo.
                        </p>
                        
                        <div className="mt-4 space-y-3">
                          <button
                            onClick={connectMailbox}
                            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#EA4335">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 12.5h-3.5V18h-3v-3.5H7v-3h3.5V8h3v3.5H17v3z" />
                            </svg>
                            Gmail
                          </button>
                          
                          <button
                            onClick={connectMailbox}
                            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#0078D4">
                              <path d="M21.386 8.108V19.25h-2.877V9.827L12 15.7l-6.509-5.872V19.25H2.614V8.108L12 16l9.386-7.892z" />
                            </svg>
                            Outlook
                          </button>
                          
                          <button
                            onClick={connectMailbox}
                            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Autre service (IMAP/SMTP)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button 
                    type="button" 
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowMailboxModal(false)}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// ===== KPI CARD COMPONENT =====
interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color?: 'blue' | 'red' | 'green' | 'yellow' | 'orange';
}

function KpiCard({ title, value, icon, color = 'blue' }: KpiCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50',
    red: 'bg-red-50',
    green: 'bg-green-50',
    yellow: 'bg-yellow-50',
    orange: 'bg-orange-50'
  };
  
  return (
    <div className={`${colorClasses[color]} p-5 rounded-lg`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd>
              <div className="text-lg font-medium text-gray-900">{value}</div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
}

// ===== REVIEW CARD COMPONENT =====
interface ReviewCardProps {
  review: Review;
  onMarkAsRead: () => void;
  onArchive: () => void;
}

function ReviewCard({ review, onMarkAsRead, onArchive }: ReviewCardProps) {
  const getBorderColor = () => {
    if (review.isCritical) return 'border-l-4 border-red-500';
    if (!review.isRead) return 'border-l-4 border-yellow-500';
    if (review.rating >= 4) return 'border-l-4 border-green-500';
    return '';
  };
  
  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${getBorderColor()}`}>
      <div className="p-4">
        <div className="flex justify-between">
          <div className="flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-700">
              {review.author.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{review.author}</p>
              <div className="flex items-center">
                <span className="text-xs text-gray-500">{review.date}</span>
                <span className="mx-1 text-gray-500">•</span>
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  {review.platform}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
        
        <div className="mt-3">
          {review.title && (
            <h4 className="text-sm font-medium text-gray-900">{review.title}</h4>
          )}
          <p className="mt-1 text-sm text-gray-600">{review.content}</p>
        </div>
        
        <div className="mt-4 flex justify-end space-x-2">
          {!review.isRead && (
            <button
              onClick={onMarkAsRead}
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Marquer comme lu"
            >
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Lu
            </button>
          )}
          
          <button
            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Répondre à l'avis"
          >
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            Répondre
          </button>
          
          <button
            onClick={onArchive}
            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Archiver l'avis"
          >
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            Archiver
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== EMAIL CARD COMPONENT =====
interface EmailCardProps {
  email: Email;
  onMarkAsRead: () => void;
  onMarkAsUrgent: () => void;
  onArchive: () => void;
}

function EmailCard({ email, onMarkAsRead, onMarkAsUrgent, onArchive }: EmailCardProps) {
  const getBorderColor = () => {
    if (email.isUrgent) return 'border-l-4 border-red-500';
    if (!email.isRead) return 'border-l-4 border-yellow-500';
    if (email.isToProcess) return 'border-l-4 border-orange-500';
    return '';
  };
  
  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${getBorderColor()}`}>
      <div className="p-4">
        <div className="flex justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">{email.subject}</h4>
            <p className="text-xs text-gray-500 mt-1">
              De: {email.sender} • {email.date}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {email.isUrgent && (
              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                Urgent
              </span>
            )}
            {email.isToProcess && (
              <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
                À traiter
              </span>
            )}
          </div>
        </div>
        
        <div className="mt-2">
          <p className="text-sm text-gray-600 truncate">{email.preview}</p>
        </div>
        
        <div className="mt-4 flex justify-end space-x-2">
          {!email.isRead && (
            <button
              onClick={onMarkAsRead}
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Marquer comme lu"
            >
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Lu
            </button>
          )}
          
          <button
            onClick={onMarkAsUrgent}
            className={`inline-flex items-center px-2.5 py-1.5 border text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              email.isUrgent 
                ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100' 
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }`}
            aria-label={email.isUrgent ? "Retirer l'urgence" : "Marquer comme urgent"}
          >
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {email.isUrgent ? 'Non urgent' : 'Urgent'}
          </button>
          
          <button
            onClick={onArchive}
            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Archiver l'email"
          >
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            Archiver
          </button>
        </div>
      </div>
    </div>
  );
}
