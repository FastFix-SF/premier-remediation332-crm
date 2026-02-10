 /**
  * Testimonials - Google Reviews style testimonial section
  *
  * Features:
  * - Google branding with rating badge
  * - Card-based layout matching Google Reviews
  * - Star ratings
  * - Review dates
  * - Service type badges
  *
  * Usage:
  *   <Testimonials />
  */

 import React, { useState } from 'react';
 import { Star, ExternalLink, X } from 'lucide-react';
 import { GoogleReviewCard } from '@/westpeak/components/cards/GoogleReviewCard';
 import { useGoogleReviews } from '@/westpeak/hooks/useConfig';

 interface TestimonialsProps {
   title?: string;
   subtitle?: string;
 }

 export const Testimonials: React.FC<TestimonialsProps> = ({
   title = "What Our Customers Say",
   subtitle = "Real reviews from satisfied customers",
 }) => {
   const reviewsData = useGoogleReviews();
   const [showModal, setShowModal] = useState(false);

   const openReviewsModal = (e: React.MouseEvent) => {
     e.preventDefault();
     setShowModal(true);
   };

   const closeModal = () => setShowModal(false);

   const renderStars = (rating: number) => {
     return (
       <div className="flex gap-0.5">
         {[...Array(5)].map((_, i) => (
           <Star
             key={i}
             className={`w-5 h-5 ${
               i < Math.floor(rating)
                 ? 'text-amber-400 fill-amber-400'
                 : i < rating
                   ? 'text-amber-400 fill-amber-400/50'
                   : 'text-muted-foreground/30'
             }`}
           />
         ))}
       </div>
     );
   };

  return (
     <section className="py-12 sm:py-16 lg:py-24 bg-background relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-transparent to-muted/30 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-primary/5 rounded-full blur-[80px] sm:blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
         {/* Section Header */}
         <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            {subtitle}
          </p>

           {/* Google Rating Badge */}
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
             <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm border border-border/50 rounded-full px-5 py-3 shadow-lg">
               {/* Google Logo */}
               <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
               </svg>

               <span className="text-2xl font-bold text-foreground">{reviewsData.averageRating}</span>
               {renderStars(reviewsData.averageRating)}
             </div>

             <a
               href={reviewsData.googleProfileUrl}
               onClick={openReviewsModal}
               className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium cursor-pointer"
             >
               <span>{reviewsData.totalReviews} Google reviews</span>
               <ExternalLink className="w-4 h-4" />
             </a>
           </div>
        </div>

         {/* Reviews Grid */}
         <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
           {reviewsData.reviews.map((review, index) => (
             <GoogleReviewCard
               key={review.id}
               review={review}
               animationDelay={index * 100}
             />
           ))}
        </div>

         {/* View All Link */}
         <div className="text-center mt-8">
           <a
             href={reviewsData.googleProfileUrl}
             onClick={openReviewsModal}
             className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border hover:border-primary/50 rounded-full text-foreground hover:text-primary transition-all font-medium cursor-pointer"
           >
             View all {reviewsData.totalReviews} reviews on Google
             <ExternalLink className="w-4 h-4" />
           </a>
         </div>
      </div>

      {/* Google Reviews Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal */}
          <div
            className="relative w-full max-w-4xl max-h-[85vh] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-lg font-bold text-foreground">Google Reviews</span>
                <span className="text-sm text-muted-foreground">({reviewsData.totalReviews} reviews)</span>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto max-h-[calc(85vh-8rem)] p-4 sm:p-6">
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                {reviewsData.reviews.map((review, index) => (
                  <GoogleReviewCard
                    key={review.id}
                    review={review}
                    animationDelay={index * 50}
                  />
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border text-center">
              <a
                href={reviewsData.googleProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                View all on Google
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonials;
