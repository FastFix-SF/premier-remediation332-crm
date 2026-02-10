/**
 * HeroClassic - Traditional hero section with background image
 *
 * Features:
 * - Full-width background image
 * - Overlay gradient for text readability
 * - Headline with optional highlight word
 * - Two CTA buttons
 * - Trust indicators
 *
 * Usage:
 *   <HeroClassic />
 *   <HeroClassic onPrimaryClick={() => scrollToForm()} />
 */

import React from 'react';
import { useHero, useTrustIndicators } from '@/westpeak/hooks/useConfig';

interface HeroClassicProps {
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export const HeroClassic: React.FC<HeroClassicProps> = ({
  onPrimaryClick,
  onSecondaryClick,
}) => {
  const hero = useHero();
  const trust = useTrustIndicators();

  return (
    <section
      className="relative min-h-[700px] flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: hero.backgroundImage ? `url(${hero.backgroundImage})` : undefined }}
    >
      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-background/70" />
      
      {/* Floating orb effects */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/15 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-3s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Headline */}
        <h1 className="text-hero font-black mb-6 text-foreground tracking-tight">
          {hero.headline}
          {hero.headlineHighlight && (
            <>
              {' '}
              <span className="text-primary orange-glow-blink">{hero.headlineHighlight}</span>
            </>
          )}
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-muted-foreground">
          {hero.subheadline}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
          <button
            onClick={onPrimaryClick}
            className="btn-gold-wave px-8 py-4 rounded-xl text-lg transition-all duration-300"
          >
            {hero.ctaPrimary || 'Get Free Estimate'}
          </button>
          {hero.ctaSecondary && (
            <button
              onClick={onSecondaryClick}
              className="btn-electric px-8 py-4 rounded-xl text-lg transition-all duration-300"
            >
              {hero.ctaSecondary}
            </button>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="glass-card inline-flex flex-wrap justify-center gap-6 px-8 py-4 mx-auto">
          {trust.ratings?.google && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-primary thunder-glow">★</span>
              <span className="text-foreground">{trust.ratings.google} Google Rating</span>
            </div>
          )}
          {trust.certifications.slice(0, 3).map((cert, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span className="text-primary energy-glow">✓</span>
              <span className="text-foreground">{cert}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroClassic;
