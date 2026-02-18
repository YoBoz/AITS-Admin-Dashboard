import { useState } from 'react';
import { FormModal } from '@/components/common/FormModal';
import { ReasonCodeSelect } from '@/components/merchant/ReasonCodeSelect';
import { RefundRulesBanner } from '@/components/merchant/RefundRulesBanner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { useOrdersStore } from '@/store/orders.store';
import { useMerchantAuth } from '@/hooks/useMerchantAuth';
import { REFUND_CONFIG } from '@/types/merchant.types';
import type { Order } from '@/types/order.types';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface RefundRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
}

export function RefundRequestModal({ open, onOpenChange, order }: RefundRequestModalProps) {
  const { requestRefund } = useOrdersStore();
  const { merchantRole } = useMerchantAuth();
  const [amount, setAmount] = useState(order.total.toString());
  const [reasonCode, setReasonCode] = useState('');
  const [notes, setNotes] = useState('');

  const parsedAmount = parseFloat(amount) || 0;
  const isValid = reasonCode && parsedAmount > 0 && parsedAmount <= order.total;
  
  // Check if ops approval is required
  const requiresOpsApproval = parsedAmount > REFUND_CONFIG.opsApprovalThreshold;
  const isAutoApproved = parsedAmount <= REFUND_CONFIG.maxAutoApprove;

  const handleConfirm = () => {
    if (!isValid) return;
    requestRefund(
      order.id,
      parsedAmount,
      reasonCode,
      notes || null
    );
    setReasonCode('');
    setNotes('');
    setAmount(order.total.toString());
    onOpenChange(false);
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Request Refund"
      subtitle={`Order ${order.order_number} — AED ${order.total.toFixed(2)}`}
      size="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!isValid}>
            <RotateCcw className="h-4 w-4 mr-1" />
            {requiresOpsApproval ? 'Submit for Approval' : 'Submit Refund Request'}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Ops Approval Warning */}
        {requiresOpsApproval && (
          <div className="flex items-start gap-2 rounded-lg border border-status-warning/50 bg-status-warning/5 p-3">
            <AlertTriangle className="h-4 w-4 text-status-warning mt-0.5" />
            <div className="text-xs">
              <p className="font-medium text-foreground">Operations Approval Required</p>
              <p className="text-muted-foreground mt-0.5">
                Refunds above AED {REFUND_CONFIG.opsApprovalThreshold} require ops team approval.
              </p>
            </div>
          </div>
        )}
        
        <RefundRulesBanner
          maxAutoApprove={REFUND_CONFIG.maxAutoApprove}
          dailyLimit={REFUND_CONFIG.dailyLimitManager}
          todayTotal={3}
        />

        <div className="space-y-2">
          <Label>Refund Amount (AED)</Label>
          <Input
            type="number"
            min="0"
            max={order.total}
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {parsedAmount > order.total && (
            <p className="text-xs text-destructive">Cannot exceed order total</p>
          )}
        </div>

        <div>
          <Label className="mb-2 block">Reason</Label>
          <ReasonCodeSelect
            category="refund_reasons"
            value={reasonCode}
            onChange={setReasonCode}
            notes={notes}
            onNotesChange={setNotes}
          />
        </div>
      </div>
    </FormModal>
  );
}
