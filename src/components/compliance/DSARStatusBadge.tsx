// ──────────────────────────────────────
// DSAR Status Badge — Phase 9
// ──────────────────────────────────────

import { cn } from '@/lib/utils';
import { Clock, Search, Loader2, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';
import type { DSARStatus } from '@/types/compliance.types';
import type { LucideIcon } from 'lucide-react';

const statusConfig: Record<DSARStatus, { label: string; className: string; icon: LucideIcon }> = {
  received: { label: 'Received', className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400', icon: Clock },
  verifying: { label: 'Verifying', className: 'bg-purple-500/10 text-purple-700 dark:text-purple-400', icon: Search },
  processing: { label: 'Processing', className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400', icon: Loader2 },
  completed: { label: 'Completed', className: 'bg-green-500/10 text-green-700 dark:text-green-400', icon: CheckCircle2 },
  rejected: { label: 'Rejected', className: 'bg-red-500/10 text-red-700 dark:text-red-400', icon: XCircle },
  withdrawn: { label: 'Withdrawn', className: 'bg-gray-500/10 text-gray-700 dark:text-gray-400', icon: MinusCircle },
};

export function DSARStatusBadge({ status }: { status: DSARStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span className={cn('inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full', config.className)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}
