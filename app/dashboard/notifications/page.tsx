"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/contexts/AuthContext";

// Reuse the types from ImportantNotifications component
type NotificationStatus = 'unread' | 'read' | 'action_required';
type NotificationSource = 'email' | 'urssaf' | 'impots' | 'bank' | 'client' | 'google' | 'facebook' | 'system';

interface Notification {
  id: string;
  title: string;
  message: string;
  status: NotificationStatus;
  source: NotificationSource;
  createdAt: string;
  businessId?: string;
  businessName?: string;
  link?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'action_required'>('all');
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    // In a real application, fetch notifications from the database
    // For this example, we'll use mock data
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Mock data - in a real app, fetch from Supabase
        // const { data, error } = await supabase
        //   .from('notifications')
        //   .select('*')
        //   .eq('user_id', user?.id)
        //   .order('created_at', { ascending: false });
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 700));
        
        // Mock notifications data
        const mockNotifications: Notification[] = [
          {
            id: '1',
            title: 'Nouvel avis sur Google',
            message: 'Un client a laissé un avis 5 étoiles pour Café de Paris',
            status: 'unread',
            source: 'google',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            businessId: '1',
            businessName: 'Café de Paris',
            link: '/dashboard/businesses/1/reviews'
          },
          {
            id: '2',
            title: 'Réponse requise',
            message: 'Un avis négatif (2 étoiles) nécessite votre attention pour Restaurant Le Gourmet',
            status: 'action_required',
            source: 'google',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            businessId: '2',
            businessName: 'Restaurant Le Gourmet',
            link: '/dashboard/businesses/2/reviews'
          },
          {
            id: '3',
            title: 'Rapport hebdomadaire disponible',
            message: 'Votre rapport hebdomadaire de réputation est prêt à être consulté',
            status: 'unread',
            source: 'system',
            createdAt: new Date(Date.now() - 259200000).toISOString()
          },
          {
            id: '4',
            title: 'Mise à jour des conditions d\'utilisation',
            message: 'Nous avons mis à jour nos conditions d\'utilisation. Veuillez les consulter',
            status: 'read',
            source: 'system',
            createdAt: new Date(Date.now() - 604800000).toISOString(),
            link: '/dashboard/settings'
          },
          {
            id: '5',
            title: 'Avis Facebook en attente',
            message: 'Vous avez 3 nouveaux avis sur Facebook qui n\'ont pas de réponse',
            status: 'action_required',
            source: 'facebook',
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            businessId: '1',
            businessName: 'Café de Paris'
          }
        ];
        
        setNotifications(mockNotifications);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Impossible de charger vos notifications. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
  }, [user]);

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'unread') return notification.status === 'unread';
    if (activeTab === 'action_required') return notification.status === 'action_required';
    return true; // 'all' tab
  });

  const handleMarkAsRead = async (id: string) => {
    // In a real app, update the notification status in the database
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, status: 'read' as NotificationStatus } 
          : notification
      )
    );
  };

  const handleDeleteNotification = async (id: string) => {
    // In a real app, delete or archive the notification in the database
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getSourceIcon = (source: NotificationSource) => {
    switch(source) {
      case 'google':
        return (
          <div className="flex-shrink-0 rounded-full bg-blue-100 p-2">
            <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
            </svg>
          </div>
        );
      case 'facebook':
        return (
          <div className="flex-shrink-0 rounded-full bg-indigo-100 p-2">
            <svg className="h-5 w-5 text-indigo-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
        );
      case 'client':
        return (
          <div className="flex-shrink-0 rounded-full bg-green-100 p-2">
            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        );
      case 'system':
        return (
          <div className="flex-shrink-0 rounded-full bg-gray-100 p-2">
            <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 rounded-full bg-blue-100 p-2">
            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getStatusIndicator = (status: NotificationStatus) => {
    switch(status) {
      case 'unread':
        return <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-blue-600"></span>;
      case 'action_required':
        return <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-red-600"></span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'À l\'instant';
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
    if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)} j`;
    
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gérez vos alertes et notifications
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-2">
            <button
              onClick={() => setNotifications(prev => prev.map(n => ({...n, status: 'read' as NotificationStatus})))}
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Tout marquer comme lu
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Toutes
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                {notifications.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'unread'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Non lues
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                {notifications.filter(n => n.status === 'unread').length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('action_required')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'action_required'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Action requise
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                {notifications.filter(n => n.status === 'action_required').length}
              </span>
            </button>
          </nav>
        </div>
        
        {/* Notifications list */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : filteredNotifications.length > 0 ? (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id}
                className={`relative rounded-lg border p-4 shadow-sm ${
                  notification.status === 'unread' ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'
                }`}
              >
                {getStatusIndicator(notification.status)}
                <div className="flex items-start">
                  {getSourceIcon(notification.source)}
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-medium ${notification.status === 'unread' ? 'text-gray-900' : 'text-gray-600'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {notification.message}
                    </p>
                    {notification.businessName && (
                      <span className="mt-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        {notification.businessName}
                      </span>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      {notification.link ? (
                        <a 
                          href={notification.link}
                          className="text-xs font-medium text-blue-600 hover:text-blue-800"
                        >
                          Voir les détails →
                        </a>
                      ) : (
                        <div></div>
                      )}
                      <div className="flex space-x-4">
                        {notification.status !== 'read' && (
                          <button 
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-xs font-medium text-gray-500 hover:text-gray-700"
                          >
                            Marquer comme lu
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="text-xs font-medium text-gray-500 hover:text-red-600"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-12">
            <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Pas de notifications</h3>
            <p className="mt-1 text-sm text-gray-500">
              Vous n'avez pas de notifications {activeTab === 'all' ? '' : activeTab === 'unread' ? 'non lues' : 'requérant une action'} pour le moment.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
