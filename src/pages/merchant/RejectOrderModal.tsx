import { useState } from 'react';
import { FormModal } from '@/components/common/FormModal';
import { ReasonCodeSelect } from '@/components/merchant/ReasonCodeSelect';
import { Button } from '@/components/ui/Button';
import { useOrdersStore } from '@/store/orders.store';
import { XCircle } from 'lucide-react';

interface RejectOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  orderReference: string;
}

export function RejectOrderModal({
  open,
  onOpenChange,
  orderId,
  orderReference,
}: RejectOrderModalProps) {
  const { rejectOrder } = useOrdersStore();
  const [reasonCode, setReasonCode] = useState('');
  const [notes, setNotes] = useState('');

  const handleConfirm = () => {
    if (!reasonCode) return;
    rejectOrder(orderId, reasonCode, notes || null);
    setReasonCode('');
    setNotes('');
    onOpenChange(false);
  };

  const handleCancel = () => {
    setReasonCode('');
    setNotes('');
    onOpenChange(false);
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Reject Order"
      subtitle={`Order ${orderReference} will be rejected and the customer notified.`}
      size="sm"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={!reasonCode}>
            <XCircle className="h-4 w-4 mr-1" />
            Reject Order
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Reason</label>
          <ReasonCodeSelect
            category="merchant_reject"
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
