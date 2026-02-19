// ──────────────────────────────────────
// Payment Compliance Tab — Phase 9 (S-04)
// ──────────────────────────────────────

import { useComplianceStore } from '@/store/compliance.store';
import { PaymentBoundaryCard } from '@/components/compliance/PaymentBoundaryCard';
import { toast } from 'sonner';

export default function PaymentComplianceTab() {
  const { paymentBoundaries, updatePaymentBoundary } = useComplianceStore();

  const handleToggle = (id: string, active: boolean) => {
    updatePaymentBoundary(id, { is_active: active, updated_by: 'Current Admin' });
    toast.success(`Payment boundary ${active ? 'activated' : 'deactivated'}.`);
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold font-lexend mb-1">Payment Compliance Boundaries</h3>
        <p className="text-xs text-muted-foreground">
          Tokenization requirements, refund controls, transaction caps, and currency restrictions that govern payment processing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentBoundaries.map((boundary) => (
          <PaymentBoundaryCard
            key={boundary.id}
            boundary={boundary}
            isSuperAdmin={true}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  );
}
