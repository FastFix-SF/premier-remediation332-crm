/**
 * Admin Tool: Brand Hero Images
 * 
 * Processes all 12 hero images through the AI image editing edge function
 * to add the West Peak logo naturally into each scene.
 * 
 * Route: /admin/brand-heroes
 */

import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Loader2, AlertCircle, Image, Play, RefreshCw } from 'lucide-react';

// Import all hero images
import trenchlessHero from '@/assets/westpeak/services/trenchless-services-hero.jpg';
import sewerHero from '@/assets/westpeak/services/sewer-services-hero.jpg';
import hydroJettingHero from '@/assets/westpeak/services/hydro-jetting-hero.jpg';
import plumbingHero from '@/assets/westpeak/services/plumbing-services-hero.jpg';
import drainCleaningHero from '@/assets/westpeak/services/commercial-drain-cleaning-hero.jpg';
import waterHeaterHero from '@/assets/westpeak/services/commercial-water-heater-hero.jpg';
import sanFranciscoHero from '@/assets/westpeak/areas/san-francisco-hero.jpg';
import santaClaraHero from '@/assets/westpeak/areas/santa-clara-county-hero.jpg';
import alamedaHero from '@/assets/westpeak/areas/alameda-county-hero.jpg';
import contraCostaHero from '@/assets/westpeak/areas/contra-costa-county-hero.jpg';
import marinHero from '@/assets/westpeak/areas/marin-county-hero.jpg';
import bayAreaHero from '@/assets/westpeak/areas/bay-area-hero.jpg';
import westPeakLogo from '@/assets/westpeak/west-peak-logo.png';

interface HeroImage {
  name: string;
  slug: string;
  category: 'service' | 'area';
  localPath: string;
}

interface ProcessingStatus {
  slug: string;
  status: 'pending' | 'processing' | 'success' | 'error';
  message?: string;
  publicUrl?: string;
}

const heroImages: HeroImage[] = [
  // Service images
  { name: 'Trenchless Services', slug: 'trenchless-services', category: 'service', localPath: trenchlessHero },
  { name: 'Sewer Services', slug: 'sewer-services', category: 'service', localPath: sewerHero },
  { name: 'Hydro Jetting', slug: 'hydro-jetting', category: 'service', localPath: hydroJettingHero },
  { name: 'Plumbing Services', slug: 'plumbing-services', category: 'service', localPath: plumbingHero },
  { name: 'Drain Cleaning', slug: 'commercial-drain-cleaning', category: 'service', localPath: drainCleaningHero },
  { name: 'Water Heater', slug: 'commercial-water-heater', category: 'service', localPath: waterHeaterHero },
  // Area images
  { name: 'San Francisco', slug: 'san-francisco', category: 'area', localPath: sanFranciscoHero },
  { name: 'Santa Clara County', slug: 'santa-clara-county', category: 'area', localPath: santaClaraHero },
  { name: 'Alameda County', slug: 'alameda-county', category: 'area', localPath: alamedaHero },
  { name: 'Contra Costa County', slug: 'contra-costa-county', category: 'area', localPath: contraCostaHero },
  { name: 'Marin County', slug: 'marin-county', category: 'area', localPath: marinHero },
  { name: 'Bay Area', slug: 'bay-area', category: 'area', localPath: bayAreaHero },
];

