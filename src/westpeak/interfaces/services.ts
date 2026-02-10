export interface ServiceConfig {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  shortDescription?: string;
  heroImage?: string;
  heroTitle?: string;
  heroHighlight?: string;
  heroSubheadline?: string;
  introText?: string;
  benefits: ServiceBenefit[];
  features?: string[];
  priceRange?: string;
  duration?: string;
  faqs?: FAQ[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  isFeatured: boolean;
  displayOrder: number;
  processSteps?: ProcessStep[];
  costFactors?: string[];
  lastUpdated?: string;
  relatedServices?: string[];
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface ServiceBenefit {
  icon: string;
  title: string;
  description: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
}
