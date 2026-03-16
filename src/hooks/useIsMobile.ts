import { useEffect, useState } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check on mount
    const checkIsMobile = () => {
      // sm breakpoint is 640px in Tailwind
      setIsMobile(window.innerWidth < 640);
    };

    checkIsMobile();

    // Listen for resize
    window.addEventListener('resize', checkIsMobile, { passive: true });

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return isMobile;
}
