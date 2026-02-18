// ──────────────────────────────────────
// Gate Surge Alert Component — Phase 8
// ──────────────────────────────────────

import { useState } from 'react';
import { AlertTriangle, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import type { Gate } from '@/types/venue.types';

interface GateSurgeAlertProps {
  surgeGates: Gate[];
  onGateClick?: (gate: Gate) => void;
  className?: string;
}

export function GateSurgeAlert({ surgeGates, onGateClick, className }: GateSurgeAlertProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (surgeGates.length === 0 || isDismissed) return null;

  return (
    <div
      className={cn(
        'rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 p-4',
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200">
            Gate Surge Detected
          </h3>
          <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
            {surgeGates.length === 1
              ? '1 gate is experiencing high passenger volume'
              : `${surgeGates.length} gates are experiencing high passenger volume`}
          </p>

          {/* Gate Chips */}
          <div className="mt-2 flex flex-wrap gap-2">
            {surgeGates.map((gate) => (
              <button
                key={gate.id}
                onClick={() => onGateClick?.(gate)}
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-xs font-medium hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors"
              >
                <span className="font-semibold">Gate {gate.name}</span>
                <Badge variant="secondary" className="h-4 text-[10px] px-1">
                  {gate.passenger_count_estimate}
                </Badge>
                <ChevronRight className="h-3 w-3" />
              </button>
            ))}
          </div>
        </div>

        {/* Dismiss */}
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200"
          onClick={() => setIsDismissed(true)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
