"use client";

import { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "fr";

type Translations = {
  [key in Language]: {
    [key: string]: string | { [key: string]: string };
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations: Translations = {
  en: {
    header: {
      home: "Home",
      features: "Features",
      pricing: "Pricing",
      testimonials: "Testimonials",
      contact: "Contact",
      signIn: "Sign In",
      getStarted: "Get Started",
      dashboard: "Dashboard"
    },
    hero: {
      title: "Manage All Your Customer Reviews In One Place",
      subtitle: "Get insights, respond quickly, and improve your online reputation with our review management platform.",
      cta: "Start for free",
      secondaryCta: "Learn more"
    },
    features: {
      title: "Features",
      centralizeTitle: "Centralize Reviews",
      centralizeDesc: "Collect reviews from Google, Facebook, and more in one dashboard.",
      analyzeTitle: "Analyze Feedback",
      analyzeDesc: "Get valuable insights from your customers' opinions.",
      respondTitle: "Respond Quickly",
      respondDesc: "Reply to reviews directly from our platform.",
      monitorTitle: "Monitor Reputation",
      monitorDesc: "Keep track of your online reputation with real-time alerts."
    },
    // Add more translations as needed
  },
  fr: {
    header: {
      home: "Accueil",
      features: "Fonctionnalités",
      pricing: "Tarifs",
      testimonials: "Témoignages",
      contact: "Contact",
      signIn: "Connexion",
      getStarted: "Commencer",
      dashboard: "Tableau de bord"
    },
    hero: {
      title: "Gérez tous vos avis clients en un seul endroit",
      subtitle: "Obtenez des insights, répondez rapidement et améliorez votre réputation en ligne avec notre plateforme de gestion d'avis.",
      cta: "Commencer gratuitement",
      secondaryCta: "En savoir plus"
    },
    features: {
      title: "Fonctionnalités",
      centralizeTitle: "Centralisez vos avis",
      centralizeDesc: "Collectez les avis de Google, Facebook et plus encore dans un seul tableau de bord.",
      analyzeTitle: "Analysez les retours",
      analyzeDesc: "Obtenez des insights précieux à partir des opinions de vos clients.",
      respondTitle: "Répondez rapidement",
      respondDesc: "Répondez aux avis directement depuis notre plateforme.",
      monitorTitle: "Surveillez votre réputation",
      monitorDesc: "Suivez votre réputation en ligne avec des alertes en temps réel."
    },
    // Add more translations as needed
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("fr");

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("language") as Language | null;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "fr")) {
      setLanguage(savedLanguage);
    } else {
      // Set default based on browser language
      const browserLang = navigator.language.substring(0, 2);
      setLanguage(browserLang === "fr" ? "fr" : "en");
    }
  }, []);

  useEffect(() => {
    // Save language preference when it changes
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.');
    let result: any = translations[language];
    
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return typeof result === 'string' ? result : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
