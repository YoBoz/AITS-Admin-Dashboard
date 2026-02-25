import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMemo, useState, useCallback } from 'react';
import {
  ArrowLeft,
  Battery,
  Heart,
  Route,
  TrendingUp,
  Wrench,
  RotateCcw,
  Clock,
  Lock,
  Unlock,
  Shield,
} from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { SectionCard } from '@/components/common/SectionCard';
import { DataTable } from '@/components/common/DataTable';
import { TrolleyStatusBadge } from '@/components/trolleys/TrolleyStatusBadge';
import { TrolleyHistoryChart } from '@/components/trolleys/TrolleyHistoryChart';
import { useTrolleysStore } from '@/store/trolleys.store';
import { usePermissionsStore } from '@/store/permissions.store';
import { cn } from '@/lib/utils';
import type { Trolley, MaintenanceRecord } from '@/types/trolley.types';

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground font-lexend">{label}</span>
      <span className="text-sm font-medium text-foreground text-right">{value}</span>
    </div>
  );
}

function MiniStatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) {
  return (
    <Card className="p-3 text-center">
      <Icon className={cn('h-5 w-5 mx-auto mb-1', color)} />
      <p className="text-lg font-bold font-montserrat text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground font-lexend uppercase tracking-wider">{label}</p>
    </Card>
  );
}

// ── Device Actions & Telemetry helpers ──────────
type DeviceAction = 'lock' | 'unlock' | 'reboot' | 'maintenance';
const deviceActions: { key: DeviceAction; label: string; icon: React.ElementType; color: string }[] = [
  { key: 'lock', label: 'Lock Device', icon: Lock, color: 'text-red-500' },
  { key: 'unlock', label: 'Unlock Device', icon: Unlock, color: 'text-emerald-500' },
  { key: 'reboot', label: 'Reboot Device', icon: RotateCcw, color: 'text-blue-500' },
  { key: 'maintenance', label: 'Mark Maintenance', icon: Wrench, color: 'text-amber-500' },
];

