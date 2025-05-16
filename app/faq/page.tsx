"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";
import { CustomLogo } from "@/components/CustomLogo";
import PublicHeader from "@/components/PublicHeader";

export default function FAQPage() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Qu'est-ce que Kritiqo et comment peut-il m'aider ?",
      answer: "Kritiqo est une plateforme qui centralise vos avis clients et emails critiques sur un tableau de bord unifié. Notre solution vous permet de surveiller votre réputation en ligne, de gérer efficacement les retours clients et d'améliorer la satisfaction client grâce à des analyses avancées et des outils de réponse intégrés."
    },
    {
      question: "Comment fonctionne l'intégration avec Google My Business et autres plateformes ?",
      answer: "L'intégration est simple et sécurisée. Il suffit de nous autoriser à accéder à vos profils d'entreprise sur Google, Facebook ou d'autres plateformes via notre processus d'authentification sécurisé. Une fois connecté, Kritiqo récupère automatiquement tous vos avis et vous permet d'y répondre directement depuis notre interface."
    },
    {
      question: "Puis-je essayer Kritiqo gratuitement avant de m'abonner ?",
      answer: "Absolument ! Nous proposons un essai gratuit de 14 jours pour tous nos forfaits sans engagement. Vous pouvez explorer toutes les fonctionnalités premium sans aucune restriction pendant cette période. Aucune carte de crédit n'est requise pour démarrer votre essai."
    },
    {
      question: "Comment Kritiqo protège-t-il les données de mon entreprise ?",
      answer: "La sécurité des données est notre priorité absolue. Toutes les données sont stockées de manière sécurisée avec un chiffrement de bout en bout, et nous sommes conformes au RGPD. Nous ne vendons ni ne partageons jamais vos données avec des tiers. De plus, vous pouvez à tout moment exporter ou supprimer définitivement vos données."
    },
    {
      question: "Est-il possible de gérer plusieurs établissements avec un seul compte ?",
      answer: "Oui, notre forfait Pro permet de gérer jusqu'à 10 établissements, tandis que notre forfait Business offre un nombre illimité d'établissements. Chaque établissement bénéficie de son propre tableau de bord dédié, tout en vous permettant d'avoir une vue d'ensemble de tous vos établissements depuis une interface centralisée."
    },
    {
      question: "Comment puis-je obtenir de l'aide si j'ai des questions ?",
      answer: "Notre équipe de support client est disponible par chat, email et téléphone, selon votre forfait. La documentation complète est accessible en ligne, et nous proposons également des webinaires de formation réguliers. Les clients avec un forfait Business bénéficient d'un gestionnaire de compte dédié pour un accompagnement personnalisé."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <PublicHeader />
      {/* Main content */}
      <main>
        {/* Hero section */}
        <div className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Questions fréquemment posées
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
                Trouvez des réponses aux questions les plus courantes sur Kritiqo et nos services
              </p>
            </div>
          </div>
        </div>

        {/* FAQ section */}
        <div className="pb-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden" key={index}>
                  <div className="animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                      <svg
                        className={`w-5 h-5 transform transition-transform duration-300 ${
                          activeFaq === index ? "rotate-180 text-blue-600" : "text-gray-500"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    <div 
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        activeFaq === index ? 'max-h-96' : 'max-h-0'
                      }`}
                    >
                      <div className="px-6 pb-4 text-gray-600 bg-slate-50">
                        <div className="pt-3 border-t border-gray-200">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-600">Vous ne trouvez pas la réponse à votre question ?</p>
              <Link
                href="/contact"
                className="mt-3 inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
              >
                Contactez notre équipe
                <svg
                  className="ml-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="bg-blue-700 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:flex lg:items-center lg:justify-between">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                <span className="block">Prêt à améliorer votre réputation en ligne ?</span>
                <span className="block text-blue-200">Démarrez votre essai gratuit aujourd'hui.</span>
              </h2>
              <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                <div className="inline-flex rounded-md shadow">
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-blue-600 hover:bg-blue-50"
                  >
                    Essayer gratuitement
                  </Link>
                </div>
                <div className="ml-3 inline-flex rounded-md shadow">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-800 px-5 py-3 text-base font-medium text-white hover:bg-blue-900"
                  >
                    Nous contacter
                  </Link>
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
