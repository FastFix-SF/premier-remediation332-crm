import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PublicProject {
  id: string;
  name: string;
  address?: string;
  project_type?: string;
  project_category?: string;
  short_description?: string;
  ai_image_url?: string;
  created_at: string;
  best_photo_url?: string;
}

export function usePublicProjects(limit = 4) {
  return useQuery({
    queryKey: ['public-projects', limit],
    queryFn: async (): Promise<PublicProject[]> => {
      const { data: projects, error } = await supabase
        .from('projects')
        .select(`
          id, name, address, project_type, project_category,
          short_description, ai_image_url, created_at,
          project_photos(id, photo_url, photo_tag, is_highlighted_after, is_highlighted_before, display_order)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (projects || []).map(project => {
        const photos = (project as any).project_photos || [];
        let bestPhotoUrl: string | undefined;

        if (photos.length > 0) {
          // Same priority as useProjectsWithPhotos
          const highlightedAfter = photos.find((p: any) => p.is_highlighted_after);
          const afterPhotos = photos.filter((p: any) => p.photo_tag === 'after');
          const highlightedBefore = photos.find((p: any) => p.is_highlighted_before);
          const ordered = photos
            .filter((p: any) => p.display_order && p.display_order > 0)
            .sort((a: any, b: any) => (b.display_order || 0) - (a.display_order || 0));

          const best = highlightedAfter ||
            (afterPhotos.length > 0 ? afterPhotos[0] : null) ||
            highlightedBefore ||
            (ordered.length > 0 ? ordered[0] : null) ||
            photos[0];

          bestPhotoUrl = best?.photo_url;
        }

        return {
          id: project.id,
          name: project.name,
          address: project.address,
          project_type: project.project_type,
          project_category: project.project_category,
          short_description: project.short_description,
          ai_image_url: project.ai_image_url,
          created_at: project.created_at,
          best_photo_url: bestPhotoUrl,
        };
      });
    },
    staleTime: 60_000,
  });
}
