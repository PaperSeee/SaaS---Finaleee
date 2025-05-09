"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Langues supportées
export type Language = "en" | "fr" | "nl";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string; // fonction de traduction
}

const defaultLanguage: Language = "fr"; // Français par défaut

export const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  t: (key) => key,
});

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  
  // Charger les traductions quand la langue change
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translationFile = await import(`@/locales/${language}.json`);
        setTranslations(translationFile.default);
      } catch (error) {
        console.error(`Échec du chargement des traductions pour ${language}:`, error);
        setTranslations({});
      }
    };
    
    loadTranslations();
    
    // Sauvegarder la préférence de langue dans localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem("language", language);
      document.documentElement.lang = language;
    }
  }, [language]);
  
  // Initialiser la langue depuis localStorage si disponible
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem("language") as Language;
      if (savedLanguage && ["en", "fr", "nl"].includes(savedLanguage)) {
        setLanguageState(savedLanguage);
      } else {
        // Essayer de détecter la langue du navigateur
        const browserLang = navigator.language.split('-')[0];
        if (["en", "fr", "nl"].includes(browserLang)) {
          setLanguageState(browserLang as Language);
        }
      }
    }
  }, []);
  
  // Fonction de traduction
  const t = (key: string): string => {
    return translations[key] || key; // Retour à la clé si traduction non trouvée
  };
  
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
