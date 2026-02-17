import { cn } from '@/lib/utils';
import type { TrolleyStatus } from '@/types/trolley.types';

const statusConfig: Record<TrolleyStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  idle: { label: 'Idle', className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  charging: { label: 'Charging', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  maintenance: { label: 'Maintenance', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  offline: { label: 'Offline', className: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
};

interface TrolleyStatusBadgeProps {
  status: TrolleyStatus;
  className?: string;
}

export function TrolleyStatusBadge({ status, className }: TrolleyStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold font-lexend',
        config.className,
        className
      )}
    >
      <span className={cn(
        'h-1.5 w-1.5 rounded-full',
        status === 'active' && 'bg-emerald-500 animate-pulse',
        status === 'idle' && 'bg-gray-400',
        status === 'charging' && 'bg-blue-500 animate-pulse',
        status === 'maintenance' && 'bg-amber-500',
        status === 'offline' && 'bg-red-500',
      )} />
      {config.label}
    </span>
  );
}
