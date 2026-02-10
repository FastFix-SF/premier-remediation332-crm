 /**
  * HeroVideo - Split layout hero with video that transitions to project cards
  */
 
 import React, { useState, useRef } from 'react';
 import { Star, Shield, Clock, MapPin, Phone } from 'lucide-react';
 import { useBusiness, useHero, useProjectShowcase } from '@/westpeak/hooks/useConfig';
 import { ProjectCard } from '@/westpeak/components/cards/ProjectCard';

 // Import assets
 import introVideo from '@/assets/westpeak/intro-video.mp4';
 import project1 from '@/assets/westpeak/projects/project-1.jpg';
 import project2 from '@/assets/westpeak/projects/project-2.jpg';
 import project3 from '@/assets/westpeak/projects/project-3.jpg';
 import project4 from '@/assets/westpeak/projects/project-4.jpg';
 
 const projectImages = [project1, project2, project3, project4];
 
 interface HeroVideoProps {
   onPrimaryClick?: () => void;
   onSecondaryClick?: () => void;
 }
 
 export const HeroVideo: React.FC<HeroVideoProps> = ({
   onPrimaryClick,
   onSecondaryClick,
 }) => {
   const business = useBusiness();
   const hero = useHero();
   const projects = useProjectShowcase();
   
   const [videoEnded, setVideoEnded] = useState(false);
   const videoRef = useRef<HTMLVideoElement>(null);
 
   const handleVideoEnd = () => {
     setVideoEnded(true);
   };
 
   // Trust indicators
   const trustItems = [
     { icon: Shield, text: 'Licensed & Insured' },
     { icon: Clock, text: '24/7 Emergency' },
     { icon: MapPin, text: 'Bay Area Local' },
   ];
 
   return (
  <section className="relative min-h-[auto] flex items-start overflow-hidden bg-background">
       {/* Background gradient */}
       <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
       
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
         <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
           
           {/* Left Content */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8 text-center lg:text-left">
             {/* Rating Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-primary/10 border border-primary/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
              <div className="flex gap-0.5">
                 {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-primary text-primary" />
                 ))}
               </div>
              <span className="text-xs sm:text-sm text-foreground font-medium">
                 {business.ratings?.google || 4.9} Rating • {business.statistics?.[0]?.number || '5,000+'} Projects
               </span>
             </div>
             
             {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight text-balance">
               {hero.headline}{' '}
               {hero.headlineHighlight && (
                 <span className="gradient-text orange-glow-blink">
                   {hero.headlineHighlight}
                 </span>
               )}
             </h1>
             
             {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
               {hero.subheadline}
             </p>
             
             {/* CTA Buttons */}
             <div className="flex flex-col sm:flex-row gap-4">
               <button
                 onClick={onPrimaryClick}
                className="btn btn-gold-wave w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
               >
                 {hero.ctaPrimary || 'Get Free Estimate'}
               </button>
               {hero.ctaSecondary && (
                 <button
                   onClick={onSecondaryClick}
                  className="btn btn-electric w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg flex items-center justify-center gap-2"
                 >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                   {hero.ctaSecondary}
                 </button>
               )}
             </div>
             
             {/* Trust Indicators */}
            <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4 lg:flex lg:flex-wrap lg:gap-6 pt-2 sm:pt-4">
               {trustItems.map((item, index) => (
                <div key={index} className="flex items-center justify-center lg:justify-start gap-1.5 sm:gap-2 text-muted-foreground">
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{item.text}</span>
                 </div>
               ))}
             </div>
           </div>
           
           {/* Right Media Section */}
           <div className="relative w-full mt-4 lg:mt-0">
             {/* Video Container */}
              <div
               className={`relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl bg-card/80 backdrop-blur-sm border border-primary/30 glow-sm transition-all duration-700 ${
                 videoEnded ? 'opacity-0 scale-95 pointer-events-none h-0 overflow-hidden' : 'opacity-100 scale-100'
               }`}
             >
               <video
                 ref={videoRef}
                 src={introVideo}
                 autoPlay
                 muted
                 playsInline
                 onEnded={handleVideoEnd}
                 className="w-full aspect-video object-cover"
               />
               {/* Video glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-xl sm:rounded-2xl blur-xl -z-10" />
             </div>

             {/* Project Cards Grid */}
             <div
              className={`grid grid-cols-2 gap-2 sm:gap-3 transition-all duration-700 ${
                 videoEnded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 h-0 overflow-hidden pointer-events-none'
               }`}
             >
               {projects.map((project: any, index: number) => (
                 <ProjectCard
                   key={project.id}
                   project={project}
                   image={projectImages[index]}
                   index={index}
                 />
               ))}
             </div>
             {/* Decorative glow behind cards */}
             {videoEnded && (
               <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 via-amber-500/5 to-primary/10 rounded-3xl blur-2xl -z-10 animate-pulse" />
             )}
           </div>
         </div>
       </div>
     </section>
   );
 };
 
 export default HeroVideo;