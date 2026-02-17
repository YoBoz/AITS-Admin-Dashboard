import { useRef } from 'react';
import { Printer } from 'lucide-react';
import { usePrint } from '@/hooks/usePrint';

interface PrintLayoutProps {
  title?: string;
  children: React.ReactNode;
}

/**
 * Wraps content with a print-triggering button and print-header visible only during print.
 */
export function PrintLayout({ title, children }: PrintLayoutProps) {
  const { print } = usePrint(title);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <button
        onClick={print}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors print:hidden"
        aria-label="Print this page"
      >
        <Printer className="w-4 h-4" />
        Print
      </button>

      <div ref={contentRef}>
        {/* Print header - shown only in print media */}
        <div className="hidden print:block mb-4 pb-3 border-b-2 border-[#BE052E]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#BE052E] flex items-center justify-center">
                <span className="text-white text-xs font-bold">Ai</span>
              </div>
              <span className="font-bold text-sm">Ai-TS Admin Dashboard</span>
            </div>
            <span className="text-xs text-gray-500">{new Date().toLocaleDateString()}</span>
          </div>
          {title && <h1 className="text-lg font-bold mt-2">{title}</h1>}
        </div>

        {children}
      </div>
    </div>
  );
}
