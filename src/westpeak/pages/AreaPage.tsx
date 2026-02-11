/**
 * Area Page Template
 *
 * Dynamic service area page that renders based on URL slug.
 * All content comes from areas.json config.
 *
 * Route: /service-areas/:slug
 *
 * Usage:
 *   <AreaPage />
 */

import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Header, Footer } from '@/westpeak/components/layout';
import { ServicesGrid, FAQ, CTASection } from '@/westpeak/components/sections';
import { TestimonialCard } from '@/westpeak/components/cards';
import { useBusiness, useAreaBySlug, useAreaServices, useGoogleReviews } from '@/westpeak/hooks/useConfig';
import { MapPin, CheckCircle, ChevronRight, Home, Calendar, Star } from 'lucide-react';

// Import area hero images
import sanFranciscoHero from '@/assets/westpeak/areas/san-francisco-hero.jpg';
import santaClaraHero from '@/assets/westpeak/areas/santa-clara-county-hero.jpg';
import alamedaHero from '@/assets/westpeak/areas/alameda-county-hero.jpg';
import contraCostaHero from '@/assets/westpeak/areas/contra-costa-county-hero.jpg';
import marinHero from '@/assets/westpeak/areas/marin-county-hero.jpg';
import bayAreaHero from '@/assets/westpeak/areas/bay-area-hero.jpg';

// Map area slugs to imported images (city slugs → county/region images)
const areaImages: Record<string, string> = {
  // Direct matches
  'san-francisco': sanFranciscoHero,
  'san-francisco-ca': sanFranciscoHero,
  'santa-clara-county': santaClaraHero,
  'alameda-county': alamedaHero,
  'contra-costa-county': contraCostaHero,
  'marin-county': marinHero,
  'bay-area': bayAreaHero,
  // City → county mappings
  'san-jose-ca': santaClaraHero,
  'san-jose': santaClaraHero,
  'berkeley-ca': alamedaHero,
  'berkeley': alamedaHero,
  'oakland-ca': alamedaHero,
  'oakland': alamedaHero,
  'hayward-ca': alamedaHero,
  'hayward': alamedaHero,
  'fremont-ca': alamedaHero,
  'fremont': alamedaHero,
  'san-mateo-ca': bayAreaHero,
  'san-mateo': bayAreaHero,
  'palo-alto-ca': santaClaraHero,
  'palo-alto': santaClaraHero,
  'mountain-view-ca': santaClaraHero,
  'mountain-view': santaClaraHero,
  'sunnyvale-ca': santaClaraHero,
  'sunnyvale': santaClaraHero,
  'redwood-city-ca': bayAreaHero,
  'redwood-city': bayAreaHero,
  'daly-city-ca': sanFranciscoHero,
  'daly-city': sanFranciscoHero,
  'richmond-ca': contraCostaHero,
  'richmond': contraCostaHero,
  'concord-ca': contraCostaHero,
  'concord': contraCostaHero,
  'walnut-creek-ca': contraCostaHero,
  'walnut-creek': contraCostaHero,
};

