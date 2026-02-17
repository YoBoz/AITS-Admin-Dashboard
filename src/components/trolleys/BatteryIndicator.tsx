import { cn } from '@/lib/utils';
import { Battery, BatteryCharging, BatteryLow, BatteryWarning } from 'lucide-react';

interface BatteryIndicatorProps {
  level: number;
  charging?: boolean;
  showLabel?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export function BatteryIndicator({
  level,
  charging = false,
  showLabel = true,
  className,
  size = 'md',
}: BatteryIndicatorProps) {
  const color =
    level < 20 ? 'text-red-500 bg-red-500' :
    level < 50 ? 'text-amber-500 bg-amber-500' :
    'text-emerald-500 bg-emerald-500';

  const barColor =
    level < 20 ? 'bg-red-500' :
    level < 50 ? 'bg-amber-500' :
    'bg-emerald-500';

  const Icon = charging ? BatteryCharging : level < 20 ? BatteryWarning : level < 50 ? BatteryLow : Battery;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Icon className={cn(
        color.split(' ')[0],
        size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'
      )} />
      <div className={cn(
        'rounded-full bg-muted overflow-hidden',
        size === 'sm' ? 'w-12 h-1.5' : 'w-16 h-2'
      )}>
        <div
          className={cn('h-full rounded-full transition-all', barColor)}
          style={{ width: `${Math.min(level, 100)}%` }}
        />
      </div>
      {showLabel && (
        <span className={cn(
          'font-mono font-semibold',
          color.split(' ')[0],
          size === 'sm' ? 'text-xs' : 'text-sm'
        )}>
          {level}%
        </span>
      )}
    </div>
  );
}
