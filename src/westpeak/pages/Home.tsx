/**
 * Home Page Template
 *
 * Composes reusable sections into a complete homepage.
 * All content is dynamically loaded from config files.
 *
 * Usage:
 *   <Home />
 */

import React, { useState } from 'react';
import { Header, Footer } from '@/westpeak/components/layout';
 import { HeroVideo } from '@/westpeak/components/hero';
import { ServicesGrid, Statistics, Testimonials, FAQ, CTASection } from '@/westpeak/components/sections';
import { ContactModal } from '@/westpeak/components/modals';
import { useBusiness, useAllFAQs, useServices, useAreas, useContact } from '@/westpeak/hooks/useConfig';

export const Home: React.FC = () => {
  const business = useBusiness();
  const faqs = useAllFAQs();
  const services = useServices();
  const areas = useAreas();
  const contact = useContact();

  // Modal state
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Collect testimonials from areas
  // Note: Now using dedicated Google reviews in Testimonials component

  // Open contact modal
  const openContactModal = () => {
    setIsContactModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Dynamic page title */}
      <title>{`${business.name} | ${business.tagline}`}</title>

      <Header />

      <main>
        {/* Hero Section */}
         <HeroVideo
          onPrimaryClick={openContactModal}
          onSecondaryClick={openContactModal}
        />

        {/* Statistics Section */}
        <Statistics />

        {/* Services Grid */}
        <ServicesGrid featured={true} />

        {/* Testimonials */}
         <Testimonials />

        {/* FAQ Section */}
        {faqs.length > 0 && (
          <FAQ faqs={faqs.slice(0, 6)} />
        )}

        {/* CTA Section */}
        <CTASection
          variant="gradient"
          onSecondaryClick={openContactModal}
        />
      </main>

      <Footer />

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      {/* Schema.org structured data for SEO/AEO/GEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": ["LocalBusiness", "Plumber"],
                "@id": "https://westpeak.biz/#business",
                "name": business.name,
                "description": business.description,
                "telephone": contact.phone,
                "email": contact.email,
                "url": "https://westpeak.biz",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": contact.address.street,
                  "addressLocality": contact.address.city,
                  "addressRegion": contact.address.state,
                  "postalCode": contact.address.zip,
                  "addressCountry": "US",
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": 37.3541,
                  "longitude": -121.9552,
                },
                "areaServed": areas.map(area => ({
                  "@type": "City",
                  "name": area.fullName,
                })),
                "hasOfferCatalog": {
                  "@type": "OfferCatalog",
                  "name": "Plumbing Services",
                  "itemListElement": services.map(service => ({
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": service.name,
                      "description": service.shortDescription || service.description,
                      "url": `https://westpeak.biz/services/${service.slug}`,
                    },
                  })),
                },
                "priceRange": "$$",
                "openingHoursSpecification": {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                  "opens": "00:00",
                  "closes": "23:59",
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.9",
                  "reviewCount": "184",
                  "bestRating": "5",
                },
              },
              {
                "@type": "WebSite",
                "@id": "https://westpeak.biz/#website",
                "name": business.name,
                "url": "https://westpeak.biz",
              },
              {
                "@type": "FAQPage",
                "mainEntity": faqs.slice(0, 6).map(faq => ({
                  "@type": "Question",
                  "name": faq.question,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer,
                  },
                })),
              },
            ],
          }),
        }}
      />
    </div>
  );
};

export default Home;
