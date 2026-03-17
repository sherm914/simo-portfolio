'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useContactPageContent } from '@/hooks/useContactPageContent';

export default function About() {
  const { content, loading } = useContactPageContent();
  const [imageLoaded, setImageLoaded] = useState(false);

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
      <div className="max-w-full mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg flex items-center justify-center overflow-hidden max-w-md mx-auto md:mx-0 w-full md:w-auto relative h-96">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-zinc-800 animate-pulse rounded-lg z-0" />
            )}
            {content?.profile_image_url ? (
              <Image
                src={content.profile_image_url}
                alt="Profile"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={false}
                onLoad={() => setImageLoaded(true)}
                className={`object-contain transition-opacity duration-300 z-10 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
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
                        <span>📷</span>
                        <span>Instagram</span>
                      </a>
                    )}
                    {content.social_links.linkedin && (
                      <a href={content.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white hover:text-zinc-300 transition">
                        <span>💼</span>
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
