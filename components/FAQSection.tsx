"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";

interface FAQSectionProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  activeFaq: number | null;
  toggleFaq: (index: number) => void;
}

export default function FAQSection({ faqs, activeFaq, toggleFaq }: FAQSectionProps) {
  const { t } = useLanguage();

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-600 font-medium text-sm mb-5">
            {t('faq.badge')}
          </span>
          <h2 className="text-3xl font-bold sm:text-4xl text-gray-900">{t('faq.title')}</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-fadeInUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
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
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">{t('faq.more.question')}</p>
          <Link
            href="/contact"
            className="mt-3 inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
            prefetch={false}
          >
            {t('faq.more.action')}
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
    </section>
  );
}
