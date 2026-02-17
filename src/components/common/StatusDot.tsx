import { cn } from '@/lib/utils';

type StatusType = 'online' | 'offline' | 'warning' | 'charging' | 'maintenance' | 'degraded';

const statusColors: Record<StatusType, string> = {
  online: 'bg-status-success',
  offline: 'bg-gray-400',
  warning: 'bg-status-warning',
  charging: 'bg-status-info',
  maintenance: 'bg-status-warning',
  degraded: 'bg-status-warning',
};

interface StatusDotProps {
  status: StatusType;
  pulse?: boolean;
  className?: string;
}

export function StatusDot({ status, pulse, className }: StatusDotProps) {
  const shouldPulse = pulse ?? status === 'online';

  return (
    <span className={cn('relative flex h-2.5 w-2.5', className)}>
      {shouldPulse && (
        <span
          className={cn(
            'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
            statusColors[status]
          )}
        />
      )}
      <span
        className={cn(
          'relative inline-flex h-2.5 w-2.5 rounded-full',
          statusColors[status]
        )}
      />
    </span>
  );
}
