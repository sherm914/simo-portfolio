'use client';

import { useState, useEffect, useRef } from 'react';
import { usePortfolioItems } from '@/hooks/usePortfolioItems';
import { useScrollCenter } from '@/hooks/useScrollCenter';
import PortfolioCard from '@/components/PortfolioCard';

interface CategoryPortfolioProps {
  categoryName: 'Directing' | 'Editorial' | 'VFX' | 'Production';
  categoryTitle: string;
}

export default function CategoryPortfolio({ categoryName, categoryTitle }: CategoryPortfolioProps) {
  const { items, loading } = usePortfolioItems();
  const [filter, setFilter] = useState<'ALL' | 'MUSIC VIDEO' | 'COMMERCIAL' | 'NARRATIVE'>('ALL');
  const [hoveredId, setHoveredId] = useState<string | number | null>(null);
  const [closestItemId, setClosestItemId] = useState<string | number | null>(null);
  const distancesRef = useRef<Map<string | number, number>>(new Map());

  const filtered_items = items
    .filter((p) => p.categories.includes(categoryName))
    .sort((a, b) => {
      const orderA = a.category_orders[categoryName as keyof typeof a.category_orders] ?? Infinity;
      const orderB = b.category_orders[categoryName as keyof typeof b.category_orders] ?? Infinity;
      return orderA - orderB;
    });

  const filtered =
    filter === 'ALL' ? filtered_items : filtered_items.filter((p) => p.type === filter);

  // Debug: log when rendered items change
  useEffect(() => {
    console.debug(`[${categoryTitle}] Rendered: Total=${filtered_items.length}, Filtered=${filtered.length}`);
    console.debug(`[${categoryTitle}] All items in this category:`, filtered_items.map(p => ({ id: p.id, title: p.title, featured: p.featured })));
    console.debug(`[${categoryTitle}] Filtered items (${filter}):`, filtered.map(p => ({ id: p.id, title: p.title })));
  }, [filtered, filtered_items, categoryTitle, filter]);

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
    console.debug(`[${categoryTitle}] Closest: ${closestItem?.title || 'None'} (ID: ${closest}), Distance: ${closestDistance.toFixed(0)}px, Tracked: ${distancesRef.current.size} items [${trackedIds}]`);
    
    setClosestItemId(closest);
  };

  return (
    <section className="pt-24 pb-8 px-6 bg-black">
      <div className="max-w-full mx-auto">
        <h1 className="sm:hidden text-3xl font-bold text-white mb-8 px-6 text-center whitespace-nowrap">{categoryTitle}</h1>

        {/* Filter buttons */}
        {!loading && filtered_items.length > 0 && (
          <div>
            <div className="flex flex-nowrap gap-1 mb-8 px-6 justify-center">
              {['ALL', 'MUSIC VIDEO', 'COMMERCIAL', 'NARRATIVE'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type as 'ALL' | 'MUSIC VIDEO' | 'COMMERCIAL' | 'NARRATIVE')}
                  className={`px-2 py-1 text-xs rounded-full border transition-all duration-300 whitespace-nowrap hover:scale-105 md:hover:scale-102 transform ${
                    filter === type 
                      ? 'bg-white text-black border-white shadow-lg shadow-white/50' 
                      : 'border-white text-white hover:bg-white/10 hover:shadow-md hover:shadow-white/30'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Portfolio grid - Single column on mobile for scroll-to-center effect */}
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6"
              onMouseLeave={() => setHoveredId(null)}
            >
              {filtered.map((item) => (
                <PortfolioCardWrapper
                  key={item.id}
                  item={item}
                  hoveredId={hoveredId}
                  isClosest={closestItemId === item.id}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onDistanceUpdate={handleDistanceUpdate}
                />
              ))}
              
              {/* Contact button - mobile only */}
              <a
                href="/site/contact"
                className="sm:hidden h-40 w-full border border-white/20 rounded-lg flex items-center justify-center transition-all duration-300 hover:border-white/40 hover:bg-white/5"
              >
                <div className="text-white text-sm font-medium">Let's Work</div>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

interface PortfolioCardWrapperProps {
  item: any;
  hoveredId: string | number | null;
  isClosest: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onDistanceUpdate: (itemId: string | number, distance: number) => void;
}

function PortfolioCardWrapper({
  item,
  hoveredId,
  isClosest,
  onMouseEnter,
  onMouseLeave,
  onDistanceUpdate,
}: PortfolioCardWrapperProps) {
  const { ref, distance } = useScrollCenter<HTMLDivElement>();

  // Debug: log when wrapper mounts
  useEffect(() => {
    console.debug(`[CategoryPortfolio] Wrapper mounted for: ${item.title} (ID: ${item.id})`);
    return () => {
      console.debug(`[CategoryPortfolio] Wrapper unmounted for: ${item.title} (ID: ${item.id})`);
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
        category={item.type}
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
