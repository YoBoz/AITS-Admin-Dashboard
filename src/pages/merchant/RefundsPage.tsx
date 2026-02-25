import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ReceiptText, Plus, Check, X, AlertTriangle, Clock, ChevronDown,
  ShieldCheck, ShieldAlert, DollarSign, FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { RequirePermission } from '@/components/merchant/RequirePermission';
import { useMerchantAuth } from '@/hooks/useMerchantAuth';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { useRefundStore, type RefundRequest } from '@/store/refund.store';
import { reasonCodes } from '@/data/mock/reason-codes.mock';
import { REFUND_CONFIG } from '@/types/merchant.types';

// ─── Status config ────────────────────────────────────────────────────
const STATUS_CFG: Record<RefundRequest['status'], { variant: 'warning' | 'success' | 'destructive'; icon: typeof Clock; label: string }> = {
  pending_approval: { variant: 'warning', icon: Clock, label: 'Pending Approval' },
  approved: { variant: 'success', icon: Check, label: 'Approved' },
  declined: { variant: 'destructive', icon: X, label: 'Declined' },
};

// ─── Request Refund Modal ─────────────────────────────────────────────
function RequestRefundModal({ onClose }: { onClose: () => void }) {
  const { submitRefund, threshold, refunds } = useRefundStore();
  const { merchantUser } = useMerchantAuth();

  const [form, setForm] = useState({
    orderNumber: '',
    type: 'full' as 'full' | 'partial',
    orderTotal: 100,
    amount: 100,
    reason: '',
    notes: '',
  });

  const update = (u: Partial<typeof form>) => setForm((f) => ({ ...f, ...u }));

  // Count today's refunds by this user
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayRefundCount = refunds.filter(
    (r) => r.requestedBy === (merchantUser?.email ?? '') && new Date(r.requestedAt) >= todayStart
  ).length;

  const selectedReasonCode = reasonCodes.refund_reasons.find((r) => r.code === form.reason);
  const requiresNotes = selectedReasonCode?.requires_notes ?? false;

  const exceedsOpsThreshold = form.amount > threshold;
  const exceedsAutoApprove = form.amount > REFUND_CONFIG.maxAutoApprove;
  const exceedsDailyLimit = todayRefundCount >= REFUND_CONFIG.dailyLimitManager;
  const willNeedApproval = exceedsOpsThreshold || exceedsAutoApprove || exceedsDailyLimit;

  const canSubmit = !!form.orderNumber.trim() && !!form.reason && form.amount > 0
    && form.amount <= form.orderTotal
    && (!requiresNotes || form.notes.trim().length > 0);

  const handleSubmit = () => {
    const refund = submitRefund({
      orderId: `ord-${form.orderNumber}`,
      orderNumber: form.orderNumber,
      type: form.type,
      amount: form.amount,
      orderTotal: form.orderTotal,
      currency: 'AED',
      reason: selectedReasonCode?.label ?? form.reason,
      notes: form.notes.trim() || null,
      requestedBy: merchantUser?.email ?? 'unknown',
    });
    if (refund.status === 'approved') {
      toast.success(`Refund of ${refund.amount} AED auto-approved`);
    } else {
      toast.info(`Refund of ${refund.amount} AED submitted for ops approval`);
    }
    onClose();
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-card rounded-xl border border-border shadow-xl p-5 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold font-montserrat">Request Refund</h3>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Order */}
        <div className="space-y-1.5">
          <Label className="text-xs">Order Number</Label>
          <Input
            value={form.orderNumber}
            onChange={(e) => update({ orderNumber: e.target.value })}
            placeholder="e.g. SLP-14"
          />
        </div>

        {/* Type toggle */}
        <div className="space-y-1.5">
          <Label className="text-xs">Refund Type</Label>
          <div className="flex gap-2">
            {(['full', 'partial'] as const).map((t) => (
              <button
                key={t}
                onClick={() => update({ type: t, amount: t === 'full' ? form.orderTotal : form.amount })}
                className={cn(
                  'flex-1 rounded-lg border py-2 text-xs font-medium capitalize transition-all',
                  form.type === t ? 'border-brand bg-brand/5 text-brand' : 'border-border hover:border-foreground/20'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Amounts */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Order Total (AED)</Label>
            <Input
              type="number"
              min={0}
              value={form.orderTotal}
              onChange={(e) => {
                const total = Number(e.target.value);
                update({ orderTotal: total, amount: form.type === 'full' ? total : Math.min(form.amount, total) });
              }}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Refund Amount (AED)</Label>
            <Input
              type="number"
              min={0}
              max={form.orderTotal}
              value={form.amount}
              onChange={(e) => update({ amount: Number(e.target.value) })}
              disabled={form.type === 'full'}
            />
          </div>
        </div>

        {/* Threshold warning */}
        {willNeedApproval && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-3">
            <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-[11px] text-amber-700 dark:text-amber-400 space-y-0.5">
              {exceedsOpsThreshold && (
                <p>Amount exceeds <b>{threshold} AED</b> ops threshold.</p>
              )}
              {exceedsAutoApprove && !exceedsOpsThreshold && (
                <p>Amount exceeds <b>{REFUND_CONFIG.maxAutoApprove} AED</b> auto-approve limit.</p>
              )}
              {exceedsDailyLimit && (
                <p>Daily refund limit reached (<b>{REFUND_CONFIG.dailyLimitManager}</b> per day).</p>
              )}
              <p className="font-semibold">This refund will require ops approval.</p>
            </div>
          </div>
        )}

        {/* Reason */}
        <div className="space-y-1.5">
          <Label className="text-xs">Reason</Label>
          <div className="relative">
            <select
              value={form.reason}
              onChange={(e) => update({ reason: e.target.value })}
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
        {(requiresNotes || form.notes) && (
          <div className="space-y-1.5">
            <Label className="text-xs">
              Notes {requiresNotes && <span className="text-destructive">*</span>}
            </Label>
            <textarea
              value={form.notes}
              onChange={(e) => update({ notes: e.target.value })}
              placeholder="Provide details..."
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[60px] resize-none"
            />
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit} disabled={!canSubmit} className="gap-1">
            <DollarSign className="h-3 w-3" /> Submit Refund
          </Button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

// ─── Main Page ────────────────────────────────────────────────────────
export default function RefundsPage() {
  const { refunds, threshold, approveRefund, declineRefund } = useRefundStore();
  const { merchantUser, canDo } = useMerchantAuth();
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<'all' | RefundRequest['status']>('all');

  const canApprove = canDo('refunds.request') && (merchantUser?.merchant_role === 'developer');

  const filtered = useMemo(
    () => filter === 'all' ? refunds : refunds.filter((r) => r.status === filter),
    [refunds, filter]
  );

  const pendingCount = refunds.filter((r) => r.status === 'pending_approval').length;

  const handleApprove = (id: string) => {
    approveRefund(id, merchantUser?.email ?? 'ops');
    toast.success('Refund approved');
  };

  const handleDecline = (id: string) => {
    declineRefund(id, merchantUser?.email ?? 'ops');
    toast.info('Refund declined');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-foreground">Refunds</h1>
          <p className="text-xs text-muted-foreground font-lexend mt-0.5">
            Request and manage customer refunds &middot; Auto-approve ≤ {threshold} AED
          </p>
        </div>
        <RequirePermission permission="refunds.request" disableInstead>
          <Button size="sm" onClick={() => setShowModal(true)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Request Refund
          </Button>
        </RequirePermission>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {(['all', 'pending_approval', 'approved', 'declined'] as const).map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-all relative',
              filter === key ? 'bg-brand text-white' : 'bg-muted text-muted-foreground hover:text-foreground'
            )}
          >
            {key === 'all' ? 'All' : key === 'pending_approval' ? 'Pending' : key === 'approved' ? 'Approved' : 'Declined'}
            {key === 'pending_approval' && pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-500 text-white text-[9px] flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Refund list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <Card>
            <CardContent className="p-10 text-center">
              <ReceiptText className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No refunds found.</p>
            </CardContent>
          </Card>
        )}

        {filtered.map((refund) => {
          const sc = STATUS_CFG[refund.status];
          const StatusIcon = sc.icon;
          return (
            <Card key={refund.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3">
                  {/* Left: icon + info + actions */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-lg shrink-0',
                      refund.status === 'approved' ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600' :
                      refund.status === 'pending_approval' ? 'bg-amber-100 dark:bg-amber-950/30 text-amber-600' :
                      'bg-red-100 dark:bg-red-950/30 text-red-600'
                    )}>
                      <StatusIcon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold font-montserrat">{refund.orderNumber}</span>
                        <Badge variant={sc.variant} className="text-[9px] px-1.5 py-0">{sc.label}</Badge>
                        <Badge variant="secondary" className="text-[9px] px-1.5 py-0 capitalize">{refund.type}</Badge>
                        {refund.status === 'pending_approval' && !canApprove && (
                          <span className="flex items-center gap-1 text-[10px] text-amber-500">
                            <AlertTriangle className="h-3 w-3" /> Awaiting Ops
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground">{refund.reason}</p>
                      {refund.notes && (
                        <p className="text-[10px] text-muted-foreground/70 flex items-center gap-1 mt-0.5">
                          <FileText className="h-2.5 w-2.5" /> {refund.notes}
                        </p>
                      )}
                    </div>
                    {/* Approve / Decline buttons inline */}
                    {refund.status === 'pending_approval' && canApprove && (
                      <div className="flex items-center gap-1.5 shrink-0 ml-1">
                        <Button
                          size="sm"
                          variant="default"
                          className="gap-1 text-xs h-7"
                          onClick={() => handleApprove(refund.id)}
                        >
                          <ShieldCheck className="h-3 w-3" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-xs h-7 text-destructive hover:text-destructive"
                          onClick={() => handleDecline(refund.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Right: amount */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold font-montserrat">{refund.amount} {refund.currency}</p>
                    <p className="text-[10px] text-muted-foreground">
                      of {refund.orderTotal} {refund.currency}
                    </p>
                  </div>
                </div>

                {/* Meta line */}
                <div className="mt-2 pt-2 border-t border-border flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
                  <span>Requested by {refund.requestedBy}</span>
                  <span>{new Date(refund.requestedAt).toLocaleString()}</span>
                  {refund.reviewedBy && (
                    <span>Reviewed by {refund.reviewedBy} · {new Date(refund.reviewedAt!).toLocaleString()}</span>
                  )}
                  {refund.requiresOpsApproval && (
                    <span className="text-amber-500 flex items-center gap-0.5">
                      <ShieldAlert className="h-2.5 w-2.5" /> Requires ops approval (&gt;{threshold} AED)
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Refund Modal */}
      <AnimatePresence>
        {showModal && <RequestRefundModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </div>
  );
}
