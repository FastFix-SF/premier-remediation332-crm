/**
 * HeroSplit - Split layout hero with content on one side, image on other
 *
 * Features:
 * - 50/50 split layout (stacks on mobile)
 * - Content side with headline, subheadline, CTAs
 * - Image side with featured image
 * - Optional form embed
 *
 * Usage:
 *   <HeroSplit />
 *   <HeroSplit imagePosition="left" />
 */

import React from 'react';
import { useBusiness, useHero, useStatistics } from '@/westpeak/hooks/useConfig';

interface HeroSplitProps {
  imagePosition?: 'left' | 'right';
  onPrimaryClick?: () => void;
  children?: React.ReactNode; // For embedding forms
}

export const HeroSplit: React.FC<HeroSplitProps> = ({
  imagePosition = 'right',
  onPrimaryClick,
  children,
}) => {
  const business = useBusiness();
  const hero = useHero();
  const statistics = useStatistics();

  const contentSection = (
    <div className="flex flex-col justify-center p-8 lg:p-16">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 w-fit">
        <span>★</span>
        <span>Trusted by {statistics[0]?.number || '1000+'} customers</span>
      </div>

      {/* Headline */}
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
        {hero.headline}{' '}
        {hero.headlineHighlight && (
          <span className="text-primary">{hero.headlineHighlight}</span>
        )}
      </h1>

      {/* Subheadline */}
      <p className="text-lg text-muted-foreground mb-8 max-w-lg">
        {hero.subheadline}
      </p>

      {/* CTAs or Form */}
      {children ? (
        children
      ) : (
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={onPrimaryClick}
            className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            {hero.ctaPrimary || 'Get Free Estimate'}
          </button>
          {hero.ctaSecondary && (
            <button className="px-8 py-4 border border-border rounded-lg font-semibold hover:bg-muted transition-colors">
              {hero.ctaSecondary}
            </button>
          )}
        </div>
      )}

      {/* Mini Stats */}
      <div className="flex gap-8">
        {statistics.slice(0, 3).map((stat, index) => (
          <div key={index}>
            <div className="text-2xl font-bold text-foreground">{stat.number}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const imageSection = (
    <div className="relative min-h-[400px] lg:min-h-[600px]">
      <img
        src={hero.backgroundImage || ''}
        alt={business.name}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Optional overlay pattern */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );

  return (
    <section className="grid lg:grid-cols-2 min-h-[600px]">
      {imagePosition === 'left' ? (
        <>
          {imageSection}
          {contentSection}
        </>
      ) : (
        <>
          {contentSection}
          {imageSection}
        </>
      )}
    </section>
  );
};

export default HeroSplit;
