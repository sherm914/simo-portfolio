import { useEffect, useRef, useState } from 'react';
import { subscribeToScroll } from '@/lib/scrollTracking';

export function useScrollCenter<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [distance, setDistance] = useState<number>(Infinity);
  const itemIdRef = useRef<string>('');

  useEffect(() => {
    // Extract item title for logging
    if (ref.current) {
      itemIdRef.current = ref.current.querySelector('a')?.textContent || 'Unknown';
      if (process.env.NODE_ENV === 'development') {
        console.debug(`[useScrollCenter] Hook mounted for: ${itemIdRef.current}`);
      }
    }
  }, []);

  useEffect(() => {
    const checkDistance = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const itemTitle = itemIdRef.current || ref.current.querySelector('a')?.textContent || 'Unknown';
      
      // Only track if element is in viewport (more inclusive for edges)
      // An element is visible if any part of it is in the viewport
      const isInViewport = rect.bottom >= 0 && rect.top <= window.innerHeight;
      
      if (!isInViewport) {
        setDistance(Infinity);
        if (process.env.NODE_ENV === 'development') {
          console.debug(`[ScrollCenter] ${itemTitle} - OUT OF VIEWPORT (rect.top: ${rect.top}, rect.bottom: ${rect.bottom}, window height: ${window.innerHeight})`);
        }
        return;
      }
      
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const newDistance = Math.abs(elementCenter - viewportCenter);
      
      if (process.env.NODE_ENV === 'development') {
        console.debug(`[ScrollCenter] ${itemTitle} - IN VIEWPORT - Distance: ${newDistance.toFixed(0)}px (rect.top: ${rect.top.toFixed(0)}, rect.bottom: ${rect.bottom.toFixed(0)}, element center: ${elementCenter.toFixed(0)}, viewport center: ${viewportCenter.toFixed(0)})`);
      }
      
      setDistance(newDistance);
    };

    // Subscribe to global scroll events with debouncing
    const unsubscribe = subscribeToScroll(checkDistance);
    
    // Check immediately and after a delay to ensure layout is stable
    checkDistance();
    const timeoutId = setTimeout(checkDistance, 100);

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  return { ref, distance };
}
