export interface BusinessConfig {
  name: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  logo: string;
  logoDark?: string;
  favicon?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  hero: {
    headline: string;
    headlineHighlight?: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary?: string;
    backgroundImage?: string;
    backgroundVideo?: string;
  };
  statistics: StatisticItem[];
  certifications: string[];
  uniqueSellingPoints: string[];
  ratings: {
    google?: number;
    yelp?: number;
    bbb?: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  hours: {
    weekdays: string;
    saturday?: string;
    sunday?: string;
    emergency?: boolean;
  };
}

export interface StatisticItem {
  icon: string;
  number: string;
  label: string;
  description?: string;
}
