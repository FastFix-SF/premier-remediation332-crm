import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { User, Mail, Phone, MapPin, Calendar, FileText, Pencil, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useIndustryConfig } from '@/hooks/useIndustryConfig';
import { DynamicIndustryFields } from '@/components/industry/DynamicIndustryFields';

interface GenericOverviewTabProps {
  quote: any;
  onUpdate: () => void;
}

export const GenericOverviewTab: React.FC<GenericOverviewTabProps> = ({ quote, onUpdate }) => {
  const industryConfig = useIndustryConfig();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: quote.name || '',
    email: quote.email || '',
    phone: quote.phone || '',
    property_address: quote.property_address || '',
    project_type: quote.project_type || '',
    property_type: quote.property_type || '',
    timeline: quote.timeline || '',
    notes: quote.notes || '',
    industry_fields: quote.industry_fields || {},
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('quote_requests')
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          property_address: formData.property_address,
          project_type: formData.project_type || null,
          property_type: formData.property_type || null,
          timeline: formData.timeline || null,
          notes: formData.notes || null,
          industry_fields: formData.industry_fields,
        })
        .eq('id', quote.id);
      if (error) throw error;
      toast.success('Quote updated');
      setEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating quote:', error);
      toast.error('Failed to update quote');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: quote.name || '',
      email: quote.email || '',
      phone: quote.phone || '',
      property_address: quote.property_address || '',
      project_type: quote.project_type || '',
      property_type: quote.property_type || '',
      timeline: quote.timeline || '',
      notes: quote.notes || '',
      industry_fields: quote.industry_fields || {},
    });
    setEditing(false);
  };

  const projectTypeLabel = industryConfig.projectTypes.find(
    pt => pt.value === quote.project_type
  )?.label || quote.project_type;

  const timelineLabels: Record<string, string> = {
    asap: 'ASAP',
    '1_month': 'Within 1 month',
    '3_months': 'Within 3 months',
    '6_months': 'Within 6 months',
    planning: 'Just planning',
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex justify-end">
        {editing ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel} disabled={saving}>
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-1" /> {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            <Pencil className="w-4 h-4 mr-1" /> Edit
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {editing ? (
              <>
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Property Address</Label>
                  <Input value={formData.property_address} onChange={e => setFormData(p => ({ ...p, property_address: e.target.value }))} />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{quote.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{quote.email}</span>
                </div>
                {quote.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{quote.phone}</span>
                  </div>
                )}
                {quote.property_address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{quote.property_address}</span>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Project Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {quote.status && <Badge variant="outline">{quote.status}</Badge>}
              {projectTypeLabel && <Badge variant="secondary">{projectTypeLabel}</Badge>}
              {quote.property_type && <Badge variant="secondary">{quote.property_type}</Badge>}
            </div>
            {quote.timeline && (
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{timelineLabels[quote.timeline] || quote.timeline}</span>
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              Created {new Date(quote.created_at).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Industry-Specific Fields */}
      {quote.industry_fields && Object.keys(quote.industry_fields).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{industryConfig.label} Details</CardTitle>
          </CardHeader>
          <CardContent>
            {editing ? (
              <DynamicIndustryFields
                fields={industryConfig.industryFields}
                values={formData.industry_fields}
                onChange={(key, value) =>
                  setFormData(p => ({
                    ...p,
                    industry_fields: { ...p.industry_fields, [key]: value },
                  }))
                }
                context="admin_form"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {industryConfig.industryFields
                  .filter(f => f.showInSummary || f.showInAdminForm)
                  .map(field => {
                    const val = quote.industry_fields?.[field.key];
                    if (!val) return null;
                    return (
                      <div key={field.key}>
                        <p className="text-sm text-muted-foreground">{field.label}</p>
                        <p className="font-medium">{val}</p>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-4 h-4" /> Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {editing ? (
            <Textarea
              value={formData.notes}
              onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
              rows={6}
              placeholder="Add notes about this quote..."
            />
          ) : (
            <p className="text-sm whitespace-pre-wrap">
              {quote.notes || 'No notes yet.'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
