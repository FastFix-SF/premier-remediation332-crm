 /**
  * Neighborhood Configuration Interfaces
  *
  * Defines the structure for SEO-optimized neighborhood landing pages.
  * Each neighborhood belongs to a parent service area and has unique local content.
  */
 
 export interface NeighborhoodConfig {
   id: string;
   slug: string;
   parentAreaSlug: string;
   name: string;
   fullName: string;
   heroHeadline?: string;
   heroSubheadline?: string;
   localContext?: string;
   commonProblems?: NeighborhoodProblem[];
   propertyTypes?: string[];
   landmarks?: string[];
   localTip?: string;
   testimonial?: NeighborhoodTestimonial;
   faqs?: NeighborhoodFAQ[];
   coordinates?: { lat: number; lng: number };
   seoTitle?: string;
   seoDescription?: string;
   services?: string[];
   lastUpdated?: string;
 }
 
 export interface NeighborhoodProblem {
   title: string;
   description: string;
 }
 
 export interface NeighborhoodTestimonial {
   name: string;
   text: string;
   rating: number;
   project?: string;
 }
 
 export interface NeighborhoodFAQ {
   id: string;
   question: string;
   answer: string;
 }