"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";
import Image from "next/image";
import { CustomLogo } from "@/components/CustomLogo";
import PublicHeader from "@/components/PublicHeader";

export default function PricingPage() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      name: "Free",
      description: "Pour essayer Kritiqo sans engagement",
      price: { monthly: 0, yearly: 0 },
      features: [
        "Jusqu'à 3 entreprises",
        "Intégration des avis Google",
        "Statistiques basiques",
        "Notifications email",
        "Support standard"
      ],
      limitations: [
        "Limité à 50 avis par mois",
        "Pas de gestion des réponses",
        "Pas de personnalisation"
      ],
      cta: "Commencer gratuitement",
      highlight: false
    },
    {
      name: "Pro",
      description: "Pour les entreprises qui développent leur présence en ligne",
      price: { monthly: 29, yearly: 290 },
      features: [
        "Jusqu'à 10 entreprises",
        "Intégration Google & Facebook",
        "Gestion complète des avis",
        "Statistiques avancées",
        "Rapports personnalisés",
        "Support prioritaire",
        "Option marque blanche"
      ],
      limitations: [],
      cta: "Essai gratuit de 7 jours",
      highlight: true
    },
    {
      name: "Business",
      description: "Pour les entreprises avec plusieurs établissements",
      price: { monthly: 99, yearly: 990 },
      features: [
        "Entreprises illimitées",
        "Toutes plateformes d'avis",
        "Accès API",
        "Gestionnaire de compte dédié",
        "Intégrations personnalisées",
        "Personnalisation complète",
        "SSO & gestion d'équipe"
      ],
      limitations: [],
      cta: "Contacter commercial",
      highlight: false
    }
  ];

  const savings = {
    Pro: Math.round(100 - (plans[1].price.yearly / (plans[1].price.monthly * 12)) * 100),
    Business: Math.round(100 - (plans[2].price.yearly / (plans[2].price.monthly * 12)) * 100)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <PublicHeader />
      {/* Main content */}
      <main>
        {/* Hero section */}
        <div className="pt-16 pb-12 sm:pt-24 sm:pb-16 lg:pt-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Des tarifs simples et transparents
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
                Choisissez le forfait qui correspond à vos besoins. Tous les plans incluent un essai gratuit de 7 jours.
              </p>

              {/* Billing period toggle */}
              <div className="mt-12 flex justify-center">
                <div className="relative bg-gray-100 p-1 rounded-full flex">
                  <button
                    className={`${
                      billingPeriod === "monthly"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    } relative w-32 py-2 text-sm font-medium rounded-full transition-all duration-300 focus:outline-none focus:z-10`}
                    onClick={() => setBillingPeriod("monthly")}
                  >
                    Mensuel
                  </button>
                  <button
                    className={`${
                      billingPeriod === "yearly"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    } relative w-32 py-2 text-sm font-medium rounded-full transition-all duration-300 focus:outline-none focus:z-10`}
                    onClick={() => setBillingPeriod("yearly")}
                  >
                    Annuel (-20%)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing section */}
        <div className="pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl bg-white p-8 shadow-md transition-all duration-300 hover:shadow-lg ${
                    plan.highlight
                      ? "border-2 border-blue-500 ring-2 ring-blue-200"
                      : "border border-gray-200"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold py-1.5 px-4 rounded-full">
                      Le plus populaire
                    </div>
                  )}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="mt-2 h-12 text-sm text-gray-500">{plan.description}</p>
                    <p className="mt-6">
                      <span className="text-4xl font-extrabold text-gray-900">
                        {plan.price[billingPeriod]}€
                      </span>
                      <span className="text-base font-medium text-gray-500">
                        {plan.price.monthly > 0 && `/${billingPeriod === "monthly" ? "mois" : "an"}`}
                      </span>
                    </p>
                    {billingPeriod === "yearly" && plan.price.monthly > 0 && (
                      <p className="mt-1 text-sm text-green-600">
                        Économisez {billingPeriod === "yearly" ? savings[plan.name as keyof typeof savings] : 0}%
                      </p>
                    )}
                    <Link 
                      href={isAuthenticated ? "/dashboard/subscription" : "/auth/register"}
                      className={`mt-8 block w-full rounded-lg py-3 px-4 text-center text-sm font-semibold ${
                        plan.highlight
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                          : plan.name === "Free"
                          ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                          : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
                      }`}
                      prefetch={false}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                  <div className="mt-8 border-t border-gray-200 pt-8">
                    <h4 className="text-sm font-semibold text-gray-900">Inclus :</h4>
                    <ul className="mt-4 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <svg
                            className="h-5 w-5 flex-shrink-0 text-green-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="ml-2 text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Limitations */}
                    {plan.limitations.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-semibold text-gray-900">Limitations :</h4>
                        <ul className="mt-4 space-y-3">
                          {plan.limitations.map((limitation) => (
                            <li key={limitation} className="flex items-start">
                              <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                              <span className="ml-2 text-sm text-gray-500">{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature comparison */}
        <div className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <h2 className="text-3xl font-bold text-center text-gray-900">Comparer les plans</h2>
              <p className="mt-4 text-lg text-gray-600 text-center">
                Choisissez le plan adapté à votre entreprise
              </p>

              <div className="mt-16 overflow-x-auto">
                <div className="min-w-max">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="py-3 pl-6 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">Fonctionnalités</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 border-b border-gray-200">Free</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-blue-600 border-b border-gray-200">Pro</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 border-b border-gray-200">Business</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="py-4 pl-6 text-sm font-medium text-gray-900">Entreprises</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-700">3</td>
                        <td className="px-6 py-4 text-center text-sm text-blue-700">10</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-700">Illimité</td>
                      </tr>
                      <tr>
                        <td className="py-4 pl-6 text-sm font-medium text-gray-900">Avis mensuels</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-700">50</td>
                        <td className="px-6 py-4 text-center text-sm text-blue-700">500</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-700">Illimité</td>
                      </tr>
                      <tr>
                        <td className="py-4 pl-6 text-sm font-medium text-gray-900">Avis Google</td>
                        <td className="px-6 py-4 text-center">
                          <svg className="mx-auto h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <svg className="mx-auto h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <svg className="mx-auto h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-4 pl-6 text-sm font-medium text-gray-900">Avis Facebook</td>
                        <td className="px-6 py-4 text-center">
                          <svg className="mx-auto h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <svg className="mx-auto h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <svg className="mx-auto h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-4 pl-6 text-sm font-medium text-gray-900">Autres plateformes</td>
                        <td className="px-6 py-4 text-center">
                          <svg className="mx-auto h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <svg className="mx-auto h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <svg className="mx-auto h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-4 pl-6 text-sm font-medium text-gray-900">Gestion des réponses</td>
                        <td className="px-6 py-4 text-center">
                          <svg className="mx-auto h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <svg className="mx-auto h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <svg className="mx-auto h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-4 pl-6 text-sm font-medium text-gray-900">Accès API</td>
                        <td className="px-6 py-4 text-center">
                          <svg className="mx-auto h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <svg className="mx-auto h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <svg className="mx-auto h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-4 pl-6 text-sm font-medium text-gray-900">Personnalisation</td>
                        <td className="px-6 py-4 text-center">
                          <svg className="mx-auto h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <svg className="mx-auto h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <svg className="mx-auto h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ section */}
        <div className="bg-gray-50 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-3xl font-bold text-center text-gray-900">Questions fréquentes</h2>
              <div className="mt-12 space-y-6">
                <div className="bg-white shadow-sm rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900">Comment fonctionne l&apos;essai gratuit ?</h3>
                  <p className="mt-2 text-gray-700">
                    Tous les forfaits payants incluent un essai gratuit de 7 jours. Vous ne serez débité qu&apos;à la fin de la période d&apos;essai, et vous pouvez annuler à tout moment avant la fin de l&apos;essai.
                  </p>
                </div>
                <div className="bg-white shadow-sm rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900">Puis-je changer de forfait ultérieurement ?</h3>
                  <p className="mt-2 text-gray-700">
                    Oui, vous pouvez passer à un forfait supérieur ou inférieur à tout moment. Lors d&apos;une mise à niveau, les nouvelles fonctionnalités seront disponibles immédiatement. Lors d&apos;un passage à un forfait inférieur, les modifications prendront effet au début de votre prochain cycle de facturation.
                  </p>
                </div>
                <div className="bg-white shadow-sm rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900">Quels moyens de paiement acceptez-vous ?</h3>
                  <p className="mt-2 text-gray-700">
                    Nous acceptons toutes les principales cartes de crédit, y compris Visa, Mastercard, American Express et Discover. Nous prenons également en charge le paiement via PayPal.
                  </p>
                </div>
                <div className="bg-white shadow-sm rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900">Y a-t-il un engagement à long terme ?</h3>
                  <p className="mt-2 text-gray-700">
                    Non, tous nos forfaits sont facturés soit mensuellement, soit annuellement, sans engagement à long terme. Vous pouvez annuler votre abonnement à tout moment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between lg:flex-row">
              <div className="max-w-2xl text-center lg:text-left">
                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                  Prêt à commencer ?
                </h2>
                <p className="mt-3 text-xl text-blue-100">
                  Rejoignez les milliers d&apos;entreprises qui utilisent Kritiqo pour gérer leur réputation en ligne.
                </p>
              </div>
              <div className="mt-8 lg:mt-0">
                <Link
                  href={isAuthenticated ? "/dashboard/subscription" : "/auth/register"}
                  className="rounded-full bg-white px-8 py-3 text-lg font-medium text-blue-600 shadow-lg hover:bg-gray-100 transition-all"
                >
                  Commencer l&apos;essai gratuit
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
