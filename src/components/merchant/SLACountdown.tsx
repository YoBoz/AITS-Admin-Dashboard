import { useSLACountdown, type UrgencyLevel } from '@/hooks/useSLACountdown';
import { cn } from '@/lib/utils';
import { Clock, AlertTriangle } from 'lucide-react';

interface SLACountdownProps {
  slaBy: string | null;
  active?: boolean;
  totalWindow?: number;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const urgencyColors: Record<UrgencyLevel, string> = {
  ok: 'text-status-success',
  warning: 'text-status-warning',
  critical: 'text-destructive',
};

const urgencyBg: Record<UrgencyLevel, string> = {
  ok: 'bg-status-success/10',
  warning: 'bg-status-warning/10',
  critical: 'bg-destructive/10',
};

const sizeClasses = {
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-sm px-2 py-1',
  lg: 'text-base px-3 py-1.5',
};

function formatTime(seconds: number): string {
  if (seconds <= 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function SLACountdown({
  slaBy,
  active = true,
  totalWindow = 90,
  showIcon = true,
  size = 'md',
  className,
}: SLACountdownProps) {
  const { secondsLeft, isExpired, urgencyLevel } = useSLACountdown({
    slaBy,
    active,
    totalWindow,
  });

  if (!slaBy) return null;

  const Icon = urgencyLevel === 'critical' ? AlertTriangle : Clock;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md font-mono font-semibold',
        urgencyColors[urgencyLevel],
        urgencyBg[urgencyLevel],
        sizeClasses[size],
        urgencyLevel === 'critical' && active && 'animate-pulse',
        className
      )}
    >
      {showIcon && <Icon className="h-3.5 w-3.5" />}
      {isExpired ? 'EXPIRED' : formatTime(secondsLeft)}
    </span>
  );
}
