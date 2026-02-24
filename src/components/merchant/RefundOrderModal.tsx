import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, DollarSign, ShieldAlert, ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useRefundStore } from '@/store/refund.store';
import { useMerchantAuth } from '@/hooks/useMerchantAuth';
import { reasonCodes } from '@/data/mock/reason-codes.mock';
import { REFUND_CONFIG } from '@/types/merchant.types';
import type { Order } from '@/types/order.types';

interface RefundOrderModalProps {
  open: boolean;
  order: Order | null;
  onClose: () => void;
}

/**
 * Modal for refunding a specific order — invoked from OrderCard Refund button.
 * Pre-fills order number, total, and currency from the order object.
 * Enforces:
 * - Partial / Full toggle
 * - Mandatory reason code
 * - Threshold warnings (maxAutoApprove + opsApprovalThreshold + daily limit)
 */
export function RefundOrderModal({ open, order, onClose }: RefundOrderModalProps) {
  const { submitRefund, threshold: opsThreshold, refunds } = useRefundStore();
  const { merchantUser } = useMerchantAuth();

  const [type, setType] = useState<'full' | 'partial'>('full');
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  // Reset form when order changes
  const orderTotal = order?.total ?? 0;
  const effectiveAmount = type === 'full' ? orderTotal : amount;

  // Daily refund count for this user
  const todayRefundCount = useMemo(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    return refunds.filter(
      (r) => r.requestedBy === (merchantUser?.email ?? '') && new Date(r.requestedAt) >= todayStart
    ).length;
  }, [refunds, merchantUser?.email]);

  const selectedReasonCode = reasonCodes.refund_reasons.find((r) => r.code === reason);
  const requiresNotes = selectedReasonCode?.requires_notes ?? false;

  const exceedsAutoApprove = effectiveAmount > REFUND_CONFIG.maxAutoApprove;
  const exceedsOpsThreshold = effectiveAmount > opsThreshold;
  const exceedsDailyLimit = todayRefundCount >= REFUND_CONFIG.dailyLimitManager;
  const willNeedApproval = exceedsOpsThreshold || exceedsAutoApprove || exceedsDailyLimit;

  const canSubmit =
    !!reason &&
    effectiveAmount > 0 &&
    effectiveAmount <= orderTotal &&
    (!requiresNotes || notes.trim().length > 0);

  const handleSubmit = () => {
    if (!order || !canSubmit) return;

    const refund = submitRefund({
      orderId: order.id,
      orderNumber: order.order_number,
      type,
      amount: effectiveAmount,
      orderTotal,
      currency: order.currency,
      reason: selectedReasonCode?.label ?? reason,
      notes: notes.trim() || null,
      requestedBy: merchantUser?.email ?? 'unknown',
    });

    if (refund.status === 'approved') {
      toast.success(`Refund of ${refund.amount} ${order.currency} auto-approved`);
    } else {
      toast.info(`Refund of ${refund.amount} ${order.currency} submitted — awaiting ops approval`);
    }

    handleClose();
  };

  const handleClose = () => {
    setType('full');
    setAmount(0);
    setReason('');
    setNotes('');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && order && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card rounded-xl border border-border shadow-xl p-5 space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold font-montserrat">Refund Order</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  #{order.order_number} · {order.currency} {orderTotal.toFixed(2)}
                </p>
              </div>
              <button onClick={handleClose} className="p-1 rounded-md hover:bg-muted">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Refund Type Toggle */}
            <div className="space-y-1.5">
              <Label className="text-xs">Refund Type</Label>
              <div className="flex gap-2">
                {(['full', 'partial'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setType(t);
                      if (t === 'full') setAmount(orderTotal);
                    }}
                    className={`flex-1 rounded-lg border py-2 text-xs font-medium capitalize transition-all ${
                      type === t
                        ? 'border-brand bg-brand/5 text-brand'
                        : 'border-border hover:border-foreground/20'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Order Total ({order.currency})</Label>
                <Input type="number" value={orderTotal} disabled />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Refund Amount ({order.currency})</Label>
                <Input
                  type="number"
                  min={0}
                  max={orderTotal}
                  value={type === 'full' ? orderTotal : amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  disabled={type === 'full'}
                />
              </div>
            </div>

            {/* Approval warnings */}
            {willNeedApproval && (
              <div className="flex items-start gap-2 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-3">
                <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-[11px] text-amber-700 dark:text-amber-400 space-y-0.5">
                  {exceedsOpsThreshold && (
                    <p>Amount exceeds <b>{opsThreshold} {order.currency}</b> ops threshold.</p>
                  )}
                  {exceedsAutoApprove && !exceedsOpsThreshold && (
                    <p>Amount exceeds <b>{REFUND_CONFIG.maxAutoApprove} {order.currency}</b> auto-approve limit.</p>
                  )}
                  {exceedsDailyLimit && (
                    <p>Daily refund limit reached (<b>{REFUND_CONFIG.dailyLimitManager}</b> per day).</p>
                  )}
                  <p className="font-semibold">This refund will require ops approval.</p>
                </div>
              </div>
            )}

            {/* Reason Code — mandatory */}
            <div className="space-y-1.5">
              <Label className="text-xs">
                Reason <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="flex h-9 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pr-8"
                >
                  <option value="">Select reason...</option>
                  {reasonCodes.refund_reasons.map((r) => (
                    <option key={r.code} value={r.code}>{r.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Notes */}
            {(requiresNotes || notes) && (
              <div className="space-y-1.5">
                <Label className="text-xs">
                  Notes {requiresNotes && <span className="text-destructive">*</span>}
                </Label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Provide details..."
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[60px] resize-none"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button variant="outline" size="sm" onClick={handleClose}>Cancel</Button>
              <Button size="sm" onClick={handleSubmit} disabled={!canSubmit} className="gap-1">
                <DollarSign className="h-3 w-3" /> Submit Refund
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
