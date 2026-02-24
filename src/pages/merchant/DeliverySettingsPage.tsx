import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, RotateCcw, Plus, X, MapPin, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { RequirePermission } from '@/components/merchant/RequirePermission';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import { useMerchantStore } from '@/store/merchant.store';
import { useMerchantAuth } from '@/hooks/useMerchantAuth';

export default function DeliverySettingsPage() {
  const { merchantRole, canDo } = useMerchantAuth();
  const canEdit = canDo('delivery.edit');
  const { deliverySettings, setDeliverySettings } = useMerchantStore();

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

  const handleSave = () => {
    setDeliverySettings(draft);
    toast.success('Delivery settings saved');
  };

  const handleReset = () => {
    setDraft({ ...deliverySettings });
    toast.info('Changes discarded');
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-foreground">Delivery Settings</h1>
          <p className="text-xs text-muted-foreground font-lexend mt-0.5">
            Configure delivery radius, fees, time windows, and runner preferences · Role:{' '}
            <span className="font-semibold capitalize text-foreground">{merchantRole}</span>
          </p>
        </div>
        <RequirePermission permission="delivery.edit" disableInstead>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={!hasChanges} onClick={handleReset} className="gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </Button>
            <Button size="sm" disabled={!hasChanges} onClick={handleSave} className="gap-1.5">
              <Save className="h-3.5 w-3.5" /> Save Changes
            </Button>
          </div>
        </RequirePermission>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Delivery Area */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-brand" />
                <h3 className="text-sm font-semibold font-montserrat">Delivery Area</h3>
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
                <p className="text-[10px] text-muted-foreground">Maximum distance for delivery orders</p>
              </div>

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
                <p className="text-[10px] text-muted-foreground">Average delivery time shown to customers</p>
              </div>

              <div className="space-y-1.5">
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
                  Any = first available | Dedicated = assigned runner | Pool = shared fleet
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Fees & Pricing */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
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
                  <Label className="text-xs text-muted-foreground">Allow Scheduled Delivery</Label>
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

        {/* Time Windows */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
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
      </div>
    </div>
  );
}
