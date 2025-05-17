"use client";

/// <reference path="../../global.d.ts" />

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";
import PublicHeader from "@/components/PublicHeader";
import { motion } from "framer-motion";
import { Tab } from '@headlessui/react';

export default function ReviewManagementPage() {
  const [selectedTab, setSelectedTab] = useState(0);
  
  // Benefits data
  const benefits = [
    {
      title: "Tout centralisé en un seul endroit",
      description: "Regroupez les avis de Google, Facebook, TripAdvisor, Trustpilot et autres sur un tableau de bord unique pour une gestion simplifiée.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      title: "Réponses rapides et efficaces",
      description: "Répondez à tous vos avis directement depuis notre plateforme sans avoir à jongler entre différents sites et applications.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
    },
    {
      title: "Analyses de sentiments avancées",
      description: "Notre IA analyse automatiquement le ton et le contenu des avis pour vous aider à identifier les tendances et les problèmes récurrents.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      title: "Alertes en temps réel",
      description: "Recevez des notifications instantanées pour les nouveaux avis, particulièrement pour ceux négatifs qui nécessitent une attention immédiate.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
    },
  ];
  
  // Platform integration details
  const platforms = [
    {
      name: "Google My Business",
      description: "Connectez votre profil Google My Business pour importer automatiquement les avis et y répondre directement.",
      icon: "/logos/google.svg",
      features: ["Import automatique des avis", "Réponses directes", "Statistiques détaillées", "Historique complet"]
    },
    {
      name: "Facebook",
      description: "Intégrez vos pages Facebook pour centraliser les avis et commentaires de vos clients sur le réseau social.",
      icon: "/logos/facebook.svg",
      features: ["Synchronisation des avis Pages", "Réponses aux recommandations", "Analyse des sentiments", "Alertes personnalisées"]
    },
    {
      name: "Trustpilot",
      description: "Importez et gérez vos avis Trustpilot pour avoir une vision complète de votre réputation en ligne.",
      icon: "/logos/trustpilot.svg",
      features: ["Notifications en temps réel", "Modèles de réponses", "Filtres avancés", "Rapports hebdomadaires"]
    },
    {
      name: "TripAdvisor",
      description: "Surveillez et gérez votre présence sur TripAdvisor, essentiel pour les entreprises du tourisme et de la restauration.",
      icon: "/logos/tripadvisor.svg",
      features: ["Import des nouvelles évaluations", "Analyse des mots-clés", "Comparaison avec la concurrence", "Détection des tendances"]
    },
    {
      name: "Yelp",
      description: "Ne manquez aucun avis Yelp et interagissez efficacement avec les clients qui vous évaluent sur cette plateforme.",
      icon: "/logos/yelp.svg",
      features: ["Suivi des évaluations", "Alertes avis négatifs", "Statistiques d'engagement", "Exportation des données"]
    }
  ];
  
  // Case studies and use cases
  const useCases = [
    {
      title: "Réagir rapidement aux avis négatifs",
      description: "Un restaurant parisien a pu améliorer son score Google de 3,7 à 4,5 étoiles en 6 mois en répondant rapidement et efficacement aux avis négatifs grâce à nos alertes en temps réel.",
      icon: "🔍"
    },
    {
      title: "Analyser les tendances et points d'amélioration",
      description: "Une chaîne d'hôtels a identifié des problèmes récurrents avec le service en chambre grâce à notre analyse de sentiments, permettant des ajustements ciblés qui ont augmenté la satisfaction client de 23%.",
      icon: "📈"
    },
    {
      title: "Unifier la gestion multi-établissements",
      description: "Une franchise de 15 magasins a centralisé la gestion de plus de 2000 avis mensuels, réduisant le temps consacré à cette tâche de 40 heures à seulement 10 heures par semaine.",
      icon: "🏢"
    },
    {
      title: "Transformer les clients mécontents en ambassadeurs",
      description: "Un service client proactif grâce aux alertes a permis à un e-commerce de récupérer 68% des clients insatisfaits et de les convertir en acheteurs réguliers.",
      icon: "🔄"
    }
  ];
  
  // Features in detail tabs
  const detailedFeatures = [
    {
      title: "Tableau de bord centralisé",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Vue unifiée de tous vos avis</h3>
            <p className="text-gray-600 mb-4">
              Notre tableau de bord intuitif regroupe tous vos avis de différentes plateformes en un seul endroit, offrant une vue d'ensemble claire et organisée.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Filtrage par plateforme, note, date ou établissement</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Vue chronologique ou par importance</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Identification visuelle rapide des avis nécessitant une action</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Statistiques en temps réel et évolution dans le temps</span>
              </li>
            </ul>
          </div>
          <div className="relative h-72 md:h-auto rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <Image
              src="/screenshots/dashboard-reviews.png"
              alt="Tableau de bord des avis clients"
              fill
              className="object-cover"
            />
          </div>
        </div>
      )
    },
    {
      title: "Gestion des réponses",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative h-72 md:h-auto rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <Image
              src="/screenshots/response-management.png"
              alt="Interface de gestion des réponses"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Répondez efficacement à tous vos avis</h3>
            <p className="text-gray-600 mb-4">
              Notre système de gestion des réponses vous permet de créer, valider et publier des réponses à vos avis clients directement depuis notre plateforme.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Modèles de réponses personnalisables</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Workflow d'approbation pour les équipes</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Suggestions de réponses par IA selon le contexte</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Historique complet des interactions</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Analyse des sentiments",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Comprendre l'opinion de vos clients</h3>
            <p className="text-gray-600 mb-4">
              Notre technologie d'intelligence artificielle analyse automatiquement le contenu de vos avis pour en extraire les sentiments, tendances et sujets récurrents.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Détection automatique des thématiques évoquées</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Évaluation du sentiment positif, neutre ou négatif</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Identification des points forts et axes d'amélioration</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Rapports d'analyse détaillés exportables</span>
              </li>
            </ul>
          </div>
          <div className="relative h-72 md:h-auto rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <Image
              src="/screenshots/sentiment-analysis.png"
              alt="Analyse des sentiments"
              fill
              className="object-cover"
            />
          </div>
        </div>
      )
    },
    {
      title: "Système d'alertes",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative h-72 md:h-auto rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <Image
              src="/screenshots/alert-system.png"
              alt="Système d'alertes"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Ne manquez jamais un avis important</h3>
            <p className="text-gray-600 mb-4">
              Configurez des alertes personnalisées pour être immédiatement informé des avis qui nécessitent votre attention, selon vos propres critères.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Alertes instantanées pour les avis négatifs (1-2 étoiles)</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Notifications par email, SMS ou push</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Filtres personnalisables par note, mot-clé ou plateforme</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Assignation automatique aux membres de l'équipe</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
  ];
  
  // How it works steps
  const steps = [
    {
      title: "Connectez vos plateformes",
      description: "Intégrez en quelques clics vos profils Google My Business, Facebook, Trustpilot et autres sources d'avis clients.",
      icon: "🔌"
    },
    {
      title: "Importation automatique",
      description: "Notre système récupère automatiquement tous vos avis existants et configure la synchronisation en temps réel pour les nouveaux avis.",
      icon: "⚙️"
    },
    {
      title: "Centralisez et analysez",
      description: "Accédez à tous vos avis sur un tableau de bord unifié avec des statistiques et analyses de sentiments avancées.",
      icon: "📊"
    },
    {
      title: "Répondez efficacement",
      description: "Utilisez nos modèles personnalisés et suggestions IA pour répondre rapidement et de manière pertinente à chaque avis.",
      icon: "✍️"
    },
    {
      title: "Suivez vos progrès",
      description: "Visualisez l'évolution de votre réputation en ligne et identifiez les points d'amélioration grâce à nos rapports détaillés.",
      icon: "📈"
    }
  ];
  
  // FAQ items
  const faqItems = [
    {
      question: "Combien de temps faut-il pour configurer la centralisation des avis ?",
      answer: "La mise en place initiale prend généralement entre 10 et 30 minutes selon le nombre de plateformes que vous souhaitez connecter. Notre assistant d'intégration vous guide pas à pas, et l'importation de vos avis historiques se fait automatiquement en arrière-plan."
    },
    {
      question: "Est-ce que je peux connecter plusieurs établissements ou succursales ?",
      answer: "Absolument ! Notre système est conçu pour gérer les entreprises multi-établissements. Vous pouvez connecter plusieurs profils Google My Business, pages Facebook, etc., et les organiser par localisation ou par marque selon vos besoins."
    },
    {
      question: "Comment fonctionne la réponse aux avis depuis votre plateforme ?",
      answer: "Notre système utilise les API officielles des plateformes d'avis pour publier vos réponses directement sur les sites d'origine. Vos réponses apparaissent comme si vous les aviez publiées directement sur Google, Facebook ou autres, avec la même visibilité pour vos clients."
    },
    {
      question: "Puis-je permettre à plusieurs membres de mon équipe d'accéder au système ?",
      answer: "Oui, notre plateforme offre une gestion des utilisateurs avec différents niveaux de permissions. Vous pouvez inviter des collègues, définir leurs droits d'accès (lecture seule, réponse aux avis, administration, etc.) et même créer des workflows d'approbation pour les réponses."
    },
    {
      question: "Quelles plateformes d'avis sont supportées ?",
      answer: "Notre solution prend en charge les principales plateformes d'avis: Google My Business, Facebook, Trustpilot, TripAdvisor, Yelp, et bien d'autres. Nous ajoutons régulièrement de nouvelles intégrations selon les besoins de nos clients."
    },
    {
      question: "Comment puis-je mesurer l'amélioration de ma réputation en ligne ?",
      answer: "Notre tableau de bord inclut des indicateurs clés de performance (KPI) qui suivent l'évolution de votre note moyenne, le volume d'avis, les délais de réponse et l'engagement client. Vous pouvez également générer des rapports périodiques pour mesurer votre progression dans le temps."
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <PublicHeader />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-20">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Centralisation des</span>
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                avis clients
              </span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Regroupez tous vos avis clients provenant de Google, Facebook, Trustpilot et d'autres plateformes en un seul endroit pour une gestion simplifiée et efficace.
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                href="/auth/register"
                className="rounded-md bg-blue-600 px-8 py-3 text-base font-medium text-white shadow-md hover:bg-blue-700"
                prefetch={false}
              >
                Essayer gratuitement
              </Link>
              <Link
                href="/pricing"
                className="ml-4 rounded-md border border-blue-600 bg-white px-8 py-3 text-base font-medium text-blue-600 shadow-md hover:bg-gray-50"
              >
                Voir les tarifs
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Key Benefits Section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Les avantages clés de notre solution
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Notre plateforme de centralisation des avis clients vous offre tout ce dont vous avez besoin pour gérer efficacement votre réputation en ligne.
            </p>
          </div>
          
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="bg-gray-50 rounded-lg p-8 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 text-blue-600">
                  {benefit.icon}
                </div>
                <h3 className="mt-4 text-xl font-medium text-gray-900">{benefit.title}</h3>
                <p className="mt-2 text-base text-gray-500">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Platform Integrations */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Plateformes prises en charge
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Connectez toutes vos sources d'avis clients à notre système pour une gestion complète de votre réputation en ligne.
            </p>
          </div>
          
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {platforms.map((platform) => (
              <div key={platform.name} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 transition-transform hover:shadow-md">
                <div className="p-8">
                  <div className="flex items-center">
                    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
                      {/* Replace with actual logos in production */}
                      <svg className="h-6 w-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                      </svg>
                    </div>
                    <h3 className="ml-4 text-xl font-semibold text-gray-900">{platform.name}</h3>
                  </div>
                  <p className="mt-4 text-gray-600">{platform.description}</p>
                  <ul className="mt-6 space-y-3">
                    {platform.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-4">
                  <Link 
                    href="/auth/register" 
                    className="flex items-center justify-end text-blue-600 font-medium"
                  >
                    <span>Connecter cette plateforme</span>
                    <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Features in Detail */}
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Fonctionnalités en détail
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Découvrez comment notre plateforme transforme votre gestion des avis clients au quotidien.
            </p>
          </div>
          
          <Tab.Group onChange={setSelectedTab}>
            <Tab.List className="flex space-x-2 rounded-xl bg-blue-50 p-1 mb-12">
              {detailedFeatures.map((feature) => (
                <Tab
                  key={feature.title}
                  className={({ selected }) =>
                    `w-full rounded-lg py-3 text-sm font-medium leading-5 transition-colors
                    ${
                      selected
                        ? 'bg-white text-blue-700 shadow'
                        : 'text-blue-600 hover:bg-blue-100'
                    }`
                  }
                >
                  {feature.title}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels>
              {detailedFeatures.map((feature, idx) => (
                <Tab.Panel
                  key={idx}
                  className={`rounded-xl bg-white p-3 transition-opacity duration-300 ${
                    selectedTab === idx ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="p-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {feature.content}
                    </motion.div>
                  </div>
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
      
      {/* Use Cases */}
      <div className="py-16 sm:py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Cas d'utilisation concrets
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Découvrez comment nos clients utilisent notre solution de centralisation des avis pour améliorer leur réputation en ligne.
            </p>
          </div>
          
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {useCases.map((useCase) => (
              <div key={useCase.title} className="bg-white rounded-lg p-8 shadow-sm border border-gray-100">
                <div className="text-3xl mb-4">{useCase.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900">{useCase.title}</h3>
                <p className="mt-4 text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* How It Works */}
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Comment ça marche
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Un processus simple en 5 étapes pour centraliser et gérer efficacement tous vos avis clients.
            </p>
          </div>
          
          <div className="mt-16 relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200 hidden md:block"></div>
            
            {steps.map((step, index) => (
              <div key={step.title} className={`relative mb-12 ${index % 2 === 0 ? 'md:ml-auto md:pl-12' : 'md:mr-auto md:pr-12'} md:w-1/2`}>
                <div className="md:absolute md:left-0 md:transform md:-translate-x-1/2 md:top-0 h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl z-10 mb-4 md:mb-0">
                  {step.icon}
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">{index + 1}. {step.title}</h3>
                  <p className="mt-2 text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="py-16 sm:py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Questions fréquentes
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Tout ce que vous devez savoir sur notre solution de centralisation des avis clients.
            </p>
          </div>
          
          <div className="mt-16 max-w-3xl mx-auto">
            {faqItems.map((item, index) => (
              <details key={index} className="group mb-4 rounded-lg bg-white p-6 shadow-sm border border-gray-100">
                <summary className="flex cursor-pointer items-center justify-between font-medium text-gray-900">
                  <span>{item.question}</span>
                  <span className="ml-6 flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-600 group-open:rotate-180">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-gray-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
      
      {/* Final CTA */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 md:py-16 lg:px-8 lg:py-20">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  <span className="block">Prêt à centraliser</span>
                  <span className="block">tous vos avis clients ?</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-blue-100">
                  Créez votre compte gratuit dès aujourd'hui et connectez vos plateformes en quelques minutes.
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
