'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { PortfolioItem } from '@/types/database';

export default function PortfolioDetail() {
  const params = useParams();
  const slug = params?.slug as string;
  const [project, setProject] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [btsImageLoaded, setBtsImageLoaded] = useState<Record<number, boolean>>({});
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: dbError } = await supabase
          .from('portfolio_items')
          .select('*')
          .eq('slug', slug)
          .single();

        if (dbError) {
          console.error('Database error:', dbError.message);
          setError(dbError.message || 'Failed to fetch project');
          setProject(null);
          return;
        }

        setProject(data);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        console.error('Failed to fetch project:', errorMsg);
        setError(errorMsg);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  useEffect(() => {
    if (!project?.video_url || !videoRef.current) return;

    // Check if video is playing after a short delay
    const timer = setTimeout(() => {
      if (videoRef.current?.paused) {
        setShowPlayButton(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [project]);

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setShowPlayButton(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <p className="text-xl mb-2">Sorry, project not found.</p>
          {error && <p className="text-zinc-400 text-sm mb-4">{error}</p>}
          <Link href="/site/selected-work" className="text-blue-400 underline">
            ← Back to projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 pt-32 pb-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{project.title}</h1>
        <p className="text-zinc-300 mb-6">{project.description}</p>

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
