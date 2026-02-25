// ──────────────────────────────────────
// Live Fleet Page — O-A1 Fleet Monitoring
// Table view with filters, DeviceDetail drawer, actions, audit
// ──────────────────────────────────────

import { useState, useMemo, useCallback } from 'react';
import { useTrolleysStore } from '@/store/trolleys.store';
import { usePermissionsStore } from '@/store/permissions.store';
import { useFleetLive } from '@/hooks/useFleetLive';
import type { Trolley } from '@/types/trolley.types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import {
  Search,
  Battery,
  BatteryWarning,
  Wifi,
  WifiOff,
  ShoppingCart,
  Lock,
  Unlock,
  RotateCcw,
  Wrench,
  X,
  ChevronRight,
  Shield,
  Cpu,
  Signal,
  Activity,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

type QuickFilter = 'all' | 'offline' | 'low-battery' | 'outdated' | 'low-confidence';

const OUTDATED_VERSION = '3.2.0';
const LOW_CONFIDENCE_THRESHOLD = 50;
const LOW_BATTERY_THRESHOLD = 20;

function zoneToTerminal(zone: string): string {
  if (zone.startsWith('Zone A') || zone.startsWith('Zone B')) return 'Terminal 1';
  if (zone.startsWith('Zone C') || zone.startsWith('Zone D')) return 'Terminal 2';
  return 'Terminal 3';
}

function compareVersions(a: string, b: string): number {
  const pa = a.replace(/-.*$/, '').split('.').map(Number);
  const pb = b.replace(/-.*$/, '').split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const na = pa[i] ?? 0;
    const nb = pb[i] ?? 0;
    if (na !== nb) return na - nb;
  }
  return 0;
}

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

type DeviceAction = 'lock' | 'unlock' | 'reboot' | 'maintenance';
const deviceActions: { key: DeviceAction; label: string; icon: React.ElementType; color: string }[] = [
  { key: 'lock', label: 'Lock Device', icon: Lock, color: 'text-red-500' },
  { key: 'unlock', label: 'Unlock Device', icon: Unlock, color: 'text-emerald-500' },
  { key: 'reboot', label: 'Reboot Device', icon: RotateCcw, color: 'text-blue-500' },
  { key: 'maintenance', label: 'Mark Maintenance', icon: Wrench, color: 'text-amber-500' },
];

