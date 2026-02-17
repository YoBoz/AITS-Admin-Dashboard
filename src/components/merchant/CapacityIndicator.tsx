import { cn } from '@/lib/utils';
import { useMerchantStore } from '@/store/merchant.store';

interface CapacityIndicatorProps {
  className?: string;
}

export function CapacityIndicator({ className }: CapacityIndicatorProps) {
  const { capacitySettings } = useMerchantStore();
  const { current_queue_length, max_queue_length, avg_prep_time_minutes, is_accepting_orders } =
    capacitySettings;

  const pct = max_queue_length > 0 ? (current_queue_length / max_queue_length) * 100 : 0;
  const isFull = pct >= 100;
  const isHigh = pct >= 75;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Queue bar */}
      <div className="flex flex-col items-end gap-0.5">
        <span className="text-[10px] text-muted-foreground">
          Queue {current_queue_length}/{max_queue_length}
        </span>
        <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              isFull
                ? 'bg-destructive'
                : isHigh
                ? 'bg-status-warning'
                : 'bg-status-success'
            )}
            style={{ width: `${Math.min(100, pct)}%` }}
          />
        </div>
      </div>

      {/* Prep time */}
      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
        ~{avg_prep_time_minutes}m prep
      </span>

      {/* Status dot */}
      <span
        className={cn(
          'h-2 w-2 rounded-full shrink-0',
          is_accepting_orders ? 'bg-status-success' : 'bg-destructive'
        )}
        title={is_accepting_orders ? 'Accepting orders' : 'Not accepting orders'}
      />
    </div>
  );
}