function generateTelemetry(device: Trolley) {
  const now = Date.now();
  const points = [];
  let bat = device.battery;
  let conf = device.location_confidence ?? 80;
  for (let i = 23; i >= 0; i--) {
    bat = Math.max(5, Math.min(100, bat + (Math.random() - 0.45) * 4));
    conf = Math.max(10, Math.min(100, conf + (Math.random() - 0.5) * 8));
    points.push({
      time: new Date(now - i * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      battery: Math.round(bat),
      confidence: Math.round(conf),
    });
  }
  return points;
}

function logAudit(action: string, resourceId: string, resourceLabel: string) {
  usePermissionsStore.getState().addAuditEntry({
    id: `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    actor_id: 'USR-admin-001',
    actor_name: 'Admin User',
    actor_role: 'super_admin',
    action,
    resource_type: 'device',
    resource_id: resourceId,
    resource_label: resourceLabel,
    changes: null,
    ip_address: '10.0.1.42',
    timestamp: new Date().toISOString(),
    result: 'success',
  });
}

export default function TrolleyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const trolleys = useTrolleysStore((s) => s.trolleys);
  const updateTrolley = useTrolleysStore((s) => s.updateTrolley);

  const trolley = trolleys.find((t) => t.id === id);

  // Device action state
  const [actionModal, setActionModal] = useState<{ action: DeviceAction; device: Trolley } | null>(null);
  const [reasonCode, setReasonCode] = useState('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const telemetry = useMemo(() => (trolley ? generateTelemetry(trolley) : []), [trolley?.id]);

  const handleExecuteAction = useCallback(() => {
    if (!actionModal || !reasonCode.trim()) return;
    const { action, device } = actionModal;
    let newStatus: Trolley['status'] = device.status;
    let toastMsg = '';
    switch (action) {
      case 'lock': newStatus = 'offline'; toastMsg = `${device.id} locked`; break;
      case 'unlock': newStatus = 'idle'; toastMsg = `${device.id} unlocked`; break;
      case 'reboot': newStatus = 'idle'; toastMsg = `${device.id} reboot initiated`; break;
      case 'maintenance': newStatus = 'maintenance'; toastMsg = `${device.id} marked for maintenance`; break;
    }
    updateTrolley(device.id, { status: newStatus, last_seen: new Date().toISOString() });
    logAudit('device_action_executed', device.id, `${action} - ${device.id}`);
    toast.success(toastMsg);
    setActionModal(null);
    setReasonCode('');
  }, [actionModal, reasonCode, updateTrolley]);

  const maintenanceColumns: ColumnDef<MaintenanceRecord, unknown>[] = useMemo(
    () => [
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => (
          <span className="text-sm">{format(new Date(row.original.date), 'MMM dd, yyyy')}</span>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
          const typeColors: Record<string, string> = {
            scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            repair: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
            battery_replace: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
            firmware_update: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
          };
          return (
            <span className={cn('inline-flex px-2 py-0.5 rounded-full text-xs font-medium', typeColors[row.original.type])}>
              {row.original.type.replace('_', ' ')}
            </span>
          );
        },
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => <span className="text-sm">{row.original.description}</span>,
      },
      {
        accessorKey: 'technician',
        header: 'Technician',
        cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.technician}</span>,
      },
      {
        accessorKey: 'cost',
        header: 'Cost',
        cell: ({ row }) => <span className="text-sm font-medium">${row.original.cost}</span>,
      },
    ],
    []
  );

  if (!trolley) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg text-muted-foreground">Trolley not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/dashboard/trolleys')}>
          Back to Trolleys
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Back button & breadcrumb */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/trolleys')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <nav className="flex items-center gap-1 text-sm text-muted-foreground font-lexend">
          <button onClick={() => navigate('/dashboard/trolleys')} className="hover:text-foreground">
            Fleet Management
          </button>
          <span>/</span>
          <span className="text-foreground font-medium">{trolley.id}</span>
        </nav>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column - 60% */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header Card */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xl font-mono font-bold text-foreground tracking-wider">
                  {trolley.imei}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <TrolleyStatusBadge status={trolley.status} />
                  <span className="text-sm text-muted-foreground">
                    {trolley.manufacturer} — {trolley.model}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {trolley.id} | SN: {trolley.serial_number}
                </p>
              </div>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </Card>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MiniStatCard icon={Battery} label="Battery" value={`${trolley.battery}%`} color="text-emerald-500" />
            <MiniStatCard icon={Heart} label="Health" value={trolley.health_score} color="text-blue-500" />
            <MiniStatCard icon={Route} label="Total Trips" value={trolley.total_trips.toLocaleString()} color="text-purple-500" />
            <MiniStatCard icon={TrendingUp} label="Today Trips" value={trolley.today_trips} color="text-brand" />
          </div>

          {/* Battery History Chart */}
          <SectionCard title="Battery History" subtitle="Last 48 hours">
            <TrolleyHistoryChart trolleyId={trolley.id} />
          </SectionCard>

          {/* Maintenance History */}
          <SectionCard title="Maintenance History">
            <DataTable
              columns={maintenanceColumns}
              data={trolley.maintenance_history}
              searchable={false}
              pageSize={5}
            />
          </SectionCard>
        </div>

        {/* Right Column - 40% */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info Card */}
          <SectionCard title="Device Information">
            <div className="space-y-0">
              <InfoRow label="Firmware Version" value={trolley.firmware_version} />
              <InfoRow label="Tab Model" value={trolley.tab_model} />
              <InfoRow label="Tab Serial" value={<span className="font-mono text-xs">{trolley.tab_serial}</span>} />
              <InfoRow label="Assigned Gate" value={trolley.assigned_gate} />
              <InfoRow
                label="Registered"
                value={format(new Date(trolley.registered_at), 'MMM dd, yyyy')}
              />
              <InfoRow
                label="Last Maintenance"
                value={format(new Date(trolley.last_maintenance), 'MMM dd, yyyy')}
              />
              <InfoRow
                label="Location"
                value={
                  <span>
                    {trolley.location.zone}
                    {trolley.location.gate && ` — Gate ${trolley.location.gate}`}
                  </span>
                }
              />
            </div>
            {trolley.notes && (
              <div className="mt-4 pt-3 border-t border-border">
                <label className="text-xs text-muted-foreground font-lexend uppercase tracking-wider">Notes</label>
                <p className="text-sm text-foreground mt-1">{trolley.notes}</p>
              </div>
            )}
          </SectionCard>

          {/* Quick Actions */}
          <SectionCard title="Device Actions">
            <p className="text-xs text-muted-foreground mb-3">All actions require a mandatory reason code and are audit-logged.</p>
            <div className="grid grid-cols-2 gap-2">
              {trolley && deviceActions.map(({ key, label, icon: Icon, color }) => (
                <Button key={key} variant="outline" size="sm" className="justify-start gap-2 h-10" onClick={() => setActionModal({ action: key, device: trolley })}>
                  <Icon className={cn('h-4 w-4', color)} />
                  {label}
                </Button>
              ))}
            </div>
          </SectionCard>

          {/* Telemetry Timeline */}
          <SectionCard title="Telemetry Timeline (24h)">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={telemetry} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} className="text-muted-foreground" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} className="text-muted-foreground" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="battery" stroke="#10b981" strokeWidth={2} dot={false} name="Battery %" />
                  <Line type="monotone" dataKey="confidence" stroke="#6366f1" strokeWidth={2} dot={false} name="Confidence %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground justify-center">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Battery</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-indigo-500" /> Confidence</span>
            </div>
          </SectionCard>

          {/* Status Timeline */}
          <SectionCard title="Recent Status Changes">
            <div className="space-y-4">
              {[
                { status: trolley.status, time: trolley.last_seen },
                { status: 'active' as const, time: new Date(Date.now() - 2 * 3600000).toISOString() },
                { status: 'charging' as const, time: new Date(Date.now() - 5 * 3600000).toISOString() },
                { status: 'idle' as const, time: new Date(Date.now() - 8 * 3600000).toISOString() },
                { status: 'active' as const, time: new Date(Date.now() - 12 * 3600000).toISOString() },
              ].map((entry, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      'h-2.5 w-2.5 rounded-full',
                      i === 0 ? 'bg-brand' : 'bg-muted-foreground/30'
                    )} />
                    {i < 4 && <div className="w-px h-6 bg-border" />}
                  </div>
                  <div className="flex-1 -mt-0.5">
                    <TrolleyStatusBadge status={entry.status} />
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(entry.time), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Action Reason-Code Dialog */}
      <Dialog open={!!actionModal} onOpenChange={(open) => { if (!open) { setActionModal(null); setReasonCode(''); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionModal && (() => {
                const cfg = deviceActions.find((a) => a.key === actionModal.action);
                const Icon = cfg?.icon ?? Shield;
                return <><Icon className={cn('h-5 w-5', cfg?.color)} /> {cfg?.label}</>;
              })()}
            </DialogTitle>
            <DialogDescription>
              Device: <span className="font-mono font-medium">{actionModal?.device.id}</span> — This action will be logged in the audit trail.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Reason Code <span className="text-red-500">*</span></Label>
              <Select value={reasonCode.startsWith('preset:') ? reasonCode : ''} onValueChange={(v) => setReasonCode(v)}>
                <SelectTrigger><SelectValue placeholder="Select a reason..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="preset:Routine maintenance">Routine maintenance</SelectItem>
                  <SelectItem value="preset:Security concern">Security concern</SelectItem>
                  <SelectItem value="preset:Device malfunction">Device malfunction</SelectItem>
                  <SelectItem value="preset:Low battery lock">Low battery lock</SelectItem>
                  <SelectItem value="preset:Ops request">Ops request</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Or provide custom reason</Label>
              <Textarea placeholder="Describe the reason for this action..." value={reasonCode.startsWith('preset:') ? '' : reasonCode} onChange={(e) => setReasonCode(e.target.value)} rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setActionModal(null); setReasonCode(''); }}>Cancel</Button>
            <Button disabled={!reasonCode.trim()} onClick={handleExecuteAction}>Confirm & Log</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
