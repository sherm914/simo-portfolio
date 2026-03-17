// Global scroll tracking with debouncing
let scrollTimeout: NodeJS.Timeout | null = null;
let scrollListeners: Set<() => void> = new Set();
let isScheduled = false;

const scheduleScrollCheck = () => {
  if (isScheduled) return;
  isScheduled = true;

  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }

  // Debounce with 50ms delay (enough for smooth 60fps, fast enough for feel)
  scrollTimeout = setTimeout(() => {
    scrollListeners.forEach(listener => listener());
    isScheduled = false;
  }, 50);
};

// Attach a single scroll listener to the window
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', scheduleScrollCheck, { passive: true });
  window.addEventListener('resize', scheduleScrollCheck, { passive: true });
}

export function subscribeToScroll(callback: () => void) {
  scrollListeners.add(callback);
  
  return () => {
    scrollListeners.delete(callback);
  };
}
