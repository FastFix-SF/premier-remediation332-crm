/**
 * TestimonialCard - Customer testimonial display card
 *
 * Features:
 * - Star rating display
 * - Customer photo (optional)
 * - Project type badge
 * - Quote styling
 *
 * Usage:
 *   <TestimonialCard testimonial={testimonial} />
 */

import React from 'react';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  name: string;
  text: string;
  rating: number;
  project?: string;
  image?: string;
  location?: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  variant?: 'default' | 'minimal' | 'featured';
  animationDelay?: number;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  variant = 'default',
  animationDelay = 0,
}) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'text-primary fill-primary energy-glow' : 'text-muted-foreground/30'
            }`}
          />
        ))}
      </div>
    );
  };

  if (variant === 'minimal') {
    return (
      <div 
        className="p-4 border-l-4 border-primary glass-card animate-fade-up"
        style={{ animationDelay: `${animationDelay}ms` }}
      >
        <p className="text-muted-foreground italic mb-2">"{testimonial.text}"</p>
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">{testimonial.name}</span>
          {renderStars(testimonial.rating)}
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div 
        className="relative p-8 rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-foreground glow-md animate-fade-up"
        style={{ animationDelay: `${animationDelay}ms` }}
      >
        <Quote className="absolute top-4 right-4 w-12 h-12 opacity-20 orange-glow-blink" />
        <p className="text-xl mb-6 leading-relaxed">"{testimonial.text}"</p>
        <div className="flex items-center gap-4">
          {testimonial.image && testimonial.image.length > 0 ? (
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-white/30 ring-offset-2 ring-offset-primary"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-semibold">
              {testimonial.name.charAt(0)}
            </div>
          )}
          <div>
            <div className="font-semibold">{testimonial.name}</div>
            {testimonial.project && (
              <div className="text-sm opacity-80">{testimonial.project}</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div 
      className="glass-card p-6 hover-lift animate-fade-up"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Quote icon */}
      <Quote className="w-8 h-8 text-primary/30 mb-4 orange-glow-blink" />
      
      {/* Rating */}
      <div className="mb-4">{renderStars(testimonial.rating)}</div>

      {/* Quote */}
      <p className="text-foreground/80 mb-6 leading-relaxed">
        "{testimonial.text}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        {testimonial.image && testimonial.image.length > 0 ? (
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/30"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-primary flex items-center justify-center font-semibold">
            {testimonial.name.charAt(0)}
          </div>
        )}
        <div>
          <div className="font-medium text-foreground">{testimonial.name}</div>
          {testimonial.project && (
            <div className="text-sm text-muted-foreground">{testimonial.project}</div>
          )}
          {testimonial.location && (
            <div className="text-sm text-muted-foreground">{testimonial.location}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
