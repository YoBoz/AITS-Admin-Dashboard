import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  root?: Element | null;
}

/**
 * Observe whether an element is in the viewport.
 */
export function useIntersectionObserver<T extends Element>(
  options: UseIntersectionObserverOptions = {},
) {
  const { threshold = 0, rootMargin = '0px', root = null } = options;
  const ref = useRef<T | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold, rootMargin, root },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, root]);

  return { ref, isIntersecting };
}
