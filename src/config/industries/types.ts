export type IndustrySlug =
  | 'roofing'
  | 'plumbing'
  | 'mold_remediation'
  | 'hvac'
  | 'general_contracting'
  | 'electrical';

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldOptionGroup {
  groupLabel: string;
  options: FieldOption[];
}

export interface IndustryFieldDefinition {
  key: string;
  label: string;
  type: 'select' | 'text' | 'number' | 'multiselect' | 'nested_select';
  required: boolean;
  options?: FieldOption[];
  groups?: FieldOptionGroup[];
  placeholder?: string;
  helpText?: string;
  showInFilters?: boolean;
  showInQuoteForm?: boolean;
  showInAdminForm?: boolean;
  showInSummary?: boolean;
}

export interface IndustryServicePreset {
  name: string;
  description: string;
  icon: string;
}

export interface QuoteTabDefinition {
  key: string;
  label: string;
  component: string;
  fullscreenCapable?: boolean;
}

export interface QuoteLineItemCategory {
  key: string;
  label: string;
  unitTypes: string[];
  defaultItems?: { name: string; unit: string; unitPrice: number }[];
}

export interface QuoteConfig {
  headerTitle: string;
  headerColor: string;
  tabs: QuoteTabDefinition[];
  defaultTab: string;
  postCreateTab: string;
  lineItemCategories: QuoteLineItemCategory[];
  measurementUnit?: string;
}

export interface IndustryConfig {
  slug: IndustrySlug;
  label: string;
  icon: string;
  servicesLabel: string;
  heroHeadline: string;
  heroHighlight: string;
  heroSubtitle: string;
  projectCategories: FieldOption[];
  projectTypes: FieldOption[];
  industryFields: IndustryFieldDefinition[];
  servicePresets: IndustryServicePreset[];
  navigationServices: { label: string; path: string }[];
  seo: {
    defaultKeywords: string;
    defaultDescription: string;
  };
  warranty: {
    defaultYears: number;
    description: string;
  };
  filterLabels: {
    primaryFilter: string;
    secondaryFilter?: string;
  };
  faqPresets: { question: string; answer: string }[];
  defaultFeatures: string[];
  quoteConfig: QuoteConfig;
  commonSkills?: string[];
  specialties?: string[];
  skillCategories?: { value: string; label: string }[];
}
