/**
 * Configuration Hooks
 *
 * These hooks provide typed access to JSON configuration files.
 * All business content is loaded through these hooks - never hardcode content in components.
 *
 * Usage:
 *   const business = useBusiness();
 *   const services = useServices();
 *   const service = useServiceBySlug('plumbing-repair');
 */

import { useMemo } from 'react';
import type {
  BusinessConfig,
  ServiceConfig,
  AreaConfig,
  ThemeConfig,
  NavigationConfig
} from '@/westpeak/interfaces';

// Import JSON configs
import businessData from '@/config/business.json';
import servicesData from '@/config/services.json';
import areasData from '@/config/areas.json';
import navigationData from '@/config/navigation.json';
import themeData from '@/config/theme.json';
 import neighborhoodsData from '@/config/neighborhoods.json';
 import reviewsData from '@/config/reviews.json';

// ============================================
// BUSINESS CONFIG HOOKS
// ============================================

/**
 * Get the full business configuration
 */
export function useBusiness(): BusinessConfig {
  return businessData as BusinessConfig;
}

/**
 * Get hero section configuration
 */
export function useHero() {
  const business = useBusiness();
  return business.hero;
}

/**
 * Get statistics array for display
 */
export function useStatistics() {
  const business = useBusiness();
  return business.statistics || [];
}

/**
 * Get business contact info
 */
export function useContact() {
  const business = useBusiness();
  return {
    phone: business.phone,
    email: business.email,
    address: business.address,
    hours: business.hours,
    social: business.social,
  };
}

// ============================================
// SERVICES CONFIG HOOKS
// ============================================

/**
 * Get all services
 */
export function useServices(): ServiceConfig[] {
  return servicesData as ServiceConfig[];
}

/**
 * Get a single service by slug
 */
export function useServiceBySlug(slug: string): ServiceConfig | undefined {
  const services = useServices();
  return useMemo(
    () => services.find(service => service.slug === slug),
    [services, slug]
  );
}

/**
 * Get featured services only
 */
export function useFeaturedServices(): ServiceConfig[] {
  const services = useServices();
  return useMemo(
    () => services
      .filter(service => service.isFeatured)
      .sort((a, b) => a.displayOrder - b.displayOrder),
    [services]
  );
}

/**
 * Get all service slugs (for routing/sitemap)
 */
export function useServiceSlugs(): string[] {
  const services = useServices();
  return useMemo(
    () => services.map(service => service.slug),
    [services]
  );
}

// ============================================
// AREAS CONFIG HOOKS
// ============================================

/**
 * Get all service areas
 */
export function useAreas(): AreaConfig[] {
  return areasData as AreaConfig[];
}

/**
 * Get a single area by slug
 */
export function useAreaBySlug(slug: string): AreaConfig | undefined {
  const areas = useAreas();
  return useMemo(
    () => areas.find(area => area.slug === slug),
    [areas, slug]
  );
}

/**
 * Get all area slugs (for routing/sitemap)
 */
export function useAreaSlugs(): string[] {
  const areas = useAreas();
  return useMemo(
    () => areas.map(area => area.slug),
    [areas]
  );
}

/**
 * Get services available in a specific area
 */
export function useAreaServices(areaSlug: string): ServiceConfig[] {
  const area = useAreaBySlug(areaSlug);
  const services = useServices();

  return useMemo(() => {
    if (!area?.services) return services;
    return services.filter(service => area.services?.includes(service.slug));
  }, [area, services]);
}

// ============================================
// NAVIGATION CONFIG HOOKS
// ============================================

/**
 * Get navigation configuration
 */
export function useNavigation(): NavigationConfig {
  return navigationData as NavigationConfig;
}

/**
 * Get main menu items
 */
export function useMainMenu() {
  const nav = useNavigation();
  return nav.mainMenu || [];
}

/**
 * Get footer menu sections
 */
export function useFooterMenu() {
  const nav = useNavigation();
  return nav.footerMenu;
}

/**
 * Get feature flags
 */
export function useFeatures() {
  const nav = useNavigation();
  return nav.features;
}

// ============================================
// THEME CONFIG HOOKS
// ============================================

/**
 * Get theme configuration
 */
export function useTheme(): ThemeConfig {
  return themeData as ThemeConfig;
}

/**
 * Get color scheme
 */
export function useColors() {
  const theme = useTheme();
  return theme.colors;
}

/**
 * Get font configuration
 */
export function useFonts() {
  const theme = useTheme();
  return theme.fonts;
}

// ============================================
// UTILITY HOOKS
// ============================================

/**
 * Check if any solar-related services exist
 */
export function useHasSolarServices(): boolean {
  const services = useServices();
  const solarKeywords = ['solar', 'roofing', 'roof', 'energy', 'panel'];

  return useMemo(
    () => services.some(s =>
      solarKeywords.some(keyword =>
        s.name.toLowerCase().includes(keyword) ||
        s.slug.toLowerCase().includes(keyword)
      )
    ),
    [services]
  );
}

/**
 * Get all FAQs from all services
 */
export function useAllFAQs() {
  const services = useServices();

  return useMemo(
    () => services.flatMap(service => service.faqs || []),
    [services]
  );
}

/**
 * Get trust indicators for display
 */
export function useTrustIndicators() {
  const business = useBusiness();

  return {
    certifications: business.certifications || [],
    ratings: business.ratings,
    usp: business.uniqueSellingPoints || [],
  };
}

 /**
  * Get project showcase data
  */
 export function useProjectShowcase() {
   const business = useBusiness();
   return (business as any).projectShowcase || [];
 }
 
 // ============================================
 // NEIGHBORHOOD CONFIG HOOKS
 // ============================================
 
 /**
  * Get all neighborhoods
  */
 export function useNeighborhoods(): import('@/westpeak/interfaces').NeighborhoodConfig[] {
   return neighborhoodsData as import('@/westpeak/interfaces').NeighborhoodConfig[];
 }
 
 /**
  * Get a single neighborhood by area slug and neighborhood slug
  */
 export function useNeighborhoodBySlug(
   areaSlug: string,
   neighborhoodSlug: string
 ): import('@/westpeak/interfaces').NeighborhoodConfig | undefined {
   const neighborhoods = useNeighborhoods();
   return useMemo(
     () => neighborhoods.find(
       n => n.parentAreaSlug === areaSlug && n.slug === neighborhoodSlug
     ),
     [neighborhoods, areaSlug, neighborhoodSlug]
   );
 }
 
 /**
  * Get all neighborhoods for a specific area
  */
 export function useNeighborhoodsByArea(areaSlug: string): import('@/westpeak/interfaces').NeighborhoodConfig[] {
   const neighborhoods = useNeighborhoods();
   return useMemo(
     () => neighborhoods.filter(n => n.parentAreaSlug === areaSlug),
     [neighborhoods, areaSlug]
   );
 }
 
 // ============================================
 // GOOGLE REVIEWS HOOKS
 // ============================================
 
 interface GoogleReview {
   id: string;
   name: string;
   rating: number;
   date: string;
   text: string;
   serviceType?: string;
 }
 
 interface ReviewsData {
   source: string;
   totalReviews: number;
   averageRating: number;
   lastUpdated: string;
   googleProfileUrl: string;
   reviews: GoogleReview[];
 }
 
 /**
  * Get Google reviews data
  */
 export function useGoogleReviews(): ReviewsData {
   return reviewsData as ReviewsData;
 }
