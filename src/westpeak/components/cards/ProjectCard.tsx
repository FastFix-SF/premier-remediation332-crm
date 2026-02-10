 /**
  * ProjectCard - Displays a project showcase card with image and details
  */

 import React from 'react';
 import { MapPin, Wrench } from 'lucide-react';

 interface ProjectCardProps {
   project: {
     id: string;
     title: string;
     location: string;
     year: string;
     label: string;
     specs: string;
   };
   image: string;
   index: number;
 }

 export const ProjectCard: React.FC<ProjectCardProps> = ({ project, image, index }) => {
   return (
     <div
       className="group relative overflow-hidden rounded-lg border border-primary/20 bg-card animate-card-reveal opacity-0 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
       style={{
         animationDelay: `${index * 150}ms`,
         animationFillMode: 'forwards'
       }}
     >
       {/* Image Container — compact aspect ratio */}
      <div className="relative aspect-[3/2] overflow-hidden">
         <img
           src={image}
           alt={project.title}
           loading="lazy"
           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
         />
         {/* Gradient Overlay with epoxy tint */}
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-primary/10" />

         {/* Label Badge */}
        <div className="absolute top-2 left-2">
          <span className="px-2 py-0.5 bg-primary/90 text-primary-foreground text-[10px] font-semibold rounded-full backdrop-blur-sm">
             {project.label}
           </span>
         </div>

         {/* Bottom overlay content */}
         <div className="absolute bottom-0 left-0 right-0 p-2">
           <h3 className="font-semibold text-white text-xs line-clamp-1 mb-0.5">
             {project.title}
           </h3>
           <div className="flex items-center justify-between text-[9px] text-white/70">
             <div className="flex items-center gap-0.5">
               <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
               <span className="truncate">{project.location}</span>
             </div>
             <div className="flex items-center gap-0.5 text-primary">
               <Wrench className="w-2.5 h-2.5 flex-shrink-0" />
               <span className="truncate">{project.specs}</span>
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 };

 export default ProjectCard;
