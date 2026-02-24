import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Settings, ShieldAlert, Save, RotateCcw, Zap, PauseCircle } from 'lucide-react';
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

// ─── Validation helpers ───────────────────────────────────────────────
function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export default function SLASettingsPage() {
  const { merchantRole, canDo } = useMerchantAuth();
  const canEdit = canDo('sla.edit');
  const canEditCapacity = canDo('capacity.edit');
  const {
    slaSettings, capacitySettings, storeStatus, autoPauseConfig,
    setSLASettings, setCapacitySettings, setStoreStatus, toggleBusyMode, setAutoPauseConfig,
  } = useMerchantStore();

  // ─── Local draft state ────────────────────────────────────────────
  const [draft, setDraft] = useState({
    acceptance_sla_seconds: slaSettings.acceptance_sla_seconds,
    max_concurrent_orders: slaSettings.max_concurrent_orders,
    busy_auto_throttle_at: slaSettings.busy_auto_throttle_at,
    avg_prep_time_minutes: capacitySettings.avg_prep_time_minutes,
    max_queue_length: capacitySettings.max_queue_length,
  });
  const [isStoreClosed, setIsStoreClosed] = useState(slaSettings.is_store_closed);
  const [closeReason, setCloseReason] = useState(slaSettings.close_reason ?? '');

  // Sync draft when store changes externally
  useEffect(() => {
    setDraft({
      acceptance_sla_seconds: slaSettings.acceptance_sla_seconds,
      max_concurrent_orders: slaSettings.max_concurrent_orders,
      busy_auto_throttle_at: slaSettings.busy_auto_throttle_at,
      avg_prep_time_minutes: capacitySettings.avg_prep_time_minutes,
      max_queue_length: capacitySettings.max_queue_length,
    });
    setIsStoreClosed(slaSettings.is_store_closed);
    setCloseReason(slaSettings.close_reason ?? '');
  }, [slaSettings, capacitySettings]);

  const hasChanges =
    draft.acceptance_sla_seconds !== slaSettings.acceptance_sla_seconds ||
    draft.max_concurrent_orders !== slaSettings.max_concurrent_orders ||
    draft.busy_auto_throttle_at !== slaSettings.busy_auto_throttle_at ||
    draft.avg_prep_time_minutes !== capacitySettings.avg_prep_time_minutes ||
    draft.max_queue_length !== capacitySettings.max_queue_length ||
    isStoreClosed !== slaSettings.is_store_closed ||
    closeReason !== (slaSettings.close_reason ?? '');

  const handleSave = () => {
    const clamped = {
      acceptance_sla_seconds: clamp(draft.acceptance_sla_seconds, 30, 600),
      max_concurrent_orders: clamp(draft.max_concurrent_orders, 1, 100),
      busy_auto_throttle_at: clamp(draft.busy_auto_throttle_at, 1, draft.max_concurrent_orders),
      avg_prep_time_minutes: clamp(draft.avg_prep_time_minutes, 1, 120),
      max_queue_length: clamp(draft.max_queue_length, 1, 200),
    };

    setSLASettings({
      acceptance_sla_seconds: clamped.acceptance_sla_seconds,
      max_concurrent_orders: clamped.max_concurrent_orders,
      busy_auto_throttle_at: clamped.busy_auto_throttle_at,
      is_store_closed: isStoreClosed,
      close_reason: isStoreClosed ? closeReason || 'Maintenance' : null,
    });

    setCapacitySettings({
      avg_prep_time_minutes: clamped.avg_prep_time_minutes,
      max_queue_length: clamped.max_queue_length,
      is_accepting_orders: !isStoreClosed,
    });

    setStoreStatus(isStoreClosed ? 'closed' : 'open');

    setDraft(clamped);
    toast.success('Settings saved successfully');
  };

  const handleReset = () => {
    setDraft({
      acceptance_sla_seconds: slaSettings.acceptance_sla_seconds,
      max_concurrent_orders: slaSettings.max_concurrent_orders,
      busy_auto_throttle_at: slaSettings.busy_auto_throttle_at,
      avg_prep_time_minutes: capacitySettings.avg_prep_time_minutes,
      max_queue_length: capacitySettings.max_queue_length,
    });
    setIsStoreClosed(slaSettings.is_store_closed);
    setCloseReason(slaSettings.close_reason ?? '');
    toast.info('Changes discarded');
  };

  const updateDraft = (key: keyof typeof draft, raw: string) => {
    const num = parseInt(raw, 10);
    if (!isNaN(num)) setDraft((prev) => ({ ...prev, [key]: num }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-foreground">Capacity & SLA</h1>
          <p className="text-xs text-muted-foreground font-lexend mt-0.5">
            Configure SLA, capacity, busy mode, and auto-pause · Role:{' '}
            <span className="font-semibold capitalize text-foreground">{merchantRole}</span>
          </p>
        </div>

        {/* Save / Reset */}
        <RequirePermission permission="sla.edit" disableInstead>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!hasChanges}
              onClick={handleReset}
              className="gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
            <Button
              size="sm"
              disabled={!hasChanges}
              onClick={handleSave}
              className="gap-1.5"
            >
              <Save className="h-3.5 w-3.5" />
              Save Changes
            </Button>
          </div>
        </RequirePermission>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ─── SLA Configuration ─────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-brand" />
                <h3 className="text-sm font-semibold font-montserrat">SLA Configuration</h3>
              </div>

              {/* Acceptance SLA */}
              <div className="space-y-1.5">
                <Label htmlFor="sla-seconds" className="text-xs text-muted-foreground">
                  Acceptance SLA (seconds)
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="sla-seconds"
                    type="number"
                    min={30}
                    max={600}
                    value={draft.acceptance_sla_seconds}
                    onChange={(e) => updateDraft('acceptance_sla_seconds', e.target.value)}
                    className="font-mono w-28"
                    disabled={!canEdit}
                  />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {draft.acceptance_sla_seconds >= 60
                      ? `${Math.floor(draft.acceptance_sla_seconds / 60)}m ${draft.acceptance_sla_seconds % 60}s`
                      : `${draft.acceptance_sla_seconds}s`}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Orders auto-reject if not accepted within this window (30–600s)
                </p>
              </div>

              {/* Max Concurrent Orders */}
              <div className="space-y-1.5">
                <Label htmlFor="max-concurrent" className="text-xs text-muted-foreground">
                  Max Concurrent Orders
                </Label>
                <Input
                  id="max-concurrent"
                  type="number"
                  min={1}
                  max={100}
                  value={draft.max_concurrent_orders}
                  onChange={(e) => updateDraft('max_concurrent_orders', e.target.value)}
                  className="font-mono w-28"
                  disabled={!canEdit}
                />
                <p className="text-[10px] text-muted-foreground">
                  Maximum orders the store handles simultaneously (1–100)
                </p>
              </div>

              {/* Busy Auto-Throttle */}
              <div className="space-y-1.5">
                <Label htmlFor="throttle" className="text-xs text-muted-foreground">
                  Busy Auto-Throttle Threshold
                </Label>
                <Input
                  id="throttle"
                  type="number"
                  min={1}
                  max={draft.max_concurrent_orders}
                  value={draft.busy_auto_throttle_at}
                  onChange={(e) => updateDraft('busy_auto_throttle_at', e.target.value)}
                  className="font-mono w-28"
                  disabled={!canEdit}
                />
                <p className="text-[10px] text-muted-foreground">
                  Store auto-switches to &quot;Busy&quot; at this order count
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ─── Capacity Settings ─────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-brand" />
                <h3 className="text-sm font-semibold font-montserrat">Capacity Settings</h3>
              </div>

              {/* Max Queue Length */}
              <div className="space-y-1.5">
                <Label htmlFor="max-queue" className="text-xs text-muted-foreground">
                  Max Queue Length
                </Label>
                <Input
                  id="max-queue"
                  type="number"
                  min={1}
                  max={200}
                  value={draft.max_queue_length}
                  onChange={(e) => updateDraft('max_queue_length', e.target.value)}
                  className="font-mono w-28"
                  disabled={!canEditCapacity}
                />
                <p className="text-[10px] text-muted-foreground">
                  Current queue: {capacitySettings.current_queue_length} / {draft.max_queue_length}
                </p>
              </div>

              {/* Avg Prep Time */}
              <div className="space-y-1.5">
                <Label htmlFor="prep-time" className="text-xs text-muted-foreground">
                  Average Prep Time (minutes)
                </Label>
                <Input
                  id="prep-time"
                  type="number"
                  min={1}
                  max={120}
                  value={draft.avg_prep_time_minutes}
                  onChange={(e) => updateDraft('avg_prep_time_minutes', e.target.value)}
                  className="font-mono w-28"
                  disabled={!canEditCapacity}
                />
              </div>

              {/* Live status display */}
              <div className="rounded-lg border border-border p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Store Status</span>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                      storeStatus === 'open' && 'bg-emerald-500/10 text-emerald-500',
                      storeStatus === 'busy' && 'bg-amber-500/10 text-amber-500',
                      storeStatus === 'closed' && 'bg-red-500/10 text-red-500',
                    )}
                  >
                    <span className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      storeStatus === 'open' && 'bg-emerald-500',
                      storeStatus === 'busy' && 'bg-amber-500',
                      storeStatus === 'closed' && 'bg-red-500',
                    )} />
                    {storeStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Accepting Orders</span>
                  <span className={cn('font-semibold', capacitySettings.is_accepting_orders ? 'text-emerald-500' : 'text-red-500')}>
                    {capacitySettings.is_accepting_orders ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ─── Store Closure / Maintenance Mode ──────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className={cn(isStoreClosed && 'border-red-500/30 bg-red-500/5')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className={cn('h-5 w-5', isStoreClosed ? 'text-red-500' : 'text-muted-foreground')} />
                  <div>
                    <h3 className="text-sm font-semibold font-montserrat">
                      Close Store (Maintenance Mode)
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Closes the store and stops accepting new orders. Current orders will continue to be processed.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={isStoreClosed}
                  onCheckedChange={(checked) => setIsStoreClosed(checked)}
                  disabled={!canEdit}
                />
              </div>

              {/* Reason field — shown when toggled on */}
              {isStoreClosed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-1.5"
                >
                  <Label htmlFor="close-reason" className="text-xs text-muted-foreground">
                    Closure Reason
                  </Label>
                  <Input
                    id="close-reason"
                    placeholder="e.g. Equipment maintenance"
                    value={closeReason}
                    onChange={(e) => setCloseReason(e.target.value)}
                    disabled={!canEdit}
                  />
                  <p className="text-[10px] text-red-500 font-medium">
                    ⚠ Closing the store will disable the Accept button on all new orders.
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* ─── Busy Mode Toggle ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="lg:col-span-2"
        >
          <Card className={cn(storeStatus === 'busy' && 'border-amber-500/30 bg-amber-500/5')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className={cn('h-5 w-5', storeStatus === 'busy' ? 'text-amber-500' : 'text-muted-foreground')} />
                  <div>
                    <h3 className="text-sm font-semibold font-montserrat">
                      Busy Mode
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Toggle between Normal and Busy. When Busy: lowers store ranking, limits new orders, does not cancel existing orders.
                    </p>
                  </div>
                </div>
                <RequirePermission permission="sla.edit" disableInstead>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'text-xs font-semibold',
                      storeStatus === 'busy' ? 'text-amber-500' : 'text-emerald-500',
                    )}>
                      {storeStatus === 'busy' ? 'Busy' : 'Normal'}
                    </span>
                    <Switch
                      checked={storeStatus === 'busy'}
                      onCheckedChange={() => toggleBusyMode()}
                      disabled={storeStatus === 'closed'}
                    />
                  </div>
                </RequirePermission>
              </div>

              {storeStatus === 'busy' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-3"
                >
                  <div className="text-[11px] text-amber-700 dark:text-amber-400 space-y-1">
                    <p>• Store ranking is lowered in search results</p>
                    <p>• New orders are limited (throttled at {slaSettings.busy_auto_throttle_at} concurrent)</p>
                    <p>• Existing orders continue to be processed normally</p>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* ─── Auto-Pause Logic ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PauseCircle className="h-5 w-5 text-brand" />
                  <div>
                    <h3 className="text-sm font-semibold font-montserrat">
                      Auto-Pause Logic
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Automatically pause accepting new orders after inactivity or high load
                    </p>
                  </div>
                </div>
                <RequirePermission permission="sla.edit" disableInstead>
                  <Switch
                    checked={autoPauseConfig.enabled}
                    onCheckedChange={(enabled) => {
                      setAutoPauseConfig({ enabled });
                      toast.info(enabled ? 'Auto-pause enabled' : 'Auto-pause disabled');
                    }}
                  />
                </RequirePermission>
              </div>

              {autoPauseConfig.enabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 pt-2"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">
                        Pause After (minutes of no orders)
                      </Label>
                      <Input
                        type="number"
                        min={5}
                        max={120}
                        value={autoPauseConfig.pause_after_minutes}
                        onChange={(e) => setAutoPauseConfig({ pause_after_minutes: parseInt(e.target.value, 10) || 30 })}
                        className="font-mono w-28"
                        disabled={!canEdit}
                      />
                      <p className="text-[10px] text-muted-foreground">
                        Stop accepting orders if no orders received in this window
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">
                          Auto-Resume
                        </Label>
                        <Switch
                          checked={autoPauseConfig.resume_automatically}
                          onCheckedChange={(resume_automatically) => setAutoPauseConfig({ resume_automatically })}
                          disabled={!canEdit}
                        />
                      </div>
                      {autoPauseConfig.resume_automatically && (
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">
                            Resume After (minutes)
                          </Label>
                          <Input
                            type="number"
                            min={5}
                            max={240}
                            value={autoPauseConfig.resume_after_minutes}
                            onChange={(e) => setAutoPauseConfig({ resume_after_minutes: parseInt(e.target.value, 10) || 60 })}
                            className="font-mono w-28"
                            disabled={!canEdit}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
