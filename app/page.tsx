// @ts-nocheck
"use client";
import Link from "next/link";
import { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { throttle } from "@/lib/utils"; // Replace lodash with your custom throttle
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Lazy load non-critical components
const FAQSection = lazy(() => import("@/components/FAQSection"));

export default function Home() {
  const { isAuthenticated: _isAuthenticated, isLoading: _isLoading } = useAuth();
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Handle header scroll effect with throttling for better performance
  useEffect(() => {
    const handleScroll = throttle(() => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }, 100); // Throttle to once every 100ms
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // FAQ items remain the same
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

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      
      {/* Main content */}
      <main>
        {/* Hero section */}
        <section className="relative pt-28 pb-16 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-left"
              >
                <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-600 font-medium text-sm mb-5">
                  {t('hero.subtitle.badge')}
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
                  {t('hero.title.part1')}{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {t('hero.title.highlight')}
                  </span>{' '}
                  {t('hero.title.part2')}
                </h1>
                
                <p className="mt-6 text-lg text-gray-600 max-w-md">
                  {t('hero.subtitle')}
                </p>
                
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/auth/register"
                    className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 flex items-center group"
                  >
                    {t('hero.cta.getStarted')}
                    <svg 
                      className="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                  
                  <Link
                    href="/pricing"
                    className="rounded-full border border-gray-300 bg-white px-8 py-3.5 text-base font-medium text-gray-700 hover:bg-gray-50 transition-all flex items-center"
                  >
                    {t('hero.cta.pricing')}
                  </Link>
                </div>
                
                <div className="mt-10 flex items-center">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="inline-block h-8 w-8 rounded-full bg-gray-200 ring-2 ring-white"></div>
                    ))}
                  </div>
                  <span className="ml-3 text-sm text-gray-500">
                    {t('hero.customers')} <span className="font-medium text-gray-900">2,000+</span> {t('hero.businesses')}
                  </span>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="aspect-w-5 aspect-h-4 md:aspect-w-3 md:aspect-h-2 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 opacity-50"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="mockup-window w-full max-w-lg bg-white shadow-lg rounded-lg p-1">
                      <div className="flex items-center space-x-2 px-3 pb-2 border-b">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      </div>
                      <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-b-lg">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-blue-100"></div>
                              <div className="h-4 w-40 bg-gray-200 rounded"></div>
                            </div>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <div className="h-4 w-full bg-gray-200 rounded"></div>
                          <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                          <div className="h-10 w-32 bg-blue-100 rounded-lg ml-auto"></div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <div className="flex justify-between">
                            <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                            <div className="h-4 w-1/5 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating UI elements for visual appeal */}
                <div className="absolute -top-5 -right-5 bg-white p-3 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="h-2.5 w-12 bg-gray-200 rounded"></div>
                      <div className="h-2 w-20 bg-gray-100 rounded mt-1"></div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-5 -left-5 bg-white p-3 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                      </svg>
                    </div>
                    <div>
                      <div className="h-2.5 w-16 bg-gray-200 rounded"></div>
                      <div className="h-2 w-16 bg-gray-100 rounded mt-1"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
            <p className="text-center text-sm font-medium text-gray-500 mb-6">
              {t('hero.trustedBy')}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-70">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-8 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Features section */}
        <section id="features" className="py-24 bg-gradient-to-b from-white to-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-600 font-medium text-sm mb-5">
                {t('features.badge')}
              </span>
              <h2 className="text-3xl font-bold sm:text-4xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {t('features.title')}
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                {t('features.subtitle')}
              </p>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-16 grid gap-y-10 gap-x-8 lg:grid-cols-3"
            >
              {/* Feature 1: Aggregation */}
              <motion.div 
                variants={itemVariants}
                className="relative group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 h-full border border-gray-100 group-hover:border-blue-100">
                  <div className="mb-6 h-14 w-14 rounded-full bg-blue-100 p-3 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {t('features.aggregation.title')}
                  </h3>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    {t('features.aggregation.description')}
                  </p>
                  <div className="mt-8 h-1 w-12 bg-blue-600 rounded group-hover:w-full transition-all duration-300"></div>
                </div>
              </motion.div>

              {/* Feature 2: Response */}
              <motion.div 
                variants={itemVariants}
                className="relative group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 h-full border border-gray-100 group-hover:border-blue-100">
                  <div className="mb-6 h-14 w-14 rounded-full bg-blue-100 p-3 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {t('features.response.title')}
                  </h3>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    {t('features.response.description')}
                  </p>
                  <div className="mt-8 h-1 w-12 bg-blue-600 rounded group-hover:w-full transition-all duration-300"></div>
                </div>
              </motion.div>

              {/* Feature 3: Analytics */}
              <motion.div 
                variants={itemVariants}
                className="relative group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 h-full border border-gray-100 group-hover:border-blue-100">
                  <div className="mb-6 h-14 w-14 rounded-full bg-blue-100 p-3 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {t('features.analytics.title')}
                  </h3>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    {t('features.analytics.description')}
                  </p>
                  <div className="mt-8 h-1 w-12 bg-blue-600 rounded group-hover:w-full transition-all duration-300"></div>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Feature showcase with screenshot */}
            <div className="mt-24 bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-600 font-medium text-sm mb-5">
                    {t('showcase.badge')}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {t('showcase.title')}
                  </h3>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    {t('showcase.description')}
                  </p>
                  
                  <ul className="mt-8 space-y-4">
                    {[1, 2, 3].map((i) => (
                      <li key={i} className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="ml-3 text-base text-gray-700">
                          {t(`showcase.feature${i}`)}
                        </p>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-8">
                    <Link
                      href="/pricing"
                      className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-lg hover:bg-blue-700 transition-all"
                    >
                      {t('showcase.cta')}
                      <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
                
                <div className="bg-slate-50 flex items-center justify-center p-8">
                  <div className="mockup-phone border-primary">
                    <div className="camera"></div> 
                    <div className="display">
                      <div className="phone-1 artboard artboard-demo bg-white">
                        <div className="px-4 py-5 bg-blue-50">
                          <div className="flex justify-between items-center mb-4">
                            <div className="h-3 w-24 bg-gray-300 rounded"></div>
                            <div className="h-3 w-12 bg-gray-300 rounded"></div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-200"></div>
                            <div className="ml-3">
                              <div className="h-2.5 w-24 bg-gray-300 rounded"></div>
                              <div className="h-2 w-16 bg-gray-200 rounded mt-1"></div>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <div className="h-2.5 w-28 bg-gray-300 rounded"></div>
                                  <div className="h-2 w-20 bg-gray-200 rounded mt-1"></div>
                                </div>
                                <div className="flex">
                                  {Array(i+2).fill(0).map((_, j) => (
                                    <div key={j} className="w-3 h-3 rounded-full bg-yellow-300 ml-0.5"></div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* How it works section */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-600 font-medium text-sm mb-5">
                {t('how.badge')}
              </span>
              <h2 className="text-3xl font-bold sm:text-4xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {t('how.title')}
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                {t('how.subtitle')}
              </p>
            </motion.div>

            <div className="mt-20">
              <div className="relative">
                {/* Connecting line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-100 -translate-x-1/2 z-0"></div>
                
                <div className="grid gap-16">
                  {[1, 2, 3].map((i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="relative z-10"
                    >
                      <div className="grid md:grid-cols-5 items-center gap-8">
                        <div className={`md:col-span-2 ${i % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                          <div className="bg-slate-50 rounded-2xl p-6 shadow-lg">
                            <div className="aspect-w-16 aspect-h-9 bg-slate-200 rounded-lg"></div>
                          </div>
                        </div>
                        
                        <div className="mx-auto">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                            {i}
                          </div>
                        </div>
                        
                        <div className={`md:col-span-2 ${i % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                          <h3 className="text-xl font-bold text-gray-900">
                            {t(`how.step${i}.title`)}
                          </h3>
                          <p className="mt-4 text-gray-600 leading-relaxed">
                            {t(`how.step${i}.description`)}
                          </p>
                          <div className="mt-6">
                            <button className="text-blue-600 font-medium flex items-center">
                              {t('how.learnMore')}
                              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
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
        
        {/* FAQ section */}
        <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading FAQs...</div>}>
          <FAQSection faqs={faqs} activeFaq={activeFaq} toggleFaq={toggleFaq} />
        </Suspense>
        
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
      </main>
      
      <Footer />
    </div>
  );
}
