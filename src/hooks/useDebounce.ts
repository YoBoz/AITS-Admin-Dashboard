import { useState, useEffect } from 'react';

/**
 * Debounce a value by the given delay in ms.
 * Useful for search inputs to avoid excessive filtering.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
