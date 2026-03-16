'use client';

import { useReel } from '@/hooks/useReel';

export default function ReelSection() {
  const { reel, loading, error } = useReel();

  // Debug: Always show something to verify component is rendering
  console.log('ReelSection - loading:', loading, 'reel:', reel, 'error:', error);

  if (error) {
    return (
      <section className="w-full py-12 md:py-20 px-4 md:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-red-500">Error loading reel: {error}</div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="w-full py-12 md:py-20 px-4 md:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-zinc-400">Loading reel...</div>
        </div>
      </section>
    );
  }

  if (!reel) {
    return null;
  }

  return (
    <section className="w-full py-12 md:py-20 px-4 md:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white">2024 Reel</h2>
        </div>
        <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl">
          <video
            src={reel}
            controls
            className="w-full h-full object-contain bg-black"
            playsInline
          />
        </div>
      </div>
    </section>
  );
}
