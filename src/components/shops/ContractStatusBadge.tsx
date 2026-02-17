import { cn } from '@/lib/utils';
import type { Contract } from '@/types/shop.types';

const statusConfig: Record<Contract['status'], { label: string; className: string; icon?: string }> = {
  active: {
    label: 'Active',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  expiring_soon: {
    label: 'Expiring Soon',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    icon: '⚠',
  },
  expired: {
    label: 'Expired',
    className: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  },
  pending_renewal: {
    label: 'Pending Renewal',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
};

interface ContractStatusBadgeProps {
  status: Contract['status'];
  className?: string;
}

export function ContractStatusBadge({ status, className }: ContractStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold font-lexend',
        config.className,
        className
      )}
    >
      {config.icon && <span>{config.icon}</span>}
      {config.label}
    </span>
  );
}
