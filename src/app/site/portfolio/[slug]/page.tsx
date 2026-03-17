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
      description: 'View Simo Motsa\'s portfolio project',
    };
  }
}

export default function PortfolioDetailPage() {
  return <PortfolioDetailClient />;
}

        {project.video_url && (
          <div className="mb-6">
            <div className="aspect-video bg-zinc-900 rounded-lg overflow-hidden relative">
              {project.video_url.includes('youtube.com') || project.video_url.includes('youtu.be') ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={project.video_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                  title={project.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : project.video_url.includes('vimeo.com') ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={project.video_url.replace('vimeo.com/', 'player.vimeo.com/video/')}
                  title={project.title}
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <video ref={videoRef} src={project.video_url} autoPlay controls className="w-full h-full" />
                  {showPlayButton && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <button
                        onClick={handlePlayClick}
                        className="bg-white hover:bg-zinc-200 text-black rounded-full p-4 transition"
                        aria-label="Play video"
                      >
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="currentColor">
                          <path d="M12 8v32l24-16z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Project Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 pt-12 border-t border-zinc-800">
          {/* Roles */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Roles</h3>
            <p className="text-zinc-400">{project.roles || 'Not specified'}</p>
          </div>

          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">About</h3>
            <p className="text-zinc-400">{project.about || 'No description available'}</p>
          </div>
        </div>

        {/* BTS Gallery & Video Section */}
        {(project.bts_images && project.bts_images.length > 0) || (project.bts_videos && project.bts_videos.length > 0) ? (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Behind the Scenes</h2>
            
            {/* BTS Images */}
            {(project.bts_images && project.bts_images.length > 0) && (
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.bts_images.map((imageUrl, index) => (
                    <div key={index} className="aspect-video bg-zinc-900 rounded-lg overflow-hidden relative">
                      {!btsImageLoaded[index] && (
                        <div className="absolute inset-0 bg-zinc-800 animate-pulse rounded-lg" />
                      )}
                      <img 
                        src={imageUrl} 
                        alt={`BTS Image ${index + 1}`} 
                        loading="lazy"
                        onLoad={() => setBtsImageLoaded(prev => ({ ...prev, [index]: true }))}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${
                          btsImageLoaded[index] ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BTS Videos */}
            {(project.bts_videos && project.bts_videos.length > 0) && (
              <div>
                <div className="space-y-4">
                  {project.bts_videos.map((videoUrl, index) => (
                    <div key={index} className="aspect-video bg-zinc-900 rounded-lg overflow-hidden">
                      <video
                        src={videoUrl}
                        autoPlay
                        muted
                        loop
                        controls
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}

        <p className="mt-10">
          <Link href="/site/selected-work" className="text-zinc-400 underline">
            ← Back to projects
          </Link>
        </p>
      </div>
    </main>
  );
}
