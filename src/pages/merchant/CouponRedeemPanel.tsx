import { useState } from 'react';
import { FormModal } from '@/components/common/FormModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import type { Coupon } from '@/types/coupon.types';
import { Ticket, Check, XCircle, Search } from 'lucide-react';

interface CouponRedeemPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupons: Coupon[];
}

export function CouponRedeemPanel({ open, onOpenChange, coupons }: CouponRedeemPanelProps) {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<'idle' | 'valid' | 'invalid' | 'expired' | 'depleted'>('idle');
  const [matchedCoupon, setMatchedCoupon] = useState<Coupon | null>(null);

  const handleLookup = () => {
    if (!code.trim()) return;
    const found = coupons.find(
      (c) => c.code.toLowerCase() === code.trim().toLowerCase()
    );
    if (!found) {
      setResult('invalid');
      setMatchedCoupon(null);
      return;
    }
    if (found.status === 'expired') {
      setResult('expired');
      setMatchedCoupon(found);
      return;
    }
    if (found.status === 'depleted') {
      setResult('depleted');
      setMatchedCoupon(found);
      return;
    }
    if (found.status === 'active') {
      setResult('valid');
      setMatchedCoupon(found);
      return;
    }
    setResult('invalid');
    setMatchedCoupon(found);
  };

  const handleRedeem = () => {
    // Mock redemption
    setCode('');
    setResult('idle');
    setMatchedCoupon(null);
    onOpenChange(false);
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Redeem Coupon"
      subtitle="Enter a coupon code to validate and apply"
      size="sm"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {result === 'valid' && (
            <Button onClick={handleRedeem}>
              <Check className="h-4 w-4 mr-1" /> Redeem
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setResult('idle');
              }}
              placeholder="Enter coupon code"
              className="pl-10 font-mono uppercase"
              onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
            />
          </div>
          <Button onClick={handleLookup} disabled={!code.trim()}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Result */}
        {result === 'valid' && matchedCoupon && (
          <div className="rounded-lg border border-status-success/30 bg-status-success/5 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-status-success" />
              <span className="font-semibold text-sm text-foreground">Valid Coupon</span>
            </div>
            <p className="text-xs text-muted-foreground">{matchedCoupon.description}</p>
            <div className="flex items-center gap-2">
              <Badge variant="success" className="text-[10px]">
                {matchedCoupon.type === 'percentage'
                  ? `${matchedCoupon.value}% off`
                  : matchedCoupon.type === 'fixed'
                  ? `AED ${matchedCoupon.value} off`
                  : matchedCoupon.type === 'bogo'
                  ? 'BOGO'
                  : 'Freebie'}
              </Badge>
              <span className="text-[10px] text-muted-foreground">
                {matchedCoupon.used_count}/{matchedCoupon.max_uses ?? '∞'} used
              </span>
            </div>
          </div>
        )}

        {result === 'invalid' && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            <span className="text-sm text-destructive">Invalid coupon code</span>
          </div>
        )}

        {result === 'expired' && (
          <div className="rounded-lg border border-status-warning/30 bg-status-warning/5 p-4 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-status-warning" />
            <span className="text-sm text-status-warning">Coupon has expired</span>
          </div>
        )}

        {result === 'depleted' && (
          <div className="rounded-lg border border-muted-foreground/30 bg-muted/30 p-4 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Coupon fully redeemed</span>
          </div>
        )}
      </div>
    </FormModal>
  );
}
