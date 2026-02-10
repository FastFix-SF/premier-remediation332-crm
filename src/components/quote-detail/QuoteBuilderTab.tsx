import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Trash2, DollarSign, Save, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useIndustryConfig } from '@/hooks/useIndustryConfig';
import type { QuoteLineItemCategory } from '@/config/industries/types';

interface LineItem {
  id: string;
  category: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface QuoteBuilderTabProps {
  quoteId: string;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export const QuoteBuilderTab: React.FC<QuoteBuilderTabProps> = ({ quoteId }) => {
  const industryConfig = useIndustryConfig();
  const categories = industryConfig.quoteConfig.lineItemCategories;
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [taxRate, setTaxRate] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load existing line items from DB
  useEffect(() => {
    loadLineItems();
  }, [quoteId]);

  const loadLineItems = async () => {
    try {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('industry_fields')
        .eq('id', quoteId)
        .maybeSingle();
      if (error) throw error;
      const fields = data?.industry_fields || {};
      if (fields.line_items && Array.isArray(fields.line_items)) {
        setLineItems(fields.line_items);
      } else {
        // Initialize with default items from config
        const defaults: LineItem[] = [];
        categories.forEach(cat => {
          (cat.defaultItems || []).forEach(item => {
            defaults.push({
              id: generateId(),
              category: cat.key,
              name: item.name,
              quantity: 1,
              unit: item.unit,
              unitPrice: item.unitPrice,
              total: item.unitPrice,
            });
          });
        });
        setLineItems(defaults);
      }
      if (fields.tax_rate !== undefined) {
        setTaxRate(fields.tax_rate);
      }
    } catch (error) {
      console.error('Error loading line items:', error);
    } finally {
      setLoaded(true);
    }
  };

  // Debounced auto-save
  const autoSave = useCallback((items: LineItem[], tax: number) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      try {
        // Read current industry_fields first to preserve other data
        const { data } = await supabase
          .from('quote_requests')
          .select('industry_fields')
          .eq('id', quoteId)
          .maybeSingle();
        const existing = data?.industry_fields || {};
        const { error } = await supabase
          .from('quote_requests')
          .update({
            industry_fields: {
              ...existing,
              line_items: items,
              tax_rate: tax,
            },
          })
          .eq('id', quoteId);
        if (error) throw error;
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 1500);
  }, [quoteId]);

  // Clean up timer
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(prev => {
      const updated = prev.map(item => {
        if (item.id !== id) return item;
        const newItem = { ...item, [field]: value };
        newItem.total = newItem.quantity * newItem.unitPrice;
        return newItem;
      });
      autoSave(updated, taxRate);
      return updated;
    });
  };

  const addLineItem = (categoryKey: string) => {
    const cat = categories.find(c => c.key === categoryKey);
    const newItem: LineItem = {
      id: generateId(),
      category: categoryKey,
      name: '',
      quantity: 1,
      unit: cat?.unitTypes[0] || 'ea',
      unitPrice: 0,
      total: 0,
    };
    setLineItems(prev => {
      const updated = [...prev, newItem];
      autoSave(updated, taxRate);
      return updated;
    });
  };

  const removeLineItem = (id: string) => {
    setLineItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      autoSave(updated, taxRate);
      return updated;
    });
  };

  const handleTaxRateChange = (rate: number) => {
    setTaxRate(rate);
    autoSave(lineItems, rate);
  };

  const handleManualSave = async () => {
    setSaving(true);
    try {
      const { data } = await supabase
        .from('quote_requests')
        .select('industry_fields')
        .eq('id', quoteId)
        .maybeSingle();
      const existing = data?.industry_fields || {};
      const { error } = await supabase
        .from('quote_requests')
        .update({
          industry_fields: {
            ...existing,
            line_items: lineItems,
            tax_rate: taxRate,
          },
        })
        .eq('id', quoteId);
      if (error) throw error;
      toast.success('Quote saved');
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Failed to save quote');
    } finally {
      setSaving(false);
    }
  };

  // Calculate totals
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const grandTotal = subtotal + taxAmount;

  // Group items by category
  const itemsByCategory = categories.map(cat => ({
    ...cat,
    items: lineItems.filter(item => item.category === cat.key),
  }));

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleManualSave} disabled={saving} size="sm">
          {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
          {saving ? 'Saving...' : 'Save Quote'}
        </Button>
      </div>

      {/* Category Cards */}
      {itemsByCategory.map(cat => (
        <Card key={cat.key}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{cat.label}</CardTitle>
              <Button variant="outline" size="sm" onClick={() => addLineItem(cat.key)}>
                <Plus className="w-4 h-4 mr-1" /> Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {cat.items.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No items yet. Click "Add Item" to start.
              </p>
            ) : (
              <div className="space-y-2">
                {/* Header */}
                <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-1">
                  <div className="col-span-4">Item</div>
                  <div className="col-span-2">Qty</div>
                  <div className="col-span-2">Unit</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-1 text-right">Total</div>
                  <div className="col-span-1"></div>
                </div>
                {/* Items */}
                {cat.items.map(item => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-4">
                      <Input
                        value={item.name}
                        onChange={e => updateLineItem(item.id, 'name', e.target.value)}
                        placeholder="Item name"
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={e => updateLineItem(item.id, 'quantity', Number(e.target.value) || 0)}
                        className="h-9 text-sm"
                        min={0}
                      />
                    </div>
                    <div className="col-span-2">
                      <Select value={item.unit} onValueChange={val => updateLineItem(item.id, 'unit', val)}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(cat.unitTypes || ['ea']).map(u => (
                            <SelectItem key={u} value={u}>{u}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        value={item.unitPrice}
                        onChange={e => updateLineItem(item.id, 'unitPrice', Number(e.target.value) || 0)}
                        className="h-9 text-sm"
                        min={0}
                        step={0.01}
                      />
                    </div>
                    <div className="col-span-1 text-right text-sm font-medium">
                      ${item.total.toFixed(2)}
                    </div>
                    <div className="col-span-1 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLineItem(item.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Totals Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-end space-y-3">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium w-28 text-right">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">Tax Rate (%):</span>
              <Input
                type="number"
                value={taxRate}
                onChange={e => handleTaxRateChange(Number(e.target.value) || 0)}
                className="h-8 w-20 text-sm text-right"
                min={0}
                max={100}
                step={0.1}
              />
            </div>
            {taxRate > 0 && (
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">Tax:</span>
                <span className="font-medium w-28 text-right">${taxAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t pt-3 flex items-center gap-4">
              <span className="font-semibold text-lg flex items-center gap-1">
                <DollarSign className="w-5 h-5" /> Total:
              </span>
              <span className="font-bold text-2xl w-28 text-right">${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