export const AreaPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const area = useAreaBySlug(slug || '');
  const business = useBusiness();
  const areaServices = useAreaServices(slug || '');
  const reviews = useGoogleReviews();

  // Get the actual image URL from imports (fallback to bay-area image)
  const heroImageUrl = slug ? (areaImages[slug] || bayAreaHero) : bayAreaHero;

  // Redirect if area not found
  if (!area) {
    return <Navigate to="/service-areas" replace />;
  }

  // Format lastUpdated for display
  const lastUpdatedDisplay = area.lastUpdated
    ? new Date(area.lastUpdated + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : null;

  // Build enhanced schema data
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "Plumber"],
        "name": business.name,
        "telephone": business.phone,
        "areaServed": {
          "@type": "City",
          "name": area.fullName,
          ...(area.coordinates && {
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": area.coordinates.lat,
              "longitude": area.coordinates.lng,
            },
          }),
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": reviews.averageRating,
          "reviewCount": reviews.totalReviews,
          "bestRating": 5,
        },
        ...(area.lastUpdated && { "dateModified": `${area.lastUpdated}-01` }),
      },
      // BreadcrumbList schema
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.westpeak.biz/" },
          { "@type": "ListItem", "position": 2, "name": area.name },
        ],
      },
      // ImageObject schema for SEO
      ...(heroImageUrl ? [{
        "@type": "ImageObject",
        "contentUrl": heroImageUrl,
        "name": area.heroImageAlt || `${business.name} service in ${area.fullName}`,
        "description": `Professional plumbing and trenchless services in ${area.fullName}`,
        "representativeOfPage": true,
      }] : []),
      // FAQPage schema
      ...(area.faqs && area.faqs.length > 0 ? [{
        "@type": "FAQPage",
        "mainEntity": area.faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer,
          },
        })),
      }] : []),
      // Service schemas for each service in this area
      ...areaServices.map(service => ({
        "@type": "Service",
        "name": service.name,
        "description": service.shortDescription || service.description,
        "url": `https://www.westpeak.biz/services/${service.slug}`,
        "areaServed": area.fullName,
        "provider": { "@type": "LocalBusiness", "name": business.name },
      })),
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Dynamic SEO */}
      <title>{area.seoTitle || `${business.name} in ${area.fullName}`}</title>
      <meta name="description" content={area.seoDescription || `Professional services in ${area.fullName}`} />

      <Header />

      <main>
        {/* Breadcrumb Navigation */}
        <nav className="bg-muted/30 py-3 border-b border-border/50">
          <div className="container mx-auto px-4">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
                  <Home className="w-4 h-4" />
                  Home
                </Link>
              </li>
              <ChevronRight className="w-4 h-4" />
              <li className="text-foreground font-medium">{area.name}</li>
            </ol>
          </div>
        </nav>

        {/* Hero Section - Split Layout */}
        <section className="relative py-16 lg:py-24 overflow-hidden bg-background">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/98 to-background/90" />
          <div className="absolute top-1/2 -translate-y-1/2 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

          <div className="relative container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left: Text Content */}
              <div className="max-w-xl">
                {/* Location badge */}
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-4 py-1.5 rounded-full mb-6">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary font-medium">Service Area</span>
                  <span className="text-white/40">|</span>
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="text-sm text-primary font-medium">{reviews.averageRating} Rating</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                  {area.heroHeadline || `${business.name} in ${area.name}`}
                  <span className="block gradient-text orange-glow-blink">Plumbing & Trenchless</span>
                </h1>
                <p className="text-lg md:text-xl text-white/70 mb-8">
                  {area.heroSubheadline || `Serving ${area.fullName} with professional expertise`}
                </p>
                {/* CTA */}
                <a
                  href={`tel:${business.phone}`}
                  className="btn-gold-wave inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-base"
                >
                  Get Free Estimate
                </a>
              </div>

              {/* Right: Hero Image */}
              <div className="hidden lg:block">
                <div className="relative rounded-2xl overflow-hidden border border-primary/30 bg-white/5 backdrop-blur-sm shadow-[0_0_40px_rgba(234,179,8,0.15)]">
                  {heroImageUrl && (
                    <img
                      src={heroImageUrl}
                      alt={area.heroImageAlt || `${business.name} service in ${area.fullName}`}
                      className="w-full h-auto aspect-[4/3] object-cover"
                      loading="eager"
                      fetchPriority="high"
                    />
                  )}
                  {/* Subtle gradient overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/40 to-transparent" />
                  {/* Image caption for SEO */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-xs text-white/80 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                      Professional service in {area.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Intro Section with Service Links */}
        {area.introText && (
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {area.introText}
                </p>
                {areaServices.length > 0 && (
                  <p className="text-muted-foreground">
                    Our services in {area.name} include{' '}
                    {areaServices.map((service, index) => (
                      <React.Fragment key={service.id}>
                        {index > 0 && index < areaServices.length - 1 && ', '}
                        {index > 0 && index === areaServices.length - 1 && ', and '}
                        <Link
                          to={`/services/${service.slug}`}
                          className="text-primary hover:underline font-medium"
                        >
                          {service.name.toLowerCase()}
                        </Link>
                      </React.Fragment>
                    ))}
                    .
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Neighborhoods Section */}
        {area.neighborhoods.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">
                Neighborhoods We Serve in {area.name}
              </h2>
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                   {area.neighborhoods.map((neighborhood, index) => {
                     const neighborhoodSlug = neighborhood.toLowerCase()
                       .replace(/\s+/g, '-')
                       .replace(/[^a-z0-9-]/g, '');

                     return (
                       <Link
                         key={index}
                         to={`/service-areas/${area.slug}/${neighborhoodSlug}`}
                         className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg hover:bg-primary/10 transition-colors group"
                       >
                         <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                         <span className="text-sm group-hover:text-primary transition-colors">{neighborhood}</span>
                       </Link>
                     );
                   })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Services Available */}
        {areaServices.length > 0 && (
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-4">
                Services Available in {area.name}
              </h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                Professional solutions tailored for {area.fullName} residents
              </p>
              <ServicesGrid />
            </div>
          </section>
        )}

        {/* Testimonial */}
        {area.testimonial && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">
                What {area.name} Customers Say
              </h2>
              <div className="max-w-2xl mx-auto">
                <TestimonialCard
                  testimonial={{
                    ...area.testimonial,
                    location: area.name,
                  }}
                  variant="featured"
                />
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {area.faqs && area.faqs.length > 0 && (
          <FAQ
            faqs={area.faqs}
            title={`${area.name} Service FAQ`}
            subtitle={`Common questions from ${area.name} customers`}
          />
        )}

        {/* Last Updated Indicator */}
        {lastUpdatedDisplay && (
          <div className="container mx-auto px-4 py-4">
            <p className="text-sm text-muted-foreground text-center">
              <Calendar className="w-4 h-4 inline-block mr-1 -mt-0.5" />
              Last updated: {lastUpdatedDisplay}
            </p>
          </div>
        )}

        {/* CTA */}
        <CTASection
          title={`Need Service in ${area.name}?`}
          subtitle={`We're proud to serve ${area.fullName} with fast, reliable service`}
          variant="gradient"
        />
      </main>

      <Footer />

      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData),
        }}
      />
    </div>
  );
};

export default AreaPage;
