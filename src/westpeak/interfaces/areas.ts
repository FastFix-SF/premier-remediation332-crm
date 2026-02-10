export interface AreaConfig {
  id: string;
  slug: string;
  name: string;
  fullName: string;
  heroImage?: string;
  heroImageAlt?: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  introText?: string;
  neighborhoods: string[];
  testimonial?: AreaTestimonial;
  faqs?: AreaFAQ[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  seoTitle?: string;
  seoDescription?: string;
  services?: string[]; // slugs of services available in this area
  lastUpdated?: string;
}

export interface AreaTestimonial {
  name: string;
  text: string;
  rating: number;
  project?: string;
  image?: string;
}

export interface AreaFAQ {
  id: string;
  question: string;
  answer: string;
}
