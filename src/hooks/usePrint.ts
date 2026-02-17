import { useCallback } from 'react';
import { triggerPrint } from '@/lib/print';

/**
 * Hook providing print functionality.
 */
export function usePrint(title?: string) {
  const print = useCallback(() => {
    triggerPrint(title);
  }, [title]);

  return { print };
}
