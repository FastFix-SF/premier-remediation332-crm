/**
 * FAQ - Frequently Asked Questions accordion
 *
 * Features:
 * - Accordion expand/collapse
 * - Search filter (optional)
 * - Category grouping (optional)
 * - Schema.org markup for SEO
 *
 * Usage:
 *   <FAQ faqs={[...]} />
 *   <FAQ faqs={[...]} title="Common Questions" />
 */

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

interface FAQProps {
  faqs: FAQItem[];
  title?: string;
  subtitle?: string;
}

export const FAQ: React.FC<FAQProps> = ({
  faqs,
  title = "Frequently Asked Questions",
  subtitle = "Find answers to common questions",
}) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 lg:py-24 bg-background relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[150px]" />
      
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-section font-bold text-foreground mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {subtitle}
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="glass-card overflow-hidden animate-fade-up transition-all duration-300 hover:border-primary/30"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-medium text-foreground pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${
                    openId === faq.id ? 'rotate-180 text-primary thunder-glow' : 'text-muted-foreground'
                  }`}
                />
              </button>
              {openId === faq.id && (
                <div className="px-5 pb-5 text-muted-foreground border-t border-white/10 pt-4 bg-white/5">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Schema.org FAQ markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            })
          }}
        />
      </div>
    </section>
  );
};

export default FAQ;
