import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTenantConfig } from '@/hooks/useTenantConfig';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  structuredData?: object;
  ogImage?: string;
  ogType?: string;
  location?: {
    name: string;
    region: string;
  };
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonical,
  structuredData,
  ogImage,
  ogType = "website",
  location
}) => {
  const tenantConfig = useTenantConfig();

  const resolvedTitle = title || tenantConfig.seo?.defaultTitle || '';
  const resolvedDescription = description || tenantConfig.seo?.defaultDescription || '';
  const resolvedKeywords = keywords || tenantConfig.seo?.defaultKeywords || '';
  const brandInitial = tenantConfig.shortName?.charAt(0) || 'F';
  const resolvedOgImage = ogImage || `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 630'><rect width='1200' height='630' fill='%232563eb'/><text x='600' y='350' text-anchor='middle' fill='white' font-family='Arial, sans-serif' font-size='200' font-weight='bold'>${brandInitial}</text><text x='600' y='450' text-anchor='middle' fill='white' font-family='Arial, sans-serif' font-size='40'>${tenantConfig.shortName}</text></svg>`;

  const fullTitle = location
    ? `${resolvedTitle} | ${location.name}, ${location.region}`
    : resolvedTitle;

  const fullDescription = location
    ? `${resolvedDescription} Serving ${location.name} and surrounding areas in ${location.region}.`
    : resolvedDescription;

  const baseUrl = window.location.origin;
  const currentUrl = canonical || window.location.href;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={resolvedKeywords} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={resolvedOgImage.startsWith('data:') ? resolvedOgImage : `${baseUrl}${resolvedOgImage}`} />
      <meta property="og:site_name" content={tenantConfig.seo?.siteName || ''} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={resolvedOgImage.startsWith('data:') ? resolvedOgImage : `${baseUrl}${resolvedOgImage}`} />

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="author" content={tenantConfig.seo?.author || ''} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Location-specific tags */}
      {location && (
        <>
          <meta name="geo.region" content={`US-CA`} />
          <meta name="geo.placename" content={location.name} />
          <meta name="ICBM" content={`${tenantConfig.coordinates?.lat}, ${tenantConfig.coordinates?.lng}`} />
        </>
      )}

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
