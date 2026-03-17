import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import { PortfolioDetailClient } from './client';
import type { PortfolioItem } from '@/types/database';

// Initialize Supabase client for server-side data fetching
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    // Fetch project data for metadata
    const { data: project } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('slug', params.slug)
      .single();

    if (!project) {
      return {
        title: 'Project Not Found',
        description: 'This project could not be found.',
      };
    }

    const baseUrl = 'https://simomotsa.com';
    const projectUrl = `${baseUrl}/site/portfolio/${project.slug}`;
    
    return {
      title: `${project.title} | Simo Motsa`,
      description: project.description || `${project.title} - A ${project.type} by Simo Motsa`,
      alternates: {
        canonical: projectUrl,
      },
      openGraph: {
        title: project.title,
        description: project.description || `${project.title} - A ${project.type} by Simo Motsa`,
        type: 'website',
        url: projectUrl,
        images: project.image_url ? [
          {
            url: project.image_url,
            width: 1200,
            height: 630,
            alt: project.title,
          }
        ] : [],
        siteName: 'Simo Motsa',
      },
      twitter: {
        card: 'summary_large_image',
        title: project.title,
        description: project.description || `${project.title} - A ${project.type} by Simo Motsa`,
        images: project.image_url ? [project.image_url] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Portfolio Project',
      description: 'View Simo Motsa portfolio project',
    };
  }
}

export default function PortfolioDetailPage() {
  return <PortfolioDetailClient />;
}
