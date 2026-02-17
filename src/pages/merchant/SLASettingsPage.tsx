import { useState } from 'react';
import { useMerchantStore } from '@/store/merchant.store';
import { useMerchantAuth } from '@/hooks/useMerchantAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { Badge } from '@/components/ui/Badge';
import { Clock, Users, AlertTriangle, Save } from 'lucide-react';

export default function SLASettingsPage() {
  const { slaSettings, capacitySettings, updateSLASettings, updateCapacity } = useMerchantStore();
  const { canDo } = useMerchantAuth();
  const canManage = canDo('sla.edit');

  const [sla, setSla] = useState(slaSettings);
  const [capacity, setCapacity] = useState(capacitySettings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSLASettings(sla);
    updateCapacity(capacity);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-montserrat text-foreground">SLA & Capacity Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure acceptance windows and kitchen capacity.</p>
        </div>
        {saved && (
          <Badge variant="success" className="text-xs">
            Settings saved!
          </Badge>
        )}
      </div>

      {/* SLA Settings */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-brand" />
            <h2 className="text-base font-semibold font-poppins text-foreground">SLA Timers</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Acceptance SLA (seconds)</Label>
              <Input
                type="number"
                min={30}
                max={300}
                value={sla.acceptance_sla_seconds}
                onChange={(e) => setSla({ ...sla, acceptance_sla_seconds: Number(e.target.value) })}
                disabled={!canManage}
              />
              <p className="text-[10px] text-muted-foreground">Time to accept before auto-decline</p>
            </div>
            <div className="space-y-2">
              <Label>Max Concurrent Orders</Label>
              <Input
                type="number"
                min={1}
                max={50}
                value={sla.max_concurrent_orders}
                onChange={(e) => setSla({ ...sla, max_concurrent_orders: Number(e.target.value) })}
                disabled={!canManage}
              />
            </div>
            <div className="space-y-2">
              <Label>Auto-throttle At</Label>
              <Input
                type="number"
                min={1}
                max={50}
                value={sla.busy_auto_throttle_at}
                onChange={(e) => setSla({ ...sla, busy_auto_throttle_at: Number(e.target.value) })}
                disabled={!canManage}
              />
              <p className="text-[10px] text-muted-foreground">Auto-pause when queue reaches this number</p>
            </div>
          </div>

          {/* Store closed override */}
          <div className="flex items-center justify-between rounded-lg border border-border p-3 mt-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-status-warning" />
              <div>
                <p className="text-sm font-medium text-foreground">Force Close Store</p>
                <p className="text-[10px] text-muted-foreground">Immediately stop accepting orders</p>
              </div>
            </div>
            <Switch
              checked={sla.is_store_closed}
              onCheckedChange={(v) => setSla({ ...sla, is_store_closed: v })}
              disabled={!canManage}
            />
          </div>

          {sla.is_store_closed && (
            <div className="space-y-2">
              <Label>Close Reason</Label>
              <Input
                value={sla.close_reason ?? ''}
                onChange={(e) => setSla({ ...sla, close_reason: e.target.value })}
                placeholder="e.g. Equipment maintenance"
                disabled={!canManage}
              />
              <Label>Estimated Reopen</Label>
              <Input
                type="datetime-local"
                value={sla.estimated_reopen ?? ''}
                onChange={(e) => setSla({ ...sla, estimated_reopen: e.target.value })}
                disabled={!canManage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Capacity Settings */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-brand" />
            <h2 className="text-base font-semibold font-poppins text-foreground">Capacity</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Max Queue Length</Label>
              <Input
                type="number"
                min={1}
                max={100}
                value={capacity.max_queue_length}
                onChange={(e) => setCapacity({ ...capacity, max_queue_length: Number(e.target.value) })}
                disabled={!canManage}
              />
            </div>
            <div className="space-y-2">
              <Label>Avg Prep Time (minutes)</Label>
              <Input
                type="number"
                min={1}
                max={60}
                value={capacity.avg_prep_time_minutes}
                onChange={(e) => setCapacity({ ...capacity, avg_prep_time_minutes: Number(e.target.value) })}
                disabled={!canManage}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium text-foreground">Accepting Orders</p>
              <p className="text-[10px] text-muted-foreground">Toggle order intake</p>
            </div>
            <Switch
              checked={capacity.is_accepting_orders}
              onCheckedChange={(v) => setCapacity({ ...capacity, is_accepting_orders: v })}
              disabled={!canManage}
            />
          </div>
        </CardContent>
      </Card>

      {canManage && (
        <Button onClick={handleSave} className="w-full sm:w-auto">
          <Save className="h-4 w-4 mr-1" />
          Save Settings
        </Button>
      )}
    </div>
  );
}
