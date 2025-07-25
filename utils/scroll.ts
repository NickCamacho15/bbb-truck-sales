/**
 * Cross-browser compatible smooth scroll to top function
 * Provides fallback for browsers that don't support smooth behavior
 */
export function smoothScrollToTop(): void {
  // Check if smooth behavior is supported
  if (CSS.supports('scroll-behavior', 'smooth')) {
    try {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } catch (e) {
      // Fallback for browsers with partial support
      smoothScrollPolyfill();
    }
  } else {
    // Fallback for unsupported browsers
    smoothScrollPolyfill();
  }
}

/**
 * Polyfill for smooth scrolling using requestAnimationFrame
 */
function smoothScrollPolyfill(): void {
  const startPosition = window.pageYOffset;
  const startTime = performance.now();
  const duration = 500; // 500ms animation duration

  function scrollAnimation(currentTime: number): void {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function for smooth animation (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const position = startPosition * (1 - easeOut);
    
    window.scrollTo(0, position);
    
    if (progress < 1) {
      requestAnimationFrame(scrollAnimation);
    }
  }
  
  requestAnimationFrame(scrollAnimation);
} 