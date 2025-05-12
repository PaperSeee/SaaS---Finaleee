"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

// Types for subscription plan data
type BillingPeriod = "monthly" | "yearly";

type Plan = {
  name: string;
  businessLimit: number | string;
  reviewLimit: number | string;
  price: { monthly: number; yearly: number };
};

type PlanId = "free" | "pro" | "business";

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: boolean;
  isDefault: boolean;
}

interface InvoiceItem {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
}

// Mock subscription data
const SUBSCRIPTION_PLANS: Record<PlanId, Plan> = {
  free: {
    name: "Free",
    businessLimit: 3,
    reviewLimit: 50,
    price: { monthly: 0, yearly: 0 }
  },
  pro: {
    name: "Pro",
    businessLimit: 10,
    reviewLimit: 500,
    price: { monthly: 29, yearly: 290 }
  },
  business: {
    name: "Business",
    businessLimit: "Illimité",
    reviewLimit: "Illimité",
    price: { monthly: 99, yearly: 990 }
  }
};

export default function SubscriptionPage() {
  const [currentPlan, setCurrentPlan] = useState<PlanId>("free");
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [loading, _setLoading] = useState(false);
  const [paymentMethods, _setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [invoices, _setInvoices] = useState<InvoiceItem[]>([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"pro" | "business">("pro");
  const [cardName, setCardName] = useState("");
  const [cardNumber, _setCardNumber] = useState("");
  const [cardExpiry, _setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [processingPayment, _setProcessingPayment] = useState(false);
  const [paymentSuccess, _setPaymentSuccess] = useState<string | null>(null);
  const [paymentError, _setPaymentError] = useState<string | null>(null);

  const { user } = useAuth();
  const supabase = createClientComponentClient();

  // Add missing handler function stubs
  const handleAddPaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation to be added
    console.log('Add payment method functionality to be implemented');
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Implementation to be added
    console.log('Card number change handler to be implemented');
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Implementation to be added
    console.log('Card expiry change handler to be implemented');
  };

  const getCardIcon = (brand: string) => {
    // Return appropriate card icon based on brand
    return <span>{brand}</span>; // Placeholder implementation
  };

  const handleSetDefaultPaymentMethod = (id: string) => {
    // Implementation to be added
    console.log(`Set default payment method ${id} to be implemented`);
  };

  const handleRemovePaymentMethod = (id: string) => {
    // Implementation to be added
    console.log(`Remove payment method ${id} to be implemented`);
  };

  const handleUpgrade = () => {
    // Implementation to be added
    console.log('Upgrade plan functionality to be implemented');
  };

  // Calculate next billing date
  const getNextBillingDate = () => {
    const today = new Date();
    const nextMonth = new Date(today);
    
    if (billingPeriod === "monthly") {
      nextMonth.setMonth(today.getMonth() + 1);
    } else {
      nextMonth.setFullYear(today.getFullYear() + 1);
    }
    
    return nextMonth.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Abonnement
            </h1>
            <p className="mt-2 text-gray-600">
              Gérez votre abonnement et vos méthodes de paiement
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
                <p className="mt-4 text-gray-500">Chargement des informations d&apos;abonnement...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Current Plan Section */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Plan actuel</h2>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-lg text-gray-900">
                          {SUBSCRIPTION_PLANS[currentPlan].name}
                          {currentPlan === "free" && (
                            <span className="ml-2 inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-full">
                              Gratuit
                            </span>
                          )}
                          {currentPlan === "pro" && (
                            <span className="ml-2 inline-block px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                              Pro
                            </span>
                          )}
                          {currentPlan === "business" && (
                            <span className="ml-2 inline-block px-2 py-0.5 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                              Business
                            </span>
                          )}
                        </p>

                        {currentPlan !== "free" && (
                          <p className="mt-1 text-sm text-gray-500">
                            {billingPeriod === "monthly" ? "Facturation mensuelle" : "Facturation annuelle"} •{" "}
                            Prochain paiement le {getNextBillingDate()}
                          </p>
                        )}

                        <div className="mt-4">
                          <p className="text-gray-700 font-medium">Inclus dans votre plan:</p>
                          <ul className="mt-2 space-y-2">
                            <li className="flex items-start">
                              <svg className="h-5 w-5 flex-shrink-0 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="ml-2 text-sm text-gray-600">Jusqu&apos;à {SUBSCRIPTION_PLANS[currentPlan].businessLimit} entreprises</span>
                            </li>
                            <li className="flex items-start">
                              <svg className="h-5 w-5 flex-shrink-0 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="ml-2 text-sm text-gray-600">{SUBSCRIPTION_PLANS[currentPlan].reviewLimit} avis par mois</span>
                            </li>
                            {currentPlan !== "free" && (
                              <li className="flex items-start">
                                <svg className="h-5 w-5 flex-shrink-0 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="ml-2 text-sm text-gray-600">Gestion complète des réponses aux avis</span>
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-3xl font-bold text-gray-900">
                          {SUBSCRIPTION_PLANS[currentPlan].price[billingPeriod]}€
                          <span className="text-base font-normal text-gray-500">
                            {currentPlan !== "free" && `/${billingPeriod === "monthly" ? "mois" : "an"}`}
                          </span>
                        </p>

                        {currentPlan !== "free" && billingPeriod === "monthly" && (
                          <button
                            onClick={() => setBillingPeriod("yearly")}
                            className="mt-2 text-sm text-blue-600 hover:text-blue-500"
                          >
                            Passer au paiement annuel et économiser 20%
                          </button>
                        )}

                        {currentPlan !== "free" && billingPeriod === "yearly" && (
                          <button
                            onClick={() => setBillingPeriod("monthly")}
                            className="mt-2 text-sm text-blue-600 hover:text-blue-500"
                          >
                            Passer au paiement mensuel
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                      {currentPlan === "free" ? (
                        <button
                          onClick={() => {
                            setSelectedPlan("pro");
                            setUpgradeModalOpen(true);
                          }}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Passer au plan Pro
                        </button>
                      ) : currentPlan === "pro" ? (
                        <div className="flex">
                          <button
                            onClick={() => {
                              setSelectedPlan("business");
                              setUpgradeModalOpen(true);
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Passer au plan Business
                          </button>
                          <button
                            onClick={() => setCurrentPlan("free")}
                            className="ml-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Rétrograder au plan Gratuit
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setCurrentPlan("pro")}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Rétrograder au plan Pro
                        </button>
                      )}

                      <Link 
                        href="/pricing" 
                        className="ml-4 text-sm text-gray-500 hover:text-gray-700"
                      >
                        Comparer tous les plans
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Payment Methods Section */}
                <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Moyens de paiement</h2>
                    <button
                      onClick={() => setShowAddCard(!showAddCard)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {showAddCard ? "Annuler" : "Ajouter une carte"}
                    </button>
                  </div>

                  <div className="p-6">
                    {showAddCard && (
                      <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Ajouter une nouvelle carte</h3>
                        
                        {paymentSuccess && (
                          <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-md flex items-center text-sm text-green-700">
                            <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {paymentSuccess}
                          </div>
                        )}
                        
                        {paymentError && (
                          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-md flex items-center text-sm text-red-700">
                            <svg className="h-5 w-5 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {paymentError}
                          </div>
                        )}
                        
                        <form onSubmit={handleAddPaymentMethod} className="space-y-4">
                          <div>
                            <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
                              Nom sur la carte
                            </label>
                            <div className="mt-1">
                              <input
                                id="cardName"
                                name="cardName"
                                type="text"
                                required
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                placeholder="Jane Smith"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                              Numéro de carte
                            </label>
                            <div className="mt-1">
                              <input
                                id="cardNumber"
                                name="cardNumber"
                                type="text"
                                required
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                placeholder="1234 1234 1234 1234"
                                maxLength={19} // 16 digits + 3 spaces
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700">
                                Date d&apos;expiration
                              </label>
                              <div className="mt-1">
                                <input
                                  id="cardExpiry"
                                  name="cardExpiry"
                                  type="text"
                                  required
                                  value={cardExpiry}
                                  onChange={handleCardExpiryChange}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                  placeholder="MM/AA"
                                  maxLength={5} // MM/YY
                                />
                              </div>
                            </div>
                            <div>
                              <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700">
                                CVC
                              </label>
                              <div className="mt-1">
                                <input
                                  id="cardCvc"
                                  name="cardCvc"
                                  type="text"
                                  required
                                  value={cardCvc}
                                  onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                  placeholder="123"
                                  maxLength={4}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-end">
                            <button
                              type="submit"
                              disabled={processingPayment}
                              className={`${
                                processingPayment 
                                  ? "bg-gray-300 cursor-not-allowed" 
                                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                              } inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                            >
                              {processingPayment ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Traitement en cours...
                                </>
                              ) : (
                                "Ajouter la carte"
                              )}
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {paymentMethods.length > 0 ? (
                      <div className="space-y-4">
                        {paymentMethods.map((method) => (
                          <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center">
                              <div className="mr-4">
                                {getCardIcon(method.brand)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  •••• •••• •••• {method.last4}
                                  {method.isDefault && (
                                    <span className="ml-2 inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-full">
                                      Par défaut
                                    </span>
                                  )}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Expire {method.expMonth < 10 ? `0${method.expMonth}` : method.expMonth}/{method.expYear}
                                </p>
                              </div>
                            </div>
                            <div className="flex">
                              {!method.isDefault && (
                                <button
                                  onClick={() => handleSetDefaultPaymentMethod(method.id)}
                                  className="text-sm text-blue-600 hover:text-blue-500 mr-4"
                                >
                                  Définir par défaut
                                </button>
                              )}
                              <button
                                onClick={() => handleRemovePaymentMethod(method.id)}
                                className="text-sm text-red-600 hover:text-red-500"
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <svg className="mx-auto h-12 w-12 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-500">
                          Aucun moyen de paiement enregistré
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Billing History Section */}
              <div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Historique de facturation</h2>
                  </div>

                  <div className="p-6">
                    {invoices.length > 0 ? (
                      <div className="space-y-4">
                        {invoices.map((invoice) => (
                          <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{invoice.description}</p>
                              <p className="text-xs text-gray-500">{String(formatDate(invoice.date))}</p>
                            </div>
                            <div className="flex items-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                invoice.status === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : invoice.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {invoice.status === "paid"
                                  ? "Payé"
                                  : invoice.status === "pending"
                                  ? "En attente"
                                  : "Échec"}
                              </span>
                              <span className="ml-4 text-sm font-medium text-gray-900">
                                {invoice.amount.toFixed(2)}€
                              </span>
                              <a
                                href="#"
                                className="ml-4 text-sm text-blue-600 hover:text-blue-500"
                                onClick={(e) => e.preventDefault()}
                              >
                                PDF
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <svg className="mx-auto h-12 w-12 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-500">
                          Aucune facture pour le moment
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upgrade Plan Modal */}
      {upgradeModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity" 
              onClick={() => setUpgradeModalOpen(false)}
              aria-hidden="true"
            ></div>

            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

            <div className="inline-block transform overflow-hidden rounded-2xl bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-6 pt-5 pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Passer au plan {selectedPlan === "pro" ? "Pro" : "Business"}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Mettez à niveau votre abonnement pour accéder à plus de fonctionnalités et de ressources.
                      </p>
                    </div>

                    {paymentSuccess && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-100 rounded-md flex items-center text-sm text-green-700">
                        <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {paymentSuccess}
                      </div>
                    )}
                    
                    {paymentError && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-md flex items-center text-sm text-red-700">
                        <svg className="h-5 w-5 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {paymentError}
                      </div>
                    )}

                    <div className="mt-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div>
                          <p className="text-lg font-medium text-gray-900">{SUBSCRIPTION_PLANS[selectedPlan].name}</p>
                          <p className="mt-1 text-sm text-gray-500">
                            Facturation {billingPeriod === "monthly" ? "mensuelle" : "annuelle"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">
                            {SUBSCRIPTION_PLANS[selectedPlan].price[billingPeriod]}€
                            <span className="text-sm font-normal text-gray-500">
                              /{billingPeriod === "monthly" ? "mois" : "an"}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-4">
                        <div className="flex items-center">
                          <input
                            id="monthly"
                            name="billingPeriod"
                            type="radio"
                            checked={billingPeriod === "monthly"}
                            onChange={() => setBillingPeriod("monthly")}
                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <label htmlFor="monthly" className="ml-3 block text-sm text-gray-700">
                            Facturation mensuelle - {SUBSCRIPTION_PLANS[selectedPlan].price.monthly}€/mois
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="yearly"
                            name="billingPeriod"
                            type="radio"
                            checked={billingPeriod === "yearly"}
                            onChange={() => setBillingPeriod("yearly")}
                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <label htmlFor="yearly" className="ml-3 block text-sm text-gray-700">
                            Facturation annuelle - {SUBSCRIPTION_PLANS[selectedPlan].price.yearly}€/an
                            <span className="ml-2 text-sm text-green-600">
                              Économisez 20%
                            </span>
                          </label>
                        </div>
                      </div>
                      
                      {paymentMethods.length > 0 ? (
                        <div className="mt-6">
                          <label className="text-sm font-medium text-gray-700">Méthode de paiement</label>
                          <div className="mt-2 p-3 border border-gray-300 rounded-md bg-gray-50">
                            <div className="flex items-center">
                              {getCardIcon(paymentMethods[0].brand)}
                              <span className="ml-2 text-sm text-gray-700">
                                •••• •••• •••• {paymentMethods[0].last4}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-6">
                          <p className="text-sm text-red-600">
                            Ajoutez d&apos;abord un moyen de paiement pour continuer.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className={`inline-flex w-full justify-center rounded-md px-4 py-2 text-base font-medium text-white shadow-sm sm:ml-3 sm:w-auto sm:text-sm ${
                    processingPayment || paymentMethods.length === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  }`}
                  onClick={handleUpgrade}
                  disabled={processingPayment || paymentMethods.length === 0}
                >
                  {processingPayment ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Traitement...
                    </>
                  ) : (
                    `Mettre à niveau (${SUBSCRIPTION_PLANS[selectedPlan].price[billingPeriod]}€)`
                  )}
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setUpgradeModalOpen(false)}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}