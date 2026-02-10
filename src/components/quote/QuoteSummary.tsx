import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Home, Calendar, Wrench } from 'lucide-react';
import { useIndustryConfig } from '@/hooks/useIndustryConfig';

interface QuoteSummaryProps {
  formData: {
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    state?: string;
    roofType?: string;
    propertyType?: string;
    projectType?: string;
    timeline?: string;
  };
  isFormValid: boolean;
  onSubmit: () => void;
}

const propertyTypeLabels: Record<string, string> = {
  'single-family': 'Single Family Home',
  'multi-family': 'Multi-Family Home',
  'commercial': 'Commercial Building',
  'industrial': 'Industrial Building',
  'other': 'Other'
};

const timelineLabels: Record<string, string> = {
  'asap': 'As Soon As Possible',
  '1-month': 'Within 1 Month',
  '3-months': 'Within 3 Months',
  '6-months': 'Within 6 Months',
  'planning': 'Just Planning / Getting Quotes'
};

export function QuoteSummary({ formData, isFormValid, onSubmit }: QuoteSummaryProps) {
  const industryConfig = useIndustryConfig();

  // Build label maps dynamically from industry config
  const roofTypeLabels = useMemo(() => {
    const labels: Record<string, string> = { 'not-sure': 'Not Sure' };
    for (const field of industryConfig.industryFields) {
      if (field.showInQuoteForm && field.options) {
        for (const opt of field.options) {
          labels[opt.value] = opt.label;
        }
      }
    }
    return labels;
  }, [industryConfig.industryFields]);

  const projectTypeLabels = useMemo(() => {
    const labels: Record<string, string> = {};
    for (const pt of industryConfig.projectTypes) {
      labels[pt.value] = pt.label;
    }
    return labels;
  }, [industryConfig.projectTypes]);

  // Determine the label for the industry-specific field section
  const industryFieldLabel = industryConfig.industryFields.find(f => f.showInQuoteForm)?.label || 'Roof Type';

  const fullAddress = formData.address && formData.city && formData.state
    ? `${formData.address}, ${formData.city}, ${formData.state}`
    : null;

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Quote Summary</span>
          <Badge variant="outline" className="text-xs">Draft</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contact Info */}
        {(formData.firstName || formData.lastName) && (
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="font-medium">
              {[formData.firstName, formData.lastName].filter(Boolean).join(' ')}
            </span>
          </div>
        )}

        {/* Address */}
        {fullAddress ? (
          <div className="space-y-1">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Property Address</p>
                <p className="text-sm text-muted-foreground">{fullAddress}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>Address not provided</span>
          </div>
        )}

        {/* Project Type */}
        {formData.projectType ? (
          <div className="space-y-1">
            <div className="flex items-start gap-2">
              <Wrench className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Project Type</p>
                <p className="text-sm text-muted-foreground">
                  {projectTypeLabels[formData.projectType] || formData.projectType}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wrench className="w-4 h-4" />
            <span>Project type not selected</span>
          </div>
        )}

        {/* Industry-specific field (e.g. Roof Type) */}
        {formData.roofType ? (
          <div className="space-y-1">
            <div className="flex items-start gap-2">
              <Home className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">{industryFieldLabel}</p>
                <p className="text-sm text-muted-foreground">
                  {roofTypeLabels[formData.roofType] || formData.roofType}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Home className="w-4 h-4" />
            <span>{industryFieldLabel} not specified</span>
          </div>
        )}

        {/* Property Type */}
        {formData.propertyType && (
          <div className="space-y-1">
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 mt-0.5 bg-muted-foreground/20 rounded flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Property Type</p>
                <p className="text-sm text-muted-foreground">
                  {propertyTypeLabels[formData.propertyType] || formData.propertyType}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        {formData.timeline ? (
          <div className="space-y-1">
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Timeline</p>
                <p className="text-sm text-muted-foreground">
                  {timelineLabels[formData.timeline] || formData.timeline}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Timeline not selected</span>
          </div>
        )}

        <div className="pt-4 border-t">
          <Button 
            onClick={onSubmit}
            disabled={!isFormValid}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-md hover:shadow-lg transition-shadow"
            size="lg"
          >
            Get My Professional Quote
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Free, no obligation. We typically deliver within 24 hours.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}