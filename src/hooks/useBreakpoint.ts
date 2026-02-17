import { useState, useEffect } from 'react';

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

type Breakpoint = keyof typeof breakpoints;

/**
 * Returns current breakpoint name and boolean helpers.
 */
export function useBreakpoint() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1280,
  );

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const current: Breakpoint =
    width >= breakpoints['2xl'] ? '2xl'
    : width >= breakpoints.xl ? 'xl'
    : width >= breakpoints.lg ? 'lg'
    : width >= breakpoints.md ? 'md'
    : 'sm';

  return {
    width,
    current,
    isMobile: width < breakpoints.md,
    isTablet: width >= breakpoints.md && width < breakpoints.lg,
    isDesktop: width >= breakpoints.lg,
    isAbove: (bp: Breakpoint) => width >= breakpoints[bp],
    isBelow: (bp: Breakpoint) => width < breakpoints[bp],
  };
}
