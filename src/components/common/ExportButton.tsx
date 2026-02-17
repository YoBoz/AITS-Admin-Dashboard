import { useState } from 'react';
import { Download, ChevronDown, FileSpreadsheet, FileJson } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dropdownVariants } from '@/lib/animations';
import { useExport } from '@/hooks/useExport';
import type { ExportColumn } from '@/lib/export';

interface ExportButtonProps<T extends Record<string, unknown>> {
  data: T[];
  columns: ExportColumn[];
  filename: string;
}

export function ExportButton<T extends Record<string, unknown>>({ data, columns, filename }: ExportButtonProps<T>) {
  const [open, setOpen] = useState(false);
  const { exportCSV, exportJSON } = useExport({ data, columns, filename });

  return (
    <div className="relative print:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Download className="w-4 h-4" />
        Export
        <ChevronDown className="w-3 h-3" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute right-0 top-full mt-1 w-44 rounded-lg border bg-popover shadow-lg z-50 py-1"
            >
              <button
                onClick={() => {
                  exportCSV();
                  setOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-green-600" />
                Export CSV
              </button>
              <button
                onClick={() => {
                  exportJSON();
                  setOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors"
              >
                <FileJson className="w-4 h-4 text-blue-600" />
                Export JSON
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
