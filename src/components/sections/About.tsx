'use client';

import { useContactPageContent } from '@/hooks/useContactPageContent';

export default function About() {
  const { content, loading } = useContactPageContent();

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
        <h2 className="text-5xl font-bold text-white mb-8 px-6">About Me</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg flex items-center justify-center overflow-hidden max-w-md">
            {content?.profile_image_url ? (
              <img
                src={content.profile_image_url}
                alt="Profile"
                className="w-full object-contain"
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
