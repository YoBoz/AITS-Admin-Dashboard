// ──────────────────────────────────────
// Merchant Approval Card — Phase 9
// ──────────────────────────────────────

import type { PendingMerchant } from '@/data/mock/merchant-directory.mock';
import { FileText, Clock, Mail, AlertTriangle } from 'lucide-react';

interface Props {
  merchant: PendingMerchant;
  onReview: (merchant: PendingMerchant) => void;
}

export function MerchantApprovalCard({ merchant, onReview }: Props) {
  const urgencyColor =
    merchant.days_pending >= 7 ? 'text-red-600 dark:text-red-400' :
    merchant.days_pending >= 5 ? 'text-amber-600 dark:text-amber-400' :
    'text-muted-foreground';

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold flex-shrink-0">
          {merchant.logo_placeholder}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold truncate">{merchant.company_name}</h3>
          <p className="text-xs text-muted-foreground">{merchant.category}</p>
        </div>
        {merchant.days_pending >= 7 && (
          <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
        )}
      </div>

      {/* Details */}
      <div className="space-y-1.5 text-xs text-muted-foreground">
        <p className="truncate">{merchant.location_requested}</p>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3 w-3" />
          <span className={urgencyColor}>
            {merchant.days_pending} days pending
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <FileText className="h-3 w-3" />
          <span>{merchant.documents_submitted.length} documents</span>
        </div>
      </div>

      {/* Contact */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {merchant.submitted_by}</span>
      </div>

      {/* Notes */}
      {merchant.notes && (
        <p className="text-xs text-amber-600 dark:text-amber-400 italic line-clamp-2">{merchant.notes}</p>
      )}

      {/* Action */}
      <button
        onClick={() => onReview(merchant)}
        className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
      >
        Review Application
      </button>
    </div>
  );
}
