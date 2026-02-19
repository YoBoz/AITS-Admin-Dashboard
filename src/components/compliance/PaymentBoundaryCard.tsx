// ──────────────────────────────────────
// Payment Boundary Card — Phase 9
// ──────────────────────────────────────

import { Lock, Unlock } from 'lucide-react';
import { Switch } from '@/components/ui/Switch';
import { cn } from '@/lib/utils';
import type { PaymentComplianceBoundary } from '@/types/compliance.types';

const typeLabels: Record<PaymentComplianceBoundary['type'], string> = {
  tokenization_requirement: 'Tokenization',
  refund_limit: 'Refund Limit',
  currency_restriction: 'Currency',
  transaction_cap: 'Transaction Cap',
};

const typeColors: Record<PaymentComplianceBoundary['type'], string> = {
  tokenization_requirement: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  refund_limit: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  currency_restriction: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  transaction_cap: 'bg-green-500/10 text-green-700 dark:text-green-400',
};

const scopeColors: Record<string, string> = {
  global: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
  per_merchant: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400',
  per_session: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400',
};

interface Props {
  boundary: PaymentComplianceBoundary;
  isSuperAdmin?: boolean;
  onToggle?: (id: string, active: boolean) => void;
}

export function PaymentBoundaryCard({ boundary, isSuperAdmin, onToggle }: Props) {
  const isReadOnly = boundary.type === 'tokenization_requirement' || boundary.type === 'currency_restriction';

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={cn('p-2 rounded-lg', isReadOnly ? 'bg-muted' : 'bg-primary/10')}>
          {isReadOnly ? <Lock className="h-4 w-4 text-muted-foreground" /> : <Unlock className="h-4 w-4 text-primary" />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold font-lexend text-foreground">{boundary.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', typeColors[boundary.type])}>
              {typeLabels[boundary.type]}
            </span>
            <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize', scopeColors[boundary.scope] || 'bg-gray-500/10')}>
              {boundary.scope.replace('_', ' ')}
            </span>
          </div>
        </div>
        {!isReadOnly && isSuperAdmin && onToggle && (
          <Switch
            checked={boundary.is_active}
            onCheckedChange={(checked) => onToggle(boundary.id, checked)}
          />
        )}
        {isReadOnly && (
          <span className="text-[10px] text-muted-foreground italic flex items-center gap-1">
            <Lock className="h-3 w-3" /> Read-only
          </span>
        )}
      </div>

      {/* Value */}
      {boundary.value !== null && (
        <div className="text-2xl font-bold font-poppins text-foreground">
          {boundary.currency && <span className="text-sm font-normal text-muted-foreground mr-1">{boundary.currency}</span>}
          {boundary.value}
        </div>
      )}

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed">{boundary.description}</p>

      {/* Footer */}
      <div className="flex items-center gap-2 pt-2 border-t border-border/50 text-[10px] text-muted-foreground">
        <span>Updated by <strong>{boundary.updated_by}</strong></span>
        <span>•</span>
        <span>{new Date(boundary.last_updated).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
