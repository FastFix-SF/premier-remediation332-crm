import { useSyncExternalStore } from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { getIndustryConfig } from '@/config/industries';
import type { IndustryConfig } from '@/config/industries/types';

const DEV_INDUSTRY_KEY = 'dev-industry-override';

function getDevOverride(): string | null {
  if (!import.meta.env.DEV) return null;
  return localStorage.getItem(DEV_INDUSTRY_KEY);
}

// Tiny pub/sub so React re-renders when the override changes
const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function setDevIndustryOverride(slug: string | null) {
  if (slug) {
    localStorage.setItem(DEV_INDUSTRY_KEY, slug);
  } else {
    localStorage.removeItem(DEV_INDUSTRY_KEY);
  }
  listeners.forEach(cb => cb());
}

/**
 * Returns the IndustryConfig for the current tenant's industry.
 * In DEV mode, checks localStorage for a dev override first.
 */
export function useIndustryConfig(): IndustryConfig {
  const { profile } = useTenant();
  const devOverride = useSyncExternalStore(subscribe, getDevOverride, () => null);
  const industry = devOverride || profile?.industry || 'roofing';
  return getIndustryConfig(industry);
}
