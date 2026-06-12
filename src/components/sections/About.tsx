'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useContactPageContent } from '@/hooks/useContactPageContent';

export default function About() {
  const { content, loading } = useContactPageContent();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

  if (loading) {
    return (
      <section className="pt-24 pb-8 px-6 bg-zinc-900">
        <div className="max-w-full mx-auto">
          <p className="text-zinc-400 text-center">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-24 pb-8 px-6 bg-zinc-900">
      <div className="max-w-6xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg flex items-center justify-center overflow-hidden max-w-md mx-auto md:mx-0 w-full md:w-auto">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-zinc-800 animate-pulse rounded-lg" />
            )}
            {content?.profile_image_url ? (
              <div className="relative w-full" style={imageDimensions ? { aspectRatio: `${imageDimensions.width} / ${imageDimensions.height}` } : {}}>
                <Image
                  src={content.profile_image_url}
                  alt="Profile"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={false}
                  onLoad={(result) => {
                    const img = result.currentTarget as HTMLImageElement;
                    setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
                    setImageLoaded(true);
                  }}
                  className={`object-contain transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </div>
            ) : (
              <p className="text-zinc-400 text-center">[Profile Image]</p>
            )}
          </div>
          
          <div>
            {content?.about_text && (
              <p className="text-lg text-zinc-300 mb-8 leading-relaxed">
                {content.about_text}
              </p>
            )}
            
            {/* Let's Work Together Section */}
            <div className="mb-8 pt-8 border-t border-zinc-700">
              <h3 className="text-white font-semibold text-lg mb-4">Let&apos;s Work Together</h3>
              <p className="text-zinc-300 text-sm mb-6">
                Have a project in mind? I&apos;d love to hear about it. Get in touch and let&apos;s create something amazing together.
              </p>
              
              {content?.contact_email && (
                <div className="mb-6">
                  <p className="text-zinc-400 text-sm font-medium mb-2">Email</p>
                  <a href={`mailto:${content.contact_email}`} className="text-white hover:text-zinc-300 transition">
                    {content.contact_email}
                  </a>
                </div>
              )}
              
              {content?.social_links && Object.keys(content.social_links).length > 0 && (
                <div>
                  <p className="text-zinc-400 text-sm font-medium mb-3">Follow</p>
                  <div className="flex flex-wrap gap-4">
                    {content.social_links.instagram && (
                      <a href={content.social_links.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white hover:text-zinc-300 transition">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-label="Instagram">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.204-.012 3.584-.07 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        <span>Instagram</span>
                      </a>
                    )}
                    {content.social_links.linkedin && (
                      <a href={content.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white hover:text-zinc-300 transition">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-label="LinkedIn">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                        </svg>
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {content.social_links.twitter && (
                      <a href={content.social_links.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white hover:text-zinc-300 transition">
                        <span>𝕏</span>
                        <span>Twitter</span>
                      </a>
                    )}
                    {content.social_links.youtube && (
                      <a href={content.social_links.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white hover:text-zinc-300 transition">
                        <span>▶️</span>
                        <span>YouTube</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {content?.skills && content.skills.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-white font-semibold text-lg">Key Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {content.skills.map((skill) => (
                    <span key={skill} className="px-4 py-2 bg-white text-black rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
