// ──────────────────────────────────────
// Consent Status Badge — Phase 9
// ──────────────────────────────────────

import { cn } from '@/lib/utils';
import type { ConsentStatus } from '@/types/compliance.types';

const statusConfig: Record<ConsentStatus, { label: string; className: string }> = {
  granted: { label: 'Granted', className: 'bg-green-500/10 text-green-700 dark:text-green-400' },
  declined: { label: 'Declined', className: 'bg-red-500/10 text-red-700 dark:text-red-400' },
  withdrawn: { label: 'Withdrawn', className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400' },
  pending: { label: 'Pending', className: 'bg-gray-500/10 text-gray-700 dark:text-gray-400' },
};

export function ConsentStatusBadge({ status }: { status: ConsentStatus }) {
  const config = statusConfig[status];
  return (
    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize', config.className)}>
      {config.label}
    </span>
  );
}
