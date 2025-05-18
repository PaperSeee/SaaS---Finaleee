"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";

// Email types
type EmailPriority = 'high' | 'medium' | 'low';
type EmailCategory = 'primary' | 'social' | 'promotions' | 'updates' | 'forums' | 'uncategorized';
type EmailSentiment = 'positive' | 'neutral' | 'negative';

interface Email {
  id: string;
  subject: string;
  sender: string;
  senderEmail: string;
  preview: string;
  body?: string;
  receivedAt: string;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  labels?: string[];
  priority: EmailPriority;
  category: EmailCategory;
  sentiment?: EmailSentiment;
  hasAttachments: boolean;
}

interface EmailFilter {
  search: string;
  priority: EmailPriority | 'all';
  category: EmailCategory | 'all';
  sentiment: EmailSentiment | 'all';
  read: 'all' | 'read' | 'unread';
  date: 'all' | 'today' | 'week' | 'month';
  sorted: 'date' | 'priority' | 'sender';
}

export default function EmailsPage() {
  // Auth
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  
  // Email connection state
  const [isEmailConnected, setIsEmailConnected] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [connectionLoading, setConnectionLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Email data state
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI state
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [filters, setFilters] = useState<EmailFilter>({
    search: '',
    priority: 'all',
    category: 'all', 
    sentiment: 'all',
    read: 'all',
    date: 'all',
    sorted: 'date'
  });

  // Stats
  const [emailStats, setEmailStats] = useState({
    total: 0,
    unread: 0,
    highPriority: 0,
    negativeSentiment: 0
  });
  
  // Check if user has connected email account
  useEffect(() => {
    const checkEmailConnection = async () => {
      if (!user) return;
      
      try {
        // In production, check if user has connected email
        // const { data, error } = await supabase
        //   .from('email_connections')
        //   .select('*')
        //   .eq('user_id', user.id)
        //   .single();
          
        // For demo purposes, use local storage
        const isConnected = localStorage.getItem('emailConnected') === 'true';
        setIsEmailConnected(isConnected);
        
        if (isConnected) {
          fetchEmails();
        } else {
          setLoading(false);
        }
        
      } catch (err) {
        console.error('Failed to check email connection:', err);
        setLoading(false);
      }
    };
    
    checkEmailConnection();
  }, [user]);
  
  // Fetch emails
  const fetchEmails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In production, fetch from API
      // const response = await fetch('/api/emails');
      // const data = await response.json();
      
      // For demo, use mock data
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate loading
      
      const mockEmails: Email[] = [
        {
          id: '1',
          subject: 'Urgent: Problem with recent order #45721',
          sender: 'John Smith',
          senderEmail: 'john.smith@example.com',
          preview: 'Hello, I\'m having issues with my recent purchase. The product arrived damaged and I need a replacement immediately...',
          receivedAt: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
          isRead: false,
          isStarred: true,
          isArchived: false,
          labels: ['customer', 'support'],
          priority: 'high',
          category: 'primary',
          sentiment: 'negative',
          hasAttachments: true
        },
        {
          id: '2',
          subject: 'Invoice #INV-2023-0426 for payment',
          sender: 'Billing Department',
          senderEmail: 'billing@suppliercompany.com',
          preview: 'Dear Customer, Please find attached the invoice #INV-2023-0426 for your recent purchase. Payment is due within 30 days...',
          receivedAt: new Date(Date.now() - 3 * 3600000).toISOString(), // 3 hours ago
          isRead: true,
          isStarred: false,
          isArchived: false,
          labels: ['finance', 'invoice'],
          priority: 'medium',
          category: 'primary',
          sentiment: 'neutral',
          hasAttachments: true
        },
        {
          id: '3',
          subject: 'Weekly Team Meeting - Agenda & Notes',
          sender: 'Sarah Johnson',
          senderEmail: 'sarah.j@yourcompany.com',
          preview: 'Hi team, Attached is the agenda for tomorrow\'s weekly meeting. Please review the items and come prepared to discuss your current projects...',
          receivedAt: new Date(Date.now() - 5 * 3600000).toISOString(), // 5 hours ago
          isRead: false,
          isStarred: false,
          isArchived: false,
          labels: ['internal', 'meeting'],
          priority: 'medium',
          category: 'primary',
          sentiment: 'neutral',
          hasAttachments: true
        },
        {
          id: '4',
          subject: '🎉 Special 30% Discount Just For You!',
          sender: 'Marketing Promotions',
          senderEmail: 'promotions@marketingco.com',
          preview: 'SPECIAL OFFER INSIDE! We\'re offering our valued customers an exclusive 30% discount on all products this weekend only...',
          receivedAt: new Date(Date.now() - 12 * 3600000).toISOString(), // 12 hours ago
          isRead: true,
          isStarred: false,
          isArchived: false,
          priority: 'low',
          category: 'promotions',
          sentiment: 'neutral',
          hasAttachments: false
        },
        {
          id: '5',
          subject: 'Thank you for your outstanding service',
          sender: 'Emma Williams',
          senderEmail: 'emma.w@clientcompany.com',
          preview: 'I just wanted to send a quick note to thank you for the exceptional service your team provided last week. The project was delivered ahead of schedule and exceeded our expectations...',
          receivedAt: new Date(Date.now() - 25 * 3600000).toISOString(), // 25 hours ago
          isRead: true,
          isStarred: true,
          isArchived: false,
          labels: ['client', 'feedback'],
          priority: 'medium',
          category: 'primary',
          sentiment: 'positive',
          hasAttachments: false
        },
        {
          id: '6',
          subject: 'System Maintenance Notice - Scheduled Downtime',
          sender: 'IT Department',
          senderEmail: 'it@yourcompany.com',
          preview: 'Notice: Our systems will be undergoing scheduled maintenance this Sunday from 2AM to 6AM. During this time, some services may be unavailable...',
          receivedAt: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
          isRead: true,
          isStarred: false,
          isArchived: false,
          labels: ['internal', 'system'],
          priority: 'low',
          category: 'updates',
          sentiment: 'neutral',
          hasAttachments: false
        },
        {
          id: '7',
          subject: 'URGENT: Immediate action required regarding your account',
          sender: 'Security Team',
          senderEmail: 'security@yourcompany.com',
          preview: 'We\'ve detected unusual activity on your account. Please verify your recent login from a new device in Germany. If this wasn\'t you, please secure your account immediately...',
          receivedAt: new Date(Date.now() - 4 * 86400000).toISOString(), // 4 days ago
          isRead: true,
          isStarred: false,
          isArchived: false,
          labels: ['security', 'alert'],
          priority: 'high',
          category: 'primary',
          sentiment: 'negative',
          hasAttachments: false
        },
        {
          id: '8',
          subject: 'Product Return Request #RT-78291',
          sender: 'Customer Support',
          senderEmail: 'support@yourcompany.com',
          preview: 'A new return request has been submitted. Customer Alex Johnson (Order #45829) is requesting a return for "Wireless Headphones" due to "Defective product"...',
          receivedAt: new Date(Date.now() - 5 * 86400000).toISOString(), // 5 days ago
          isRead: false,
          isStarred: false,
          isArchived: false,
          labels: ['returns', 'support'],
          priority: 'high',
          category: 'primary',
          sentiment: 'negative',
          hasAttachments: false
        }
      ];
      
      setEmails(mockEmails);
      
      // Calculate stats
      const stats = {
        total: mockEmails.length,
        unread: mockEmails.filter(e => !e.isRead).length,
        highPriority: mockEmails.filter(e => e.priority === 'high').length,
        negativeSentiment: mockEmails.filter(e => e.sentiment === 'negative').length
      };
      setEmailStats(stats);
      
    } catch (err) {
      console.error('Failed to fetch emails:', err);
      setError('Une erreur est survenue lors du chargement de vos emails. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };
  
  // Connect email account
  const handleConnectEmail = async (provider: 'gmail' | 'outlook' | 'custom') => {
    setConnectionLoading(true);
    setConnectionError(null);
    
    try {
      // In production, initiate OAuth flow
      // const response = await fetch(`/api/auth/email-connect/${provider}`, {
      //   method: 'POST',
      // });
      // const data = await response.json();
      // window.location.href = data.authUrl;
      
      // For demo, simulate connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store in local storage for demo
      localStorage.setItem('emailConnected', 'true');
      setIsEmailConnected(true);
      setConnectModalOpen(false);
      
      // Fetch emails after connection
      setTimeout(() => {
        fetchEmails();
      }, 500);
      
    } catch (err) {
      console.error('Failed to connect email account:', err);
      setConnectionError('Échec de la connexion. Veuillez réessayer.');
    } finally {
      setConnectionLoading(false);
    }
  };
  
  // Filter emails based on current filters
  const filteredEmails = emails.filter(email => {
    // Search filter
    if (filters.search && !email.subject.toLowerCase().includes(filters.search.toLowerCase()) && 
        !email.sender.toLowerCase().includes(filters.search.toLowerCase()) && 
        !email.preview.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Priority filter
    if (filters.priority !== 'all' && email.priority !== filters.priority) {
      return false;
    }
    
    // Category filter
    if (filters.category !== 'all' && email.category !== filters.category) {
      return false;
    }
    
    // Sentiment filter
    if (filters.sentiment !== 'all' && email.sentiment !== filters.sentiment) {
      return false;
    }
    
    // Read/unread filter
    if (filters.read === 'read' && !email.isRead) return false;
    if (filters.read === 'unread' && email.isRead) return false;
    
    // Date filter
    const emailDate = new Date(email.receivedAt);
    const now = new Date();
    
    if (filters.date === 'today') {
      return emailDate.toDateString() === now.toDateString();
    }
    
    if (filters.date === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return emailDate >= weekAgo;
    }
    
    if (filters.date === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return emailDate >= monthAgo;
    }
    
    return true;
  });
  
  // Sort emails based on current sort option
  const sortedEmails = [...filteredEmails].sort((a, b) => {
    if (filters.sorted === 'date') {
      return new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime();
    }
    
    if (filters.sorted === 'priority') {
      const priorityValues = { high: 3, medium: 2, low: 1 };
      return priorityValues[b.priority as EmailPriority] - priorityValues[a.priority as EmailPriority];
    }
    
    if (filters.sorted === 'sender') {
      return a.sender.localeCompare(b.sender);
    }
    
    return 0;
  });
  
  // Mark email as read
  const markAsRead = (id: string) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, isRead: true } : email
    ));
    
    // Update stats
    setEmailStats(prev => ({
      ...prev,
      unread: prev.unread - 1
    }));
    
    // In production, send to API
    // fetch(`/api/emails/${id}/read`, { method: 'POST' });
  };
  
  // Toggle star status
  const toggleStar = (id: string) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, isStarred: !email.isStarred } : email
    ));
    
    // In production, send to API
    // fetch(`/api/emails/${id}/star`, { method: 'POST' });
  };
  
  // Format date relative to now
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'À l\'instant';
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
    if (date.toDateString() === now.toDateString()) return 'Aujourd\'hui';
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return 'Hier';
    
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };
  
  // Get priority indicator
  const getPriorityIndicator = (priority: EmailPriority) => {
    switch (priority) {
      case 'high':
        return <span className="inline-flex h-2 w-2 rounded-full bg-red-600" title="Haute priorité"></span>;
      case 'medium':
        return <span className="inline-flex h-2 w-2 rounded-full bg-yellow-500" title="Priorité moyenne"></span>;
      case 'low':
        return <span className="inline-flex h-2 w-2 rounded-full bg-green-500" title="Basse priorité"></span>;
    }
  };
  
  // Get sentiment indicator
  const getSentimentIndicator = (sentiment: EmailSentiment | undefined) => {
    switch (sentiment) {
      case 'positive':
        return <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600" title="Sentiment positif">😊</span>;
      case 'negative':
        return <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600" title="Sentiment négatif">😟</span>;
      case 'neutral':
        return <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-600" title="Sentiment neutre">😐</span>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion Intelligente des Emails</h1>
            <p className="mt-1 text-sm text-gray-500">
              Priorisez et centralisez vos communications importantes
            </p>
          </div>
          {isEmailConnected && (
            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => setConnectModalOpen(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Ajouter une boîte mail
              </button>
            </div>
          )}
        </div>
        
        {!isEmailConnected ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-5 sm:p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Connectez votre boîte mail</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                Connectez votre boîte mail pour permettre à notre intelligence artificielle de trier automatiquement vos emails et d'identifier ceux qui nécessitent une attention urgente.
              </p>
              
              <div className="mt-8 max-w-md mx-auto">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => handleConnectEmail('gmail')}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#EA4335">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 12.5h-3.5V18h-3v-3.5H7v-3h3.5V8h3v3.5H17v3z" />
                    </svg>
                    Google (Gmail)
                  </button>
                  <button
                    onClick={() => handleConnectEmail('outlook')}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#0078D4">
                      <path d="M21.386 8.108V19.25h-2.877V9.827L12 15.7l-6.509-5.872V19.25H2.614V8.108L12 16l9.386-7.892z" />
                    </svg>
                    Microsoft Outlook
                  </button>
                </div>
                
                <div className="mt-3">
                  <button
                    onClick={() => handleConnectEmail('custom')}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Autre service email (IMAP/SMTP)
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Email Stats Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              <div className="bg-white overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 rounded-md bg-blue-100 p-3">
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <div className="text-sm font-medium text-gray-500">Total des emails</div>
                      <div className="mt-1 text-3xl font-semibold text-gray-900">{emailStats.total}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 rounded-md bg-yellow-100 p-3">
                      <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <div className="text-sm font-medium text-gray-500">Non lus</div>
                      <div className="mt-1 text-3xl font-semibold text-gray-900">{emailStats.unread}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 rounded-md bg-red-100 p-3">
                      <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <div className="text-sm font-medium text-gray-500">Haute priorité</div>
                      <div className="mt-1 text-3xl font-semibold text-gray-900">{emailStats.highPriority}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 rounded-md bg-red-100 p-3">
                      <span className="h-6 w-6 text-center text-xl leading-6 text-red-600">😟</span>
                    </div>
                    <div className="ml-5">
                      <div className="text-sm font-medium text-gray-500">Sentiment négatif</div>
                      <div className="mt-1 text-3xl font-semibold text-gray-900">{emailStats.negativeSentiment}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Email Filters and Search */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div className="flex-1 min-w-0">
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input 
                      type="text" 
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Rechercher des emails..."
                      value={filters.search}
                      onChange={e => setFilters({...filters, search: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={filters.priority}
                    onChange={e => setFilters({...filters, priority: e.target.value as EmailPriority | 'all'})}
                  >
                    <option value="all">Toutes priorités</option>
                    <option value="high">Haute priorité</option>
                    <option value="medium">Priorité moyenne</option>
                    <option value="low">Faible priorité</option>
                  </select>
                  
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={filters.read}
                    onChange={e => setFilters({...filters, read: e.target.value as 'all' | 'read' | 'unread'})}
                  >
                    <option value="all">Tous les emails</option>
                    <option value="unread">Non lus</option>
                    <option value="read">Lus</option>
                  </select>
                  
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={filters.date}
                    onChange={e => setFilters({...filters, date: e.target.value as 'all' | 'today' | 'week' | 'month'})}
                  >
                    <option value="all">Toutes dates</option>
                    <option value="today">Aujourd'hui</option>
                    <option value="week">Cette semaine</option>
                    <option value="month">Ce mois</option>
                  </select>
                  
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={filters.sorted}
                    onChange={e => setFilters({...filters, sorted: e.target.value as 'date' | 'priority' | 'sender'})}
                  >
                    <option value="date">Trier par date</option>
                    <option value="priority">Trier par priorité</option>
                    <option value="sender">Trier par expéditeur</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Email List */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
              ) : error ? (
                <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
                  {error}
                </div>
              ) : sortedEmails.length === 0 ? (
                <div className="p-6 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun email trouvé</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Aucun email ne correspond à vos critères de filtrage.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {sortedEmails.map((email) => (
                    <div 
                      key={email.id}
                      className={`p-4 hover:bg-gray-50 transition-colors flex ${!email.isRead ? 'bg-blue-50' : ''} ${selectedEmail === email.id ? 'border-l-4 border-blue-500' : ''}`}
                      onClick={() => {
                        setSelectedEmail(email.id === selectedEmail ? null : email.id);
                        if (!email.isRead) markAsRead(email.id);
                      }}
                    >
                      <div className="flex-shrink-0 self-center mr-3">
                        <div className="flex flex-col items-center space-y-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStar(email.id);
                            }}
                            className="text-gray-400 hover:text-yellow-500 focus:outline-none"
                          >
                            <svg className={`h-5 w-5 ${email.isStarred ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                          
                          <div className="flex-shrink-0">
                            {getPriorityIndicator(email.priority)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${!email.isRead ? 'text-gray-900' : 'text-gray-600'} truncate`}>
                            {email.sender}
                          </p>
                          <div className="flex items-center">
                            {email.hasAttachments && (
                              <svg className="h-5 w-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                              </svg>
                            )}
                            <p className="ml-2 flex-shrink-0 whitespace-nowrap text-xs text-gray-500">
                              {formatDate(email.receivedAt)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-1">
                          <p className={`text-sm ${!email.isRead ? 'font-semibold text-gray-900' : 'text-gray-600'} truncate`}>
                            {email.subject}
                          </p>
                          {email.sentiment && (
                            <div className="ml-2 flex-shrink-0">
                              {getSentimentIndicator(email.sentiment)}
                            </div>
                          )}
                        </div>
                        
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {email.preview}
                        </p>
                        
                        {email.labels && email.labels.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {email.labels.map(label => (
                              <span key={label} className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                {label}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Email expanded view */}
                        {selectedEmail === email.id && (
                          <div className="mt-4 border-t border-gray-200 pt-4">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">{email.subject}</h3>
                                <div className="mt-1 flex items-center">
                                  <p className="text-sm text-gray-500">
                                    De: <span className="font-medium text-gray-900">{email.sender}</span> 
                                    <span className="ml-1 text-gray-500">({email.senderEmail})</span>
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <button
                                  className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100"
                                  title="Archiver"
                                >
                                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                  </svg>
                                </button>
                                
                                <button
                                  className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100"
                                  title="Répondre"
                                >
                                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                  </svg>
                                </button>
                                
                                <button
                                  className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100"
                                  title="Marquer comme non lu"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEmails(emails.map(e => e.id === email.id ? {...e, isRead: false} : e));
                                    setEmailStats(prev => ({...prev, unread: prev.unread + 1}));
                                  }}
                                >
                                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            
                            <div className="mt-6 prose prose-sm max-w-none text-gray-700">
                              <p>{email.body || email.preview}</p>
                              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae elit libero, a pharetra augue. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum.</p>
                              <p>Cordialement,<br/>{email.sender}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
      {/* Add Email Modal */}
      {connectModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm">
          <div className="flex min-h-screen items-end sm:items-center justify-center p-4 sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity" 
              onClick={() => setConnectModalOpen(false)}
              aria-hidden="true"
            ></div>

            <div className="inline-block w-full transform overflow-hidden rounded-t-xl sm:rounded-2xl bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 sm:px-6 pt-5 pb-4 sm:pt-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Connecter une boîte mail
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Sélectionnez votre fournisseur de messagerie pour vous connecter et synchroniser vos emails.
                      </p>
                      
                      <div className="mt-6 space-y-3">
                        <button
                          onClick={() => handleConnectEmail('gmail')}
                          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          disabled={connectionLoading}
                        >
                          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#EA4335">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 12.5h-3.5V18h-3v-3.5H7v-3h3.5V8h3v3.5H17v3z" />
                          </svg>
                          Gmail
                        </button>
                        
                        <button
                          onClick={() => handleConnectEmail('outlook')}
                          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          disabled={connectionLoading}
                        >
                          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#0078D4">
                            <path d="M21.386 8.108V19.25h-2.877V9.827L12 15.7l-6.509-5.872V19.25H2.614V8.108L12 16l9.386-7.892z" />
                          </svg>
                          Outlook
                        </button>
                        
                        <button
                          onClick={() => handleConnectEmail('custom')}
                          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          disabled={connectionLoading}
                        >
                          Autre service (IMAP/SMTP)
                        </button>
                      </div>
                      
                      {connectionError && (
                        <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                          {connectionError}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setConnectModalOpen(false)}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
