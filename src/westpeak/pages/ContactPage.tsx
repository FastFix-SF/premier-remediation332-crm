/**
 * Contact Page
 *
 * Premium contact page with contact info cards, hours, and a contact form.
 * All content is dynamically loaded from config files.
 *
 * Route: /contact
 *
 * Usage:
 *   <ContactPage />
 */

import React, { useState } from 'react';
import { Header, Footer } from '@/westpeak/components/layout';
import { ContactModal } from '@/westpeak/components/modals';
import { useBusiness, useContact } from '@/westpeak/hooks/useConfig';
import { Phone, Mail, MapPin, Clock, ArrowRight, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const business = useBusiness();
  const contact = useContact();

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const hasEmergency = contact.hours?.emergency;

  return (
    <div className="min-h-screen bg-background">
      <title>{`Contact Us | ${business.name}`}</title>

      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative py-20 lg:py-28 overflow-hidden bg-background">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/98 to-background/90" />
          <div className="absolute top-1/3 -right-24 w-80 h-80 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

          <div className="relative container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-4 py-1.5 rounded-full mb-6">
              <MessageSquare className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Get in Touch</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Contact{' '}
              <span className="gradient-text orange-glow-blink">Us</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              Ready to get started? Reach out for a free estimate or emergency service.
              {hasEmergency && ' We are available 24/7.'}
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {/* Phone Card */}
              <a
                href={`tel:${contact.phone}`}
                className="glass-card p-6 rounded-xl text-center hover:border-primary/50 transition-all group glow-sm"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Phone</h3>
                <p className="text-muted-foreground group-hover:text-primary transition-colors font-medium">
                  {contact.phone}
                </p>
                {hasEmergency && (
                  <span className="inline-block mt-2 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    24/7 Emergency
                  </span>
                )}
              </a>

              {/* Email Card */}
              <a
                href={`mailto:${contact.email}`}
                className="glass-card p-6 rounded-xl text-center hover:border-primary/50 transition-all group glow-sm"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Email</h3>
                <p className="text-muted-foreground group-hover:text-primary transition-colors font-medium text-sm">
                  {contact.email}
                </p>
              </a>

              {/* Address Card */}
              <div className="glass-card p-6 rounded-xl text-center glow-sm">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Address</h3>
                <p className="text-muted-foreground text-sm">
                  {contact.address.street}
                  <br />
                  {contact.address.city}, {contact.address.state} {contact.address.zip}
                </p>
              </div>

              {/* Hours Card */}
              <div className="glass-card p-6 rounded-xl text-center glow-sm">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Hours</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Mon-Fri: {contact.hours.weekdays}</p>
                  {contact.hours.saturday && <p>Sat: {contact.hours.saturday}</p>}
                  {contact.hours.sunday && <p>Sun: {contact.hours.sunday}</p>}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hours & Map / Address Section */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
              {/* Left: Detailed Hours & Address */}
              <div>
                <h2 className="text-section font-bold text-foreground mb-6">
                  Visit Us
                </h2>
                <div className="glass-card p-6 rounded-xl glow-sm mb-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-2 rounded-full bg-primary/10 flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Office Location</h3>
                      <p className="text-muted-foreground">
                        {contact.address.street}
                        <br />
                        {contact.address.city}, {contact.address.state} {contact.address.zip}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full bg-primary/10 flex-shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Business Hours</h3>
                      <div className="text-muted-foreground space-y-1">
                        <div className="flex justify-between gap-8">
                          <span>Monday - Friday</span>
                          <span className="font-medium text-foreground">{contact.hours.weekdays}</span>
                        </div>
                        {contact.hours.saturday && (
                          <div className="flex justify-between gap-8">
                            <span>Saturday</span>
                            <span className="font-medium text-foreground">{contact.hours.saturday}</span>
                          </div>
                        )}
                        {contact.hours.sunday && (
                          <div className="flex justify-between gap-8">
                            <span>Sunday</span>
                            <span className="font-medium text-foreground">{contact.hours.sunday}</span>
                          </div>
                        )}
                      </div>
                      {hasEmergency && (
                        <p className="mt-3 text-sm text-primary font-medium">
                          Emergency service available 24/7
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Contact CTA */}
              <div>
                <h2 className="text-section font-bold text-foreground mb-6">
                  Get a Free Estimate
                </h2>
                <div className="glass-card p-8 rounded-xl glow-sm text-center">
                  <p className="text-muted-foreground mb-6">
                    Tell us about your project and we will get back to you within 24 hours
                    with a free, no-obligation estimate.
                  </p>
                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="btn-gold-wave inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg w-full"
                  >
                    Request Estimate
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center justify-center gap-2 px-4 py-2 glass-card rounded-lg hover:border-primary/50 transition-all group"
                    >
                      <Phone className="w-4 h-4 text-primary" />
                      <span className="font-medium text-foreground">{contact.phone}</span>
                    </a>
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center justify-center gap-2 px-4 py-2 glass-card rounded-lg hover:border-primary/50 transition-all group"
                    >
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="font-medium text-foreground">Email Us</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Embed Section */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-section font-bold text-foreground text-center mb-8">
                Find Us on the Map
              </h2>
              <div className="glass-card rounded-2xl overflow-hidden glow-sm aspect-[16/9] lg:aspect-[21/9]">
                <iframe
                  title={`${business.name} Location`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    `${contact.address.street}, ${contact.address.city}, ${contact.address.state} ${contact.address.zip}`
                  )}&output=embed`}
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};

export default ContactPage;
