import { useEffect, useRef, useState } from 'react';

type LazyVideoProps = {
  src: string;
  poster?: string;
  className?: string;
};

// Muted looping preview that costs nothing until it is near the viewport: the poster
// shows immediately, the video is fetched on approach, and it pauses when scrolled away.
// Users who prefer reduced motion get the poster only.
export default function LazyVideo({ src, poster, className }: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: '200px 0px' },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      src={load ? src : undefined}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
    />
  );
}
