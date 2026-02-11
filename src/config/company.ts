/**
 * Default Company Configuration (Fallback Template)
 *
 * These values are used ONLY when no tenant is resolved from the database.
 * In production, each tenant's data comes from mt_business_profiles + mt_business_branding.
 * Update these to set generic defaults for the template.
 */

export const companyConfig = {
  // Company Identity
  name: "Your Company",
  websiteUrl: "",
  legalName: "YOUR COMPANY, INC",
  shortName: "Company",
  tagline: "Quality Service, Every Time",
  description: "Professional services. Licensed, insured, and committed to excellence.",

  // Contact Information
  phone: "(000) 000-0000",
  phoneRaw: "+10000000000",
  email: "info@yourcompany.com",

  // Business Details
  licenseNumber: "",
  address: {
    street: "",
    city: "",
    state: "",
    zip: "",
    full: "",
    region: "your area",
  },

  // Hours of Operation
  hours: {
    weekdays: "Mon - Fri: 8AM - 5PM",
    weekends: "Weekends: Closed",
    emergency: "24/7 Emergency Service",
    schema: "Mo-Fr 08:00-17:00",
  },

  // Service Areas
  serviceAreas: [] as string[],

  // Social Media Links
  social: {
    youtube: "",
    instagram: "",
    facebook: "",
    tiktok: "",
    google: "",
    yelp: "",
    linkedin: "",
  },

  // Logo (empty = no fallback logo)
  logo: "",

  // SEO Defaults
  seo: {
    defaultTitle: "Professional Services",
    defaultDescription: "Professional services. Licensed, insured, and committed to quality.",
    defaultKeywords: "contractor, professional services, licensed, insured",
    siteName: "FastFix CRM",
    author: "FastFix",
  },

  // Ratings
  ratings: {
    average: "5.0",
    count: "0",
    best: "5",
    worst: "1",
  },

  // Pricing
  priceRange: "$$-$$$",

  // Services
  services: [] as { name: string; path: string }[],

  // Warranty Info
  warranty: {
    years: 25,
    description: "Warranty covering materials and workmanship",
  },

  // Geo coordinates (for schema.org)
  coordinates: {
    lat: 0,
    lng: 0,
  },
} as const;

// Type for the company config
export type CompanyConfig = typeof companyConfig;
