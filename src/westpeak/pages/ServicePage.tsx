/**
 * Service Page Template
 *
 * Dynamic service page that renders based on URL slug.
 * All content comes from services.json config.
 *
 * Route: /services/:slug
 *
 * Usage:
 *   <ServicePage />
 */

import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Header, Footer } from '@/westpeak/components/layout';
import { FAQ, CTASection } from '@/westpeak/components/sections';
import { useBusiness, useServiceBySlug, useServices, useAreas, useGoogleReviews } from '@/westpeak/hooks/useConfig';
import {
  Shield, Clock, Award, Star, Wrench, Zap, CheckCircle,
  Building, Camera, Calendar, Search, Sparkles, Leaf, Lock,
  TrendingUp, Home, Droplets, Flame, Settings, ChevronRight,
  DollarSign, MapPin,
} from 'lucide-react';

// Import service hero images
import trenchlessHero from '@/assets/westpeak/services/trenchless-services-hero.jpg';
import sewerHero from '@/assets/westpeak/services/sewer-services-hero.jpg';
import hydroJettingHero from '@/assets/westpeak/services/hydro-jetting-hero.jpg';
import plumbingHero from '@/assets/westpeak/services/plumbing-services-hero.jpg';
import drainCleaningHero from '@/assets/westpeak/services/commercial-drain-cleaning-hero.jpg';
import waterHeaterHero from '@/assets/westpeak/services/commercial-water-heater-hero.jpg';

// Map slugs to imported images
const serviceImages: Record<string, string> = {
  'trenchless-services': trenchlessHero,
  'sewer-services': sewerHero,
  'hydro-jetting': hydroJettingHero,
  'plumbing-services': plumbingHero,
  'commercial-drain-cleaning': drainCleaningHero,
  'commercial-water-heater': waterHeaterHero,
};

// Icon mapping for benefits
const iconMap: Record<string, React.ElementType> = {
  Shield, Clock, Award, Star, Wrench, Zap, CheckCircle,
  Building, Camera, Calendar, Search, Sparkles, Leaf, Lock,
  TrendingUp, Home, Droplets, Flame, Settings,
};

