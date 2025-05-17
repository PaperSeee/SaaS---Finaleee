"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CustomLogo } from "@/components/CustomLogo";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // For parallax scrolling effect
  const ref = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const scrollY = window.scrollY;
      const scrollMax = window.innerHeight;
      const ratio = Math.min(scrollY / scrollMax, 1);
      
      // Apply transform and opacity directly
      const overlay = ref.current.querySelector('.parallax-overlay');
      if (overlay instanceof HTMLElement) {
        overlay.style.transform = `translateY(${scrollY * 0.2}px)`;
        overlay.style.opacity = `${1 - (ratio * 0.5)}`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Expected outcomes data - enhanced with better descriptions and custom icons
  const expectedOutcomes = [
    {
      title: "Centralisation des avis",
      description: "Tous vos avis clients en un seul endroit pour une gestion simplifiée et un gain de temps considérable",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      benefit: "Gagnez jusqu'à 5 heures par semaine sur la gestion de votre réputation en ligne et augmentez votre visibilité de 40%"
    },
    {
      title: "Intelligence email",
      description: "Priorisation automatique des emails critiques grâce à l'IA pour une réactivité optimale et une meilleure satisfaction client",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 11l3 3 3-3" />
        </svg>
      ),
      benefit: "Réduisez votre temps de réponse aux clients insatisfaits de 60% et diminuez le taux d'attrition de 25%"
    },
    {
      title: "Analyse de sentiments",
      description: "Comprenez l'opinion de vos clients grâce à l'analyse automatique des avis et identifiez les tendances émergentes",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          <circle cx="19" cy="5" r="1" fill="currentColor" />
          <circle cx="15" cy="9" r="1" fill="currentColor" />
          <circle cx="12" cy="14" r="1" fill="currentColor" />
        </svg>
      ),
      benefit: "Identifiez les axes d'amélioration prioritaires pour votre business et augmentez votre score de satisfaction client de 35%"
    }
  ];
  
  // Pricing plans data
  const plans = [
    {
      name: "Gratuit",
      description: "Pour essayer nos fonctionnalités de base",
      price: 0,
      features: [
        "3 sources d'avis maximum",
        "1 boîte email connectée",
        "Tableaux de bord basiques",
        "100 avis par mois",
        "Support communautaire"
      ],
      cta: "Commencer gratuitement",
      popular: false
    },
    {
      name: "Pro",
      description: "Pour les petites et moyennes entreprises",
      price: 29,
      features: [
        "10 sources d'avis",
        "3 boîtes email connectées",
        "Rapports personnalisés",
        "Avis illimités",
        "Alertes en temps réel",
        "Support prioritaire"
      ],
      cta: "Essai gratuit de 14 jours",
      popular: true
    },
    {
      name: "Business",
      description: "Pour les entreprises avec plusieurs établissements",
      price: 99,
      features: [
        "Sources d'avis illimitées",
        "Boîtes email illimitées",
        "API complète",
        "Intégrations personnalisées",
        "Gestionnaire de compte dédié"
      ],
      cta: "Contacter le commercial",
      popular: false
    }
  ];
  
  // Features data
  const features = [
    {
      title: "Centralisation des avis clients",
      description: "Regroupez tous vos avis clients provenant de Google, Facebook, Trustpilot et d'autres plateformes en un seul endroit.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      subFeatures: [
        "Agrégation en temps réel des avis",
        "Réponse directe depuis la plateforme",
        "Alertes pour les nouveaux avis",
        "Analyses et tendances des sentiments"
      ]
    },
    {
      title: "Gestion intelligente des emails",
      description: "Filtrez et priorisez automatiquement vos emails professionnels pour identifier rapidement les messages critiques.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      subFeatures: [
        "Détection des emails urgents",
        "Identification des clients mécontents",
        "Classification automatique par IA",
        "Notifications personnalisables"
      ]
    }
  ];
  
  // How it works steps
  const steps = [
    {
      title: "Connectez vos comptes",
      description: "Liez vos profils d'entreprise et vos boîtes mail en quelques clics",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Surveillez en temps réel",
      description: "Visualisez et analysez tous vos avis et emails critiques sur un tableau de bord unifié",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: "Réagissez efficacement",
      description: "Répondez rapidement aux avis et emails prioritaires pour améliorer votre satisfaction client",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center" prefetch={false}>
              <CustomLogo width={120} height={40} />
            </Link>
            
            <div className="hidden md:flex md:items-center md:space-x-6">
              <Link href="/pricing" className="text-base font-medium text-gray-600 hover:text-gray-900">
                Tarifs
              </Link>
              <Link href="/faq" className="text-base font-medium text-gray-600 hover:text-gray-900">
                FAQ
              </Link>
              <Link href="/contact" className="text-base font-medium text-gray-600 hover:text-gray-900">
                Contact
              </Link>
              
              {isAuthenticated ? (
                <Link 
                  href="/dashboard" 
                  className="ml-8 inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/auth/login" className="text-base font-medium text-gray-600 hover:text-gray-900">
                    Se connecter
                  </Link>
                  <Link 
                    href="/auth/register" 
                    className="ml-8 inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700"
                  >
                    Essayer gratuitement
                  </Link>
                </>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Ouvrir le menu</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Mobile dropdown */}
            {mobileMenuOpen && (
              <div className="absolute inset-x-0 top-full z-40 bg-white border-t border-gray-100 shadow-md md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <Link href="/pricing" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                    Tarifs
                  </Link>
                  <Link href="/faq" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                    FAQ
                  </Link>
                  <Link href="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                    Contact
                  </Link>
                  {!isAuthenticated ? (
                    <>
                      <Link href="/auth/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                        Se connecter
                      </Link>
                      <Link href="/auth/register" className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700">
                        Essayer gratuitement
                      </Link>
                    </>
                  ) : (
                    <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700">
                      Dashboard
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main>
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-white" ref={ref}>
          <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50">
            {/* Parallax overlay */}
            <div className="parallax-overlay absolute inset-0 h-full w-full transition-transform duration-300 ease-out" />
          </div>
          
          <div className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 lg:pt-24 lg:pb-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="sm:text-center md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:items-center">
                <div>
                  {/* Hero "Nouveau" badge */}
                  <div className="animate-fadeIn">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800">
                      Nouveau
                    </span>
                  </div>
                  
                  {/* Hero title */}
                  <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:mt-5 sm:text-5xl lg:mt-6 xl:text-6xl">
                    <div className="animate-fadeIn animation-delay-100">
                      <span className="block">Maîtrisez votre réputation</span>
                      <span className="block text-blue-600">en ligne sans effort</span>
                    </div>
                  </h1>
                  
                  {/* Hero subtitle */}
                  <div className="animate-fadeIn animation-delay-200">
                    <div className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                      Centralisez vos avis et vos e-mails critiques sur un seul dashboard intelligent pour améliorer votre satisfaction client et votre réputation digitale.
                    </div>
                  </div>
                  
                  {/* Hero CTAs */}
                  <div className="animate-fadeIn animation-delay-300">
                    <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start">
                      <div className="rounded-md shadow">
                        <Link
                          href="/auth/register"
                          className="flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 md:py-4 md:px-10 md:text-lg"
                        >
                          Essayer gratuitement
                        </Link>
                      </div>
                      <div className="mt-3 sm:mt-0 sm:ml-3">
                        <Link
                          href="/pricing"
                          className="flex w-full items-center justify-center rounded-md border border-transparent bg-blue-100 px-8 py-3 text-base font-medium text-blue-700 hover:bg-blue-200 md:py-4 md:px-10 md:text-lg"
                        >
                          Voir les tarifs
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative mt-12 sm:mx-auto sm:max-w-lg lg:mt-0 lg:max-w-none lg:col-span-6">
                <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                  <div className="relative block w-full overflow-hidden rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Image
                      src="/dashboard-preview.png"
                      alt="Dashboard de Kritiqo"
                      width={800}
                      height={500}
                      className="w-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 mix-blend-multiply opacity-10"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-white"
                      >
                        <svg className="h-5 w-5 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Voir la démo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Early Adopters Section (replacing partners section) */}
        <div className="bg-gray-50 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900">Programme Early Adopter</h2>
              <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                Rejoignez notre programme early adopter et bénéficiez d'avantages exclusifs
              </p>
              
              <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                  <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Tarif préférentiel</h3>
                  <p className="mt-2 text-sm text-gray-600">Bénéficiez d'une remise de 30% sur votre abonnement pendant 12 mois</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                  <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Accès prioritaire</h3>
                  <p className="mt-2 text-sm text-gray-600">Accédez en avant-première aux nouvelles fonctionnalités et influencez nos priorités</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                  <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Support dédié</h3>
                  <p className="mt-2 text-sm text-gray-600">Bénéficiez d'un accompagnement personnalisé par notre équipe fondatrice</p>
                </div>
              </div>
              
              <Link
                href="/auth/register"
                className="mt-8 inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-5 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 sm:mt-10"
              >
                Rejoindre le programme
              </Link>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="py-16 sm:py-24 lg:py-32 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="animate-fadeIn">
                <h2 className="text-base font-semibold uppercase tracking-wide text-blue-600">
                  Fonctionnalités principales
                </h2>
              </div>
              <div className="animate-fadeIn animation-delay-100">
                <div className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Tout ce dont vous avez besoin
                </div>
              </div>
              <div className="animate-fadeIn animation-delay-200">
                <div className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                  Une solution complète pour gérer votre réputation digitale et rester au top de vos communications clients
                </div>
              </div>
            </div>

            <div className="mt-16">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                {features.map((feature, index) => (
                  <div key={feature.title} className="bg-gray-50 rounded-xl overflow-hidden shadow-lg">
                    <div className="animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="p-8">
                        <div className="flex items-center">
                          <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                            {feature.icon}
                          </div>
                          <h3 className="ml-4 text-xl font-bold text-gray-900">{feature.title}</h3>
                        </div>
                        <p className="mt-5 text-gray-600">{feature.description}</p>
                        
                        <ul className="mt-8 space-y-3">
                          {feature.subFeatures.map((subFeature) => (
                            <li key={subFeature} className="flex items-start">
                              <svg className="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="ml-2 text-gray-600">{subFeature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-blue-600 px-8 py-4">
                        <a
                          href={
                            feature.title === "Centralisation des avis clients"
                              ? "/features/reviews"
                              : feature.title === "Gestion intelligente des emails"
                              ? "/features/emails"
                              : "#"
                          }
                          className="flex items-center justify-end text-white font-medium"
                        >
                          <span>Découvrir cette fonctionnalité</span>
                          <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* How It Works Section */}
        <div className="bg-blue-700 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-fadeIn">
                <h2 className="text-base font-semibold uppercase tracking-wide text-blue-200">
                  Processus simplifié
                </h2>
              </div>
              <div className="animate-fadeIn animation-delay-100">
                <div className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
                  Comment ça marche
                </div>
              </div>
              <div className="animate-fadeIn animation-delay-200">
                <div className="mt-4 max-w-2xl text-xl text-blue-100 mx-auto">
                  Trois étapes simples pour transformer votre gestion de la réputation
                </div>
              </div>
            </div>

            <div className="mt-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {steps.map((step, index) => (
                  <div
                    key={step.title}
                    className="animate-fadeInUp"
                    style={{ animationDelay: `${index * 100 + 200}ms` }}
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
                      <div className="h-16 w-16 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center">
                        {step.icon}
                      </div>
                      <h3 className="mt-6 text-xl font-bold text-white">{step.title}</h3>
                      <p className="mt-4 text-blue-100">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Testimonials Section */}
        <div className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-fadeIn">
                <h2 className="text-base font-semibold uppercase tracking-wide text-blue-600">
                  Ce que vous allez aimer
                </h2>
              </div>
              <div className="animate-fadeIn animation-delay-100">
                <div className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Résultats attendus
                </div>
              </div>
            </div>

            <div className="mt-16">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {expectedOutcomes.map((outcome, index) => (
                  <div
                    key={outcome.title}
                    className="animate-fadeInUp bg-gray-50 rounded-xl p-8 shadow-md transform transition-all duration-300 hover:scale-105"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center mb-6">
                      <div className="flex-shrink-0">
                        {outcome.icon || (
                          <svg className="h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v18H3V3z" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{outcome.title}</h3>
                        <p className="text-sm text-gray-500">{outcome.description}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <svg className="absolute top-0 left-0 h-8 w-8 text-gray-200 transform -translate-x-3 -translate-y-4" fill="currentColor" viewBox="0 0 32 32">
                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                      </svg>
                      <p className="relative text-gray-600 italic">{outcome.benefit}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Pricing Section */}
        <div className="bg-gray-50 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-fadeIn">
                <h2 className="text-base font-semibold uppercase tracking-wide text-blue-600">
                  Tarifs
                </h2>
              </div>
              <div className="animate-fadeIn animation-delay-100">
                <div className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Des plans adaptés à vos besoins
                </div>
              </div>
              <div className="animate-fadeIn animation-delay-200">
                <div className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                  Démarrez gratuitement et évoluez au fur et à mesure de votre croissance
                </div>
              </div>
            </div>

            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              {plans.map((plan, index) => (
                <div
                  key={plan.name}
                  className={`animate-fadeInUp relative flex flex-col rounded-2xl ${
                    plan.popular 
                      ? 'bg-white border-2 border-blue-500 shadow-xl z-10' 
                      : 'bg-white border border-gray-200 shadow-md'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1 text-xs font-medium text-blue-800">
                        Le plus populaire
                      </span>
                    </div>
                  )}
                  
                  <div className="p-8">
                    <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                    <p className="mt-2 text-gray-500">{plan.description}</p>
                    <p className="mt-6">
                      <span className="text-4xl font-extrabold text-gray-900">{plan.price}€</span>
                      <span className="text-base font-medium text-gray-500">/mois</span>
                    </p>
                    
                    <ul className="mt-8 space-y-4">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <svg className="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="ml-3 text-gray-500">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="p-8 pt-0 mt-auto">
                    <a
                      href="#"
                      className={`block w-full rounded-md px-4 py-2 text-center text-sm font-semibold shadow-sm ${
                        plan.popular
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      {plan.cta}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-white">
          <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 shadow-xl lg:grid lg:grid-cols-2 lg:gap-4">
              <div className="px-6 pt-10 pb-12 sm:px-16 sm:pt-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
                <div className="lg:self-center">
                  <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                    <span className="block">Prêt à améliorer votre réputation en ligne ?</span>
                  </h2>
                  <p className="mt-4 text-lg leading-6 text-blue-100">
                    Commencez à unifier vos avis et emails critiques dès aujourd'hui. Essai gratuit, aucune carte de crédit requise.
                  </p>
                  <a
                    href="/auth/register"
                    className="mt-8 inline-flex items-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-blue-600 shadow-sm hover:bg-blue-50"
                  >
                    Démarrer gratuitement
                  </a>
                </div>
              </div>
              <div className="aspect-w-5 aspect-h-3 -mt-6 md:aspect-w-2 md:aspect-h-1">
                <div className="transform translate-x-8 translate-y-8 lg:translate-y-16 xl:translate-y-20">
                  <Image
                    className="rounded-md shadow-xl"
                    src="/platform-screenshot.png"
                    alt="App screenshot"
                    width={800}
                    height={450}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