function logAudit(action: string, resourceId: string, resourceLabel: string, _reason: string) {
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

interface LiveFleetPageProps {
  embedded?: boolean;
  initialDeviceId?: string | null;
}

export default function LiveFleetPage({ embedded = false, initialDeviceId = null }: LiveFleetPageProps) {
  const { trolleys, updateTrolley } = useTrolleysStore();
  useFleetLive();

  const [search, setSearch] = useState('');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(initialDeviceId);
  const [actionModal, setActionModal] = useState<{ action: DeviceAction; device: Trolley } | null>(null);
  const [reasonCode, setReasonCode] = useState('');

  const offlineCount = useMemo(() => trolleys.filter((t) => t.status === 'offline').length, [trolleys]);
  const lowBatteryCount = useMemo(() => trolleys.filter((t) => t.battery < LOW_BATTERY_THRESHOLD).length, [trolleys]);
  const outdatedCount = useMemo(() => trolleys.filter((t) => compareVersions(t.firmware_version, OUTDATED_VERSION) < 0).length, [trolleys]);
  const lowConfCount = useMemo(() => trolleys.filter((t) => (t.location_confidence ?? 100) < LOW_CONFIDENCE_THRESHOLD).length, [trolleys]);

  const filtered = useMemo(() => {
    return trolleys.filter((t) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !t.id.toLowerCase().includes(q) &&
          !t.imei.toLowerCase().includes(q) &&
          !t.serial_number.toLowerCase().includes(q) &&
          !zoneToTerminal(t.location.zone).toLowerCase().includes(q)
        ) return false;
      }
      switch (quickFilter) {
        case 'offline': return t.status === 'offline';
        case 'low-battery': return t.battery < LOW_BATTERY_THRESHOLD;
        case 'outdated': return compareVersions(t.firmware_version, OUTDATED_VERSION) < 0;
        case 'low-confidence': return (t.location_confidence ?? 100) < LOW_CONFIDENCE_THRESHOLD;
        default: return true;
      }
    });
  }, [trolleys, search, quickFilter]);

  const selectedDevice = selectedDeviceId ? trolleys.find((t) => t.id === selectedDeviceId) : null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const telemetry = useMemo(() => (selectedDevice ? generateTelemetry(selectedDevice) : []), [selectedDevice?.id]);

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
    logAudit('device_action_executed', device.id, `${action} - ${device.id}`, reasonCode.trim());
    toast.success(toastMsg);
    setActionModal(null);
    setReasonCode('');
  }, [actionModal, reasonCode, updateTrolley]);

  const StatusBadge = ({ status }: { status: Trolley['status'] }) => {
    const map: Record<Trolley['status'], { label: string; cls: string }> = {
      active: { label: 'Active', cls: 'bg-emerald-500/20 text-emerald-500' },
      idle: { label: 'Idle', cls: 'bg-sky-500/20 text-sky-500' },
      charging: { label: 'Charging', cls: 'bg-amber-500/20 text-amber-500' },
      maintenance: { label: 'Maintenance', cls: 'bg-purple-500/20 text-purple-500' },
      offline: { label: 'Offline', cls: 'bg-red-500/20 text-red-500' },
    };
    const c = map[status];
    return <Badge className={cn('text-[11px]', c.cls)}>{c.label}</Badge>;
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {!embedded && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 font-montserrat">
              <Activity className="h-6 w-6 text-brand" />
              Fleet List
            </h1>
            <p className="text-muted-foreground text-sm mt-1 font-lexend">
              Real-time device health, telemetry, and actions
            </p>
          </div>
          <Badge variant="outline" className="gap-1 self-start">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </Badge>
        </div>
      )}

      {/* Quick-filter chips */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search device ID, IMEI, terminal..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {([
          { key: 'all' as QuickFilter, label: 'All', count: trolleys.length },
          { key: 'offline' as QuickFilter, label: 'Offline', count: offlineCount },
          { key: 'low-battery' as QuickFilter, label: 'Low Battery', count: lowBatteryCount },
          { key: 'outdated' as QuickFilter, label: 'Outdated FW', count: outdatedCount },
          { key: 'low-confidence' as QuickFilter, label: 'Low Confidence', count: lowConfCount },
        ]).map(({ key, label, count }) => (
          <Button
            key={key}
            variant={quickFilter === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setQuickFilter(key)}
            className="gap-1"
          >
            {label}
            <Badge variant="secondary" className="ml-1 text-[10px] h-5 min-w-[20px] justify-center">
              {count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Main area */}
      <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
        <Card className={cn('flex-1 flex flex-col min-h-0 overflow-hidden transition-all', selectedDevice ? 'hidden lg:flex lg:flex-1' : 'flex-1')}>
          <CardHeader className="pb-2 flex-shrink-0">
            <CardTitle className="text-base">Devices</CardTitle>
            <CardDescription>{filtered.length} of {trolleys.length} devices</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto pb-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device ID</TableHead>
                    <TableHead>Terminal</TableHead>
                    <TableHead>Floor</TableHead>
                    <TableHead>Online</TableHead>
                    <TableHead>Battery</TableHead>
                    <TableHead>Last Seen</TableHead>
                    <TableHead>Firmware</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.slice(0, 60).map((t) => {
                    const isOnline = t.status !== 'offline';
                    const isSelected = t.id === selectedDeviceId;
                    return (
                      <TableRow
                        key={t.id}
                        className={cn('cursor-pointer transition-colors', isSelected && 'bg-brand/5', !isOnline && 'bg-red-500/5')}
                        onClick={() => setSelectedDeviceId(isSelected ? null : t.id)}
                      >
                        <TableCell className="font-mono font-medium text-sm">{t.id}</TableCell>
                        <TableCell className="text-sm">{zoneToTerminal(t.location.zone)}</TableCell>
                        <TableCell className="text-sm">F{t.location.floor}</TableCell>
                        <TableCell>
                          {isOnline ? <Wifi className="h-4 w-4 text-emerald-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {t.battery < LOW_BATTERY_THRESHOLD ? <BatteryWarning className="h-4 w-4 text-red-500" /> : <Battery className="h-4 w-4 text-emerald-500" />}
                            <span className={cn('font-mono text-sm', t.battery < LOW_BATTERY_THRESHOLD && 'text-red-500 font-semibold')}>{t.battery}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(t.last_seen), { addSuffix: true })}</TableCell>
                        <TableCell>
                          <span className={cn('font-mono text-sm', compareVersions(t.firmware_version, OUTDATED_VERSION) < 0 && 'text-amber-500')}>v{t.firmware_version}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Signal className={cn('h-3 w-3', (t.location_confidence ?? 100) < LOW_CONFIDENCE_THRESHOLD ? 'text-red-500' : 'text-emerald-500')} />
                            <span className={cn('font-mono text-sm', (t.location_confidence ?? 100) < LOW_CONFIDENCE_THRESHOLD && 'text-red-500')}>{t.location_confidence ?? 0}%</span>
                          </div>
                        </TableCell>
                        <TableCell><StatusBadge status={t.status} /></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-1">No devices match filters</h3>
                <p className="text-sm text-muted-foreground">Adjust your search or filters</p>
              </div>
            )}
            {filtered.length > 60 && (
              <p className="text-xs text-muted-foreground text-center mt-3">Showing first 60 of {filtered.length} devices. Use filters to narrow down.</p>
            )}
          </CardContent>
        </Card>

        {/* Device Detail Drawer */}
        <AnimatePresence>
          {selectedDevice && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.2 }}
              className="w-full lg:w-[480px] xl:w-[540px] flex-shrink-0 flex flex-col gap-4 overflow-y-auto"
            >
              <div className="flex items-center justify-between lg:justify-end">
                <Button variant="ghost" size="sm" className="lg:hidden gap-1" onClick={() => setSelectedDeviceId(null)}>
                  <ChevronRight className="h-4 w-4 rotate-180" /> Back to list
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedDeviceId(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Device Info Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-brand" />
                    Device Info — {selectedDevice.id}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="space-y-0.5"><p className="text-muted-foreground text-xs">Device ID</p><p className="font-mono font-medium">{selectedDevice.id}</p></div>
                    <div className="space-y-0.5"><p className="text-muted-foreground text-xs">IMEI</p><p className="font-mono">{selectedDevice.imei}</p></div>
                    <div className="space-y-0.5"><p className="text-muted-foreground text-xs">Terminal</p><p>{zoneToTerminal(selectedDevice.location.zone)}</p></div>
                    <div className="space-y-0.5"><p className="text-muted-foreground text-xs">Floor / Zone</p><p>F{selectedDevice.location.floor} — {selectedDevice.location.zone}</p></div>
                    <div className="space-y-0.5"><p className="text-muted-foreground text-xs">Online Status</p>
                      <div className="flex items-center gap-1">
                        {selectedDevice.status !== 'offline' ? (<><Wifi className="h-3.5 w-3.5 text-emerald-500" /> <span className="text-emerald-600 font-medium">Online</span></>) : (<><WifiOff className="h-3.5 w-3.5 text-red-500" /> <span className="text-red-600 font-medium">Offline</span></>)}
                      </div>
                    </div>
                    <div className="space-y-0.5"><p className="text-muted-foreground text-xs">Battery</p><p className={cn('font-mono font-medium', selectedDevice.battery < LOW_BATTERY_THRESHOLD ? 'text-red-500' : 'text-emerald-600')}>{selectedDevice.battery}%</p></div>
                    <div className="space-y-0.5"><p className="text-muted-foreground text-xs">Last Seen</p><p className="text-xs">{formatDistanceToNow(new Date(selectedDevice.last_seen), { addSuffix: true })}</p></div>
                    <div className="space-y-0.5"><p className="text-muted-foreground text-xs">Firmware</p><p className="font-mono">v{selectedDevice.firmware_version}</p></div>
                    <div className="space-y-0.5"><p className="text-muted-foreground text-xs">Confidence Score</p><p className={cn('font-mono font-medium', (selectedDevice.location_confidence ?? 100) < LOW_CONFIDENCE_THRESHOLD ? 'text-red-500' : 'text-emerald-600')}>{selectedDevice.location_confidence ?? 0}%</p></div>
                    <div className="space-y-0.5"><p className="text-muted-foreground text-xs">Status</p><StatusBadge status={selectedDevice.status} /></div>
                  </div>
                </CardContent>
              </Card>

              {/* Telemetry Timeline */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2"><Activity className="h-4 w-4 text-brand" />Telemetry Timeline (24h)</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>

              {/* Device Actions */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2"><Shield className="h-4 w-4 text-brand" />Device Actions</CardTitle>
                  <CardDescription className="text-xs">All actions require a mandatory reason code</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {deviceActions.map(({ key, label, icon: Icon, color }) => (
                      <Button key={key} variant="outline" size="sm" className="justify-start gap-2 h-10" onClick={() => setActionModal({ action: key, device: selectedDevice })}>
                        <Icon className={cn('h-4 w-4', color)} />
                        {label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
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
    </div>
  );
}
