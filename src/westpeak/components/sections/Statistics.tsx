/**
 * Statistics - Number stats section
 *
 * Features:
 * - Dynamic icon mapping
 * - Animated counters (optional)
 * - Responsive layout
 * - Dark/light variants
 *
 * Usage:
 *   <Statistics />
 *   <Statistics variant="dark" />
 */

import React from 'react';
import { useStatistics } from '@/westpeak/hooks/useConfig';
import {
  Shield,
  Users,
  Clock,
  Award,
  Star,
  Wrench,
  Zap,
  Heart,
  CheckCircle,
  MapPin,
} from 'lucide-react';

// Icon mapping - add icons as needed
const iconMap: Record<string, React.ElementType> = {
  Shield,
  Users,
  Clock,
  Award,
  Star,
  Wrench,
  Zap,
  Heart,
  CheckCircle,
  MapPin,
};

interface StatisticsProps {
  variant?: 'light' | 'dark';
}

export const Statistics: React.FC<StatisticsProps> = ({ variant: _variant = 'dark' }) => {
  const statistics = useStatistics();

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-muted/50 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
      
      <div className="container mx-auto px-4 sm:px-6">
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
  );
};

export default Statistics;
