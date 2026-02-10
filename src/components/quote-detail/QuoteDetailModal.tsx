import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { X, Trash2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useIndustryConfig } from '@/hooks/useIndustryConfig';
import { GenericOverviewTab } from './GenericOverviewTab';
import { QuoteBuilderTab } from './QuoteBuilderTab';
import { ReportsTab } from './ReportsTab';
import { OwnerApprovalModal } from './OwnerApprovalModal';
import { useProposalManagement } from '@/hooks/useProposalManagement';

interface QuoteDetailModalProps {
  quoteId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}

export const QuoteDetailModal: React.FC<QuoteDetailModalProps> = ({
  quoteId,
  open,
  onOpenChange,
  onDeleted,
}) => {
  const industryConfig = useIndustryConfig();
  const quoteConfig = industryConfig.quoteConfig;
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(quoteConfig.defaultTab);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const { createProposal } = useProposalManagement();

  useEffect(() => {
    if (quoteId && open) {
      fetchQuote();
    }
    if (!open) {
      setQuote(null);
      setActiveTab(quoteConfig.defaultTab);
    }
  }, [quoteId, open]);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .eq('id', quoteId)
        .maybeSingle();
      if (error) throw error;
      setQuote(data);
    } catch (error) {
      console.error('Error fetching quote:', error);
      toast.error('Failed to load quote');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this quote?')) return;
    try {
      const { error } = await supabase.from('quote_requests').delete().eq('id', quoteId);
      if (error) throw error;
      toast.success('Quote deleted');
      onOpenChange(false);
      onDeleted?.();
    } catch (error) {
      console.error('Error deleting quote:', error);
      toast.error('Failed to delete quote');
    }
  };

  const handleOwnerApproval = async (signatureDataUrl: string) => {
    try {
      const { error } = await supabase
        .from('quote_requests')
        .update({
          status: 'ready_to_send',
          notes: (quote?.notes || '') + `\n\n[Owner Approved on ${new Date().toLocaleString()}]`,
        })
        .eq('id', quoteId);
      if (error) throw error;
      toast.success('Quote approved!');
      if (quote) {
        await createProposal.mutateAsync({
          property_address: quote.property_address || 'Address not provided',
          project_type: quote.project_type || 'residential',
          client_name: quote.name,
          client_email: quote.email,
          client_phone: quote.phone || undefined,
          scope_of_work: quote.notes || undefined,
          notes_disclaimers: 'Auto-generated from quote request',
          quote_request_id: quote.id,
        });
      }
      fetchQuote();
    } catch (error) {
      console.error('Error approving quote:', error);
      throw error;
    }
  };

  // Only render the non-roofing tabs in modal
  const modalTabs = quoteConfig.tabs;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          {/* Modal Header */}
          <div className={`${quoteConfig.headerColor} text-white px-6 py-4 rounded-t-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">{quoteConfig.headerTitle}</h2>
                {quote && (
                  <p className="text-sm opacity-80">
                    {quote.name} &mdash; {quote.property_address || 'No address'}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {quote?.status && <Badge variant="secondary" className="bg-white/20 text-white">{quote.status}</Badge>}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-red-700"
                  onClick={handleDelete}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : !quote ? (
              <p className="text-center text-muted-foreground py-8">Quote not found.</p>
            ) : (
              <>
                {quote.status === 'ready_to_send' && (
                  <div className="mb-4 bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <p className="text-sm font-medium">Quote approved and ready to send.</p>
                  </div>
                )}

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <TabsList>
                      {modalTabs.map(tab => (
                        <TabsTrigger key={tab.key} value={tab.key} className="text-sm">
                          {tab.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {activeTab === 'quote-builder' &&
                      quote.status !== 'ready_to_send' &&
                      quote.status !== 'sent' && (
                        <Button
                          size="sm"
                          onClick={() => setShowApprovalModal(true)}
                          className="gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Approve
                        </Button>
                      )}
                  </div>

                  {modalTabs.map(tab => (
                    <TabsContent key={tab.key} value={tab.key}>
                      {tab.component === 'GenericOverviewTab' && (
                        <GenericOverviewTab quote={quote} onUpdate={fetchQuote} />
                      )}
                      {tab.component === 'QuoteBuilderTab' && (
                        <QuoteBuilderTab quoteId={quote.id} />
                      )}
                      {tab.component === 'ReportsTab' && (
                        <ReportsTab
                          quoteId={quote.id}
                          customerName={quote.name}
                          propertyAddress={quote.property_address || 'Property Address'}
                        />
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <OwnerApprovalModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        onApprove={handleOwnerApproval}
        quoteName={quote?.name || 'Quote'}
      />
    </>
  );
};