export const ServicePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = useServiceBySlug(slug || '');
  const business = useBusiness();
  const areas = useAreas();
  const allServices = useServices();
  const reviews = useGoogleReviews();

  // Get the actual image URL from imports
  const heroImageUrl = slug ? (serviceImages[slug] || trenchlessHero) : trenchlessHero;

  // Redirect if service not found
  if (!service) {
    return <Navigate to="/services" replace />;
  }

  // Get related services
  const relatedServices = service.relatedServices
    ? allServices.filter(s => service.relatedServices?.includes(s.slug))
    : [];

  // Get areas that offer this service
  const areasWithService = areas.filter(area =>
    area.services?.includes(service.slug)
  );

  // Format lastUpdated for display
  const lastUpdatedDisplay = service.lastUpdated
    ? new Date(service.lastUpdated + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : null;

  // Build comprehensive schema
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "name": service.name,
        "description": service.description,
        "url": `https://www.westpeak.biz/services/${service.slug}`,
        "provider": {
          "@type": ["LocalBusiness", "Plumber"],
          "name": business.name,
          "telephone": business.phone,
        },
        ...(service.priceRange && { "priceRange": service.priceRange }),
        "areaServed": areasWithService.map(area => ({
          "@type": "City",
          "name": area.fullName,
        })),
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": reviews.averageRating,
          "reviewCount": reviews.totalReviews,
          "bestRating": 5,
        },
        ...(service.lastUpdated && { "dateModified": `${service.lastUpdated}-01` }),
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.westpeak.biz/" },
          { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://www.westpeak.biz/services" },
          { "@type": "ListItem", "position": 3, "name": service.name },
        ],
      },
      ...(service.faqs && service.faqs.length > 0 ? [{
        "@type": "FAQPage",
        "mainEntity": service.faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer,
          },
        })),
      }] : []),
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Dynamic SEO */}
      <title>{service.seoTitle || `${service.name} | ${business.name}`}</title>
      <meta name="description" content={service.seoDescription || service.description} />

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
              <li>
                <Link to="/services" className="hover:text-primary transition-colors">
                  Services
                </Link>
              </li>
              <ChevronRight className="w-4 h-4" />
              <li className="text-foreground font-medium">{service.name}</li>
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
                {/* Service badge */}
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-4 py-1.5 rounded-full mb-6">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="text-sm text-primary font-medium">{reviews.averageRating} Rating • {reviews.totalReviews} Reviews</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                  {service.heroTitle || service.name}
                  {service.heroHighlight && (
                    <span className="block gradient-text orange-glow-blink">{service.heroHighlight}</span>
                  )}
                </h1>
                <p className="text-lg md:text-xl text-white/70 mb-8">
                  {service.heroSubheadline || service.description}
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
                      alt={`${service.name} - ${business.name}`}
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
                      {service.name} by {business.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Intro Section */}
        {service.introText && (
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {service.introText}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Benefits Section */}
        {service.benefits.length > 0 && (
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">
                Why Choose Our {service.name}
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {service.benefits.map((benefit, index) => {
                  const IconComponent = iconMap[benefit.icon] || CheckCircle;
                  return (
                    <div key={index} className="text-center p-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* How It Works - Process Steps */}
        {service.processSteps && service.processSteps.length > 0 && (
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-4">
                  How {service.name} Works
                </h2>
                <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                  Our proven process ensures quality results every time
                </p>
                <div className="space-y-6">
                  {service.processSteps.map((step) => (
                    <div key={step.step} className="flex gap-6 items-start">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                        {step.step}
                      </div>
                      <div className="flex-1 pt-1">
                        <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Features List */}
        {service.features && service.features.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-8">
                  What's Included
                </h2>
                <ul className="grid md:grid-cols-2 gap-4">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* Cost Factors */}
        {service.costFactors && service.costFactors.length > 0 && (
          <section className="py-16 bg-muted/20">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <DollarSign className="w-7 h-7 text-primary" />
                  <h2 className="text-3xl font-bold text-center">
                    What Affects {service.name} Cost
                  </h2>
                </div>
                <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
                  We believe in transparent pricing. Here are the factors that influence your estimate.
                </p>
                <ul className="grid md:grid-cols-2 gap-4">
                  {service.costFactors.map((factor, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-background rounded-lg border border-border/50">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* Pricing & Duration */}
        {(service.priceRange || service.duration) && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-8 text-center">
                {service.priceRange && (
                  <div className="p-6 border border-border rounded-xl">
                    <div className="text-sm text-muted-foreground mb-2">Starting From</div>
                    <div className="text-3xl font-bold text-primary">{service.priceRange}</div>
                  </div>
                )}
                {service.duration && (
                  <div className="p-6 border border-border rounded-xl">
                    <div className="text-sm text-muted-foreground mb-2">Typical Duration</div>
                    <div className="text-3xl font-bold">{service.duration}</div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Where We Offer This Service */}
        {areasWithService.length > 0 && (
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <MapPin className="w-7 h-7 text-primary" />
                  <h2 className="text-3xl font-bold text-center">
                    Where We Offer {service.name}
                  </h2>
                </div>
                <p className="text-muted-foreground text-center mb-8">
                  We provide {service.name.toLowerCase()} throughout the Bay Area
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {areasWithService.map(area => (
                    <Link
                      key={area.id}
                      to={`/service-areas/${area.slug}`}
                      className="flex items-center gap-2 p-4 bg-background rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-colors group"
                    >
                      <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="font-medium group-hover:text-primary transition-colors">{area.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-4">
                  Related Services
                </h2>
                <p className="text-muted-foreground text-center mb-8">
                  Other services that complement {service.name.toLowerCase()}
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedServices.map(related => {
                    const IconComponent = iconMap[related.icon] || Wrench;
                    return (
                      <Link
                        key={related.id}
                        to={`/services/${related.slug}`}
                        className="p-6 border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all group"
                      >
                        <div className="w-12 h-12 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                          {related.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {related.shortDescription || related.description}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {service.faqs && service.faqs.length > 0 && (
          <FAQ
            faqs={service.faqs}
            title={`${service.name} FAQ`}
            subtitle="Common questions about this service"
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
          title={`Ready to Get Started with ${service.name}?`}
          variant="solid"
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

export default ServicePage;
