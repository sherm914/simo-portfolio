'use client';

import { useState, useEffect, useRef } from 'react';
import { portfolioItems } from '@/data/portfolio';
import { useScrollCenter } from '@/hooks/useScrollCenter';
import PortfolioCard from '@/components/PortfolioCard';

export default function Portfolio() {
  const featured = portfolioItems.filter((p) => p.featured);
  const others = portfolioItems.filter((p) => !p.featured);
  const [filter, setFilter] = useState<'All' | 'Directing' | 'Editing' | 'VFX' | 'Production' | 'Motion Graphics'>('All');
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [closestItemId, setClosestItemId] = useState<number | null>(null);
  const distancesRef = useRef<Map<number, number>>(new Map());

  const filtered =
    filter === 'All' ? others : others.filter((p) => p.category === filter);

  // Debug: log when rendered items change
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[Portfolio] Rendered: Featured=${featured.length}, Filtered=${filtered.length}, Total items in view=${featured.length + filtered.length}`);
      if (filtered.length > 0) {
        console.debug(`[Portfolio] Featured items:`, featured.map(p => ({ id: p.id, title: p.title })));
        console.debug(`[Portfolio] Filtered items (${filter}):`, filtered.map(p => ({ id: p.id, title: p.title })));
      }
    }
  }, [filtered, featured, filter]);

  // Track distances and find closest item
  const handleDistanceUpdate = (itemId: number, distance: number) => {
    distancesRef.current.set(itemId, distance);
    
    let closest: number | null = null;
    let closestDistance = Infinity;
    
    distancesRef.current.forEach((dist, id) => {
      if (dist < closestDistance) {
        closestDistance = dist;
        closest = id;
      }
    });
    
    if (process.env.NODE_ENV === 'development') {
      const closestItem = [...featured, ...others].find(item => item.id === closest);
      const trackedIds = Array.from(distancesRef.current.keys()).join(', ');
      console.debug(`[Portfolio] Closest: ${closestItem?.title || 'None'} (ID: ${closest}), Distance: ${closestDistance.toFixed(0)}px, Tracked: ${distancesRef.current.size} items [${trackedIds}]`);
    }
    
    setClosestItemId(closest);
  };

  return (
    <section className="py-20 px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-bold text-white mb-4">My Portfolio</h2>
        <p className="text-zinc-400 mb-12 max-w-2xl">
          A collection of my latest projects in editing, VFX, and production.
        </p>

        {/* featured projects grid */}
        {featured.length > 0 && (
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
            onMouseLeave={() => setHoveredId(null)}
          >
            {featured.map((item) => (
              <PortfolioCardWrapperData
                key={item.id}
                item={item}
                hoveredId={hoveredId}
                isClosest={closestItemId === item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onDistanceUpdate={handleDistanceUpdate}
              />
            ))}
          </div>
        )}

        {/* secondary grid controls */}
        {others.length > 0 && (
          <div>
            <h3 className="text-3xl font-semibold text-white mb-6">All Projects</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {['All', 'Directing', 'Editing', 'VFX', 'Production', 'Motion Graphics'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat as 'All' | 'Directing' | 'Editing' | 'VFX' | 'Production' | 'Motion Graphics')}
                  className={`px-4 py-2 rounded-full border transition ${filter === cat ? 'bg-white text-black' : 'border-white text-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div 
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6"
              onMouseLeave={() => setHoveredId(null)}
            >
              {filtered.map((item) => (
                <PortfolioCardWrapperData
                  key={item.id}
                  item={item}
                  hoveredId={hoveredId}
                  isClosest={closestItemId === item.id}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onDistanceUpdate={handleDistanceUpdate}
                  isSmall
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

interface PortfolioCardWrapperDataProps {
  item: any;
  hoveredId: number | null;
  isClosest: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onDistanceUpdate: (itemId: number, distance: number) => void;
  isSmall?: boolean;
}

function PortfolioCardWrapperData({
  item,
  hoveredId,
  isClosest,
  onMouseEnter,
  onMouseLeave,
  onDistanceUpdate,
  isSmall,
}: PortfolioCardWrapperDataProps) {
  const { ref, distance } = useScrollCenter<HTMLDivElement>();

  // Debug: log when wrapper mounts
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[Portfolio] Wrapper mounted for: ${item.title} (ID: ${item.id})`);
    }
    return () => {
      if (process.env.NODE_ENV === 'development') {
        console.debug(`[Portfolio] Wrapper unmounted for: ${item.title} (ID: ${item.id})`);
      }
    };
  }, [item.id, item.title]);

  // Report distance when it changes
  useEffect(() => {
    onDistanceUpdate(item.id, distance);
  }, [distance, item.id, onDistanceUpdate]);

  // Cleanup: remove distance when unmounting
  useEffect(() => {
    return () => {
      onDistanceUpdate(item.id, Infinity);
    };
  }, [item.id, onDistanceUpdate]);

  return (
    <div
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`w-full h-full transition-transform duration-300 ${
        isClosest ? 'sm:scale-100 scale-100' : 'sm:scale-100 scale-95'
      }`}
    >
      <PortfolioCard
        href={`/site/portfolio/${item.slug}`}
        title={item.title}
        category={item.category}
        imageUrl={item.image_url}
        videoUrl={item.videoUrl}
        isBlurred={hoveredId !== null && hoveredId !== item.id}
        isSmall={isSmall}
        isMobileCentered={isClosest}
        isHovered={hoveredId === item.id}
        distance={distance}
      />
    </div>
  );
}
