"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type Language = "en" | "fr" | "nl";

// Define recursive translation values: strings, SplitTitle, or nested objects
interface SplitTitle {
  part1: string;
  highlight: string;
  part2: string;
}

type TranslationValue = string | SplitTitle | { [key: string]: TranslationValue };
type Translations = Record<Language, { [key: string]: TranslationValue }>;

// Create the context
interface LanguageContextProps {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

// Define translations
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
      secondaryCta: "Learn more",
      customers: "Trusted by more than",
      businesses: "businesses worldwide",
      subtitleBadge: {
        badge: "Customer Experience Platform"
      },
      splitTitle: {
        part1: "Manage your",
        highlight: "online reputation",
        part2: "effortlessly"
      },
      trustedBy: "Trusted by innovative companies worldwide",
      cta: {
        getStarted: "Try for free",
        pricing: "View pricing"
      }
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
    modules: {
      title: "Two Powerful Modules",
      subtitle: "Everything you need to manage your customer relationships efficiently",
      reviews: {
        title: "Review Management",
        subtitle: "Centralize all customer reviews in one interface",
        description: "Aggregate feedback from Google, Facebook, Trustpilot and other platforms to get a comprehensive view of your online reputation.",
        feature1: "Monitor reviews across all platforms",
        feature2: "Respond directly from the dashboard",
        feature3: "Analyze trends and sentiment",
        cta: "Discover review management"
      },
      emails: {
        title: "Intelligent Email Management",
        subtitle: "Automatically prioritize your important emails",
        description: "Connect your professional inbox and let our AI categorize emails based on urgency and type, so you never miss important messages.",
        feature1: "Automatic categorization by priority",
        feature2: "Identify unhappy customers instantly",
        feature3: "Smart response suggestions",
        cta: "Explore email management"
      }
    },
    howItWorks: {
      title: "Get Started in 3 Simple Steps",
      subtitle: "Quick setup, immediate results",
      step1: {
        title: "Connect Your Accounts",
        description: "Link your review platforms and email accounts in just a few clicks with our secure integration system."
      },
      step2: {
        title: "Let Our AI Work",
        description: "Our algorithms analyze your reviews and emails, organizing everything based on importance and sentiment."
      },
      step3: {
        title: "Respond and Improve",
        description: "Take action on what matters most, save time on routine tasks, and improve your customer experience."
      }
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
      signIn: "Se connecter",
      getStarted: "S'inscrire",
      dashboard: "Tableau de bord"
    },
    hero: {
      title: "Gérez tous vos avis clients en un seul endroit",
      subtitle: "Obtenez des insights, répondez rapidement et améliorez votre réputation en ligne avec notre plateforme de gestion d'avis.",
      secondaryCta: "En savoir plus",
      customers: "Utilisé par plus de",
      businesses: "entreprises dans le monde",
      subtitleBadge: {
        badge: "Plateforme d'Expérience Client"
      },
      splitTitle: {
        part1: "Gérez votre",
        highlight: "réputation en ligne",
        part2: "sans effort"
      },
      trustedBy: "Adopté par des entreprises innovantes partout dans le monde",
      cta: {
        getStarted: "Essayer gratuitement",
        pricing: "Voir les tarifs"
      }
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
    modules: {
      title: "Deux Modules Puissants",
      subtitle: "Tout ce dont vous avez besoin pour gérer efficacement vos relations clients",
      reviews: {
        title: "Gestion des Avis",
        subtitle: "Centralisez tous les avis clients dans une seule interface",
        description: "Agrégez les retours de Google, Facebook, Trustpilot et d'autres plateformes pour obtenir une vue complète de votre réputation en ligne.",
        feature1: "Surveillez les avis sur toutes les plateformes",
        feature2: "Répondez directement depuis le tableau de bord",
        feature3: "Analysez les tendances et le sentiment",
        cta: "Découvrir la gestion des avis"
      },
      emails: {
        title: "Gestion Intelligente des Emails",
        subtitle: "Priorisez automatiquement vos emails importants",
        description: "Connectez votre boîte de réception professionnelle et laissez notre IA catégoriser les emails selon leur urgence et leur type, pour ne jamais manquer les messages importants.",
        feature1: "Catégorisation automatique par priorité",
        feature2: "Identification instantanée des clients mécontents",
        feature3: "Suggestions de réponses intelligentes",
        cta: "Explorer la gestion des emails"
      }
    },
    howItWorks: {
      title: "Démarrez en 3 Étapes Simples",
      subtitle: "Configuration rapide, résultats immédiats",
      step1: {
        title: "Connectez Vos Comptes",
        description: "Liez vos plateformes d'avis et comptes email en quelques clics grâce à notre système d'intégration sécurisé."
      },
      step2: {
        title: "Laissez Notre IA Travailler",
        description: "Nos algorithmes analysent vos avis et emails, en organisant tout selon l'importance et le sentiment."
      },
      step3: {
        title: "Répondez et Améliorez",
        description: "Agissez sur ce qui compte le plus, gagnez du temps sur les tâches routinières et améliorez votre expérience client."
      }
    },
    // Add more translations as needed
  },
  nl: {
    header: {
      home: "Home",
      features: "Functies",
      pricing: "Prijzen",
      testimonials: "Getuigenissen",
      contact: "Contact",
      signIn: "Inloggen",
      getStarted: "Aan de slag",
      dashboard: "Dashboard"
    },
    hero: {
      title: "Beheer al uw klantbeoordelingen op één plek",
      subtitle: "Krijg inzichten, reageer snel en verbeter uw online reputatie met ons beoordelingsbeheerplatform.",
      secondaryCta: "Meer informatie",
      customers: "Vertrouwd door meer dan",
      businesses: "bedrijven wereldwijd",
      subtitleBadge: {
        badge: "Klantbeleving Platform"
      },
      splitTitle: {
        part1: "Beheer uw",
        highlight: "online reputatie",
        part2: "moeiteloos"
      },
      trustedBy: "Vertrouwd door innovatieve bedrijven wereldwijd",
      cta: {
        getStarted: "Probeer gratis",
        pricing: "Bekijk prijzen"
      }
    },
    features: {
      title: "Functies",
      centralizeTitle: "Centraliseer Beoordelingen",
      centralizeDesc: "Verzamel beoordelingen van Google, Facebook en meer op één dashboard.",
      analyzeTitle: "Analyseer Feedback",
      analyzeDesc: "Krijg waardevolle inzichten uit de meningen van uw klanten.",
      respondTitle: "Reageer Snel",
      respondDesc: "Beantwoord beoordelingen rechtstreeks vanuit ons platform.",
      monitorTitle: "Bewaken Reputatie",
      monitorDesc: "Houd uw online reputatie in de gaten met realtime meldingen."
    },
    modules: {
      title: "Twee Krachtige Modulen",
      subtitle: "Alles wat u nodig heeft om uw klantrelaties efficiënt te beheren",
      reviews: {
        title: "Beheer van Beoordelingen",
        subtitle: "Centraliseer alle klantbeoordelingen in één interface",
        description: "Verzamel feedback van Google, Facebook, Trustpilot en andere platforms voor een uitgebreid overzicht van uw online reputatie.",
        feature1: "Bewaken beoordelingen op alle platforms",
        feature2: "Direct reageren vanuit het dashboard",
        feature3: "Trends en sentiment analyseren",
        cta: "Ontdek beoordelingsbeheer"
      },
      emails: {
        title: "Intelligent E-mailbeheer",
        subtitle: "Prioriteer automatisch uw belangrijke e-mails",
        description: "Verbind uw professionele inbox en laat onze AI e-mails categoriseren op basis van urgentie en type, zodat u nooit belangrijke berichten mist.",
        feature1: "Automatische categorisatie op prioriteit",
        feature2: "Identificeer ontevreden klanten onmiddellijk",
        feature3: "Slimme antwoordvoorstellen",
        cta: "Verken e-mailbeheer"
      }
    },
    howItWorks: {
      title: "Begin in 3 Eenvoudige Stappen",
      subtitle: "Snelle installatie, directe resultaten",
      step1: {
        title: "Verbind uw Accounts",
        description: "Koppel uw beoordelingsplatforms en e-mailaccounts in slechts een paar klikken met ons veilige integratiesysteem."
      },
      step2: {
        title: "Laat Onze AI Werken",
        description: "Onze algoritmen analyseren uw beoordelingen en e-mails, en organiseren alles op basis van belangrijkheid en sentiment."
      },
      step3: {
        title: "Reageer en Verbeter",
        description: "Neem actie op wat het belangrijkst is, bespaar tijd op routinetaken en verbeter uw klantbeleving."
      }
    },
    // Add more translations as needed
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
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
    // Split the key by dots to navigate nested objects
    const keys = key.split('.');
    
    // Start with the current language translations
    let value: any = translations[language];
    
    // Navigate through the nested objects
    for (const k of keys) {
      if (!value[k]) {
        // Fallback to English if translation is missing
        value = translations["en"];
        for (const fallbackKey of keys) {
          value = value[fallbackKey];
          if (!value) break;
        }
        break;
      }
      value = value[k];
    }
    
    // If we have a SplitTitle object, concatenate its parts
    if (value && typeof value === 'object' && 'part1' in value && 'highlight' in value && 'part2' in value) {
      return `${value.part1} ${value.highlight} ${value.part2}`;
    }
    
    // Return the string value or empty string if not found
    return typeof value === 'string' ? value : '';
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
