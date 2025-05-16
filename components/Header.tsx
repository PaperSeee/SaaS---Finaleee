import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ReactNode } from 'react';

interface HeaderProps {
  title?: string;
  showNotifications?: boolean;
  actionButton?: ReactNode; // Changed from null | undefined to ReactNode
  onMenuToggle?: () => void; // Changed from null | undefined to function
}

export default function Header({ 
  title = "Dashboard",
  showNotifications = true,
  actionButton = null,
  onMenuToggle,
}: HeaderProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center border-b border-gray-200 bg-white px-4 sm:px-6">
      {/* Mobile menu button */}
      {onMenuToggle && (
        <button
          type="button"
          className="mr-4 text-gray-600 focus:outline-none md:hidden"
          onClick={onMenuToggle}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="sr-only">Ouvrir le menu</span>
        </button>
      )}
      
      {/* Page title */}
      <h1 className="text-xl font-semibold text-gray-900 flex-1">{title}</h1>
      
      {/* Action buttons */}
      <div className="ml-auto flex items-center space-x-4">
        {/* Action button (contextual) */}
        {actionButton && (
          <div>
            {actionButton}
          </div>
        )}
        
        {/* Notifications */}
        {showNotifications && (
          <div className="relative">
            <button
              type="button"
              className="flex rounded-full bg-white p-1 text-gray-600 hover:bg-gray-50 hover:text-gray-900 focus:outline-none"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <span className="sr-only">Voir les notifications</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                3
              </span>
            </button>
            
            {/* Notifications dropdown panel - hidden by default */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">Notifications</p>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto">
                    <Link href="/dashboard/notifications" className="block px-4 py-2 hover:bg-gray-50" prefetch={false}>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 rounded-full bg-blue-100 p-1">
                          <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Nouvel avis 5 étoiles</p>
                          <p className="text-xs text-gray-500">Il y a 10 minutes</p>
                        </div>
                      </div>
                    </Link>
                    
                    <Link href="/dashboard/notifications" className="block px-4 py-2 hover:bg-gray-50">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 rounded-full bg-red-100 p-1">
                          <svg className="h-4 w-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Action requise sur un avis négatif</p>
                          <p className="text-xs text-gray-500">Il y a 1 heure</p>
                        </div>
                      </div>
                    </Link>
                    
                    <Link href="/dashboard/notifications" className="block px-4 py-2 hover:bg-gray-50">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 rounded-full bg-green-100 p-1">
                          <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Rapport mensuel disponible</p>
                          <p className="text-xs text-gray-500">Hier</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                  
                  <div className="border-t border-gray-100 py-2 px-4">
                    <Link href="/dashboard/notifications" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      Voir toutes les notifications
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* User menu */}
        <div className="relative">
          <Link href="/dashboard/profile" className="flex rounded-full bg-white text-sm focus:outline-none">
            <span className="sr-only">Ouvrir le menu utilisateur</span>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-700 font-medium text-sm">
                {user?.user_metadata?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
