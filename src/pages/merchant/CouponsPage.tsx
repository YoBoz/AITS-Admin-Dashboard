import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, CheckCircle2, XCircle, AlertTriangle, Clock, QrCode, Loader2,
  Tag, Percent, Gift, ShoppingBag, Plus, Pencil, Trash2, Pause, Play, X,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { RequirePermission } from '@/components/merchant/RequirePermission';
import { useMerchantAuth } from '@/hooks/useMerchantAuth';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import { Badge } from '@/components/ui/Badge';
import { useCouponStore, type CouponValidationStatus } from '@/store/coupon.store';
import type { Coupon } from '@/types/coupon.types';

// ─── Validation status config ─────────────────────────────────────────
const STATUS_CONFIG: Record<Exclude<CouponValidationStatus, 'idle'>, {
  icon: typeof CheckCircle2;
  color: string;
  bg: string;
  border: string;
}> = {
  valid: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-800' },
  expired: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800' },
  invalid: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-800' },
  depleted: { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-800' },
};

const TYPE_ICONS = {
  percentage: Percent,
  fixed: Tag,
  bogo: ShoppingBag,
  freebie: Gift,
};

// ─── Coupon Create/Edit Modal ─────────────────────────────────────────
interface CouponModalProps {
  open: boolean;
  editCoupon?: Coupon | null;
  onClose: () => void;
}

function CouponModal({ open, editCoupon, onClose }: CouponModalProps) {
  const { addCoupon, updateCoupon } = useCouponStore();
  const isEdit = !!editCoupon;

  const [code, setCode] = useState(editCoupon?.code ?? '');
  const [description, setDescription] = useState(editCoupon?.description ?? '');
  const [type, setType] = useState<Coupon['type']>(editCoupon?.type ?? 'percentage');
  const [value, setValue] = useState(editCoupon?.value?.toString() ?? '');
  const [minOrder, setMinOrder] = useState(editCoupon?.min_order_value?.toString() ?? '');
  const [maxUses, setMaxUses] = useState(editCoupon?.max_uses?.toString() ?? '');
  const [validFrom, setValidFrom] = useState(editCoupon?.valid_from?.slice(0, 10) ?? new Date().toISOString().slice(0, 10));
  const [validTo, setValidTo] = useState(editCoupon?.valid_to?.slice(0, 10) ?? '');
  const [stackingAllowed, setStackingAllowed] = useState(editCoupon?.stacking_allowed ?? false);

  const handleSubmit = () => {
    const trimmedCode = code.trim().toUpperCase();
    if (!trimmedCode) { toast.error('Coupon code is required'); return; }
    if (type !== 'bogo' && type !== 'freebie') {
      const v = parseFloat(value);
      if (isNaN(v) || v <= 0) { toast.error('Enter a valid discount value'); return; }
    }
    if (!validTo) { toast.error('Expiry date is required'); return; }

    const data = {
      code: trimmedCode,
      description: description.trim(),
      type,
      value: type === 'bogo' || type === 'freebie' ? 0 : parseFloat(value),
      min_order_value: minOrder ? parseFloat(minOrder) : null,
      max_uses: maxUses ? parseInt(maxUses, 10) : null,
      valid_from: new Date(validFrom).toISOString(),
      valid_to: new Date(validTo + 'T23:59:59').toISOString(),
      status: 'active' as const,
      stacking_allowed: stackingAllowed,
      campaign_id: editCoupon?.campaign_id ?? null,
    };

    if (isEdit && editCoupon) {
      updateCoupon(editCoupon.id, data);
      toast.success(`Coupon "${trimmedCode}" updated`);
    } else {
      addCoupon(data);
      toast.success(`Coupon "${trimmedCode}" created`);
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative z-10 w-full max-w-md rounded-xl bg-card border border-border shadow-xl p-6 mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold font-montserrat">
            {isEdit ? 'Edit Coupon' : 'Create Coupon'}
          </h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-muted transition-colors">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Code */}
          <div className="space-y-1.5">
            <Label className="text-xs">Coupon Code *</Label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. SUMMER20"
              className="font-mono uppercase tracking-wider"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-xs">Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. 20% off summer drinks" />
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <Label className="text-xs">Discount Type *</Label>
            <div className="grid grid-cols-4 gap-1.5">
              {([
                { value: 'percentage', label: '%', title: 'Percentage' },
                { value: 'fixed', label: 'AED', title: 'Fixed Amount' },
                { value: 'bogo', label: 'BOGO', title: 'Buy One Get One' },
                { value: 'freebie', label: 'Free', title: 'Freebie' },
              ] as const).map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  title={t.title}
                  className={cn(
                    'rounded-lg border py-2 text-xs font-semibold transition-colors',
                    type === t.value
                      ? 'border-brand bg-brand/10 text-brand'
                      : 'border-border text-muted-foreground hover:border-foreground/30'
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Value (for percentage/fixed) */}
          {(type === 'percentage' || type === 'fixed') && (
            <div className="space-y-1.5">
              <Label className="text-xs">
                {type === 'percentage' ? 'Discount %' : 'Discount Amount (AED)'} *
              </Label>
              <Input type="number" min={0} step={type === 'percentage' ? 1 : 0.5} value={value} onChange={(e) => setValue(e.target.value)} />
            </div>
          )}

          {/* Min order + Max uses */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Min Order (AED)</Label>
              <Input type="number" min={0} step={1} value={minOrder} onChange={(e) => setMinOrder(e.target.value)} placeholder="None" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Max Uses</Label>
              <Input type="number" min={1} step={1} value={maxUses} onChange={(e) => setMaxUses(e.target.value)} placeholder="Unlimited" />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Valid From</Label>
              <Input type="date" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Valid To *</Label>
              <Input type="date" value={validTo} onChange={(e) => setValidTo(e.target.value)} />
            </div>
          </div>

          {/* Stacking */}
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-xs font-medium">Allow Stacking</p>
              <p className="text-[10px] text-muted-foreground">Can be combined with other coupons</p>
            </div>
            <Switch checked={stackingAllowed} onCheckedChange={setStackingAllowed} />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit}>
            {isEdit ? 'Update' : 'Create Coupon'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────
export default function CouponsPage() {
  const { coupons, validationResult, isValidating, validateCode, resetValidation, redeemCoupon, deleteCoupon, toggleCouponStatus } = useCouponStore();
  const { canDo } = useMerchantAuth();
  const canCreate = canDo('coupons.create');
  const [code, setCode] = useState('');
  const [couponModal, setCouponModal] = useState<{ open: boolean; editCoupon?: Coupon | null }>({ open: false, editCoupon: null });

  const handleValidate = () => {
    if (!code.trim()) return;
    validateCode(code);
  };

  const handleRedeem = () => {
    if (validationResult.coupon) {
      redeemCoupon(validationResult.coupon.id);
      toast.success(`Coupon "${validationResult.coupon.code}" redeemed!`);
      setCode('');
      resetValidation();
    }
  };

  const handleReset = () => {
    setCode('');
    resetValidation();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-foreground">Coupons</h1>
          <p className="text-xs text-muted-foreground font-lexend mt-0.5">
            Validate, redeem & manage coupon codes
          </p>
        </div>
        <RequirePermission permission="coupons.create">
          <Button size="sm" className="gap-1.5" onClick={() => setCouponModal({ open: true, editCoupon: null })}>
            <Plus className="h-3.5 w-3.5" /> Create Coupon
          </Button>
        </RequirePermission>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* ─── LEFT: Validation Panel ──────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="text-sm font-semibold font-montserrat">Validate Coupon</h3>

              {/* Code entry */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      value={code}
                      onChange={(e) => { setCode(e.target.value.toUpperCase()); if (validationResult.status !== 'idle') resetValidation(); }}
                      placeholder="Enter coupon code"
                      className="pl-8 font-mono uppercase tracking-wider"
                      onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
                    />
                  </div>
                  <RequirePermission permission="coupons.validate" disableInstead>
                    <Button
                      onClick={handleValidate}
                      disabled={!code.trim() || isValidating}
                      className="gap-1.5"
                    >
                      {isValidating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
                      Validate
                    </Button>
                  </RequirePermission>
                </div>

                {/* QR scan placeholder */}
                <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full justify-center rounded-lg border border-dashed border-border py-3 hover:border-brand/30">
                  <QrCode className="h-4 w-4" />
                  <span>Scan QR Code (Coming Soon)</span>
                </button>
              </div>

              {/* Validation result */}
              <AnimatePresence mode="wait">
                {validationResult.status !== 'idle' && (
                  <motion.div
                    key={validationResult.status}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    {(() => {
                      const cfg = STATUS_CONFIG[validationResult.status];
                      const Icon = cfg.icon;
                      return (
                        <div className={cn('rounded-lg border p-4 space-y-3', cfg.bg, cfg.border)}>
                          <div className="flex items-center gap-2">
                            <Icon className={cn('h-5 w-5', cfg.color)} />
                            <span className={cn('text-sm font-semibold font-montserrat', cfg.color)}>
                              {validationResult.status === 'valid' ? 'Valid' : validationResult.status === 'expired' ? 'Expired' : validationResult.status === 'depleted' ? 'Depleted' : 'Invalid'}
                            </span>
                          </div>
                          <p className="text-xs text-foreground">{validationResult.message}</p>

                          {/* Preview */}
                          {validationResult.discountPreview && (
                            <div className="rounded-md bg-card border border-border p-3">
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Discount Preview</p>
                              <p className="text-sm font-semibold text-foreground">{validationResult.discountPreview}</p>
                              {validationResult.coupon?.stacking_allowed && (
                                <p className="text-[10px] text-emerald-500 mt-1">✓ Can be stacked with other coupons</p>
                              )}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2">
                            {validationResult.status === 'valid' && (
                              <RequirePermission permission="coupons.validate" disableInstead>
                                <Button size="sm" onClick={handleRedeem} className="gap-1 flex-1">
                                  <CheckCircle2 className="h-3 w-3" /> Apply & Redeem
                                </Button>
                              </RequirePermission>
                            )}
                            <Button size="sm" variant="outline" onClick={handleReset}>
                              Clear
                            </Button>
                          </div>
                        </div>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        {/* ─── RIGHT: Active Coupons List ──────────────────────── */}
        <div className="lg:col-span-3 space-y-3">
          <h3 className="text-sm font-semibold font-montserrat text-muted-foreground">All Coupons</h3>
          {coupons.map((coupon) => {
            const TypeIcon = TYPE_ICONS[coupon.type] || Tag;
            const isActive = coupon.status === 'active';
            const isPaused = coupon.status === 'paused';
            return (
              <Card key={coupon.id} className={cn(!isActive && !isPaused && 'opacity-60')}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-lg shrink-0',
                        isActive ? 'bg-brand/10 text-brand' : isPaused ? 'bg-amber-500/10 text-amber-500' : 'bg-muted text-muted-foreground'
                      )}>
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold">{coupon.code}</span>
                          <Badge
                            variant={isActive ? 'success' : coupon.status === 'expired' ? 'warning' : isPaused ? 'warning' : 'secondary'}
                            className="text-[9px] px-1.5 py-0 capitalize"
                          >
                            {coupon.status}
                          </Badge>
                          {coupon.stacking_allowed && (
                            <span className="text-[9px] text-emerald-500">stackable</span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate">{coupon.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {coupon.used_count}{coupon.max_uses ? `/${coupon.max_uses}` : ''} used
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Expires {new Date(coupon.valid_to).toLocaleDateString()}
                        </p>
                      </div>
                      {/* Manager actions */}
                      {canCreate && (
                        <div className="flex items-center gap-1 border-l border-border pl-2">
                          {(isActive || isPaused) && (
                            <button
                              onClick={() => {
                                toggleCouponStatus(coupon.id);
                                toast.info(`Coupon "${coupon.code}" ${isActive ? 'paused' : 'activated'}`);
                              }}
                              className="rounded p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                              title={isActive ? 'Pause' : 'Activate'}
                            >
                              {isActive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                            </button>
                          )}
                          <button
                            onClick={() => setCouponModal({ open: true, editCoupon: coupon })}
                            className="rounded p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="Edit coupon"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              deleteCoupon(coupon.id);
                              toast.success(`Coupon "${coupon.code}" deleted`);
                            }}
                            className="rounded p-1 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                            title="Delete coupon"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Coupon Create/Edit Modal */}
      <AnimatePresence>
        {couponModal.open && (
          <CouponModal
            open={couponModal.open}
            editCoupon={couponModal.editCoupon}
            onClose={() => setCouponModal({ open: false, editCoupon: null })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