// Convert image path to base64 data URL
async function imageToBase64(imagePath: string): Promise<string> {
  const response = await fetch(imagePath);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export const BrandHeroImages: React.FC = () => {
  const [statuses, setStatuses] = useState<ProcessingStatus[]>(
    heroImages.map(img => ({ slug: img.slug, status: 'pending' }))
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const updateStatus = (slug: string, update: Partial<ProcessingStatus>) => {
    setStatuses(prev => prev.map(s => 
      s.slug === slug ? { ...s, ...update } : s
    ));
  };

  const processImage = async (image: HeroImage): Promise<boolean> => {
    updateStatus(image.slug, { status: 'processing', message: 'Converting images...' });

    try {
      // Convert both images to base64
      const [imageBase64, logoBase64] = await Promise.all([
        imageToBase64(image.localPath),
        imageToBase64(westPeakLogo)
      ]);

      updateStatus(image.slug, { message: 'Sending to AI for logo integration...' });

      // Call the edge function
      const { data, error } = await supabase.functions.invoke('add-logo-to-image', {
        body: {
          imageUrl: imageBase64,
          logoUrl: logoBase64,
          imageName: image.slug
        }
      });

      if (error) {
        throw new Error(error.message || 'Edge function error');
      }

      if (!data.success) {
        throw new Error(data.error || 'Processing failed');
      }

      updateStatus(image.slug, { 
        status: 'success', 
        message: 'Logo added successfully!',
        publicUrl: data.publicUrl
      });

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      updateStatus(image.slug, { 
        status: 'error', 
        message: errorMessage 
      });
      return false;
    }
  };

  const processSingleImage = async (index: number) => {
    setIsProcessing(true);
    setCurrentIndex(index);
    await processImage(heroImages[index]);
    setIsProcessing(false);
    setCurrentIndex(null);
  };

  const processAllImages = async () => {
    setIsProcessing(true);
    
    // Reset all statuses
    setStatuses(heroImages.map(img => ({ slug: img.slug, status: 'pending' })));

    // Process images sequentially to avoid rate limits
    for (let i = 0; i < heroImages.length; i++) {
      setCurrentIndex(i);
      await processImage(heroImages[i]);
      
      // Small delay between requests to avoid rate limiting
      if (i < heroImages.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    setIsProcessing(false);
    setCurrentIndex(null);
  };

  const getStatusIcon = (status: ProcessingStatus['status']) => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Image className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const successCount = statuses.filter(s => s.status === 'success').length;
  const errorCount = statuses.filter(s => s.status === 'error').length;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Brand Hero Images</h1>
          <p className="text-muted-foreground">
            Add the West Peak logo naturally into all hero images using AI
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <div className="text-2xl font-bold text-foreground">{heroImages.length}</div>
            <div className="text-sm text-muted-foreground">Total Images</div>
          </div>
          <div className="p-4 bg-green-500/10 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-500">{successCount}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="p-4 bg-red-500/10 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-500">{errorCount}</div>
            <div className="text-sm text-muted-foreground">Errors</div>
          </div>
        </div>

        {/* Process All Button */}
        <button
          onClick={processAllImages}
          disabled={isProcessing}
          className="w-full mb-8 flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing {currentIndex !== null ? `(${currentIndex + 1}/${heroImages.length})` : '...'}
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Process All Images
            </>
          )}
        </button>

        {/* Image List */}
        <div className="space-y-4">
          {/* Service Images */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">Service Pages</h2>
            <div className="space-y-3">
              {heroImages.filter(img => img.category === 'service').map((image) => {
                const status = statuses.find(s => s.slug === image.slug);
                const globalIndex = heroImages.findIndex(i => i.slug === image.slug);
                return (
                  <div 
                    key={image.slug}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                      status?.status === 'processing' ? 'border-primary bg-primary/5' :
                      status?.status === 'success' ? 'border-green-500/30 bg-green-500/5' :
                      status?.status === 'error' ? 'border-red-500/30 bg-red-500/5' :
                      'border-border bg-card'
                    }`}
                  >
                    <img 
                      src={status?.publicUrl || image.localPath} 
                      alt={image.name}
                      className="w-20 h-14 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{image.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {status?.message || `${image.slug}-hero.jpg`}
                      </div>
                    </div>
                    {getStatusIcon(status?.status || 'pending')}
                    <button
                      onClick={() => processSingleImage(globalIndex)}
                      disabled={isProcessing}
                      className="p-2 text-muted-foreground hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Process this image"
                    >
                      <RefreshCw className={`w-4 h-4 ${currentIndex === globalIndex ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Area Images */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">Service Area Pages</h2>
            <div className="space-y-3">
              {heroImages.filter(img => img.category === 'area').map((image) => {
                const status = statuses.find(s => s.slug === image.slug);
                const globalIndex = heroImages.findIndex(i => i.slug === image.slug);
                return (
                  <div 
                    key={image.slug}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                      status?.status === 'processing' ? 'border-primary bg-primary/5' :
                      status?.status === 'success' ? 'border-green-500/30 bg-green-500/5' :
                      status?.status === 'error' ? 'border-red-500/30 bg-red-500/5' :
                      'border-border bg-card'
                    }`}
                  >
                    <img 
                      src={status?.publicUrl || image.localPath} 
                      alt={image.name}
                      className="w-20 h-14 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{image.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {status?.message || `${image.slug}-hero.jpg`}
                      </div>
                    </div>
                    {getStatusIcon(status?.status || 'pending')}
                    <button
                      onClick={() => processSingleImage(globalIndex)}
                      disabled={isProcessing}
                      className="p-2 text-muted-foreground hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Process this image"
                    >
                      <RefreshCw className={`w-4 h-4 ${currentIndex === globalIndex ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-muted/30 rounded-lg">
          <h3 className="font-semibold text-foreground mb-2">How it works</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
            <li>Click "Process All Images" or process individual images</li>
            <li>AI analyzes each image and finds natural placement for the logo</li>
            <li>Branded images are uploaded to storage automatically</li>
            <li>Once complete, update the page components to use branded images</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default BrandHeroImages;
