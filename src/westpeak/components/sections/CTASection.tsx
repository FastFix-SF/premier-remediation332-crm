/**
 * CTASection - Call-to-action block
 *
 * Features:
 * - Eye-catching design
 * - Primary/secondary CTA buttons
 * - Optional background image
 * - Multiple style variants
 *
 * Usage:
 *   <CTASection />
 *   <CTASection variant="gradient" />
 */

import React from 'react';
import { useBusiness, useContact } from '@/westpeak/hooks/useConfig';
import { Phone, ArrowRight } from 'lucide-react';

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  primaryCTA?: string;
  secondaryCTA?: string;
  variant?: 'solid' | 'gradient' | 'outline';
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  variant: _variant = 'solid',
  onSecondaryClick,
}) => {
  const business = useBusiness();
  const contact = useContact();

  const defaultTitle = `Ready to Get Started with ${business.name}?`;
  const defaultSubtitle = "Contact us today for a free estimate";

  return (
    <section className="py-16 lg:py-20 relative overflow-hidden">
      {/* Flowing gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10" style={{ backgroundSize: '200% 100%', animation: 'gradient-flow 8s ease infinite' }} />
      
      {/* Radial overlays */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/15 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="glass-card rounded-3xl p-10 md:p-16 text-center glow-md">
        {/* Title */}
        <h2 className="text-section font-bold mb-4 text-foreground">
          {title || defaultTitle}
        </h2>

        {/* Subtitle */}
        <p className="text-lg mb-10 max-w-2xl mx-auto text-muted-foreground">
          {subtitle || defaultSubtitle}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* Phone CTA */}
          <a
            href={`tel:${contact.phone}`}
            className="btn-premium inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all"
          >
            <Phone className="w-5 h-5" />
            {primaryCTA || `Call ${contact.phone}`}
          </a>

          {/* Secondary CTA */}
          {(secondaryCTA || onSecondaryClick) && (
            <button
              onClick={onSecondaryClick}
              className="btn-electric inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all group"
            >
              {secondaryCTA || 'Learn More'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
