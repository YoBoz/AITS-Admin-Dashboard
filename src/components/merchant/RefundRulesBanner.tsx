import { cn } from '@/lib/utils';
import { AlertTriangle, Info } from 'lucide-react';

interface RefundRulesBannerProps {
  maxAutoApprove: number;
  dailyLimit: number;
  todayTotal: number;
  className?: string;
}

export function RefundRulesBanner({
  maxAutoApprove,
  dailyLimit,
  todayTotal,
  className,
}: RefundRulesBannerProps) {
  const remaining = dailyLimit - todayTotal;
  const isNearLimit = remaining <= 3;
  const isOverLimit = remaining <= 0;

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border p-3',
        isOverLimit
          ? 'border-destructive/50 bg-destructive/5'
          : isNearLimit
          ? 'border-status-warning/50 bg-status-warning/5'
          : 'border-border bg-muted/30',
        className
      )}
    >
      {isOverLimit || isNearLimit ? (
        <AlertTriangle
          className={cn(
            'h-5 w-5 shrink-0 mt-0.5',
            isOverLimit ? 'text-destructive' : 'text-status-warning'
          )}
        />
      ) : (
        <Info className="h-5 w-5 shrink-0 mt-0.5 text-muted-foreground" />
      )}

      <div className="flex-1 text-sm">
        <p className="font-medium text-foreground">Refund Policies</p>
        <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
          <li>
            Auto-approve refunds up to{' '}
            <span className="font-semibold text-foreground">AED {maxAutoApprove}</span>
          </li>
          <li>
            Daily limit:{' '}
            <span className={cn('font-semibold', isOverLimit ? 'text-destructive' : 'text-foreground')}>
              {todayTotal} / {dailyLimit}
            </span>
            {isOverLimit && ' — Limit reached'}
          </li>
          <li>Higher amounts require manager approval</li>
        </ul>
      </div>
    </div>
  );
}
