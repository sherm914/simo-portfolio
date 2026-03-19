'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import styles from './PortfolioCard.module.css';

interface PortfolioCardProps {
  href: string;
  title: string;
  category?: string;
  imageUrl?: string;
  videoUrl?: string;
  isBlurred?: boolean;
  isSmall?: boolean;
  isMobileCentered?: boolean;
  isHovered?: boolean;
  distance?: number;
}

export default function PortfolioCard({
  href,
  title,
  category,
  imageUrl,
  videoUrl,
  isBlurred = false,
  isSmall = false,
  isMobileCentered = false,
  isHovered = false,
  distance = Infinity,
}: PortfolioCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate tilt angles (max 8 degrees)
    const xPercent = (x / rect.width - 0.5) * 2;
    const yPercent = (y / rect.height - 0.5) * 2;
    const rotateY = xPercent * 8;
    const rotateX = -yPercent * 8;

    setTilt({ x: rotateX, y: rotateY });
  };

  // Helper to safely seek to a random position
  const seekToRandomTime = (video: HTMLVideoElement) => {
    const duration = video.duration;
    if (!duration || duration <= 0) return;

    const randomTime = Math.random() * duration;
    // Only seek if video has buffered data (avoid seeking into unbuffered regions)
    const canSeek = video.buffered.length > 0;
    if (canSeek) {
      video.currentTime = randomTime;
    } else {
      // If not buffered yet, start from beginning
      video.currentTime = 0;
    }
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    // Stop video when mouse leaves
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleMouseEnter = () => {
    if (videoRef.current && videoUrl) {
      const video = videoRef.current;
      seekToRandomTime(video);
      // Play and handle promise properly
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (err.name !== 'AbortError' && process.env.NODE_ENV === 'development') {
            console.debug('Video play on hover failed:', err);
          }
        });
      }
    }
  };

  // Auto-play video on mobile when centered
  useEffect(() => {
    if (!videoRef.current || !videoUrl || !isMobile) return;

    const video = videoRef.current;

    if (isMobileCentered) {
      // Only play if not already playing
      if (video.paused) {
        seekToRandomTime(video);
        // Play and handle promise properly
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            // Autoplay prevented or cancelled - just continue silently
            if (err.name !== 'AbortError' && process.env.NODE_ENV === 'development') {
              console.debug('Video play failed:', err);
            }
          });
        }
      }
    } else {
      // Pause when not centered, but only if actually playing
      if (!video.paused) {
        video.pause();
      }
    }
  }, [isMobileCentered, videoUrl, isMobile]);

  // Prefetch: Start buffering videos as they approach (within 800px)
  useEffect(() => {
    if (!videoRef.current || !videoUrl || isMobileCentered || distance === Infinity) return;

    const video = videoRef.current;
    // More aggressive prefetch for faster loading
    const PREFETCH_THRESHOLD = 1600; // Larger prefetch window

    if (distance < PREFETCH_THRESHOLD && video.paused) {
      // Start buffering video by setting preload and playing muted
      video.preload = 'auto';
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // Silently catch autoplay errors
          if (err.name !== 'AbortError' && process.env.NODE_ENV === 'development') {
            console.debug('Prefetch failed:', err);
          }
        });
      }
    } else if (distance >= PREFETCH_THRESHOLD && !video.paused && !isHovered) {
      // Stop prefetching if far away and not hovered
      video.pause();
    }
  }, [distance, videoUrl, isMobileCentered, isHovered]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className={styles.perspectiveContainer}
    >
      <Link
        href={href}
        className={`
          group relative bg-gradient-to-br from-zinc-800 via-zinc-900 to-black rounded-lg overflow-hidden transition-all duration-300
          ${isSmall ? 'aspect-video' : 'aspect-video'}
          hover:shadow-2xl
          block w-full h-full
        `}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${
            isMobile && isMobileCentered ? 1.08 : isBlurred ? 1 : 1.02
          })`,
          transition: 'transform 200ms ease-out',
          boxShadow: isMobile && isMobileCentered ? '0 25px 50px -12px rgba(255, 255, 255, 0.25)' : undefined,
        }}
      >
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 z-10 ${
              (isMobile && isMobileCentered) || isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
            muted
            loop
            playsInline
            preload="auto"
          />
        ) : null}

        {imageUrl ? (
          <>
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 animate-pulse z-0" />
            )}
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={false}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`object-cover transition-opacity duration-300 absolute inset-0 z-5 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              } ${
                (isMobile && isMobileCentered) ? 'opacity-0' : videoUrl ? 'group-hover:opacity-0' : ''
              }`}
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center opacity-50">
            <div className="text-center text-white">
              <p className="font-semibold mb-1 text-sm md:text-base">{title}</p>
              {category && <p className="text-xs text-zinc-400">{category}</p>}
            </div>
          </div>
        )}
      </Link>
    </div>
  );
}
