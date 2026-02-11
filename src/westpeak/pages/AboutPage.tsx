/**
 * About Page
 *
 * Premium about page with company story, statistics, services overview,
 * and service areas. All content is dynamically loaded from config files.
 *
 * Route: /about
 *
 * Usage:
 *   <AboutPage />
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header, Footer } from '@/westpeak/components/layout';
import { CTASection } from '@/westpeak/components/sections';
import { ContactModal } from '@/westpeak/components/modals';
import { useBusiness, useServices, useAreas, useStatistics } from '@/westpeak/hooks/useConfig';
import {
  Shield, Users, Clock, Award, Star, Wrench, Zap, Heart,
  CheckCircle, MapPin, ArrowRight, Building, Target,
} from 'lucide-react';

// Icon mapping for statistics and services
const iconMap: Record<string, React.ElementType> = {
  Shield, Users, Clock, Award, Star, Wrench, Zap, Heart,
  CheckCircle, MapPin, Building, Target,
};

export const AboutPage: React.FC = () => {
  const business = useBusiness();
  const services = useServices();
  const areas = useAreas();
  const statistics = useStatistics();

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Access owner data (not yet typed in interface but present in config)
  const owner = (business as any).owner as { name: string; bio: string; photo?: string } | undefined;
  const yearsInBusiness = (business as any).yearsInBusiness as number | undefined;
  const employeesCount = (business as any).employeesCount as string | undefined;

  return (
    <div className="min-h-screen bg-background">
      <title>{`About Us | ${business.name}`}</title>

      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden bg-background">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/98 to-background/90" />
          <div className="absolute top-1/2 -translate-y-1/2 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute top-0 left-0 w-72 h-72 bg-secondary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

          <div className="relative container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-4 py-1.5 rounded-full mb-6">
              <Building className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Our Story</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              About{' '}
              <span className="gradient-text orange-glow-blink">{business.name}</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
              {business.tagline}
            </p>
          </div>
        </section>

        {/* About / Story Section */}
        {owner?.bio && (
          <section className="py-16 lg:py-24 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="grid lg:grid-cols-5 gap-10 items-start">
                  {/* Left accent */}
                  <div className="lg:col-span-2">
                    <h2 className="text-section font-bold text-foreground mb-4">
                      Our Mission
                    </h2>
                    {owner.name && (
                      <p className="text-muted-foreground text-sm">
                        Founded by <span className="text-primary font-medium">{owner.name}</span>
                      </p>
                    )}
                    {yearsInBusiness && (
                      <div className="mt-6 glass-card p-4 rounded-xl glow-sm">
                        <div className="text-3xl font-bold text-primary">{yearsInBusiness}+</div>
                        <div className="text-sm text-muted-foreground">Years in Business</div>
                      </div>
                    )}
                    {employeesCount && (
                      <div className="mt-4 glass-card p-4 rounded-xl glow-sm">
                        <div className="text-3xl font-bold text-primary">{employeesCount}</div>
                        <div className="text-sm text-muted-foreground">Team Members</div>
                      </div>
                    )}
                  </div>

                  {/* Right content */}
                  <div className="lg:col-span-3">
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {owner.bio}
                    </p>
                    {business.uniqueSellingPoints && business.uniqueSellingPoints.length > 0 && (
                      <ul className="mt-8 space-y-3">
                        {business.uniqueSellingPoints.map((usp, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-foreground">{usp}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Statistics Section */}
        {statistics.length > 0 && (
          <section className="py-12 sm:py-16 lg:py-20 bg-muted/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />

            <div className="container mx-auto px-4 sm:px-6">
              <h2 className="text-section font-bold text-center mb-10 text-foreground">
                By the Numbers
              </h2>
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {statistics.map((stat, index) => {
                  const IconComponent = iconMap[stat.icon] || Shield;
                  return (
                    <div
                      key={index}
                      className="glass-card p-4 sm:p-6 text-center hover-lift animate-fade-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex justify-center mb-3 sm:mb-4">
                        <div className="p-2 sm:p-3 rounded-full bg-primary/10">
                          <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-primary thunder-glow" />
                        </div>
                      </div>
                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 text-foreground">
                        {stat.number}
                      </div>
                      <div className="font-medium text-foreground text-sm sm:text-base">
                        {stat.label}
                      </div>
                      {stat.description && (
                        <div className="text-xs sm:text-sm mt-1 text-muted-foreground">
                          {stat.description}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Services Overview */}
        {services.length > 0 && (
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-section font-bold text-foreground mb-4">
                  Our Services
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Comprehensive solutions tailored to your needs
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {services.map((service) => {
                  const IconComponent = iconMap[service.icon] || Wrench;
                  return (
                    <Link
                      key={service.id}
                      to={`/services/${service.slug}`}
                      className="glass-card p-6 rounded-xl hover:border-primary/50 transition-all group glow-sm"
                    >
                      <div className="w-12 h-12 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {service.shortDescription || service.description}
                      </p>
                      <span className="inline-flex items-center gap-1 text-sm text-primary font-medium group-hover:gap-2 transition-all">
                        Learn More <ArrowRight className="w-4 h-4" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Service Areas */}
        {areas.length > 0 && (
          <section className="py-16 lg:py-24 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-4 py-1.5 rounded-full mb-4">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm text-primary font-medium">Coverage Area</span>
                  </div>
                  <h2 className="text-section font-bold text-foreground mb-4">
                    Where We Serve
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Proudly serving communities across the Greater Bay Area
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {areas.map((area) => (
                    <Link
                      key={area.id}
                      to={`/service-areas/${area.slug}`}
                      className="flex items-center gap-2 p-4 glass-card rounded-lg hover:border-primary/50 transition-all group glow-sm"
                    >
                      <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {area.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <CTASection
          variant="gradient"
          onSecondaryClick={() => setIsContactModalOpen(true)}
        />
      </main>

      <Footer />

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};

export default AboutPage;
