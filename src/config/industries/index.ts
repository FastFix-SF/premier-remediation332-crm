import type { IndustryConfig, IndustrySlug } from './types';
import roofingConfig from './roofing.json';
import plumbingConfig from './plumbing.json';
import moldRemediationConfig from './mold_remediation.json';
import hvacConfig from './hvac.json';
import generalContractingConfig from './general_contracting.json';
import electricalConfig from './electrical.json';

const INDUSTRY_CONFIGS: Record<string, IndustryConfig> = {
  roofing: roofingConfig as unknown as IndustryConfig,
  plumbing: plumbingConfig as unknown as IndustryConfig,
  mold_remediation: moldRemediationConfig as unknown as IndustryConfig,
  hvac: hvacConfig as unknown as IndustryConfig,
  general_contracting: generalContractingConfig as unknown as IndustryConfig,
  electrical: electricalConfig as unknown as IndustryConfig,
};

export function getIndustryConfig(slug?: string | null): IndustryConfig {
  return INDUSTRY_CONFIGS[slug || 'roofing'] || INDUSTRY_CONFIGS.roofing;
}

export function getAllIndustries(): { slug: IndustrySlug; label: string; icon: string }[] {
  return Object.values(INDUSTRY_CONFIGS).map(c => ({
    slug: c.slug,
    label: c.label,
    icon: c.icon,
  }));
}

export { INDUSTRY_CONFIGS };
export type { IndustryConfig, IndustrySlug, IndustryFieldDefinition, IndustryServicePreset, QuoteConfig, QuoteTabDefinition, QuoteLineItemCategory } from './types';
