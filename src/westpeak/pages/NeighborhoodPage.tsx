 /**
  * Neighborhood Page - SEO-Optimized Local Landing Page
  *
  * Features advanced local SEO including:
  * - LocalBusiness + Plumber schema
  * - FAQPage schema for rich snippets
  * - BreadcrumbList schema
  * - GeoCoordinates
  * - Unique hyper-local content
  */
 
 import React from 'react';
 import { useParams, Navigate, Link } from 'react-router-dom';
 import { Header, Footer } from '@/westpeak/components/layout';
 import { FAQ, CTASection } from '@/westpeak/components/sections';
 import { ServiceCard, TestimonialCard } from '@/westpeak/components/cards';
 import { useBusiness, useNeighborhoodBySlug, useAreaBySlug, useServices } from '@/westpeak/hooks/useConfig';
 import { MapPin, AlertTriangle, Building2, Landmark, Lightbulb, ChevronRight, Home, Calendar } from 'lucide-react';
 
 export const NeighborhoodPage: React.FC = () => {
   const { areaSlug, neighborhoodSlug } = useParams<{ areaSlug: string; neighborhoodSlug: string }>();
   const neighborhood = useNeighborhoodBySlug(areaSlug || '', neighborhoodSlug || '');
   const area = useAreaBySlug(areaSlug || '');
   const business = useBusiness();
   const allServices = useServices();
 
   // Get services available in this neighborhood
   const neighborhoodServices = neighborhood?.services
     ? allServices.filter(s => neighborhood.services?.includes(s.slug))
     : allServices.slice(0, 4);
 
   // Redirect if neighborhood not found
   if (!neighborhood || !area) {
     return <Navigate to={`/service-areas/${areaSlug || ''}`} replace />;
   }
 
   // Build comprehensive schema markup
   const schemaData = {
     "@context": "https://schema.org",
     "@graph": [
       // LocalBusiness schema
       {
         "@type": ["LocalBusiness", "Plumber"],
         "name": business.name,
         "telephone": business.phone,
         "url": (business as any).website || '',
         "priceRange": "$$",
         "areaServed": {
           "@type": "City",
           "name": neighborhood.fullName,
           ...(neighborhood.coordinates && {
             "geo": {
               "@type": "GeoCoordinates",
               "latitude": neighborhood.coordinates.lat,
               "longitude": neighborhood.coordinates.lng
             }
           })
         },
         ...(neighborhood.lastUpdated && { "dateModified": `${neighborhood.lastUpdated}-01` }),
       },
       // BreadcrumbList schema
       {
         "@type": "BreadcrumbList",
         "itemListElement": [
           { "@type": "ListItem", "position": 1, "name": "Home", "item": "/" },
           { "@type": "ListItem", "position": 2, "name": area.name, "item": `/service-areas/${area.slug}` },
           { "@type": "ListItem", "position": 3, "name": neighborhood.name }
         ]
       },
       // FAQPage schema
       ...(neighborhood.faqs && neighborhood.faqs.length > 0 ? [{
         "@type": "FAQPage",
         "mainEntity": neighborhood.faqs.map(faq => ({
           "@type": "Question",
           "name": faq.question,
           "acceptedAnswer": {
             "@type": "Answer",
             "text": faq.answer
           }
         }))
       }] : []),
       // Service schemas
       ...neighborhoodServices.map(service => ({
         "@type": "Service",
         "name": service.name,
         "areaServed": neighborhood.fullName,
         "provider": { "@type": "LocalBusiness", "name": business.name }
       }))
     ]
   };
 
   return (
     <div className="min-h-screen bg-background">
       {/* SEO Meta Tags */}
       <title>{neighborhood.seoTitle || `${neighborhood.name} Plumber | ${business.name}`}</title>
       <meta name="description" content={neighborhood.seoDescription || `Expert plumbing services in ${neighborhood.fullName}. 24/7 emergency service. Free estimates.`} />
 
       <Header />
 
       <main>
         {/* Breadcrumbs */}
         <nav className="bg-muted/30 py-3 border-b border-border/50">
           <div className="container mx-auto px-4">
             <ol className="flex items-center gap-2 text-sm text-muted-foreground">
               <li>
                 <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
                   <Home className="w-4 h-4" />
                   Home
                 </Link>
               </li>
               <ChevronRight className="w-4 h-4" />
               <li>
                 <Link to={`/service-areas/${area.slug}`} className="hover:text-primary transition-colors">
                   {area.name}
                 </Link>
               </li>
               <ChevronRight className="w-4 h-4" />
               <li className="text-foreground font-medium">{neighborhood.name}</li>
             </ol>
           </div>
         </nav>
 
         {/* Hero Section */}
         <section className="relative py-16 lg:py-24 overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
           <div className="relative container mx-auto px-4">
             <div className="flex items-center gap-2 text-primary mb-4">
               <MapPin className="w-5 h-5" />
               <span className="font-medium">{area.name}</span>
             </div>
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground">
               {neighborhood.heroHeadline || `${neighborhood.name} Plumbing Experts`}
             </h1>
             <p className="text-xl max-w-3xl text-muted-foreground">
               {neighborhood.heroSubheadline || `Professional plumbing and trenchless services in ${neighborhood.fullName}`}
             </p>
           </div>
         </section>
 
         {/* Local Context */}
         {neighborhood.localContext && (
           <section className="py-12 bg-muted/30">
             <div className="container mx-auto px-4">
               <div className="max-w-4xl mx-auto">
                 <p className="text-lg leading-relaxed text-muted-foreground">
                   {neighborhood.localContext}
                 </p>
               </div>
             </div>
           </section>
         )}
 
         {/* Common Problems */}
         {neighborhood.commonProblems && neighborhood.commonProblems.length > 0 && (
           <section className="py-16">
             <div className="container mx-auto px-4">
               <h2 className="text-3xl font-bold text-center mb-4">
                 Common Plumbing Issues in {neighborhood.name}
               </h2>
               <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
                 We understand the unique challenges {neighborhood.name} properties face
               </p>
               <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                 {neighborhood.commonProblems.map((problem, index) => (
                   <div key={index} className="glass-card p-6 rounded-xl">
                     <div className="flex items-start gap-4">
                       <div className="p-2 bg-primary/10 rounded-lg">
                         <AlertTriangle className="w-6 h-6 text-primary" />
                       </div>
                       <div>
                         <h3 className="font-semibold text-lg mb-2">{problem.title}</h3>
                         <p className="text-muted-foreground text-sm">{problem.description}</p>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           </section>
         )}
 
         {/* Property Types & Landmarks */}
         <section className="py-16 bg-muted/20">
           <div className="container mx-auto px-4">
             <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
               {/* Property Types */}
               {neighborhood.propertyTypes && neighborhood.propertyTypes.length > 0 && (
                 <div>
                   <div className="flex items-center gap-2 mb-4">
                     <Building2 className="w-5 h-5 text-primary" />
                     <h3 className="text-xl font-semibold">Property Types We Serve</h3>
                   </div>
                   <div className="flex flex-wrap gap-2">
                     {neighborhood.propertyTypes.map((type, index) => (
                       <span key={index} className="px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-full">
                         {type}
                       </span>
                     ))}
                   </div>
                 </div>
               )}
 
               {/* Landmarks */}
               {neighborhood.landmarks && neighborhood.landmarks.length > 0 && (
                 <div>
                   <div className="flex items-center gap-2 mb-4">
                     <Landmark className="w-5 h-5 text-primary" />
                     <h3 className="text-xl font-semibold">Near These Landmarks</h3>
                   </div>
                   <div className="flex flex-wrap gap-2">
                     {neighborhood.landmarks.map((landmark, index) => (
                       <span key={index} className="px-3 py-1.5 bg-muted text-muted-foreground text-sm rounded-full">
                         {landmark}
                       </span>
                     ))}
                   </div>
                 </div>
               )}
             </div>
 
             {/* Local Tip */}
             {neighborhood.localTip && (
               <div className="max-w-3xl mx-auto mt-12">
                 <div className="glass-card p-6 rounded-xl border-l-4 border-primary">
                   <div className="flex items-start gap-3">
                     <Lightbulb className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                     <div>
                       <h4 className="font-semibold mb-1">Local Tip</h4>
                       <p className="text-muted-foreground">{neighborhood.localTip}</p>
                     </div>
                   </div>
                 </div>
               </div>
             )}
           </div>
         </section>
 
         {/* Services Available */}
         {neighborhoodServices.length > 0 && (
           <section className="py-16">
             <div className="container mx-auto px-4">
               <h2 className="text-3xl font-bold text-center mb-4">
                 Services in {neighborhood.name}
               </h2>
               <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
                 Professional solutions for {neighborhood.fullName}
               </p>
               <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                 {neighborhoodServices.slice(0, 4).map(service => (
                   <ServiceCard key={service.id} service={service} variant="compact" />
                 ))}
               </div>
             </div>
           </section>
         )}
 
         {/* Testimonial */}
         {neighborhood.testimonial && (
           <section className="py-16 bg-muted/30">
             <div className="container mx-auto px-4">
               <h2 className="text-3xl font-bold text-center mb-8">
                 What {neighborhood.name} Customers Say
               </h2>
               <div className="max-w-2xl mx-auto">
                 <TestimonialCard
                   testimonial={{
                     ...neighborhood.testimonial,
                     location: neighborhood.name,
                   }}
                   variant="featured"
                 />
               </div>
             </div>
           </section>
         )}
 
         {/* FAQ Section */}
         {neighborhood.faqs && neighborhood.faqs.length > 0 && (
           <FAQ
             faqs={neighborhood.faqs}
             title={`${neighborhood.name} Plumbing FAQ`}
             subtitle={`Common questions from ${neighborhood.name} customers`}
           />
         )}
 
         {/* Last Updated Indicator */}
         {neighborhood.lastUpdated && (
           <div className="container mx-auto px-4 py-4">
             <p className="text-sm text-muted-foreground text-center">
               <Calendar className="w-4 h-4 inline-block mr-1 -mt-0.5" />
               Last updated: {new Date(neighborhood.lastUpdated + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
             </p>
           </div>
         )}

         {/* CTA */}
         <CTASection
           title={`Need a Plumber in ${neighborhood.name}?`}
           subtitle={`Fast, reliable service for ${neighborhood.fullName}`}
           variant="gradient"
         />
       </main>
 
       <Footer />
 
       {/* Schema.org structured data */}
       <script
         type="application/ld+json"
         dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
       />
     </div>
   );
 };
 
 export default NeighborhoodPage;