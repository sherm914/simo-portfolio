'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { PortfolioItem } from '@/types/database';

export function PortfolioDetailClient() {
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
          <Link href="/site/selected-work" className="text-white/60 hover:text-white transition-colors">
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
          <div className="relative mb-16 rounded-lg overflow-hidden bg-black aspect-video">
            <video
              ref={videoRef}
              src={project.video_url}
              className="w-full h-full object-cover"
              controls
              playsInline
            />
            {showPlayButton && (
              <button
                onClick={handlePlayClick}
                className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/30 transition"
              >
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
              </button>
            )}
          </div>
        )}

        {project.about && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">About</h2>
            <p className="text-zinc-300 leading-relaxed">{project.about}</p>
          </div>
        )}

        {project.roles && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Roles</h2>
            <p className="text-zinc-300">{project.roles}</p>
          </div>
        )}

        {Array.isArray(project.bts_images) && project.bts_images.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Behind the Scenes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.bts_images.map((imageUrl, index) => (
                <div key={index} className="relative h-64 rounded-lg overflow-hidden bg-zinc-900">
                  {!btsImageLoaded[index] && (
                    <div className="absolute inset-0 bg-zinc-800 animate-pulse z-0" />
                  )}
                  <Image
                    src={imageUrl}
                    alt={`Behind the scenes ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={false}
                    onLoad={() => setBtsImageLoaded((prev) => ({ ...prev, [index]: true }))}
                    className={`object-cover transition-opacity duration-300 z-10 ${
                      btsImageLoaded[index] ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {Array.isArray(project.bts_videos) && project.bts_videos.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-col gap-6">
              {project.bts_videos.map((videoUrl, index) => (
                <div key={index} className="relative w-full aspect-video rounded-lg overflow-hidden bg-zinc-900">
                  <video
                    src={videoUrl}
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                    muted
                    playsInline
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <Link href="/site/selected-work" className="text-white/60 hover:text-white transition-colors">
          ← Back to projects
        </Link>
      </div>
    </main>
  );
}
