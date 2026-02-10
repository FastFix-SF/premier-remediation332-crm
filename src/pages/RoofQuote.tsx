import React, { useState } from 'react';
import SEOHead from '@/components/SEOHead';
import RoofingFriendHeader from '@/components/RoofingFriendHeader';
import Footer from '@/components/Footer';
import { QuoteForm } from '@/components/quote/QuoteForm';
import { QuoteSummary } from '@/components/quote/QuoteSummary';
import { HowItWorks } from '@/components/quote/HowItWorks';
import { SuccessDialog } from '@/components/quote/SuccessDialog';
import { Shield, Star, Award, MapPin } from 'lucide-react';
import { useTenantConfig } from '@/hooks/useTenantConfig';
import { useIndustryConfig } from '@/hooks/useIndustryConfig';

interface FormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  projectType?: string;
  propertyType?: string;
  timeline?: string;
  notes?: string;
  roofType?: string;
  placeId?: string;
  lat?: number;
  lng?: number;
}

const RoofQuote = () => {
  const tenantConfig = useTenantConfig();
  const industryConfig = useIndustryConfig();
  const industryLabel = industryConfig.label;
  const [formData, setFormData] = useState<FormData>({});
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Check if form is valid for summary
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'projectType', 'propertyType', 'timeline'];
      const hasAllRequired = requiredFields.every(reqField => updated[reqField as keyof FormData]);
      setIsFormValid(hasAllRequired);
      
      return updated;
    });

    // Track analytics for field completion
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'quote_field_completed',
        field_name: field,
        field_value: value
      });
    }
  };

  const handleFormSubmit = (data: FormData) => {
    setShowSuccessDialog(true);
    setFormData(data);
  };

  const handleSummarySubmit = () => {
    // This will trigger the form's onSubmit
    if (typeof document !== 'undefined') {
      const submitEvent = new Event('submit', { bubbles: true });
      const formElement = document.querySelector('form');
      formElement?.dispatchEvent(submitEvent);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`Get a Professional ${industryLabel} Quote in 24 Hours - Free Estimate | ${tenantConfig.name}`}
        description={industryConfig.seo.defaultDescription || `Get your professional ${industryLabel.toLowerCase()} quote in 24 hours. We use detailed analysis to provide accurate estimates.`}
        keywords={industryConfig.seo.defaultKeywords || `${industryLabel.toLowerCase()} quote, ${industryLabel.toLowerCase()} estimate, contractor`}
      />
      <RoofingFriendHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
            Get Your Professional {industryLabel} Quote in 24 Hours
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            We use your project details to build an accurate {industryLabel.toLowerCase()} proposal.
          </p>
          
          {/* Trust Row */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">{industryConfig.warranty.description || `${industryConfig.warranty.defaultYears}-Year Warranty`}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">4.9/5 (150+ reviews)</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Licensed & Insured</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Serving the Bay Area</span>
            </div>
          </div>
        </div>

        {/* Main Form Layout */}
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Form Column */}
          <div className="flex-1">
            <QuoteForm 
              onSubmitSuccess={handleFormSubmit}
              onFieldChange={handleFieldChange}
            />
          </div>
          
          {/* Summary Column - Sticky on Desktop, Fixed Bottom on Mobile */}
          <div className="lg:w-80">
            <div className="hidden lg:block">
              <QuoteSummary 
                formData={formData}
                isFormValid={isFormValid}
                onSubmit={handleSummarySubmit}
              />
            </div>
            
            {/* Mobile Summary - Fixed Bottom */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-background border-t shadow-lg">
              <QuoteSummary 
                formData={formData}
                isFormValid={isFormValid}
                onSubmit={handleSummarySubmit}
              />
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div id="how-it-works" className="mt-24">
          <HowItWorks />
        </div>
      </main>

      {/* Success Dialog */}
      <SuccessDialog 
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        customerName={formData.firstName}
      />
      
      <Footer />
      
      {/* Mobile padding to prevent content being hidden behind fixed summary */}
      <div className="lg:hidden h-32"></div>
    </div>
  );
};

export default RoofQuote;