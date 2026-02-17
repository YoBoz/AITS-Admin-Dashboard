import { useMemo } from 'react';
import { format, differenceInDays, isAfter, isBefore } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Contract } from '@/types/shop.types';

interface ContractTimelineProps {
  startDate: string;
  endDate: string;
  status: Contract['status'];
}

export function ContractTimeline({ startDate, endDate, status }: ContractTimelineProps) {
  const { progress, daysRemaining, totalDays, daysPassed, isExpired, isUpcoming } =
    useMemo(() => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const now = new Date();

      const total = differenceInDays(end, start);
      const passed = differenceInDays(now, start);
      const remaining = differenceInDays(end, now);
      const pct = total > 0 ? Math.min(100, Math.max(0, (passed / total) * 100)) : 0;

      return {
        progress: pct,
        daysRemaining: remaining,
        totalDays: total,
        daysPassed: Math.max(0, passed),
        isExpired: isAfter(now, end),
        isUpcoming: isBefore(now, start),
      };
    }, [startDate, endDate]);

  const barColor = (() => {
    if (isExpired) return 'bg-red-500';
    if (status === 'expiring_soon') return 'bg-amber-500';
    if (status === 'pending_renewal') return 'bg-blue-500';
    return 'bg-green-500';
  })();

  const statusText = (() => {
    if (isExpired) return 'Expired';
    if (isUpcoming) return 'Not yet started';
    if (status === 'expiring_soon') return `${daysRemaining} days remaining`;
    if (status === 'pending_renewal') return 'Pending renewal';
    return `${daysRemaining} days remaining`;
  })();

  return (
    <div className="space-y-4 py-2">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{format(new Date(startDate), 'MMM dd, yyyy')}</span>
          <span>{format(new Date(endDate), 'MMM dd, yyyy')}</span>
        </div>
        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-500', barColor)}
            style={{ width: `${progress}%` }}
          />
          {/* Today marker */}
          {!isExpired && !isUpcoming && (
            <div
              className="absolute top-0 w-0.5 h-full bg-foreground/70"
              style={{ left: `${progress}%` }}
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-foreground whitespace-nowrap bg-card px-1 rounded border border-border">
                Today
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Timeline segments visual */}
      <div className="flex items-center gap-0">
        {/* Past segment */}
        <div
          className="h-1.5 rounded-l-full bg-muted-foreground/30"
          style={{ width: `${progress}%`, minWidth: progress > 0 ? 4 : 0 }}
        />
        {/* Active/future segment */}
        <div
          className={cn(
            'h-1.5 rounded-r-full',
            isExpired ? 'bg-red-500/20' : 'bg-green-500/30'
          )}
          style={{ width: `${100 - progress}%`, minWidth: progress < 100 ? 4 : 0 }}
        />
      </div>

      {/* Details row */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-2 rounded-lg bg-muted/50">
          <p className="text-lg font-bold font-mono">{totalDays}</p>
          <p className="text-[10px] text-muted-foreground">Total Days</p>
        </div>
        <div className="p-2 rounded-lg bg-muted/50">
          <p className="text-lg font-bold font-mono">{daysPassed}</p>
          <p className="text-[10px] text-muted-foreground">Days Passed</p>
        </div>
        <div className="p-2 rounded-lg bg-muted/50">
          <p
            className={cn(
              'text-lg font-bold font-mono',
              daysRemaining <= 30 && !isExpired && 'text-amber-500',
              isExpired && 'text-red-500'
            )}
          >
            {isExpired ? 0 : Math.max(0, daysRemaining)}
          </p>
          <p className="text-[10px] text-muted-foreground">Days Left</p>
        </div>
      </div>

      {/* Status text */}
      <div className="flex items-center justify-center gap-2">
        <span
          className={cn('h-2 w-2 rounded-full', barColor)}
        />
        <span className="text-xs font-medium text-muted-foreground">
          {statusText}
        </span>
        <span className="text-xs text-muted-foreground">
          ({Math.round(progress)}% complete)
        </span>
      </div>
    </div>
  );
}
