import { useCallback, useRef } from 'react';
import { exportToCSV, exportToJSON } from '@/lib/export';
import type { ExportColumn } from '@/lib/export';
import { toast } from 'sonner';

interface UseExportOptions<T extends Record<string, unknown>> {
  data: T[];
  columns: ExportColumn[];
  filename: string;
}

/**
 * Hook providing export functions for table data.
 */
export function useExport<T extends Record<string, unknown>>({
  data,
  columns,
  filename,
}: UseExportOptions<T>) {
  const exporting = useRef(false);

  const exportCSV = useCallback(() => {
    if (exporting.current) return;
    exporting.current = true;
    try {
      exportToCSV(data, columns, filename);
      toast.success(`Exported ${data.length} rows as CSV`);
    } catch {
      toast.error('Export failed');
    } finally {
      exporting.current = false;
    }
  }, [data, columns, filename]);

  const exportJSON = useCallback(() => {
    if (exporting.current) return;
    exporting.current = true;
    try {
      exportToJSON(data, filename);
      toast.success(`Exported ${data.length} rows as JSON`);
    } catch {
      toast.error('Export failed');
    } finally {
      exporting.current = false;
    }
  }, [data, filename]);

  return { exportCSV, exportJSON };
}
