import { useState } from 'react';
import { FormModal } from '@/components/common/FormModal';
import { ReasonCodeSelect } from '@/components/merchant/ReasonCodeSelect';
import { RefundRulesBanner } from '@/components/merchant/RefundRulesBanner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useOrdersStore } from '@/store/orders.store';
import type { Order } from '@/types/order.types';
import { RotateCcw } from 'lucide-react';

interface RefundRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
}

export function RefundRequestModal({ open, onOpenChange, order }: RefundRequestModalProps) {
  const { requestRefund } = useOrdersStore();
  const [amount, setAmount] = useState(order.total.toString());
  const [reasonCode, setReasonCode] = useState('');
  const [notes, setNotes] = useState('');

  const parsedAmount = parseFloat(amount) || 0;
  const isValid = reasonCode && parsedAmount > 0 && parsedAmount <= order.total;

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
            Submit Refund Request
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <RefundRulesBanner
          maxAutoApprove={20}
          dailyLimit={10}
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
