// ──────────────────────────────────────
// Gate Management Page — O-A3
// GateStatusBoard, GateBroadcast, GateChangeFeed + Impacted Orders
// ──────────────────────────────────────

import { useState, useMemo, useCallback } from 'react';
import { usePermissionsStore } from '@/store/permissions.store';
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
// Dialog removed — not needed in O-A3 rewrite
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import {
  DoorOpen,
  Search,
  AlertTriangle,
  Users,
  Megaphone,
  Clock,
  ShieldAlert,
  Activity,
  ChevronRight,
  X,
  Send,
  List,
  LayoutGrid,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

// ── Gate Status Model ──────────────────────────────
type GateStatus = 'Normal' | 'Congested' | 'Restricted' | 'Closed';

interface Gate {
  id: string;
  name: string;
  terminal: string;
  zone: string;
  status: GateStatus;
  flight_number: string | null;
  departure_time: string | null;
  passenger_count: number;
  trolley_count: number;
  active_orders: number;
  last_updated: string;
}

const mockGates: Gate[] = [
  { id: 'G-A01', name: 'Gate A1', terminal: 'Terminal 1', zone: 'Zone A', status: 'Normal', flight_number: 'EK-205', departure_time: '2026-02-24T11:30:00Z', passenger_count: 245, trolley_count: 12, active_orders: 8, last_updated: '2026-02-24T10:50:00Z' },
  { id: 'G-A02', name: 'Gate A2', terminal: 'Terminal 1', zone: 'Zone A', status: 'Congested', flight_number: 'QR-781', departure_time: '2026-02-24T12:00:00Z', passenger_count: 310, trolley_count: 18, active_orders: 15, last_updated: '2026-02-24T10:48:00Z' },
  { id: 'G-A12', name: 'Gate A12', terminal: 'Terminal 1', zone: 'Zone A', status: 'Normal', flight_number: 'EK-873', departure_time: '2026-02-24T11:45:00Z', passenger_count: 198, trolley_count: 10, active_orders: 6, last_updated: '2026-02-24T10:52:00Z' },
  { id: 'G-B05', name: 'Gate B5', terminal: 'Terminal 2', zone: 'Zone B', status: 'Normal', flight_number: 'SQ-422', departure_time: '2026-02-24T13:15:00Z', passenger_count: 180, trolley_count: 8, active_orders: 3, last_updated: '2026-02-24T10:45:00Z' },
  { id: 'G-B07', name: 'Gate B7', terminal: 'Terminal 2', zone: 'Zone B', status: 'Normal', flight_number: null, departure_time: null, passenger_count: 20, trolley_count: 2, active_orders: 0, last_updated: '2026-02-24T10:40:00Z' },
  { id: 'G-C03', name: 'Gate C3', terminal: 'Terminal 3', zone: 'Zone C', status: 'Closed', flight_number: null, departure_time: null, passenger_count: 0, trolley_count: 0, active_orders: 0, last_updated: '2026-02-24T09:00:00Z' },
  { id: 'G-C08', name: 'Gate C8', terminal: 'Terminal 3', zone: 'Zone C', status: 'Restricted', flight_number: null, departure_time: null, passenger_count: 0, trolley_count: 1, active_orders: 0, last_updated: '2026-02-24T08:00:00Z' },
  { id: 'G-D02', name: 'Gate D2', terminal: 'Terminal 3', zone: 'Zone D', status: 'Congested', flight_number: 'BA-108', departure_time: '2026-02-24T14:30:00Z', passenger_count: 275, trolley_count: 14, active_orders: 11, last_updated: '2026-02-24T10:55:00Z' },
];

const allStatuses: GateStatus[] = ['Normal', 'Congested', 'Restricted', 'Closed'];

const statusColor: Record<GateStatus, string> = {
  Normal: 'bg-emerald-500/20 text-emerald-500',
  Congested: 'bg-amber-500/20 text-amber-500',
  Restricted: 'bg-red-500/20 text-red-500',
  Closed: 'bg-gray-500/20 text-gray-500',
};

// ── Gate Change Feed Event ─────────────────────────
interface GateChangeEvent {
  id: string;
  gate_id: string;
  old_status: GateStatus;
  new_status: GateStatus;
  source: string;
  timestamp: string;
}

// ── Impacted order mock ────────────────────────────
interface ImpactedOrder {
  id: string;
  merchant: string;
  gate: string;
  status: string;
  eta: string;
}

function generateImpactedOrders(gateId: string): ImpactedOrder[] {
  const seed = gateId.charCodeAt(2) || 1;
  const count = (seed % 4) + 1;
  const orders: ImpactedOrder[] = [];
  const merchants = ['Airport Bites', 'Duty Free Delights', 'SkyLounge Cafe', 'Terminal Treats', 'CloudKitchen Express'];
  for (let i = 0; i < count; i++) {
    orders.push({
      id: `ORD-2025-${String(2000 + seed * 5 + i).padStart(4, '0')}`,
      merchant: merchants[(seed + i) % merchants.length],
      gate: gateId,
      status: i === 0 ? 'in_transit' : 'pending',
      eta: `${3 + i * 2} min`,
    });
  }
  return orders;
}

function logAudit(action: string, resourceId: string, resourceLabel: string) {
  usePermissionsStore.getState().addAuditEntry({
    id: `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    actor_id: 'USR-admin-001',
    actor_name: 'Admin User',
    actor_role: 'super_admin',
    action,
    resource_type: 'gate',
    resource_id: resourceId,
    resource_label: resourceLabel,
    changes: null,
    ip_address: '10.0.1.42',
    timestamp: new Date().toISOString(),
    result: 'success',
  });
}

export default function GateManagementPage() {
  const [gates, setGates] = useState<Gate[]>(mockGates);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<GateStatus | 'all'>('all');
  const [terminalFilter, setTerminalFilter] = useState<string>('all');
  const [tab, setTab] = useState<'board' | 'broadcast' | 'feed'>('board');

  // Change feed
  const [changeFeed, setChangeFeed] = useState<GateChangeEvent[]>([]);
  const [impactedOrdersGate, setImpactedOrdersGate] = useState<string | null>(null);
  const impactedOrders = useMemo(() => impactedOrdersGate ? generateImpactedOrders(impactedOrdersGate) : [], [impactedOrdersGate]);

  // Broadcast state
  const [broadcastTerminal, setBroadcastTerminal] = useState('all');
  const [broadcastGate, setBroadcastGate] = useState('all');
  const [broadcastMessage, setBroadcastMessage] = useState('');

  // Inline status update
  const handleStatusChange = useCallback((gateId: string, newStatus: GateStatus) => {
    setGates((prev) => {
      const gate = prev.find((g) => g.id === gateId);
      if (!gate || gate.status === newStatus) return prev;

      const oldStatus = gate.status;
      const event: GateChangeEvent = {
        id: `GCE-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        gate_id: gateId,
        old_status: oldStatus,
        new_status: newStatus,
        source: 'Admin User',
        timestamp: new Date().toISOString(),
      };
      setChangeFeed((f) => [event, ...f]);
      logAudit('gate_status_updated', gateId, `${gate.name}: ${oldStatus} \u2192 ${newStatus}`);
      toast.success(`${gate.name} updated to ${newStatus}`);

      return prev.map((g) => g.id === gateId ? { ...g, status: newStatus, last_updated: new Date().toISOString() } : g);
    });
  }, []);

  // Send broadcast
  const handleSendBroadcast = useCallback(() => {
    if (!broadcastMessage.trim()) return;
    const scope = broadcastTerminal === 'all' ? 'All terminals' : broadcastTerminal;
    logAudit('gate_broadcast_sent', broadcastGate === 'all' ? scope : broadcastGate, `Broadcast to ${scope}: ${broadcastMessage.slice(0, 80)}`);
    toast.success('Broadcast sent to ' + scope);
    setBroadcastMessage('');
  }, [broadcastTerminal, broadcastGate, broadcastMessage]);

  // Filtered gates
  const filtered = useMemo(() => gates.filter((g) => {
    if (search && !g.name.toLowerCase().includes(search.toLowerCase()) && !g.flight_number?.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && g.status !== statusFilter) return false;
    if (terminalFilter !== 'all' && g.terminal !== terminalFilter) return false;
    return true;
  }), [gates, search, statusFilter, terminalFilter]);

  const congestedCount = gates.filter((g) => g.status === 'Congested').length;
  const restrictedCount = gates.filter((g) => g.status === 'Restricted').length;
  const totalOrders = gates.reduce((s, g) => s + g.active_orders, 0);
  const closedCount = gates.filter((g) => g.status === 'Closed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 font-montserrat">
            <DoorOpen className="h-6 w-6 text-brand" />
            Gate Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1 font-lexend">
            Gate status, broadcasts, and change feed
          </p>
        </div>
        <Badge variant="outline" className="gap-1 self-start">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><p className="text-xs text-muted-foreground">Congested</p><p className="text-2xl font-bold text-amber-500">{congestedCount}</p></div><AlertTriangle className="h-8 w-8 text-amber-500/30" /></div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><p className="text-xs text-muted-foreground">Restricted</p><p className="text-2xl font-bold text-red-500">{restrictedCount}</p></div><ShieldAlert className="h-8 w-8 text-red-500/30" /></div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><p className="text-xs text-muted-foreground">Active Orders</p><p className="text-2xl font-bold text-primary">{totalOrders}</p></div><Clock className="h-8 w-8 text-primary/30" /></div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><p className="text-xs text-muted-foreground">Closed</p><p className="text-2xl font-bold text-gray-500">{closedCount}</p></div><DoorOpen className="h-8 w-8 text-gray-500/30" /></div></CardContent></Card>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        <Button variant={tab === 'board' ? 'default' : 'ghost'} size="sm" onClick={() => setTab('board')}><LayoutGrid className="h-4 w-4 mr-1" />Status Board</Button>
        <Button variant={tab === 'broadcast' ? 'default' : 'ghost'} size="sm" onClick={() => setTab('broadcast')}><Megaphone className="h-4 w-4 mr-1" />Broadcast</Button>
        <Button variant={tab === 'feed' ? 'default' : 'ghost'} size="sm" onClick={() => setTab('feed')}><List className="h-4 w-4 mr-1" />Change Feed</Button>
      </div>

      {/* ═══ Status Board Tab ═══ */}
      {tab === 'board' && (
        <>
          <Card>
            <CardContent className="pt-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search gates or flights..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as GateStatus | 'all')}>
                  <SelectTrigger className="w-full md:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {allStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={terminalFilter} onValueChange={setTerminalFilter}>
                  <SelectTrigger className="w-full md:w-40"><SelectValue placeholder="Terminal" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Terminals</SelectItem>
                    <SelectItem value="Terminal 1">Terminal 1</SelectItem>
                    <SelectItem value="Terminal 2">Terminal 2</SelectItem>
                    <SelectItem value="Terminal 3">Terminal 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Gate Status Board</CardTitle><CardDescription>{filtered.length} gates</CardDescription></CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Gate</TableHead>
                      <TableHead>Terminal</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Flight</TableHead>
                      <TableHead>Passengers</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Change Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((gate) => (
                      <TableRow key={gate.id} className={cn(gate.status === 'Congested' && 'bg-amber-500/5', gate.status === 'Restricted' && 'bg-red-500/5')}>
                        <TableCell className="font-mono font-medium">{gate.name}</TableCell>
                        <TableCell>{gate.terminal}</TableCell>
                        <TableCell><Badge className={cn('text-[11px]', statusColor[gate.status])}>{gate.status}</Badge></TableCell>
                        <TableCell className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(gate.last_updated), { addSuffix: true })}</TableCell>
                        <TableCell>{gate.flight_number ? <span className="font-mono text-sm">{gate.flight_number}</span> : <span className="text-muted-foreground">\u2014</span>}</TableCell>
                        <TableCell><div className="flex items-center gap-1"><Users className="h-3 w-3 text-muted-foreground" /><span className="font-mono">{gate.passenger_count}</span></div></TableCell>
                        <TableCell className="font-mono">{gate.active_orders}</TableCell>
                        <TableCell>
                          <Select value={gate.status} onValueChange={(v) => handleStatusChange(gate.id, v as GateStatus)}>
                            <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {allStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filtered.length === 0 && (
                <div className="text-center py-12"><DoorOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="font-semibold mb-1">No gates found</h3><p className="text-sm text-muted-foreground">Try adjusting your filters</p></div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* ═══ Broadcast Tab ═══ */}
      {tab === 'broadcast' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Megaphone className="h-4 w-4 text-brand" />Gate Broadcast</CardTitle>
            <CardDescription>Send operational messages to gate areas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Terminal Filter</Label>
                <Select value={broadcastTerminal} onValueChange={setBroadcastTerminal}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Terminals</SelectItem>
                    <SelectItem value="Terminal 1">Terminal 1</SelectItem>
                    <SelectItem value="Terminal 2">Terminal 2</SelectItem>
                    <SelectItem value="Terminal 3">Terminal 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Gate Range</Label>
                <Select value={broadcastGate} onValueChange={setBroadcastGate}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Gates</SelectItem>
                    {gates.filter((g) => broadcastTerminal === 'all' || g.terminal === broadcastTerminal).map((g) => (
                      <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Active Sessions Filter</Label>
                <Select defaultValue="all">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sessions</SelectItem>
                    <SelectItem value="with_orders">With Active Orders</SelectItem>
                    <SelectItem value="boarding">Boarding Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Broadcast Message</Label>
              <Textarea placeholder="Enter broadcast message for gate area..." value={broadcastMessage} onChange={(e) => setBroadcastMessage(e.target.value)} rows={3} />
            </div>
            <Button onClick={handleSendBroadcast} disabled={!broadcastMessage.trim()} className="gap-2">
              <Send className="h-4 w-4" />
              Send Broadcast
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ═══ Change Feed Tab ═══ */}
      {tab === 'feed' && (
        <div className="flex gap-4">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Activity className="h-4 w-4 text-brand" />Gate Change Feed</CardTitle>
              <CardDescription>{changeFeed.length} events recorded this session</CardDescription>
            </CardHeader>
            <CardContent>
              {changeFeed.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-1">No changes yet</h3>
                  <p className="text-sm text-muted-foreground">Gate status changes will appear here in real time</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event ID</TableHead>
                        <TableHead>Gate</TableHead>
                        <TableHead>Old Status</TableHead>
                        <TableHead>New Status</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Impacted</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {changeFeed.map((evt) => (
                        <TableRow key={evt.id}>
                          <TableCell className="font-mono text-xs">{evt.id}</TableCell>
                          <TableCell className="font-mono font-medium">{evt.gate_id}</TableCell>
                          <TableCell><Badge className={cn('text-[10px]', statusColor[evt.old_status])}>{evt.old_status}</Badge></TableCell>
                          <TableCell><Badge className={cn('text-[10px]', statusColor[evt.new_status])}>{evt.new_status}</Badge></TableCell>
                          <TableCell className="text-sm">{evt.source}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{new Date(evt.timestamp).toLocaleTimeString()}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => setImpactedOrdersGate(evt.gate_id)}>
                              View <ChevronRight className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Impacted Orders Drawer */}
          <AnimatePresence>
            {impactedOrdersGate && (
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.2 }}
                className="w-full lg:w-[360px] flex-shrink-0"
              >
                <Card className="h-full">
                  <CardHeader className="pb-2 flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-sm">Impacted Orders \u2014 {impactedOrdersGate}</CardTitle>
                      <CardDescription className="text-xs">Orders affected by this gate status change</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setImpactedOrdersGate(null)}><X className="h-4 w-4" /></Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {impactedOrders.map((o) => (
                        <div key={o.id} className="p-3 rounded-lg border text-sm space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-medium">{o.id}</span>
                            <Badge className={cn('text-[10px]', o.status === 'in_transit' ? 'bg-blue-500/20 text-blue-500' : 'bg-amber-500/20 text-amber-500')}>{o.status}</Badge>
                          </div>
                          <p className="text-muted-foreground text-xs">{o.merchant}</p>
                          <p className="text-xs">ETA: {o.eta}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
