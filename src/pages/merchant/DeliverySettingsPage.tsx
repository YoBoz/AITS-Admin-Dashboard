import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Masonry from 'react-masonry-css';
import {
  Save, RotateCcw, Plus, X, MapPin, Clock, DollarSign,
  Package, QrCode, ShieldCheck, AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { RequirePermission } from '@/components/merchant/RequirePermission';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import { Badge } from '@/components/ui/Badge';
import { useMerchantStore } from '@/store/merchant.store';
import { useMerchantAuth } from '@/hooks/useMerchantAuth';
import { useMerchantAuditStore } from '@/store/merchant-audit.store';
import type { DeliveryMode, PickupVerificationMethod } from '@/types/merchant.types';

// --- Available airport areas ------------------------------------------------
const AIRPORT_AREAS = [
  'Gate A1-A12', 'Gate A13-A24', 'Gate B1-B8', 'Gate B9-B16',
  'Gate C1-C10', 'Gate D1-D6', 'Transit Lounge', 'Arrivals Hall',
  'Departures Hall', 'VIP Terminal',
] as const;

export default function DeliverySettingsPage() {
  const { merchantRole, canDo, merchantUser } = useMerchantAuth();
  const canEdit = canDo('delivery.edit');
  const { deliverySettings, setDeliverySettings } = useMerchantStore();
  const addAudit = useMerchantAuditStore((s) => s.addEntry);

  if (!canDo('delivery.view')) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">You do not have permission to view this page.</p>
      </div>
    );
  }

  const [draft, setDraft] = useState({ ...deliverySettings });

  useEffect(() => {
    setDraft({ ...deliverySettings });
  }, [deliverySettings]);

  const hasChanges = JSON.stringify(draft) !== JSON.stringify(deliverySettings);

  // --- Validation ---
  const errors: string[] = [];
  if (draft.delivery_mode === 'delivery_enabled') {
    if (draft.delivery_radius_km < 0.5) errors.push('Delivery radius must be at least 0.5 km');
    if (draft.estimated_delivery_minutes < 5) errors.push('Estimated delivery time must be at least 5 min');
    if (draft.supported_areas.length === 0) errors.push('Select at least one supported area');
  }
  if (draft.cutoff_minutes !== null && draft.cutoff_minutes < 0) errors.push('Cutoff minutes must be positive');

  const handleSave = () => {
    if (errors.length) {
      toast.error(errors[0]);
      return;
    }
    setDeliverySettings(draft);
    addAudit({
      eventType: 'merchant_delivery_settings_updated',
      actorName: merchantUser?.name ?? 'Unknown',
      actorRole: merchantRole ?? 'unknown',
      metadata: { delivery_mode: draft.delivery_mode, pickup_verification: draft.pickup_verification },
    });
    toast.success('Delivery settings saved');
  };

  const handleReset = () => {
    setDraft({ ...deliverySettings });
    toast.info('Changes discarded');
  };

  const toggleArea = (area: string) => {
    setDraft((d) => ({
      ...d,
      supported_areas: d.supported_areas.includes(area)
        ? d.supported_areas.filter((a) => a !== area)
        : [...d.supported_areas, area],
    }));
  };

  const addTimeWindow = () => {
    setDraft((d) => ({
      ...d,
      delivery_time_windows: [...d.delivery_time_windows, { start: '08:00', end: '22:00' }],
    }));
  };

  const removeTimeWindow = (idx: number) => {
    setDraft((d) => ({
      ...d,
      delivery_time_windows: d.delivery_time_windows.filter((_, i) => i !== idx),
    }));
  };

  const updateTimeWindow = (idx: number, field: 'start' | 'end', value: string) => {
    setDraft((d) => ({
      ...d,
      delivery_time_windows: d.delivery_time_windows.map((tw, i) =>
        i === idx ? { ...tw, [field]: value } : tw
      ),
    }));
  };

  const isDelivery = draft.delivery_mode === 'delivery_enabled';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-foreground">Delivery Settings</h1>
          <p className="text-xs text-muted-foreground font-lexend mt-0.5">
            Configure delivery mode, areas, fees, runner handoff, and time windows {'\u00B7'} Role:{' '}
            <span className="font-semibold capitalize text-foreground">{merchantRole}</span>
          </p>
        </div>
        <RequirePermission permission="delivery.edit" disableInstead>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={!hasChanges} onClick={handleReset} className="gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </Button>
            <Button size="sm" disabled={!hasChanges || errors.length > 0} onClick={handleSave} className="gap-1.5">
              <Save className="h-3.5 w-3.5" /> Save Changes
            </Button>
          </div>
        </RequirePermission>
      </div>

      {/* Validation banner */}
      {errors.length > 0 && hasChanges && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            {errors.map((err, idx) => (
              <p key={idx} className="text-xs text-destructive">{err}</p>
            ))}
          </div>
        </div>
      )}

      {/* Delivery Mode Toggle */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-brand" />
              <h3 className="text-sm font-semibold font-montserrat">Delivery Mode</h3>
            </div>

            <div className="flex gap-3">
              {(['pickup_only', 'delivery_enabled'] as DeliveryMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => canEdit && setDraft((d) => ({ ...d, delivery_mode: mode }))}
                  disabled={!canEdit}
                  className={cn(
                    'flex-1 rounded-xl border-2 p-4 text-left transition-all',
                    draft.delivery_mode === mode
                      ? 'border-brand bg-brand/5'
                      : 'border-border hover:border-foreground/20',
                    !canEdit && 'opacity-50 cursor-not-allowed',
                  )}
                >
                  <span className="text-sm font-semibold block capitalize">
                    {mode === 'pickup_only' ? 'Pickup Only' : 'Delivery Enabled'}
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-0.5 block">
                    {mode === 'pickup_only'
                      ? 'Customers collect orders at the counter'
                      : 'Orders delivered to gates and areas via runners'}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Masonry
        breakpointCols={{ default: 2, 1024: 2, 768: 1 }}
        className="masonry-grid"
        columnClassName="masonry-grid-column"
      >
        {/* Supported Areas (zone selector) */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.02 }}>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-brand" />
                <h3 className="text-sm font-semibold font-montserrat">Supported Areas</h3>
                <Badge variant="secondary" className="text-[10px]">{draft.supported_areas.length} selected</Badge>
              </div>

              <div className="flex flex-wrap gap-2">
                {AIRPORT_AREAS.map((area) => (
                  <button
                    key={area}
                    onClick={() => canEdit && toggleArea(area)}
                    disabled={!canEdit}
                    className={cn(
                      'rounded-lg border px-3 py-1.5 text-xs font-medium transition-all',
                      draft.supported_areas.includes(area)
                        ? 'border-brand bg-brand/10 text-brand'
                        : 'border-border text-muted-foreground hover:border-foreground/20',
                      !canEdit && 'opacity-50 cursor-not-allowed',
                    )}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Cutoff Rule */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}>
          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-brand" />
                <h3 className="text-sm font-semibold font-montserrat">Cutoff & Timing</h3>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Order Cutoff Before Departure (minutes)</Label>
                <Input
                  type="number"
                  min={0}
                  max={120}
                  value={draft.cutoff_minutes ?? ''}
                  onChange={(e) => setDraft((d) => ({
                    ...d,
                    cutoff_minutes: e.target.value ? Number(e.target.value) : null,
                  }))}
                  placeholder="No cutoff"
                  className="font-mono w-28"
                  disabled={!canEdit}
                />
                <p className="text-[10px] text-muted-foreground">
                  Orders will be rejected if flight departs within this window. Leave blank to disable.
                </p>
              </div>

              {isDelivery && (
                <>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Estimated Delivery Time (minutes)</Label>
                    <Input
                      type="number"
                      min={5}
                      max={120}
                      value={draft.estimated_delivery_minutes}
                      onChange={(e) => setDraft((d) => ({ ...d, estimated_delivery_minutes: Number(e.target.value) }))}
                      className="font-mono w-28"
                      disabled={!canEdit}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Delivery Radius (km)</Label>
                    <Input
                      type="number"
                      min={0.5}
                      max={50}
                      step={0.5}
                      value={draft.delivery_radius_km}
                      onChange={(e) => setDraft((d) => ({ ...d, delivery_radius_km: Number(e.target.value) }))}
                      className="font-mono w-28"
                      disabled={!canEdit}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Runner Handoff Rules */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-brand" />
                <h3 className="text-sm font-semibold font-montserrat">Runner Handoff Rules</h3>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Pickup Verification Method</Label>
                <div className="flex gap-2">
                  {(['QR', 'Code', 'Both'] as PickupVerificationMethod[]).map((method) => (
                    <button
                      key={method}
                      onClick={() => canEdit && setDraft((d) => ({ ...d, pickup_verification: method }))}
                      disabled={!canEdit}
                      className={cn(
                        'flex-1 rounded-lg border py-2.5 text-xs font-medium transition-all',
                        draft.pickup_verification === method
                          ? 'border-brand bg-brand/5 text-brand'
                          : 'border-border hover:border-foreground/20',
                        !canEdit && 'opacity-50 cursor-not-allowed',
                      )}
                    >
                      {method === 'QR' && <QrCode className="h-3.5 w-3.5 mx-auto mb-1" />}
                      {method === 'Code' && <ShieldCheck className="h-3.5 w-3.5 mx-auto mb-1" />}
                      {method === 'Both' && <Package className="h-3.5 w-3.5 mx-auto mb-1" />}
                      {method}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground">
                  How runners verify pickup: QR scan, numeric code, or both
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs">Packaging Readiness Required</Label>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Staff must confirm package is ready before runner dispatch
                  </p>
                </div>
                <Switch
                  checked={draft.packaging_readiness_required}
                  onCheckedChange={(checked) => setDraft((d) => ({ ...d, packaging_readiness_required: checked }))}
                  disabled={!canEdit}
                />
              </div>

              {isDelivery && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Runner Preference</Label>
                  <div className="flex gap-2">
                    {(['any', 'dedicated', 'pool'] as const).map((pref) => (
                      <button
                        key={pref}
                        onClick={() => canEdit && setDraft((d) => ({ ...d, runner_preference: pref }))}
                        disabled={!canEdit}
                        className={cn(
                          'flex-1 rounded-lg border py-2 text-xs font-medium capitalize transition-all',
                          draft.runner_preference === pref
                            ? 'border-brand bg-brand/5 text-brand'
                            : 'border-border hover:border-foreground/20',
                          !canEdit && 'opacity-50 cursor-not-allowed',
                        )}
                      >
                        {pref}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Any = first available | Dedicated = assigned | Pool = shared fleet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Fees & Pricing - only for delivery mode */}
        {isDelivery && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <Card>
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-brand" />
                  <h3 className="text-sm font-semibold font-montserrat">Fees & Pricing</h3>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Base Delivery Fee (AED)</Label>
                  <Input
                    type="number"
                    min={0}
                    step={0.5}
                    value={draft.base_delivery_fee}
                    onChange={(e) => setDraft((d) => ({ ...d, base_delivery_fee: Number(e.target.value) }))}
                    className="font-mono w-28"
                    disabled={!canEdit}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Free Delivery Above (AED)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={draft.free_delivery_above ?? ''}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        free_delivery_above: e.target.value ? Number(e.target.value) : null,
                      }))
                    }
                    placeholder="No threshold"
                    className="font-mono w-28"
                    disabled={!canEdit}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Orders above this amount get free delivery. Leave blank for no threshold.
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs">Allow Scheduled Delivery</Label>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Let customers schedule deliveries in advance
                    </p>
                  </div>
                  <Switch
                    checked={draft.allow_scheduled_delivery}
                    onCheckedChange={(checked) => setDraft((d) => ({ ...d, allow_scheduled_delivery: checked }))}
                    disabled={!canEdit}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Time Windows — delivery only */}
        {isDelivery && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-brand" />
                    <h3 className="text-sm font-semibold font-montserrat">Delivery Time Windows</h3>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={addTimeWindow}
                    disabled={!canEdit}
                    className="gap-1 text-xs"
                  >
                    <Plus className="h-3 w-3" /> Add Window
                  </Button>
                </div>

                {draft.delivery_time_windows.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No time windows configured. Orders can be placed anytime.
                  </p>
                )}

                <div className="space-y-3">
                  {draft.delivery_time_windows.map((tw, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={tw.start}
                          onChange={(e) => updateTimeWindow(idx, 'start', e.target.value)}
                          className="w-32"
                          disabled={!canEdit}
                        />
                        <span className="text-xs text-muted-foreground">to</span>
                        <Input
                          type="time"
                          value={tw.end}
                          onChange={(e) => updateTimeWindow(idx, 'end', e.target.value)}
                          className="w-32"
                          disabled={!canEdit}
                        />
                      </div>
                      <button
                        onClick={() => removeTimeWindow(idx)}
                        disabled={!canEdit}
                        className="p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive disabled:opacity-50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

      </Masonry>
    </div>
  );
}
