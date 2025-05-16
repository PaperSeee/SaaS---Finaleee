"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";
import PublicHeader from "@/components/PublicHeader";
import { Tab } from "@headlessui/react";
import { motion } from "framer-motion";

export default function EmailManagementPage() {
  const { t } = useLanguage();
  const [selectedTab, setSelectedTab] = useState(0);
  
  // Benefits data
  const benefits = [
    {
      title: "Priorisation automatique",
      description: "Notre IA analyse le contenu et le contexte de vos emails pour classer automatiquement les messages selon leur importance.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
    {
      title: "Identification des clients mécontents",
      description: "Détection automatique des emails critiques exprimant une insatisfaction pour une prise en charge rapide.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      title: "Classification automatique",
      description: "Catégorisation intelligente des emails selon leur nature (demande d'information, réclamation, support technique, etc.).",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
    },
    {
      title: "Notifications personnalisables",
      description: "Paramétrez des alertes selon vos critères pour être informé immédiatement des messages nécessitant une attention particulière.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
    },
  ];
  
  // Email provider integrations
  const emailProviders = [
    {
      name: "Gmail",
      description: "Connectez vos comptes Gmail professionnels pour une gestion intelligente de vos emails.",
      icon: "/logos/gmail.svg",
      features: ["Synchronisation bidirectionnelle", "Labels intelligents", "Triage automatique", "Détection des priorités"]
    },
    {
      name: "Outlook",
      description: "Intégrez vos comptes Outlook et Microsoft 365 pour centraliser votre communication professionnelle.",
      icon: "/logos/outlook.svg",
      features: ["Classement automatique", "Dossiers intelligents", "Aperçus contextuels", "Filtres personnalisés"]
    },
    {
      name: "Exchange",
      description: "Solution complète pour les entreprises utilisant Microsoft Exchange Server.",
      icon: "/logos/exchange.svg",
      features: ["Intégration serveur complète", "Paramètres d'administration", "Gestion des règles", "Support des dossiers partagés"]
    },
    {
      name: "IMAP",
      description: "Compatible avec tout fournisseur email supportant le protocole IMAP standard.",
      icon: "/logos/imap.svg",
      features: ["Support multi-comptes", "Synchronisation sécurisée", "Configuration personnalisée", "Compatibilité étendue"]
    }
  ];
  
  // Use cases
  const useCases = [
    {
      title: "Réduire le temps de traitement",
      description: "Un cabinet d'avocats traite désormais ses demandes prioritaires 3 fois plus rapidement grâce à notre système de priorisation intelligente.",
      icon: "⏱️"
    },
    {
      title: "Ne jamais manquer un client mécontent",
      description: "Un e-commerce a amélioré son taux de rétention de 35% en identifiant et traitant rapidement les emails de clients insatisfaits.",
      icon: "😊"
    },
    {
      title: "Optimiser le support client",
      description: "Une entreprise SaaS a réduit de 40% le temps de réponse de son équipe support grâce à la classification automatique des demandes.",
      icon: "🛠️"
    },
    {
      title: "Focus sur les communications stratégiques",
      description: "Des commerciaux ont augmenté leur taux de conversion de 22% en se concentrant uniquement sur les emails à fort potentiel identifiés par l'IA.",
      icon: "🎯"
    }
  ];
  
  // Features in detail tabs
  const detailedFeatures = [
    {
      title: "Priorisation intelligente",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Ne manquez plus aucun email important</h3>
            <p className="text-gray-600 mb-4">
              Notre algorithme d'IA analyse le contenu, l'expéditeur et le contexte de chaque email pour déterminer automatiquement son niveau d'urgence.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Identification des emails nécessitant une réponse urgente</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Reconnaissance des clients VIP et historique de communication</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Détection des délais mentionnés dans les messages</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Apprentissage continu basé sur vos interactions</span>
              </li>
            </ul>
          </div>
          <div className="relative h-72 md:h-auto rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <Image
              src="/screenshots/email-prioritization.png"
              alt="Priorisation intelligente des emails"
              fill
              className="object-cover"
            />
          </div>
        </div>
      )
    },
    {
      title: "Détection des sentiments",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative h-72 md:h-auto rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <Image
              src="/screenshots/sentiment-detection.png"
              alt="Détection des sentiments dans les emails"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Identifiez l'état émotionnel de vos clients</h3>
            <p className="text-gray-600 mb-4">
              Notre technologie d'analyse de sentiments détecte les émotions exprimées dans les emails pour vous permettre d'adapter votre réponse.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Détection des clients mécontents ou frustrés</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Identification des opportunités (clients enthousiastes)</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Analyse contextuelle des messages ambigus</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Suggestions de ton pour vos réponses</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Réponses suggérées",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Répondez plus rapidement avec l'aide de l'IA</h3>
            <p className="text-gray-600 mb-4">
              Bénéficiez de suggestions de réponses intelligentes adaptées au contexte de chaque conversation pour gagner un temps précieux.
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
                <span>Suggestions contextuelles basées sur l'historique</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Adaptation automatique au ton et style de votre entreprise</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Optimisation continue par apprentissage</span>
              </li>
            </ul>
          </div>
          <div className="relative h-72 md:h-auto rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <Image
              src="/screenshots/suggested-replies.png"
              alt="Réponses suggérées par IA"
              fill
              className="object-cover"
            />
          </div>
        </div>
      )
    },
    {
      title: "Automatisation des tâches",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative h-72 md:h-auto rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <Image
              src="/screenshots/email-automation.png"
              alt="Automatisation des tâches email"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Simplifiez votre gestion d'emails grâce à l'automatisation</h3>
            <p className="text-gray-600 mb-4">
              Configurez des règles personnalisées pour automatiser les actions répétitives et vous concentrer sur les tâches à valeur ajoutée.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Classement automatique des emails par catégorie</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Assignation automatique aux membres de l'équipe</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Règles conditionnelles personnalisables</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Intégration avec vos outils de travail</span>
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
      title: "Connectez vos comptes email",
      description: "Intégrez facilement vos boîtes mail professionnelles (Gmail, Outlook, Exchange ou autres) via notre interface sécurisée.",
      icon: "📧"
    },
    {
      title: "Configuration initiale",
      description: "Personnalisez vos critères de priorisation et catégories selon vos besoins spécifiques ou utilisez nos paramètres recommandés.",
      icon: "⚙️"
    },
    {
      title: "Analyse automatique",
      description: "Notre IA analyse en continu vos emails entrants pour les classer par priorité et catégorie en temps réel.",
      icon: "🤖"
    },
    {
      title: "Gestion optimisée",
      description: "Traitez vos emails selon leur importance réelle et non leur ordre d'arrivée pour une efficacité maximale.",
      icon: "✅"
    },
    {
      title: "Amélioration continue",
      description: "Le système apprend de vos interactions pour affiner ses analyses et s'adapter parfaitement à vos habitudes de travail.",
      icon: "📈"
    }
  ];
  
  // FAQ items
  const faqItems = [
    {
      question: "Est-ce que vos algorithmes lisent le contenu de mes emails ?",
      answer: "Notre système utilise des algorithmes d'IA pour analyser le contenu de vos emails afin d'en déterminer la priorité et la catégorie. Cependant, nous respectons strictement votre confidentialité : toutes les analyses sont effectuées de manière sécurisée, aucun humain n'accède à vos données, et nous ne stockons pas le contenu de vos emails plus longtemps que nécessaire pour fournir le service."
    },
    {
      question: "Puis-je connecter plusieurs comptes email différents ?",
      answer: "Absolument ! Notre solution permet de connecter plusieurs comptes email, qu'ils soient personnels ou partagés au sein d'une équipe. Vous pouvez par exemple intégrer votre Gmail professionnel, votre adresse Outlook d'entreprise et une boîte mail partagée pour le support client, le tout géré depuis notre interface unique."
    },
    {
      question: "Comment le système détermine-t-il la priorité d'un email ?",
      answer: "Notre algorithme analyse plusieurs facteurs pour déterminer la priorité : l'expéditeur et son historique d'interactions avec vous, les mots-clés contenus dans l'objet et le corps du message, les mentions de délais, le ton et le sentiment exprimés, ainsi que votre propre comportement passé face à des emails similaires. Le système s'adapte en permanence à vos habitudes pour affiner ses prédictions."
    },
    {
      question: "Est-ce compatible avec mon client de messagerie actuel ?",
      answer: "Notre solution s'intègre avec la plupart des clients de messagerie populaires. Vous pouvez continuer à utiliser Gmail, Outlook ou votre client préféré, tout en bénéficiant de notre couche d'intelligence ajoutée. Nous proposons également des extensions pour navigateurs et applications mobiles pour une expérience optimale, quel que soit votre environnement de travail."
    },
    {
      question: "Mon équipe peut-elle collaborer sur les emails importants ?",
      answer: "Oui, notre plateforme intègre des fonctionnalités collaboratives permettant à votre équipe de gérer efficacement les communications. Vous pouvez assigner des emails à des collègues spécifiques, ajouter des commentaires internes invisibles pour les destinataires, suivre le statut de traitement des messages, et obtenir des statistiques sur les performances de l'équipe."
    },
    {
      question: "La priorisation fonctionne-t-elle avec des emails en langue étrangère ?",
      answer: "Notre système prend en charge plus de 30 langues pour l'analyse de priorité et de sentiment. Les principales langues européennes, asiatiques et arabes sont parfaitement supportées, avec une précision comparable à celle obtenue en français ou en anglais. Si vous travaillez dans un environnement multilingue, notre solution s'adaptera parfaitement à vos besoins."
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
              <span className="block">Gestion intelligente</span>
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                des emails
              </span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Filtrez et priorisez automatiquement vos emails professionnels pour identifier rapidement les messages critiques et ne jamais manquer une communication importante.
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
              Notre technologie d'IA transforme votre boîte de réception en un outil de productivité puissant et intelligent.
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
      
      {/* Email Provider Integrations */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Compatibilité avec vos services de messagerie
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Notre solution s'intègre parfaitement avec tous vos fournisseurs de messagerie professionnelle.
            </p>
          </div>
          
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {emailProviders.map((provider) => (
              <div key={provider.name} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 transition-transform hover:shadow-md">
                <div className="p-8">
                  <div className="flex items-center">
                    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
                      {/* Replace with actual logos in production */}
                      <svg className="h-6 w-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                      </svg>
                    </div>
                    <h3 className="ml-4 text-xl font-semibold text-gray-900">{provider.name}</h3>
                  </div>
                  <p className="mt-4 text-gray-600">{provider.description}</p>
                  <ul className="mt-6 space-y-3">
                    {provider.features.map((feature) => (
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
                    <span>Connecter {provider.name}</span>
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
              Découvrez comment notre plateforme transforme votre gestion des emails professionnels au quotidien.
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
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="p-4"
                  >
                    {feature.content}
                  </motion.div>
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
              Comment nos clients utilisent notre gestion intelligente des emails pour améliorer leur productivité.
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
              Un processus simple pour transformer votre gestion des emails professionnels.
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
              Tout ce que vous devez savoir sur notre solution de gestion intelligente des emails professionnels.
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
                  <span className="block">Prêt à optimiser</span>
                  <span className="block">votre gestion des emails ?</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-blue-100">
                  Créez votre compte gratuit dès aujourd'hui et connectez vos boîtes mail en quelques minutes.
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
