"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Handle header scroll effect with throttling for better performance
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

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="Kritiqo" width={40} height={40} className="mr-2" />
            <span className={`font-bold text-2xl ${scrolled ? 'text-gray-800' : 'text-white'}`}>
              Kritiqo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`text-sm font-medium ${scrolled ? 'text-gray-600 hover:text-blue-600' : 'text-white hover:text-blue-100'}`}>
              {t('header.home')}
            </Link>
            <Link href="/#features" className={`text-sm font-medium ${scrolled ? 'text-gray-600 hover:text-blue-600' : 'text-white hover:text-blue-100'}`}>
              {t('header.features')}
            </Link>
            <Link href="/pricing" className={`text-sm font-medium ${scrolled ? 'text-gray-600 hover:text-blue-600' : 'text-white hover:text-blue-100'}`}>
              {t('header.pricing')}
            </Link>
            <Link href="/#testimonials" className={`text-sm font-medium ${scrolled ? 'text-gray-600 hover:text-blue-600' : 'text-white hover:text-blue-100'}`}>
              {t('header.testimonials')}
            </Link>
            <Link href="/contact" className={`text-sm font-medium ${scrolled ? 'text-gray-600 hover:text-blue-600' : 'text-white hover:text-blue-100'}`}>
              {t('header.contact')}
            </Link>
          </nav>

          {/* Authentication Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link 
                  href="/auth/login"
                  className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                    scrolled 
                      ? 'text-gray-700 hover:text-blue-700' 
                      : 'text-white hover:text-blue-100'
                  }`}
                >
                  {t('header.signIn')}
                </Link>
                <Link 
                  href="/auth/register"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md"
                >
                  {t('header.getStarted')}
                </Link>
              </>
            ) : (
              <Link 
                href="/dashboard"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md"
              >
                {t('header.dashboard')}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className={`p-2 rounded-md ${scrolled ? 'text-gray-800' : 'text-white'}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md" onClick={() => setMobileMenuOpen(false)}>
              {t('header.home')}
            </Link>
            <Link href="/#features" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md" onClick={() => setMobileMenuOpen(false)}>
              {t('header.features')}
            </Link>
            <Link href="/pricing" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md" onClick={() => setMobileMenuOpen(false)}>
              {t('header.pricing')}
            </Link>
            <Link href="/#testimonials" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md" onClick={() => setMobileMenuOpen(false)}>
              {t('header.testimonials')}
            </Link>
            <Link href="/contact" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md" onClick={() => setMobileMenuOpen(false)}>
              {t('header.contact')}
            </Link>
            
            {!isAuthenticated ? (
              <div className="border-t border-gray-200 pt-4 mt-4 flex flex-col space-y-3">
                <Link 
                  href="/auth/login"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('header.signIn')}
                </Link>
                <Link 
                  href="/auth/register"
                  className="block px-3 py-2 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('header.getStarted')}
                </Link>
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <Link 
                  href="/dashboard"
                  className="block px-3 py-2 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('header.dashboard')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
