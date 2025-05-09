"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Handle header scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Qu'est-ce que Kritiqo ?",
      answer: "Kritiqo est une plateforme de gestion d'avis clients qui vous permet de collecter, analyser et répondre à tous vos avis en un seul endroit. Notre solution centralise les avis de Google, Facebook, et d'autres plateformes pour vous aider à améliorer votre réputation en ligne."
    },
    {
      question: "Comment fonctionne l'essai gratuit ?",
      answer: "Tous nos forfaits payants incluent un essai gratuit de 7 jours. Vous ne serez débité qu'à la fin de la période d'essai, et vous pouvez annuler à tout moment sans frais."
    },
    {
      question: "Quelles plateformes d'avis sont prises en charge ?",
      answer: "Nous prenons en charge les principales plateformes d'avis, notamment Google Business, Facebook, TripAdvisor et bien d'autres. Nos forfaits Pro et Business vous permettent d'accéder à davantage de plateformes."
    },
    {
      question: "Puis-je répondre aux avis directement depuis Kritiqo ?",
      answer: "Oui, notre plateforme vous permet de répondre directement aux avis de clients depuis notre interface, sans avoir à vous connecter à chaque plateforme individuellement."
    },
    {
      question: "Comment Kritiqo m'aide-t-il à améliorer ma réputation en ligne ?",
      answer: "En centralisant vos avis, en vous alertant des nouveaux commentaires, en vous permettant d'y répondre rapidement et en vous fournissant des analyses détaillées, Kritiqo vous aide à mieux comprendre vos clients et à améliorer votre service."
    },
    {
      question: "Puis-je changer de forfait ultérieurement ?",
      answer: "Oui, vous pouvez passer à un forfait supérieur ou inférieur à tout moment. Lors d'une mise à niveau, les nouvelles fonctionnalités seront disponibles immédiatement. Lors d'un passage à un forfait inférieur, les modifications prendront effet au début de votre prochain cycle de facturation."
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Modern sticky header with glass effect when scrolled */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/80 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      }`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between p-5 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Kritiqo
            </span>
          </div>
          
          {/* Desktop Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Accueil
            </Link>
            <Link href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Fonctionnalités
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Tarifs
            </Link>
            <Link href="#faq" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              FAQ
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Contact
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden rounded-md p-2 text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            
            {isLoading ? (
              <div className="h-10 w-24 animate-pulse rounded-md bg-gray-200"></div>
            ) : isAuthenticated ? (
              <Link
                href="/dashboard"
                className="group relative rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
              >
                {t('header.dashboard')}
              </Link>
            ) : (
              <div className="hidden md:flex space-x-3">
                <Link
                  href="/auth/login"
                  className="rounded-full border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                >
                  {t('header.signIn')}
                </Link>
                <Link
                  href="/auth/register"
                  className="group relative rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-sm font-medium text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                >
                  {t('header.getStarted')}
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile navigation menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <nav className="flex flex-col px-4 py-3 space-y-3">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-2 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link 
                href="#features" 
                className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-2 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Fonctionnalités
              </Link>
              <Link 
                href="/pricing" 
                className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-2 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tarifs
              </Link>
              <Link 
                href="#faq" 
                className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-2 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-2 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              {!isAuthenticated && (
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
                  <Link
                    href="/auth/login"
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/auth/register"
                    className="rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-center text-sm font-medium text-white hover:from-blue-700 hover:to-indigo-700 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    S'inscrire
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Hero section with static elements */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-28 pb-16 text-center sm:px-6 lg:px-8">
        {/* Background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-blue-50 via-indigo-50 to-white"></div>
          <div className="absolute top-20 left-20 h-64 w-64 rounded-full bg-blue-100 filter blur-3xl opacity-30"></div>
          <div className="absolute top-40 right-20 h-64 w-64 rounded-full bg-indigo-100 filter blur-3xl opacity-30"></div>
        </div>

        <div className="max-w-4xl transform transition-all duration-700 ease-in-out">
          <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl">
            {t('hero.title.part1')}<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{t('hero.title.highlight')}</span>{t('hero.title.part2')}
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-gray-600 sm:text-xl">
            {t('hero.subtitle')}
          </p>
          <div className="mt-12 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-center sm:space-x-6 sm:space-y-0">
            <Link
              href="/auth/register"
              className="group relative rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 md:px-10 md:text-lg"
            >
              {t('hero.cta.getStarted')}
              <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">→</span>
            </Link>
            <Link
              href="#features"
              className="flex items-center justify-center rounded-full border border-gray-300 bg-white px-8 py-3.5 text-base font-medium text-gray-700 hover:bg-gray-50 md:px-10 md:text-lg transition-all"
            >
              {t('hero.cta.learnMore')}
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features section with cards */}
      <section id="features" className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center transform transition-all duration-500 ease-in-out">
            <h2 className="text-3xl font-bold sm:text-4xl">{t('features.title')}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="relative overflow-hidden rounded-xl bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="mb-6 h-14 w-14 rounded-full bg-blue-100 p-3 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{t('features.aggregation.title')}</h3>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {t('features.aggregation.description')}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="relative overflow-hidden rounded-xl bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="mb-6 h-14 w-14 rounded-full bg-blue-100 p-3 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{t('features.response.title')}</h3>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {t('features.response.description')}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="relative overflow-hidden rounded-xl bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="mb-6 h-14 w-14 rounded-full bg-blue-100 p-3 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{t('features.analytics.title')}</h3>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {t('features.analytics.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center transform transition-all duration-500 ease-in-out">
            <h2 className="text-3xl font-bold sm:text-4xl">{t('how.title')}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              {t('how.subtitle')}
            </p>
          </div>

          <div className="mt-16">
            <div className="grid gap-12 lg:grid-cols-3">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center transform transition-all duration-500 hover:-translate-y-1">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
                  1
                </div>
                <h3 className="text-xl font-bold">{t('how.step1.title')}</h3>
                <p className="mt-4 text-gray-600">
                  {t('how.step1.description')}
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center transform transition-all duration-500 hover:-translate-y-1">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
                  2
                </div>
                <h3 className="text-xl font-bold">{t('how.step2.title')}</h3>
                <p className="mt-4 text-gray-600">
                  {t('how.step2.description')}
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center transform transition-all duration-500 hover:-translate-y-1">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
                  3
                </div>
                <h3 className="text-xl font-bold">{t('how.step3.title')}</h3>
                <p className="mt-4 text-gray-600">
                  {t('how.step3.description')}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link 
              href="/auth/register" 
              className="inline-flex items-center rounded-full bg-blue-600 px-8 py-3 text-base font-medium text-white shadow-lg hover:bg-blue-700 transition-all"
            >
              {t('how.cta')}
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing CTA section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 shadow-xl">
            <div className="mb-6 md:mb-0 md:max-w-2xl">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Des forfaits pour tous les besoins
              </h2>
              <p className="mt-3 text-lg text-blue-100">
                Découvrez nos différentes options d'abonnement et choisissez celle qui correspond le mieux à vos besoins.
              </p>
            </div>
            <div className="flex flex-shrink-0">
              <Link
                href="/pricing"
                className="inline-flex items-center rounded-full bg-white px-6 py-3 text-base font-medium text-blue-600 shadow-md hover:bg-gray-50 hover:shadow-lg transition-all"
              >
                Voir nos tarifs
                <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Foire Aux Questions</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Tout ce que vous devez savoir sur Kritiqo
            </p>
          </div>

          <div className="mt-12 space-y-5">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                  activeFaq === index ? 'border-blue-200 bg-blue-50 shadow-md' : 'border-gray-200 bg-white'
                }`}
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="text-lg font-medium">{faq.question}</span>
                  <svg 
                    className={`h-6 w-6 transform transition-transform duration-300 ${
                      activeFaq === index ? 'rotate-180 text-blue-600' : 'text-gray-400'
                    }`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div 
                  className={`transition-all duration-300 ease-in-out ${
                    activeFaq === index 
                      ? 'opacity-100 max-h-96 pb-6' 
                      : 'opacity-0 max-h-0 overflow-hidden'
                  }`}
                >
                  <p className="px-6 text-gray-700">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Vous ne trouvez pas de réponse à votre question ?
            </p>
            <Link 
              href="/contact" 
              className="mt-3 inline-flex items-center text-blue-600 hover:text-blue-500"
            >
              Contactez-nous
              <svg className="ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center transform transition-all duration-500 ease-in-out">
            <h2 className="text-3xl font-bold sm:text-4xl">{t('testimonials.title')}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              {t('testimonials.subtitle')}
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="rounded-xl bg-white p-8 shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <svg className="h-10 w-10 text-blue-400" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L25.864 4z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium text-gray-900">{t('testimonials.person1.name')}</p>
                  <p className="text-sm text-gray-600">{t('testimonials.person1.role')}</p>
                </div>
              </div>
              <p className="mt-2 text-gray-600 leading-relaxed">
                {t('testimonials.person1.quote')}
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="rounded-xl bg-white p-8 shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <svg className="h-10 w-10 text-blue-400" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L25.864 4z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium text-gray-900">{t('testimonials.person2.name')}</p>
                  <p className="text-sm text-gray-600">{t('testimonials.person2.role')}</p>
                </div>
              </div>
              <p className="mt-2 text-gray-600 leading-relaxed">
                {t('testimonials.person2.quote')}
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="rounded-xl bg-white p-8 shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <svg className="h-10 w-10 text-blue-400" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L25.864 4z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium text-gray-900">{t('testimonials.person3.name')}</p>
                  <p className="text-sm text-gray-600">{t('testimonials.person3.role')}</p>
                </div>
              </div>
              <p className="mt-2 text-gray-600 leading-relaxed">
                {t('testimonials.person3.quote')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between lg:flex-row">
            <div className="max-w-2xl text-center lg:text-left">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                {t('cta.title')}
              </h2>
              <p className="mt-3 text-xl text-blue-100">
                {t('cta.subtitle')}
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <Link
                href="/auth/register"
                className="rounded-full bg-white px-8 py-3 text-lg font-medium text-blue-600 shadow-lg hover:bg-gray-100 transition-all"
              >
                {t('cta.button')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center space-x-6 md:order-2">
              <Link href="/pricing" className="text-gray-500 hover:text-gray-900 transition-colors">
                Tarifs
              </Link>
              <Link href="/contact" className="text-gray-500 hover:text-gray-900 transition-colors">
                Contact
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-gray-900 transition-colors">
                {t('footer.terms')}
              </Link>
              <Link href="/privacy" className="text-gray-500 hover:text-gray-900 transition-colors">
                {t('footer.privacy')}
              </Link>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-base text-gray-500">
                {t('footer.copyright').replace('{year}', new Date().getFullYear().toString())}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
