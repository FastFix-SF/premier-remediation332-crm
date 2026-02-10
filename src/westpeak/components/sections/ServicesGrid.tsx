/**
 * ServicesGrid - Grid display of services
 *
 * Features:
 * - Responsive grid layout
 * - Service cards with icons
 * - Link to individual service pages
 * - Optional featured-only filter
 *
 * Usage:
 *   <ServicesGrid />
 *   <ServicesGrid featured={true} columns={3} />
 */

import React from 'react';
import { useServices, useFeaturedServices } from '@/westpeak/hooks/useConfig';
import { ServiceCard } from '@/westpeak/components/cards/ServiceCard';

interface ServicesGridProps {
  featured?: boolean;
  columns?: 2 | 3 | 4;
  showDescription?: boolean;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({
  featured = false,
  columns = 3,
  showDescription = true,
}) => {
  const allServices = useServices();
  const featuredServices = useFeaturedServices();
  const services = featured ? featuredServices : allServices;

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-background relative overflow-hidden">
      {/* Floating orb accents */}
      <div className="absolute top-40 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-primary/10 rounded-full blur-[60px] sm:blur-[100px]" />
      <div className="absolute bottom-20 left-0 w-40 sm:w-80 h-40 sm:h-80 bg-secondary/10 rounded-full blur-[80px] sm:blur-[120px]" />
      
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            <span className="gradient-text">Our Services</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Professional solutions tailored to your needs
          </p>
        </div>

        {/* Grid */}
        <div className={`grid gap-4 sm:gap-6 ${gridCols[columns]}`}>
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              showDescription={showDescription}
              animationDelay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
