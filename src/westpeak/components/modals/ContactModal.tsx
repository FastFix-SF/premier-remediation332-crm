/**
 * ContactModal - Modal dialog for contact/quote requests
 *
 * Features:
 * - Overlay backdrop
 * - Animated entrance
 * - Form with validation
 * - Close on backdrop click or X button
 *
 * Usage:
 *   <ContactModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
 */

import React, { useState, useEffect } from 'react';
import { X, Phone, Mail } from 'lucide-react';
import { useBusiness, useServices, useContact } from '@/westpeak/hooks/useConfig';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  initialService = '',
}) => {
  const business = useBusiness();
  const services = useServices();
  const contact = useContact();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: initialService,
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, service: initialService }));
      setIsSubmitted(false);
    }
  }, [isOpen, initialService]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const edgeUrl = import.meta.env.VITE_FASTFIX_EDGE_URL || import.meta.env.VITE_SUPABASE_URL + '/functions/v1';
      const response = await fetch(`${edgeUrl}/create-crm-lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: import.meta.env.VITE_TENANT_ID,
          name: formData.name,
          phone: formData.phone,
          email: formData.email || '',
          service: formData.service,
          message: formData.message,
          referralSource: 'website',
        }),
      });

      if (!response.ok) {
        console.error('Lead submission failed:', await response.text());
      }
    } catch (err) {
      console.error('Lead submission error:', err);
    }

    setIsSubmitting(false);
    setIsSubmitted(true);

    setTimeout(() => {
      onClose();
      setFormData({ name: '', phone: '', email: '', service: '', message: '' });
      setIsSubmitted(false);
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto animate-in fade-in zoom-in-95 duration-200 glow-md">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/10">
          <h2 className="text-2xl font-bold text-foreground gradient-text inline-block">
            Get Your Free Estimate
          </h2>
          <p className="text-muted-foreground mt-1">
            Fill out the form and we'll contact you within 24 hours
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center glow-md animate-pulse-glow">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Thank You!</h3>
              <p className="text-muted-foreground">
                We've received your request. A team member from {business.name} will contact you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-foreground placeholder:text-muted-foreground"
                  placeholder="John Smith"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-foreground placeholder:text-muted-foreground"
                  placeholder="(555) 123-4567"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-foreground placeholder:text-muted-foreground"
                  placeholder="john@example.com"
                />
              </div>

              {/* Service */}
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-foreground mb-1">
                  Service Needed
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-foreground"
                >
                  <option value="">Select a service...</option>
                  {services.map(service => (
                    <option key={service.id} value={service.slug}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
                  Additional Details
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground"
                  placeholder="Tell us about your project..."
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-gold-wave w-full py-4 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Request Free Estimate'}
              </button>
            </form>
          )}

          {/* Quick Contact */}
          {!isSubmitted && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-sm text-muted-foreground text-center mb-4">
                Or contact us directly:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center justify-center gap-2 px-4 py-2 glass-card rounded-lg hover:border-primary/50 transition-all group"
                >
                  <Phone className="w-4 h-4 text-primary group-hover:thunder-glow" />
                  <span className="font-medium">{contact.phone}</span>
                </a>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center justify-center gap-2 px-4 py-2 glass-card rounded-lg hover:border-primary/50 transition-all group"
                >
                  <Mail className="w-4 h-4 text-primary group-hover:thunder-glow" />
                  <span className="font-medium">Email Us</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
