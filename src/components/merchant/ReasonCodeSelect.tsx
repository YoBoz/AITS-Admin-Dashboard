import { useState } from 'react';
import { cn } from '@/lib/utils';
import { reasonCodes, type ReasonCodeType, type ReasonCode } from '@/data/mock/reason-codes.mock';
import { ChevronDown } from 'lucide-react';

interface ReasonCodeSelectProps {
  category: ReasonCodeType;
  value: string;
  onChange: (code: string) => void;
  onNotesChange?: (notes: string) => void;
  notes?: string;
  className?: string;
}

export function ReasonCodeSelect({
  category,
  value,
  onChange,
  onNotesChange,
  notes = '',
  className,
}: ReasonCodeSelectProps) {
  const codes = reasonCodes[category] ?? [];
  const selected = codes.find((c: ReasonCode) => c.code === value);
  const [open, setOpen] = useState(false);

  return (
    <div className={cn('space-y-2', className)}>
      {/* Select */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            'flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            !value && 'text-muted-foreground'
          )}
        >
          <span>{selected ? selected.label : 'Select a reason...'}</span>
          <ChevronDown
            className={cn('h-4 w-4 text-muted-foreground transition-transform', open && 'rotate-180')}
          />
        </button>

        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-card shadow-lg">
            <ul className="max-h-48 overflow-y-auto py-1">
              {codes.map((code: ReasonCode) => (
                <li key={code.code}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(code.code);
                      setOpen(false);
                    }}
                    className={cn(
                      'w-full px-3 py-2 text-left text-sm hover:bg-muted/50 transition-colors',
                      code.code === value && 'bg-muted font-medium'
                    )}
                  >
                    {code.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Notes textarea if required */}
      {selected?.requires_notes && (
        <textarea
          value={notes}
          onChange={(e) => onNotesChange?.(e.target.value)}
          placeholder="Additional notes (required)..."
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
        />
      )}
    </div>
  );
}
