import { memo } from "react";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
  activeFaq: number | null;
  toggleFaq: (index: number) => void;
}

const FAQSection = memo(function FAQSection({ faqs, activeFaq, toggleFaq }: FAQSectionProps) {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Questions fréquentes
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Tout ce que vous devez savoir sur Kritiqo.
          </p>
        </div>

        <div className="mt-12 mx-auto max-w-3xl">
          <dl className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="rounded-lg bg-white p-6 shadow">
                <dt className="text-lg">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex w-full items-start justify-between text-left"
                    aria-expanded={activeFaq === index}
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    <span className="ml-6 flex-shrink-0">
                      <svg
                        className={`h-6 w-6 transform ${activeFaq === index ? 'rotate-180' : ''} text-gray-500`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                </dt>
                {activeFaq === index && (
                  <dd className="mt-3">
                    <p className="text-gray-600">{faq.answer}</p>
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
});

export default FAQSection;
