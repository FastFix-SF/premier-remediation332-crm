 /**
  * GoogleReviewCard - Google-style review card
  *
  * Features:
  * - Avatar with initials
  * - Star rating display
  * - Review date
  * - Service type badge
  * - Matches Google Reviews visual style
  *
  * Usage:
  *   <GoogleReviewCard review={review} />
  */
 
 import React from 'react';
 import { Star } from 'lucide-react';
 
 interface GoogleReview {
   id: string;
   name: string;
   rating: number;
   date: string;
   text: string;
   serviceType?: string;
 }
 
 interface GoogleReviewCardProps {
   review: GoogleReview;
   animationDelay?: number;
 }
 
 // Generate consistent avatar color based on name
 const getAvatarColor = (name: string): string => {
   const colors = [
     'from-blue-500 to-blue-600',
     'from-green-500 to-green-600',
     'from-purple-500 to-purple-600',
     'from-red-500 to-red-600',
     'from-amber-500 to-amber-600',
     'from-teal-500 to-teal-600',
     'from-pink-500 to-pink-600',
     'from-indigo-500 to-indigo-600',
   ];
   const index = name.charCodeAt(0) % colors.length;
   return colors[index];
 };
 
 export const GoogleReviewCard: React.FC<GoogleReviewCardProps> = ({
   review,
   animationDelay = 0,
 }) => {
   const renderStars = (rating: number) => {
     return (
       <div className="flex gap-0.5">
         {[...Array(5)].map((_, i) => (
           <Star
             key={i}
             className={`w-4 h-4 ${
               i < rating ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30'
             }`}
           />
         ))}
       </div>
     );
   };
 
   const initials = review.name
     .split(' ')
     .map(n => n[0])
     .join('')
     .toUpperCase()
     .slice(0, 2);
 
   return (
     <div 
       className="glass-card p-6 hover-lift animate-fade-up flex flex-col h-full"
       style={{ animationDelay: `${animationDelay}ms` }}
     >
       {/* Header: Avatar + Name + Date */}
       <div className="flex items-start gap-3 mb-4">
         {/* Avatar */}
         <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(review.name)} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
           {initials}
         </div>
         
         <div className="flex-1 min-w-0">
           <div className="font-semibold text-foreground truncate">{review.name}</div>
           <div className="text-xs text-muted-foreground">1 review</div>
         </div>
       </div>
       
       {/* Rating + Date */}
       <div className="flex items-center gap-2 mb-3">
         {renderStars(review.rating)}
         <span className="text-sm text-muted-foreground">{review.date}</span>
       </div>
 
       {/* Review Text */}
       <p className="text-foreground/80 text-sm leading-relaxed flex-1 mb-4">
         "{review.text}"
       </p>
 
       {/* Service Type Badge */}
       {review.serviceType && (
         <div className="mt-auto">
           <span className="inline-flex px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
             {review.serviceType}
           </span>
         </div>
       )}
     </div>
   );
 };
 
 export default GoogleReviewCard;