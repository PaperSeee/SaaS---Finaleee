import { useState } from 'react';
import Link from 'next/link';

// Types pour les notifications
type NotificationStatus = 'unread' | 'read' | 'action_required';
type NotificationSource = 'email' | 'urssaf' | 'impots' | 'bank' | 'client';

interface Notification {
  id: string;
  title: string;
  description: string;
  source: NotificationSource;
  date: string;
  status: NotificationStatus;
}

// Mock data pour l'affichage
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Facture URSSAF reçue',
    description: 'Votre facture trimestrielle est disponible. Montant: 1250,00€. Échéance: 15/05/2025.',
    source: 'urssaf',
    date: '2025-05-01',
    status: 'action_required',
  },
  {
    id: '2',
    title: 'Déclaration impôts professionnels',
    description: 'Rappel: votre déclaration doit être soumise avant le 31/05/2025.',
    source: 'impots',
    date: '2025-04-28',
    status: 'action_required',
  },
  {
    id: '3',
    title: 'Virement client reçu',
    description: 'Un virement de 3800,00€ a été reçu de Entreprise XYZ.',
    source: 'bank',
    date: '2025-04-25',
    status: 'read',
  },
  {
    id: '4',
    title: 'Nouvelle demande client',
    description: 'Entreprise ABC vous a envoyé une demande de devis pour un nouveau projet.',
    source: 'email',
    date: '2025-04-22',
    status: 'unread',
  },
  {
    id: '5',
    title: 'Relevé bancaire disponible',
    description: 'Votre relevé bancaire du mois d\'avril est maintenant disponible.',
    source: 'bank',
    date: '2025-05-02',
    status: 'unread',
  },
];

export default function ImportantNotifications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  // Filtrage des notifications
  const filteredNotifications = MOCK_NOTIFICATIONS.filter(notification => {
    // Filtre par terme de recherche
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         notification.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtre par statut
    const matchesStatus = statusFilter === 'all' || notification.status === statusFilter;
    
    // Filtre par source
    const matchesSource = sourceFilter === 'all' || notification.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  // Rendu des icônes selon la source
  const renderSourceIcon = (source: NotificationSource) => {
    switch (source) {
      case 'email':
        return (
          <div className="bg-blue-100 rounded-full p-3 text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
        );
      case 'urssaf':
        return (
          <div className="bg-purple-100 rounded-full p-3 text-purple-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
        );
      case 'impots':
        return (
          <div className="bg-green-100 rounded-full p-3 text-green-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
        );
      case 'bank':
        return (
          <div className="bg-amber-100 rounded-full p-3 text-amber-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
            </svg>
          </div>
        );
      case 'client':
        return (
          <div className="bg-red-100 rounded-full p-3 text-red-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 rounded-full p-3 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        );
    }
  };

  // Rendu du badge de statut
  const renderStatusBadge = (status: NotificationStatus) => {
    switch (status) {
      case 'unread':
        return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Non lu</span>;
      case 'read':
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Lu</span>;
      case 'action_required':
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">À traiter</span>;
      default:
        return null;
    }
  };

  // Formatage de la date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', options).format(date);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* En-tête et filtres */}
      <div className="p-5 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
            Notifications importantes
          </h2>
          
          {/* Barre de recherche */}
          <div className="flex-1 md:max-w-xs">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input 
                type="search"
                className="block w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="mt-4 flex flex-wrap gap-2">
          <select 
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="unread">Non lu</option>
            <option value="read">Lu</option>
            <option value="action_required">À traiter</option>
          </select>

          <select 
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
          >
            <option value="all">Toutes les sources</option>
            <option value="email">Emails</option>
            <option value="urssaf">URSSAF</option>
            <option value="impots">Impôts</option>
            <option value="bank">Banque</option>
            <option value="client">Clients</option>
          </select>
        </div>
      </div>

      {/* Liste des notifications */}
      <div className="overflow-hidden divide-y divide-gray-200">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune notification</h3>
            <p className="mt-1 text-sm text-gray-500">
              Aucune notification ne correspond à vos critères de recherche.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div 
              key={notification.id}
              className={`p-5 hover:bg-gray-50 transition-colors ${
                notification.status === 'unread' ? 'bg-blue-50/30' : notification.status === 'action_required' ? 'bg-red-50/30' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icône de la source */}
                <div className="flex-shrink-0">
                  {renderSourceIcon(notification.source)}
                </div>
                
                {/* Contenu principal */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap justify-between gap-2 mb-1">
                    <h3 className="text-base font-semibold text-gray-900 truncate">
                      {notification.title}
                    </h3>
                    {renderStatusBadge(notification.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {notification.description}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Reçue le {formatDate(notification.date)}
                    </span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex-shrink-0 flex items-center self-center ml-2">
                  <Link 
                    href={`/dashboard/notifications/${notification.id}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    prefetch={false}
                  >
                    <span className="sr-only">Voir détails</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Footer / Pagination (optionnel) */}
      <div className="bg-gray-50 px-5 py-3 flex justify-between items-center border-t border-gray-200">
        <div className="text-sm text-gray-500">
          <span className="font-medium">{filteredNotifications.length}</span> notification(s) au total
        </div>
        <Link 
          href="/notifications" 
          className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
        >
          Voir toutes les notifications
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </Link>
      </div>
    </div>
  );
}
