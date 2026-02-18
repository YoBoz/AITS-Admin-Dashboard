import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { reasonCodes } from '@/data/mock/reason-codes.mock';

interface RejectOrderModalProps {
  open: boolean;
  orderNumber: string;
  onClose: () => void;
  onConfirm: (reasonCode: string, notes: string | null) => void;
  isLoading?: boolean;
}

const REJECT_REASONS = reasonCodes.merchant_reject;

export function RejectOrderModal({
  open, orderNumber, onClose, onConfirm, isLoading = false,
}: RejectOrderModalProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [notes, setNotes] = useState('');

  const reason = REJECT_REASONS.find((r) => r.code === selectedReason);
  const needsNotes = reason?.requires_notes ?? false;
  const canSubmit = selectedReason && (!needsNotes || notes.trim().length > 0);

  const handleConfirm = () => {
    if (!canSubmit) return;
    onConfirm(selectedReason, notes.trim() || null);
    setSelectedReason('');
    setNotes('');
  };

  const handleClose = () => {
    setSelectedReason('');
    setNotes('');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md rounded-xl border bg-card shadow-xl" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-montserrat">Reject Order</h3>
                    <p className="text-[10px] text-muted-foreground font-mono">#{orderNumber}</p>
                  </div>
                </div>
                <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              <div className="px-5 py-4 space-y-4">
                <div>
                  <Label className="text-xs font-semibold mb-2 block">Reason *</Label>
                  <div className="space-y-1.5">
                    {REJECT_REASONS.map((r) => (
                      <button
                        key={r.code}
                        onClick={() => setSelectedReason(r.code)}
                        className={`w-full flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm text-left transition-colors ${
                          selectedReason === r.code
                            ? 'border-brand bg-brand/5 text-brand font-medium'
                            : 'border-border hover:bg-muted text-foreground'
                        }`}
                      >
                        <div className={`h-3.5 w-3.5 rounded-full border-2 shrink-0 ${
                          selectedReason === r.code
                            ? 'border-brand bg-brand'
                            : 'border-muted-foreground'
                        }`} />
                        <span className="font-lexend">{r.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-semibold mb-2 block">
                    Notes {needsNotes ? '*' : '(optional)'}
                  </Label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add additional details..."
                    rows={3}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-lexend placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand resize-none"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border">
                <Button variant="outline" size="sm" onClick={handleClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleConfirm}
                  disabled={!canSubmit || isLoading}
                  className="gap-1"
                >
                  {isLoading ? 'Rejecting...' : 'Reject Order'}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
