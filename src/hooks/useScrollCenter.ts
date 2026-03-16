import { useEffect, useRef, useState } from 'react';

export function useScrollCenter<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [distance, setDistance] = useState<number>(Infinity);
  const itemIdRef = useRef<string>('');

  useEffect(() => {
    // Extract item title for logging
    if (ref.current) {
      itemIdRef.current = ref.current.querySelector('a')?.textContent || 'Unknown';
      console.debug(`[useScrollCenter] Hook mounted for: ${itemIdRef.current}`);
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
        console.debug(`[ScrollCenter] ${itemTitle} - OUT OF VIEWPORT (rect.top: ${rect.top}, rect.bottom: ${rect.bottom}, window height: ${window.innerHeight})`);
        return;
      }
      
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const newDistance = Math.abs(elementCenter - viewportCenter);
      
      console.debug(`[ScrollCenter] ${itemTitle} - IN VIEWPORT - Distance: ${newDistance.toFixed(0)}px (rect.top: ${rect.top.toFixed(0)}, rect.bottom: ${rect.bottom.toFixed(0)}, element center: ${elementCenter.toFixed(0)}, viewport center: ${viewportCenter.toFixed(0)})`);
      
      setDistance(newDistance);
    };

    // Check immediately and after a delay to ensure layout is stable
    checkDistance();
    const timeoutId = setTimeout(checkDistance, 100);
    
    window.addEventListener('scroll', checkDistance, { passive: true });
    window.addEventListener('resize', checkDistance, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', checkDistance);
      window.removeEventListener('resize', checkDistance);
    };
  }, []);

  return { ref, distance };
}
