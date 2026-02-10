/**
 * Header - Navigation header component
 *
 * Features:
 * - Responsive navigation
 * - Dynamic menu from config
 * - Logo display
 * - Mobile menu trigger
 * - Sticky option
 *
 * Usage:
 *   <Header />
 *   <Header sticky={true} />
 */

import React, { useState } from 'react';
import { useBusiness, useMainMenu, useContact } from '@/westpeak/hooks/useConfig';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import westPeakLogo from '@/assets/westpeak/west-peak-logo.png';

interface HeaderProps {
  sticky?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ sticky = true }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const business = useBusiness();
  const menuItems = useMainMenu();
  const contact = useContact();

  return (
    <header
      className={`backdrop-blur-lg bg-background/80 border-b border-border/50 ${
        sticky ? 'sticky top-0 z-50' : ''
      }`}
    >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            {westPeakLogo ? (
              <img
                src={westPeakLogo}
                alt={business.name}
                className="h-12 sm:h-14 lg:h-16 w-auto transition-all group-hover:brightness-110"
              />
            ) : (
                <span className="text-lg sm:text-xl font-bold text-primary group-hover:orange-glow-blink transition-all">{business.name}</span>
            )}
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {menuItems.map((item, index) => (
              <div key={index} className="relative">
                {item.children ? (
                  <div
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button className="flex items-center gap-1 text-foreground/80 hover:text-primary transition-colors py-2 font-medium">
                      {item.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === item.label && (
                      <div className="absolute top-full left-0 pt-2">
                        <div className="bg-background border border-border rounded-xl py-2 min-w-[200px] shadow-lg shadow-black/50">
                          {item.children.map((child, childIndex) => (
                            <a
                              key={childIndex}
                              href={child.href}
                              className="block px-4 py-2 text-foreground hover:bg-muted hover:text-primary transition-colors"
                            >
                              {child.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href={item.href}
                    className="text-foreground/80 hover:text-primary transition-colors font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all"
                  >
                    {item.label}
                  </a>
                )}
              </div>
            ))}
          </nav>

          {/* CTA & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Phone CTA - Desktop */}
            <a
              href={`tel:${contact.phone}`}
                className="hidden sm:flex btn-gold-wave items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base"
            >
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden md:inline">{contact.phone}</span>
                <span className="md:hidden">Call</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border/50 animate-fade-up">
            <nav className="flex flex-col gap-2">
              {menuItems.map((item, index) => (
                <div key={index}>
                  <a
                    href={item.href}
                    className="block py-3 text-foreground/80 hover:text-primary transition-colors font-medium"
                  >
                    {item.label}
                  </a>
                  {item.children && (
                    <div className="pl-4 space-y-1 mt-1 border-l border-primary/20">
                      {item.children.map((child, childIndex) => (
                        <a
                          key={childIndex}
                          href={child.href}
                          className="block py-2 text-muted-foreground hover:text-primary transition-colors"
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {/* Mobile Phone CTA */}
              <a
                href={`tel:${contact.phone}`}
                className="btn-gold-wave flex items-center gap-2 mt-4 px-4 py-3 rounded-lg font-medium justify-center"
              >
                <Phone className="w-4 h-4" />
                Call {contact.phone}
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
