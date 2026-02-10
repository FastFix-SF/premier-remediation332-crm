/**
 * HeroMinimal - Clean, minimal hero with centered content
 *
 * Features:
 * - Clean white/light background
 * - Centered content layout
 * - Subtle animations
 * - Compact design
 *
 * Usage:
 *   <HeroMinimal />
 */

import React from 'react';
import { useHero, useTrustIndicators } from '@/westpeak/hooks/useConfig';

interface HeroMinimalProps {
  onPrimaryClick?: () => void;
}

export const HeroMinimal: React.FC<HeroMinimalProps> = ({ onPrimaryClick }) => {
  const hero = useHero();
  const trust = useTrustIndicators();

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-muted/50 to-background">
      <div className="container mx-auto px-4 text-center">
        {/* Logo/Badge */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-full px-6 py-3">
            {trust.ratings?.google && (
              <>
                <span className="text-yellow-500">★★★★★</span>
                <span className="text-sm font-medium">{trust.ratings.google} Rating</span>
              </>
            )}
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 max-w-4xl mx-auto leading-tight">
          {hero.headline}{' '}
          {hero.headlineHighlight && (
            <span className="text-primary">{hero.headlineHighlight}</span>
          )}
        </h1>

        {/* Subheadline */}
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          {hero.subheadline}
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={onPrimaryClick}
            className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
          >
            {hero.ctaPrimary || 'Get Started'}
          </button>
          {hero.ctaSecondary && (
            <button className="px-8 py-4 text-foreground font-semibold text-lg hover:text-primary transition-colors">
              {hero.ctaSecondary} →
            </button>
          )}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
          {trust.certifications.map((cert, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span>
              <span>{cert}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroMinimal;
