import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react';
import { motion, useSpring } from 'framer-motion';

// Inspired by motion-anything's magnetic-button recipe; adapted to a stable
// anchor hit area, a small travel limit and React's lifecycle. See licenses/.
export default function MagneticLink({ href, className, children }: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const enabled = useRef(false);
  const x = useSpring(0, { stiffness: 300, damping: 30 });
  const y = useSpring(0, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const preference = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const update = () => {
      enabled.current = preference.matches;
      x.jump(0);
      y.jump(0);
    };
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, [x, y]);

  const reset = () => { x.set(0); y.set(0); };
  const follow = (event: PointerEvent<HTMLAnchorElement>) => {
    if (!enabled.current || event.pointerType !== 'mouse' || event.currentTarget.matches(':focus-visible')) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(Math.max(-4, Math.min(4, (event.clientX - rect.left - rect.width / 2) * 0.08)));
    y.set(Math.max(-3, Math.min(3, (event.clientY - rect.top - rect.height / 2) * 0.12)));
  };

  return (
    <a href={href} className="group inline-flex rounded-full" onPointerMove={follow}
      onPointerLeave={reset} onPointerDown={reset} onFocus={reset} onBlur={reset}>
      <motion.span className={className} style={{ x, y }}>{children}</motion.span>
    </a>
  );
}
