import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { IndustryFieldDefinition } from '@/config/industries/types';

interface DynamicIndustryFieldsProps {
  fields: IndustryFieldDefinition[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  context: 'quote_form' | 'admin_form' | 'filters';
  disabled?: boolean;
  className?: string;
}

function shouldShow(field: IndustryFieldDefinition, context: string): boolean {
  switch (context) {
    case 'quote_form': return !!field.showInQuoteForm;
    case 'admin_form': return !!field.showInAdminForm;
    case 'filters': return !!field.showInFilters;
    default: return true;
  }
}

export const DynamicIndustryFields: React.FC<DynamicIndustryFieldsProps> = ({
  fields,
  values,
  onChange,
  context,
  disabled = false,
  className = '',
}) => {
  const visibleFields = fields.filter(f => shouldShow(f, context));

  if (visibleFields.length === 0) return null;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {visibleFields.map((field) => (
        <div key={field.key} className="space-y-2">
          <Label htmlFor={field.key}>
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>

          {field.type === 'select' && field.options && (
            <Select
              value={values[field.key] || ''}
              onValueChange={(val) => onChange(field.key, val)}
              disabled={disabled}
            >
              <SelectTrigger id={field.key}>
                <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {field.type === 'nested_select' && field.groups && (
            <Select
              value={values[field.key] || ''}
              onValueChange={(val) => onChange(field.key, val)}
              disabled={disabled}
            >
              <SelectTrigger id={field.key}>
                <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {field.groups.map((group) => (
                  <SelectGroup key={group.groupLabel}>
                    <SelectLabel className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                      {group.groupLabel}
                    </SelectLabel>
                    {group.options.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          )}

          {field.type === 'text' && (
            <Input
              id={field.key}
              value={values[field.key] || ''}
              onChange={(e) => onChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              disabled={disabled}
            />
          )}

          {field.type === 'number' && (
            <Input
              id={field.key}
              type="number"
              value={values[field.key] || ''}
              onChange={(e) => onChange(field.key, e.target.value ? Number(e.target.value) : '')}
              placeholder={field.placeholder}
              disabled={disabled}
            />
          )}

          {field.helpText && (
            <p className="text-xs text-muted-foreground">{field.helpText}</p>
          )}
        </div>
      ))}
    </div>
  );
};
