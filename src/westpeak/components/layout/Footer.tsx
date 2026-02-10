/**
 * Footer - Site footer component
 *
 * Features:
 * - Multi-column layout
 * - Dynamic links from config
 * - Contact info display
 * - Social media links
 * - Business hours
 *
 * Usage:
 *   <Footer />
 */

import React from 'react';
import { useBusiness, useFooterMenu, useContact } from '@/westpeak/hooks/useConfig';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import westPeakLogo from '@/assets/westpeak/west-peak-logo.png';

const socialIcons: Record<string, React.ElementType> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
};

export const Footer: React.FC = () => {
  const business = useBusiness();
  const footerMenu = useFooterMenu();
  const contact = useContact();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted border-t border-border">
      {/* Gradient line separator */}
      <div className="h-1 bg-gradient-to-r from-primary via-secondary to-primary" style={{ backgroundSize: '200% 100%', animation: 'gradient-flow 4s ease infinite' }} />
      
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            {westPeakLogo ? (
              <img
                src={westPeakLogo}
                alt={business.name}
                className="h-10 sm:h-12 w-auto mb-4"
              />
            ) : (
              <h3 className="text-lg sm:text-xl font-bold mb-4 text-foreground">{business.name}</h3>
            )}
            <p className="text-sm sm:text-base text-muted-foreground mb-6">
              {business.tagline}
            </p>

            {/* Contact Info */}
            <div className="space-y-2 sm:space-y-3">
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors group"
              >
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:thunder-glow flex-shrink-0" />
                {contact.phone}
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors group"
              >
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:thunder-glow flex-shrink-0" />
                {contact.email}
              </a>
              <div className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-1 flex-shrink-0" />
                <span className="text-sm sm:text-base">
                  {contact.address.street}<br />
                  {contact.address.city}, {contact.address.state} {contact.address.zip}
                </span>
              </div>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-foreground text-sm sm:text-base">Services</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {footerMenu.services.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-primary hover:after:w-full after:transition-all"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-foreground text-sm sm:text-base">Company</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {footerMenu.company.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-primary hover:after:w-full after:transition-all"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours & Social */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-foreground text-sm sm:text-base">Hours</h4>
            <div className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>Mon-Fri: {contact.hours.weekdays}</span>
              </div>
              {contact.hours.saturday && (
                <div className="ml-5 sm:ml-6">Sat: {contact.hours.saturday}</div>
              )}
              {contact.hours.sunday && (
                <div className="ml-5 sm:ml-6">Sun: {contact.hours.sunday}</div>
              )}
              {contact.hours.emergency && (
                <div className="mt-2 text-primary font-medium orange-glow-blink text-sm sm:text-base">
                  24/7 Emergency Service Available
                </div>
              )}
            </div>

            {/* Social Links - only show if at least one URL exists */}
            {Object.values(contact.social).some(url => url) && (
              <>
                <h4 className="font-semibold mb-3 sm:mb-4 text-foreground text-sm sm:text-base">Follow Us</h4>
                <div className="flex gap-3 sm:gap-4">
                  {Object.entries(contact.social).map(([platform, url]) => {
                    if (!url) return null;
                    const IconComponent = socialIcons[platform];
                    if (!IconComponent) return null;
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 glass-card rounded-lg hover:text-primary hover:glow-sm transition-all group"
                      >
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 group-hover:thunder-glow" />
                      </a>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-border/50">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <div>
              © {currentYear} {business.name}. All rights reserved.
            </div>
            <div className="flex gap-4 sm:gap-6">
              <a href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
