"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";
import PublicHeader from "@/components/PublicHeader";

export default function FeaturesPage() {
  const { t } = useLanguage();
  
  // Feature categories
  const featureCategories = [
    {
      id: "reviews",
      title: "Centralisation des avis clients",
      description: "Regroupez tous vos avis clients provenant de Google, Facebook, Trustpilot et d'autres plateformes en un seul endroit.",
      image: "/features/review-management.jpg",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      benefits: [
        "Agrégation en temps réel des avis",
        "Réponse directe depuis la plateforme",
        "Alertes pour les nouveaux avis",
        "Analyses et tendances des sentiments"
      ],
      link: "/features/reviews"
    },
    {
      id: "emails",
      title: "Gestion intelligente des emails",
      description: "Filtrez et priorisez automatiquement vos emails professionnels pour identifier rapidement les messages critiques.",
      image: "/features/email-management.jpg",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      benefits: [
        "Détection des emails urgents",
        "Identification des clients mécontents",
        "Classification automatique par IA", 
        "Notifications personnalisables"
      ],
      link: "/features/emails"
    },
    {
      id: "analytics",
      title: "Analyses et rapports avancés",
      description: "Obtenez des insights précieux sur votre réputation en ligne et la satisfaction de vos clients grâce à des tableaux de bord détaillés.",
      image: "/features/analytics.jpg",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      benefits: [
        "Tableaux de bord personnalisables",
        "Suivi des KPIs de satisfaction",
        "Rapports automatiques périodiques",
        "Exportation des données"
      ],
      link: "/features/analytics"
    },
    {
      id: "teams",
      title: "Gestion d'équipes et collaborateurs",
      description: "Travaillez efficacement en équipe avec des outils de collaboration pour gérer votre réputation et service client.",
      image: "/features/teams.jpg",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      benefits: [
        "Assignation de tâches",
        "Workflow d'approbation",
        "Historique des actions",
        "Gestion des permissions"
      ],
      link: "/features/teams"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <PublicHeader />
      
      {/* Hero Section */}
      <div className="pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              Fonctionnalités puissantes pour votre
              <span className="block text-blue-600">expérience client</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Découvrez notre gamme complète d'outils conçus pour améliorer votre réputation en ligne et optimiser votre satisfaction client.
            </p>
          </div>
          
          {/* Feature Categories Grid */}
          <div className="mt-16 grid gap-10 md:grid-cols-2">
            {featureCategories.map((category) => (
              <div key={category.id} className="flex flex-col bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="relative h-48">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white px-4">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm mb-4">
                        {category.icon}
                      </div>
                      <h2 className="text-2xl font-bold">{category.title}</h2>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 p-6">
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  
                  <ul className="mb-6 space-y-2">
                    {category.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="px-6 pb-6">
                  <Link 
                    href={category.link}
                    className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700"
                  >
                    En savoir plus
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {/* Feature Comparison */}
          <div className="mt-24">
            <h2 className="text-3xl font-bold text-center text-gray-900">Comparaison des fonctionnalités par plan</h2>
            <p className="mt-4 max-w-2xl mx-auto text-center text-lg text-gray-500">
              Découvrez quel plan correspond le mieux à vos besoins
            </p>
            
            <div className="mt-12 overflow-x-auto">
              <div className="inline-block min-w-full py-2 align-middle">
                <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Fonctionnalités</th>
                        <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Free</th>
                        <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-blue-700">Pro</th>
                        <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Business</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">Centralisation des avis</td>
                        <td className="px-3 py-4 text-sm text-center text-gray-500">Limité</td>
                        <td className="px-3 py-4 text-sm text-center text-blue-700">Complet</td>
                        <td className="px-3 py-4 text-sm text-center text-gray-500">Complet</td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">Gestion des emails</td>
                        <td className="px-3 py-4 text-sm text-center text-gray-500">-</td>
                        <td className="px-3 py-4 text-sm text-center text-blue-700">Basique</td>
                        <td className="px-3 py-4 text-sm text-center text-gray-500">Avancé</td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">Analyses et rapports</td>
                        <td className="px-3 py-4 text-sm text-center text-gray-500">Basique</td>
                        <td className="px-3 py-4 text-sm text-center text-blue-700">Standard</td>
                        <td className="px-3 py-4 text-sm text-center text-gray-500">Personnalisé</td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">Gestion d'équipe</td>
                        <td className="px-3 py-4 text-sm text-center text-gray-500">-</td>
                        <td className="px-3 py-4 text-sm text-center text-blue-700">3 membres</td>
                        <td className="px-3 py-4 text-sm text-center text-gray-500">Illimité</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Link 
                href="/pricing"
                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700"
              >
                Voir les détails des plans
                <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:px-8 lg:py-16">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  <span className="block">Prêt à découvrir nos fonctionnalités ?</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-blue-100">
                  Créez votre compte gratuit et commencez à améliorer votre expérience client dès aujourd'hui.
                </p>
              </div>
              <div className="mt-8 lg:mt-0 lg:ml-8 lg:flex-shrink-0">
                <div className="inline-flex rounded-md shadow">
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-6 py-4 text-lg font-medium text-blue-600 hover:bg-blue-50"
                  >
                    Commencer gratuitement
                  </Link>
                </div>
                <div className="mt-4 inline-flex lg:mt-0 lg:ml-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-md border border-white px-6 py-4 text-lg font-medium text-white hover:bg-blue-500"
                  >
                    Demander une démo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
