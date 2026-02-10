/**
 * ServiceCard - Individual service display card
 *
 * Features:
 * - Dynamic icon mapping
 * - Link to service page
 * - Hover effects
 * - Optional image display
 *
 * Usage:
 *   <ServiceCard service={service} />
 */

import React from 'react';
import type { ServiceConfig } from '@/westpeak/interfaces';
import {
  Wrench,
  Zap,
  Home,
  Droplets,
  Flame,
  Wind,
  Sun,
  Shield,
  Settings,
  Hammer,
  Building,
  Camera,
  Calendar,
  Search,
  Sparkles,
  Leaf,
  Lock,
  TrendingUp,
  CheckCircle,
  Clock,
} from 'lucide-react';

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  Wrench,
  Zap,
  Home,
  Droplets,
  Flame,
  Wind,
  Sun,
  Shield,
  Settings,
  Hammer,
  Building,
  Camera,
  Calendar,
  Search,
  Sparkles,
  Leaf,
  Lock,
  TrendingUp,
  CheckCircle,
  Clock,
};

interface ServiceCardProps {
  service: ServiceConfig;
  showDescription?: boolean;
  variant?: 'default' | 'compact' | 'featured';
  animationDelay?: number;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  showDescription = true,
  variant = 'default',
  animationDelay = 0,
}) => {
  const IconComponent = iconMap[service.icon] || Wrench;

  if (variant === 'compact') {
    return (
      <a
        href={`/services/${service.slug}`}
        className="flex items-center gap-4 p-4 glass-card hover:border-primary/50 transition-all group animate-fade-up"
        style={{ animationDelay: `${animationDelay}ms` }}
      >
        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
          <IconComponent className="w-5 h-5 group-hover:thunder-glow" />
        </div>
        <span className="font-medium text-foreground">{service.name}</span>
      </a>
    );
  }

  if (variant === 'featured') {
    return (
      <a
        href={`/services/${service.slug}`}
        className="relative group rare-legendary-card animate-fade-up"
        style={{ animationDelay: `${animationDelay}ms` }}
      >
        {/* Image */}
        {service.heroImage && service.heroImage.length > 0 && (
          <div className="aspect-video overflow-hidden">
            <img
              src={service.heroImage}
              alt={service.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 text-primary">
              <IconComponent className="w-5 h-5 thunder-glow" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">{service.name}</h3>
          </div>
          <p className="text-muted-foreground line-clamp-2">
            {service.shortDescription || service.description}
          </p>
        </div>
      </a>
    );
  }

  // Default variant
  return (
    <a
      href={`/services/${service.slug}`}
      className="rare-legendary-card block p-6 group animate-fade-up"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
        <IconComponent className="w-6 h-6 thunder-glow" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {service.name}
      </h3>

      {/* Description */}
      {showDescription && (
        <p className="text-muted-foreground line-clamp-3">
          {service.shortDescription || service.description}
        </p>
      )}

      {/* Learn more link */}
      <div className="mt-4 text-primary font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
        Learn more 
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </a>
  );
};

export default ServiceCard;
