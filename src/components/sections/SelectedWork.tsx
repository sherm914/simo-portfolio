'use client';

import { useState, useEffect, useRef } from 'react';
import { usePortfolioItems } from '@/hooks/usePortfolioItems';
import { useScrollCenter } from '@/hooks/useScrollCenter';
import PortfolioCard from '@/components/PortfolioCard';

export default function SelectedWork() {
  const { items, loading } = usePortfolioItems();
  const [hoveredId, setHoveredId] = useState<string | number | null>(null);
  const [closestItemId, setClosestItemId] = useState<string | number | null>(null);
  const distancesRef = useRef<Map<string | number, number>>(new Map());
  
  const filtered = items
    .filter((p) => p.featured)
    .sort((a, b) => {
      // Sort by the order of their first category
      const firstCatA = a.categories[0] as keyof typeof a.category_orders;
      const firstCatB = b.categories[0] as keyof typeof b.category_orders;
      const orderA = a.category_orders[firstCatA] ?? Infinity;
      const orderB = b.category_orders[firstCatB] ?? Infinity;
      return orderA - orderB;
    });

  // Debug: log when rendered items change
  useEffect(() => {
    console.debug(`[SelectedWork] Rendered: ${filtered.length} featured items`);
    console.debug(`[SelectedWork] All featured items from DB:`, filtered.map(p => ({ id: p.id, title: p.title, featured: p.featured })));
  }, [filtered]);

  // Track distances and find closest item
  const handleDistanceUpdate = (itemId: string | number, distance: number) => {
    distancesRef.current.set(itemId, distance);
    
    let closest: string | number | null = null;
    let closestDistance = Infinity;
    
    distancesRef.current.forEach((dist, id) => {
      if (dist < closestDistance) {
        closestDistance = dist;
        closest = id;
      }
    });
    
    const closestItem = filtered.find(item => item.id === closest);
    const trackedIds = Array.from(distancesRef.current.keys()).join(', ');
    console.debug(`[SelectedWork] Closest: ${closestItem?.title || 'None'} (ID: ${closest}), Distance: ${closestDistance.toFixed(0)}px, Tracked: ${distancesRef.current.size} items [${trackedIds}]`);
    
    setClosestItemId(closest);
  };

  return (
    <section className="pt-24 pb-8 px-6 bg-black">
      <div className="max-w-full mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 px-6 text-center whitespace-nowrap">SELECTED WORK</h1>

        {/* Portfolio grid */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          onMouseLeave={() => setHoveredId(null)}
        >
          {filtered.map((item, index) => {
            console.debug(`[SelectedWork] Mapping item ${index + 1}/${filtered.length}: ${item.title} (ID: ${item.id})`);
            return (
              <PortfolioCardWrapperSelectedWork
                key={item.id}
                item={item}
                hoveredId={hoveredId}
                isClosest={closestItemId === item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onDistanceUpdate={handleDistanceUpdate}
              />
            );
          })}
          
          {/* Contact button - mobile only */}
          <a
            href="/site/contact"
            className="sm:hidden h-40 w-full border border-white/20 rounded-lg flex items-center justify-center transition-all duration-300 hover:border-white/40 hover:bg-white/5"
          >
            <div className="text-white text-sm font-medium">Let's Work</div>
          </a>
        </div>
      </div>
    </section>
  );
}

interface PortfolioCardWrapperSelectedWorkProps {
  item: any;
  hoveredId: string | number | null;
  isClosest: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onDistanceUpdate: (itemId: string | number, distance: number) => void;
}

function PortfolioCardWrapperSelectedWork({
  item,
  hoveredId,
  isClosest,
  onMouseEnter,
  onMouseLeave,
  onDistanceUpdate,
}: PortfolioCardWrapperSelectedWorkProps) {
  const { ref, distance } = useScrollCenter<HTMLDivElement>();
  
  console.debug(`[SelectedWork] Wrapper render: ${item.title} (ID: ${item.id}), distance: ${distance.toFixed(0)}px`);

  // Debug: log when wrapper mounts
  useEffect(() => {
    console.debug(`[SelectedWork] Wrapper mounted for: ${item.title} (ID: ${item.id})`);
    return () => {
      console.debug(`[SelectedWork] Wrapper unmounted for: ${item.title} (ID: ${item.id})`);
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
        category={item.categories.join(', ')}
        imageUrl={item.image_url}
        videoUrl={item.video_url}
        isBlurred={hoveredId !== null && hoveredId !== item.id}
        isMobileCentered={isClosest}
        isHovered={hoveredId === item.id}
        distance={distance}
      />
    </div>
  );
}
