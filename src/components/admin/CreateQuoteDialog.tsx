import React, { useState } from 'react';
import { Plus, Satellite } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { GooglePlacesAutocomplete } from '@/components/ui/google-places-autocomplete';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIndustryConfig } from '@/hooks/useIndustryConfig';
import { DynamicIndustryFields } from '@/components/industry/DynamicIndustryFields';

interface CreateQuoteDialogProps {
  onQuoteCreated?: () => void;
  onOpenQuoteModal?: (quoteId: string) => void;
}

export function CreateQuoteDialog({
  onQuoteCreated,
  onOpenQuoteModal,
}: CreateQuoteDialogProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const industryConfig = useIndustryConfig();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    property_address: '',
    project_type: '',
    property_type: '',
    timeline: '',
    notes: '',
    industry_fields: {} as Record<string, any>,
  });
  const {
    toast
  } = useToast();

  const resetFormData = () => ({
    name: '',
    email: '',
    phone: '',
    property_address: '',
    project_type: '',
    property_type: '',
    timeline: '',
    notes: '',
    industry_fields: {} as Record<string, any>,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.property_address.trim()) {
      toast({
        title: "Required Fields",
        description: "Please enter name, email, and property address.",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      // Build the insert payload
      const insertPayload: Record<string, any> = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        property_address: formData.property_address.trim(),
        project_type: formData.project_type || null,
        property_type: formData.property_type || null,
        timeline: formData.timeline || null,
        notes: formData.notes.trim() || null,
        status: 'new',
      };

      // For roofing tenants, copy industry_fields values back to top-level roofing columns
      // for backward compatibility with existing roofing-specific columns
      if (industryConfig.slug === 'roofing') {
        const fields = formData.industry_fields;
        insertPayload.existing_roof = fields.existing_roof || null;
        insertPayload.wanted_roof = fields.wanted_roof || null;
        insertPayload.existing_roof_deck = fields.existing_roof_deck || null;
        insertPayload.wanted_roof_deck = fields.wanted_roof_deck || null;
        insertPayload.insulation = fields.insulation || null;
      }

      // Always save industry_fields for all industries (including roofing)
      insertPayload.industry_fields = formData.industry_fields;

      // Step 1: Create the quote request
      const {
        data: quote,
        error: quoteError
      } = await supabase.from('quote_requests').insert(insertPayload).select().maybeSingle();
      if (quoteError) throw quoteError;

      // Step 2: Geocode the address
      const {
        data: geocodeData,
        error: geocodeError
      } = await supabase.functions.invoke('geocode-address', {
        body: {
          quote_request_id: quote.id,
          address: formData.property_address.trim()
        }
      });
      if (geocodeError) {
        console.warn('Geocoding failed:', geocodeError);
      }
      toast({
        title: "Quote Created",
        description: "Opening quote details..."
      });

      // Close dialog and reset form
      setOpen(false);
      setFormData(resetFormData());

      // Refresh parent component
      onQuoteCreated?.();

      // Roofing navigates to full page; other industries open in modal
      if (industryConfig.slug === 'roofing') {
        const postTab = industryConfig.quoteConfig?.postCreateTab || 'overview';
        navigate(`/quote/${quote.id}?tab=${postTab}`);
      } else if (onOpenQuoteModal) {
        onOpenQuoteModal(quote.id);
      } else {
        navigate(`/quote/${quote.id}`);
      }
    } catch (error) {
      console.error('Error creating quote:', error);
      toast({
        title: "Error",
        description: "Failed to create quote. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setFormData(resetFormData());
  };

  return <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create New Quote
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto" onInteractOutside={e => {
        // Prevent dialog from closing when clicking on Google Places autocomplete dropdown
        const target = e.target as HTMLElement;
        if (target.closest('.pac-container')) {
          e.preventDefault();
        }
      }}>
          <DialogHeader className="pb-2">
            <DialogTitle>Create New Quote</DialogTitle>
            <DialogDescription>
              Enter the quote details to get started.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-xs">Customer Name *</Label>
                <Input id="name" placeholder="John Smith" value={formData.name} onChange={e => setFormData(prev => ({
                ...prev,
                name: e.target.value
              }))} disabled={loading} className="h-9" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs">Email *</Label>
                <Input id="email" type="email" placeholder="john@example.com" value={formData.email} onChange={e => setFormData(prev => ({
                ...prev,
                email: e.target.value
              }))} disabled={loading} className="h-9" />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone" className="text-xs">Phone</Label>
              <Input id="phone" type="tel" placeholder="(555) 123-4567" value={formData.phone} onChange={e => setFormData(prev => ({
              ...prev,
              phone: e.target.value
            }))} disabled={loading} className="h-9" />
            </div>

            <div className="space-y-1 mb-16">
              <Label htmlFor="property_address" className="text-xs">Property Address *</Label>
              <GooglePlacesAutocomplete value={formData.property_address} onChange={value => setFormData(prev => ({
              ...prev,
              property_address: value
            }))} onPlaceSelected={place => {
              console.log('Selected place:', place);
            }} placeholder="Start typing an address..." disabled={loading} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="project_type" className="text-xs">Project Type</Label>
                <Select value={formData.project_type} onValueChange={value => setFormData(prev => ({
                ...prev,
                project_type: value
              }))} disabled={loading}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {industryConfig.projectTypes.length > 0 ? (
                      industryConfig.projectTypes.map(pt => (
                        <SelectItem key={pt.value} value={pt.value}>{pt.label}</SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="new">New Installation</SelectItem>
                        <SelectItem value="replacement">Replacement</SelectItem>
                        <SelectItem value="repair">Repair</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="inspection">Inspection</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="property_type" className="text-xs">Property Type</Label>
                <Select value={formData.property_type} onValueChange={value => setFormData(prev => ({
                ...prev,
                property_type: value
              }))} disabled={loading}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dynamic industry-specific fields */}
            <DynamicIndustryFields
              fields={industryConfig.industryFields}
              values={formData.industry_fields}
              onChange={(key, value) => setFormData(prev => ({
                ...prev,
                industry_fields: { ...prev.industry_fields, [key]: value }
              }))}
              context="admin_form"
              disabled={loading}
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="timeline" className="text-xs">Timeline</Label>
                <Select value={formData.timeline} onValueChange={value => setFormData(prev => ({
                ...prev,
                timeline: value
              }))} disabled={loading}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent className="z-[100]">
                    <SelectItem value="asap">ASAP</SelectItem>
                    <SelectItem value="1_month">Within 1 month</SelectItem>
                    <SelectItem value="3_months">Within 3 months</SelectItem>
                    <SelectItem value="6_months">Within 6 months</SelectItem>
                    <SelectItem value="planning">Just planning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="notes" className="text-xs">Customer Notes & Requirements (AI-Powered)</Label>
              <Textarea id="notes" value={formData.notes} onChange={e => setFormData(prev => ({
              ...prev,
              notes: e.target.value
            }))} disabled={loading} rows={4} className="min-h-[100px]" placeholder="Customer Emails + SMS + Call Transcripts + Recordings from Consultation" />
              <p className="text-xs text-muted-foreground">
                The more detailed the notes, the more accurate the AI-generated quote will be
              </p>
            </div>
          </form>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmit} disabled={loading}>
              {loading ? <>
                  <Satellite className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </> : <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Quote
                </>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>;
}
