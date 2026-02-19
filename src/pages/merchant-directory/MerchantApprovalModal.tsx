// ──────────────────────────────────────
// Merchant Approval Modal — Phase 9
// ──────────────────────────────────────

import { useState } from 'react';
import { FormModal } from '@/components/common/FormModal';
import { Callout } from '@/components/common/Callout';
import { Input } from '@/components/ui/Input';
import type { PendingMerchant } from '@/data/mock/merchant-directory.mock';
import { FileText, Mail, Phone, MapPin, Clock, User, Download } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  merchant: PendingMerchant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MerchantApprovalModal({ merchant, open, onOpenChange }: Props) {
  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null);
  const [notes, setNotes] = useState('');
  const [acceptanceSLA, setAcceptanceSLA] = useState(180);
  const [refundThreshold, setRefundThreshold] = useState(50);

  const handleApprove = () => {
    toast.success(`Approved: ${merchant.company_name}`);
    onOpenChange(false);
  };

  const handleReject = () => {
    if (!notes.trim()) {
      toast.error('Notes are required for rejection');
      return;
    }
    toast.success(`Rejected: ${merchant.company_name}`);
    onOpenChange(false);
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Review Merchant Application"
      size="xl"
      footer={
        <div className="flex justify-end gap-3">
          <button onClick={() => onOpenChange(false)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
          <button onClick={decision === 'approve' ? handleApprove : handleReject} disabled={!decision} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">{decision === 'approve' ? 'Approve Merchant' : decision === 'reject' ? 'Reject Application' : 'Select Decision'}</button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg font-bold flex-shrink-0">
            {merchant.logo_placeholder}
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold">{merchant.company_name}</h3>
            <p className="text-xs text-muted-foreground">{merchant.category}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {merchant.days_pending} days pending</span>
              <span className="flex items-center gap-1"><User className="h-3 w-3" /> {merchant.submitted_by}</span>
            </div>
          </div>
        </div>

        {merchant.days_pending >= 7 && (
          <Callout variant="warning">
            This application has been pending for {merchant.days_pending} days. Expedited review recommended.
          </Callout>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <h4 className="font-semibold text-muted-foreground uppercase text-[10px]">Contact</h4>
            <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-muted-foreground" /> {merchant.contact_email}</div>
            <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground" /> {merchant.contact_phone}</div>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-muted-foreground uppercase text-[10px]">Location</h4>
            <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-muted-foreground" /> {merchant.location_requested}</div>
          </div>
        </div>

        {/* Documents */}
        <div>
          <h4 className="font-semibold text-muted-foreground uppercase text-[10px] mb-2">Submitted Documents</h4>
          <div className="flex flex-wrap gap-2">
            {merchant.documents_submitted.map((doc) => (
              <button
                key={doc}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-muted/50 transition-colors"
              >
                <FileText className="h-3 w-3" /> {doc}
                <Download className="h-3 w-3 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        {merchant.notes && (
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
            <strong>Applicant Notes:</strong> {merchant.notes}
          </div>
        )}

        {/* Decision */}
        <div className="border-t border-border pt-4 space-y-4">
          <h4 className="font-semibold text-sm">Decision</h4>
          <div className="flex gap-3">
            <button
              onClick={() => setDecision('approve')}
              className={`flex-1 py-2.5 rounded-lg border-2 text-xs font-medium transition-colors ${
                decision === 'approve'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400'
                  : 'border-border hover:border-emerald-300'
              }`}
            >
              ✓ Approve
            </button>
            <button
              onClick={() => setDecision('reject')}
              className={`flex-1 py-2.5 rounded-lg border-2 text-xs font-medium transition-colors ${
                decision === 'reject'
                  ? 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'
                  : 'border-border hover:border-red-300'
              }`}
            >
              ✕ Reject
            </button>
          </div>

          {/* SLA Defaults (on approve) */}
          {decision === 'approve' && (
            <div className="space-y-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
              <h4 className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">SLA Defaults</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Acceptance SLA (seconds)</label>
                  <Input type="number" value={acceptanceSLA} onChange={(e) => setAcceptanceSLA(Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Refund Threshold (AED)</label>
                  <Input type="number" value={refundThreshold} onChange={(e) => setRefundThreshold(Number(e.target.value))} />
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Review Notes {decision === 'reject' && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs font-lexend placeholder:text-muted-foreground resize-none"
              placeholder="Add review notes..."
            />
          </div>
        </div>
      </div>
    </FormModal>
  );
}
