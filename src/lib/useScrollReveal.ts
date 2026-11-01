import { useEffect, useRef } from 'react';

// React adaptation of motion-anything's scroll-reveal timing and restraint.
// Static HTML stays visible: animation enhances content, never gates it on JS.
export function useScrollReveal<T extends HTMLElement>(replayKey = '') {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !('IntersectionObserver' in window) || !('animate' in Element.prototype)) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver((entries) => {
      let order = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (preference.matches || entry.boundingClientRect.bottom <= 0) continue;
        // At most three entrances per observer batch, all done within 500ms.
        if (order >= 3) continue;
        const animation = entry.target.animate(
          [{ opacity: 0.65, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }],
          { duration: 380, delay: order++ * 50, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' },
        );
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

    root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => observer.observe(element));
    const cancelMotion = () => {
      if (preference.matches) {
        animations.forEach((animation) => animation.cancel());
        animations.clear();
      }
    };
    preference.addEventListener('change', cancelMotion);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      preference.removeEventListener('change', cancelMotion);
    };
  }, [replayKey]);

  return ref;
}
