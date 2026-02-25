// ──────────────────────────────────────
// Runners Page — O-A2 Runners Monitoring
// RunnerList → RunnerDetail (orders history, route, escalation)
// Performance analytics with failure reasons
// ──────────────────────────────────────

import { useState, useMemo, useCallback } from 'react';
import { useRunnersStore } from '@/store/runners.store';
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
  UserCheck,
  Search,
  Clock,
  MapPin,
  Activity,
  TrendingUp,
  Users,
  Truck,
  Coffee,
  WifiOff,
  X,
  ChevronRight,
  AlertTriangle,
  ArrowRightLeft,
  Trash2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { runnerPerformanceData } from '@/data/mock/runners.mock';
import type { Runner, RunnerStatus } from '@/types/runner.types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const statusConfig: Record<RunnerStatus, { label: string; color: string; icon: React.ElementType }> = {
  available: { label: 'Available', color: 'bg-emerald-500/20 text-emerald-500', icon: UserCheck },
  assigned: { label: 'Assigned', color: 'bg-blue-500/20 text-blue-500', icon: Truck },
  in_transit: { label: 'In Transit', color: 'bg-cyan-500/20 text-cyan-500', icon: Activity },
  returning: { label: 'Returning', color: 'bg-violet-500/20 text-violet-500', icon: MapPin },
  on_break: { label: 'On Break', color: 'bg-amber-500/20 text-amber-500', icon: Coffee },
  offline: { label: 'Offline', color: 'bg-red-500/20 text-red-500', icon: WifiOff },
};

// Mock assigned orders history for runner detail
interface RunnerOrder {
  id: string;
  assigned_at: string;
  delivered_at: string | null;
  status: 'delivered' | 'in_progress' | 'failed' | 'cancelled';
}
function generateRunnerOrders(runnerId: string): RunnerOrder[] {
  const orders: RunnerOrder[] = [];
  const now = Date.now();
  const seed = runnerId.charCodeAt(4) || 1;
  for (let i = 0; i < 12; i++) {
    const assigned = new Date(now - (i * 45 + seed * 3) * 60000);
    const statuses: RunnerOrder['status'][] = ['delivered', 'delivered', 'delivered', 'delivered', 'in_progress', 'failed', 'cancelled'];
    const st = statuses[(seed + i) % statuses.length];
    orders.push({
      id: `ORD-2025-${String(1000 + seed * 10 + i).padStart(4, '0')}`,
      assigned_at: assigned.toISOString(),
      delivered_at: st === 'delivered' ? new Date(assigned.getTime() + (6 + (seed + i) % 8) * 60000).toISOString() : null,
      status: st,
    });
  }
  return orders;
}

// Failure reasons mock
const failureReasons = [
  { name: 'Customer No-Show', value: 28, color: '#ef4444' },
  { name: 'Wrong Gate Info', value: 18, color: '#f59e0b' },
  { name: 'Shop Closed', value: 12, color: '#6366f1' },
  { name: 'Item Unavailable', value: 8, color: '#06b6d4' },
  { name: 'Runner Device Issue', value: 5, color: '#8b5cf6' },
];

type EscalationAction = 'remove_assignment' | 'reassign_order';

function logAudit(action: string, resourceId: string, resourceLabel: string) {
  usePermissionsStore.getState().addAuditEntry({
    id: `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    actor_id: 'USR-admin-001',
    actor_name: 'Admin User',
    actor_role: 'super_admin',
    action,
    resource_type: 'runner',
    resource_id: resourceId,
    resource_label: resourceLabel,
    changes: null,
    ip_address: '10.0.1.42',
    timestamp: new Date().toISOString(),
    result: 'success',
  });
}

export default function RunnersPage() {
  const { runners, updateRunnerStatus, unassignOrder } = useRunnersStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<RunnerStatus | 'all'>('all');
  const [view, setView] = useState<'list' | 'performance'>('list');
  const [selectedRunnerId, setSelectedRunnerId] = useState<string | null>(null);
  const [escalationModal, setEscalationModal] = useState<{ action: EscalationAction; runner: Runner } | null>(null);
  const [reasonCode, setReasonCode] = useState('');

  const filtered = useMemo(() => runners.filter((r) => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.name.toLowerCase().includes(q) && !r.employee_id.toLowerCase().includes(q)) return false;
    }
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    return true;
  }), [runners, search, statusFilter]);

  const availableCount = runners.filter((r) => r.status === 'available').length;
  const assignedCount = runners.filter((r) => ['assigned', 'in_transit'].includes(r.status)).length;
  const onBreakCount = runners.filter((r) => r.status === 'on_break').length;
  const offlineCount = runners.filter((r) => r.status === 'offline').length;

  const selectedRunner = selectedRunnerId ? runners.find((r) => r.id === selectedRunnerId) : null;
  const runnerOrders = useMemo(() => selectedRunner ? generateRunnerOrders(selectedRunner.id) : [], [selectedRunner?.id]);

  // Performance score = completion_rate_pct averaged with acceptance_rate_pct
  const getPerformanceScore = (r: Runner) => Math.round((r.acceptance_rate_pct + r.completion_rate_pct) / 2);

  const handleEscalation = useCallback(() => {
    if (!escalationModal || !reasonCode.trim()) return;
    const { action, runner } = escalationModal;
    if (action === 'remove_assignment') {
      unassignOrder(runner.id);
      logAudit('runner_reassigned_by_ops', runner.id, `Removed assignment from ${runner.name}`);
      toast.success(`Assignment removed from ${runner.name}`);
    } else {
      unassignOrder(runner.id);
      updateRunnerStatus(runner.id, 'available');
      logAudit('runner_reassigned_by_ops', runner.id, `Reassigned order from ${runner.name}`);
      toast.success(`Order reassigned from ${runner.name}`);
    }
    setEscalationModal(null);
    setReasonCode('');
  }, [escalationModal, reasonCode, unassignOrder, updateRunnerStatus]);

  // Performance aggregates for analytics bar chart
  const perfBarData = useMemo(() => runnerPerformanceData.map((p) => ({
    name: p.runner_name.split(' ')[0],
    onTime: Math.round(100 - (p.sla_breach_count / Math.max(p.total_deliveries, 1)) * 100),
    avgDelivery: p.avg_delivery_minutes,
    failRate: Math.round((p.fail_count / Math.max(p.total_deliveries, 1)) * 100),
  })), []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 font-montserrat">
            <UserCheck className="h-6 w-6 text-brand" />
            Runners
          </h1>
          <p className="text-muted-foreground text-sm mt-1 font-lexend">
            Runner management, assignment tracking, and performance metrics
          </p>
        </div>
        <Badge variant="outline" className="gap-1 self-start">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><p className="text-xs text-muted-foreground">Available</p><p className="text-2xl font-bold text-emerald-500">{availableCount}</p></div><UserCheck className="h-8 w-8 text-emerald-500/30" /></div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><p className="text-xs text-muted-foreground">Assigned / In Transit</p><p className="text-2xl font-bold text-blue-500">{assignedCount}</p></div><Truck className="h-8 w-8 text-blue-500/30" /></div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><p className="text-xs text-muted-foreground">On Break</p><p className="text-2xl font-bold text-amber-500">{onBreakCount}</p></div><Coffee className="h-8 w-8 text-amber-500/30" /></div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><p className="text-xs text-muted-foreground">Offline</p><p className="text-2xl font-bold text-red-500">{offlineCount}</p></div><WifiOff className="h-8 w-8 text-red-500/30" /></div></CardContent></Card>
      </div>

      {/* View Toggle + Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          <Button variant={view === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setView('list')}><Users className="h-4 w-4 mr-1" />Runner List</Button>
          <Button variant={view === 'performance' ? 'default' : 'ghost'} size="sm" onClick={() => setView('performance')}><TrendingUp className="h-4 w-4 mr-1" />Performance</Button>
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search runners by name or ID..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as RunnerStatus | 'all')}>
          <SelectTrigger className="w-full md:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="in_transit">In Transit</SelectItem>
            <SelectItem value="returning">Returning</SelectItem>
            <SelectItem value="on_break">On Break</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Runner List View */}
      {view === 'list' && (
        <div className="flex gap-4">
          {/* Table */}
          <Card className={cn('flex-1', selectedRunner && 'hidden lg:block')}>
            <CardHeader>
              <CardTitle className="text-base">Active Runners</CardTitle>
              <CardDescription>{filtered.length} runners — click a row for details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Runner</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Current Order</TableHead>
                      <TableHead>Last Update</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((runner) => {
                      const config = statusConfig[runner.status];
                      const StatusIcon = config.icon;
                      const isSelected = runner.id === selectedRunnerId;
                      return (
                        <TableRow
                          key={runner.id}
                          className={cn('cursor-pointer transition-colors', isSelected && 'bg-brand/5')}
                          onClick={() => setSelectedRunnerId(isSelected ? null : runner.id)}
                        >
                          <TableCell>
                            <div><p className="font-medium">{runner.name}</p><p className="text-xs text-muted-foreground font-mono">{runner.employee_id}</p></div>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn('gap-1', config.color)}><StatusIcon className="h-3 w-3" />{config.label}</Badge>
                          </TableCell>
                          <TableCell>
                            {runner.current_order_id ? <span className="font-mono text-sm text-primary">{runner.current_order_id}</span> : <span className="text-muted-foreground text-sm">—</span>}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">{formatDistanceToNow(new Date(runner.last_seen), { addSuffix: true })}</TableCell>
                          <TableCell>
                            <span className={cn('font-mono font-medium', getPerformanceScore(runner) >= 95 ? 'text-emerald-500' : getPerformanceScore(runner) >= 85 ? 'text-amber-500' : 'text-red-500')}>
                              {getPerformanceScore(runner)}%
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              {filtered.length === 0 && (
                <div className="text-center py-12"><UserCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="font-semibold mb-1">No runners found</h3><p className="text-sm text-muted-foreground">Try adjusting your filters</p></div>
              )}
            </CardContent>
          </Card>

          {/* Runner Detail Panel */}
          <AnimatePresence>
            {selectedRunner && (
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.2 }}
                className="w-full lg:w-[480px] xl:w-[520px] flex-shrink-0 flex flex-col gap-4 overflow-y-auto"
              >
                <div className="flex items-center justify-between lg:justify-end">
                  <Button variant="ghost" size="sm" className="lg:hidden gap-1" onClick={() => setSelectedRunnerId(null)}>
                    <ChevronRight className="h-4 w-4 rotate-180" /> Back
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedRunnerId(null)}><X className="h-4 w-4" /></Button>
                </div>

                {/* Current Route Summary */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2"><MapPin className="h-4 w-4 text-brand" />Current Route Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedRunner.current_order_id ? (
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="space-y-0.5"><p className="text-muted-foreground text-xs">Pickup Location</p><p className="font-medium">{selectedRunner.current_zone}</p></div>
                        <div className="space-y-0.5"><p className="text-muted-foreground text-xs">Dropoff Gate</p><p className="font-medium">{selectedRunner.current_gate || 'N/A'}</p></div>
                        <div className="space-y-0.5"><p className="text-muted-foreground text-xs">ETA</p><p className="font-mono">{Math.floor(3 + Math.random() * 8)} min</p></div>
                        <div className="space-y-0.5"><p className="text-muted-foreground text-xs">Distance Remaining</p><p className="font-mono">{(0.1 + Math.random() * 0.8).toFixed(2)} km</p></div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No active route — runner is {selectedRunner.status.replace('_', ' ')}</p>
                    )}
                  </CardContent>
                </Card>

                {/* Escalation Actions */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-brand" />Escalation Actions</CardTitle>
                    <CardDescription className="text-xs">Ops interventions require reason codes</CardDescription>
                  </CardHeader>
                  <CardContent className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      disabled={!selectedRunner.current_order_id}
                      onClick={() => setEscalationModal({ action: 'remove_assignment', runner: selectedRunner })}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-500" /> Remove Assignment
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      disabled={!selectedRunner.current_order_id}
                      onClick={() => setEscalationModal({ action: 'reassign_order', runner: selectedRunner })}
                    >
                      <ArrowRightLeft className="h-3.5 w-3.5 text-blue-500" /> Reassign Order
                    </Button>
                  </CardContent>
                </Card>

                {/* Assigned Orders History */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2"><Clock className="h-4 w-4 text-brand" />Assigned Orders History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Assigned</TableHead>
                            <TableHead>Delivered</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {runnerOrders.map((o) => (
                            <TableRow key={o.id}>
                              <TableCell className="font-mono text-sm">{o.id}</TableCell>
                              <TableCell className="text-xs text-muted-foreground">{new Date(o.assigned_at).toLocaleTimeString()}</TableCell>
                              <TableCell className="text-xs text-muted-foreground">{o.delivered_at ? new Date(o.delivered_at).toLocaleTimeString() : '—'}</TableCell>
                              <TableCell>
                                <Badge className={cn('text-[11px]',
                                  o.status === 'delivered' && 'bg-emerald-500/20 text-emerald-500',
                                  o.status === 'in_progress' && 'bg-blue-500/20 text-blue-500',
                                  o.status === 'failed' && 'bg-red-500/20 text-red-500',
                                  o.status === 'cancelled' && 'bg-gray-500/20 text-gray-500',
                                )}>{o.status}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Performance View */}
      {view === 'performance' && (
        <div className="space-y-6">
          {/* Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Runner Performance Metrics</CardTitle>
              <CardDescription>Historical performance breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Runner</TableHead>
                      <TableHead>Total Deliveries</TableHead>
                      <TableHead>Avg Acceptance</TableHead>
                      <TableHead>Avg Delivery</TableHead>
                      <TableHead>Completion Rate</TableHead>
                      <TableHead>SLA Breaches</TableHead>
                      <TableHead>Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {runnerPerformanceData.map((perf) => (
                      <TableRow key={perf.runner_id}>
                        <TableCell><div><p className="font-medium">{perf.runner_name}</p><p className="text-xs text-muted-foreground font-mono">{perf.runner_id}</p></div></TableCell>
                        <TableCell className="font-mono">{perf.total_deliveries}</TableCell>
                        <TableCell><span className={cn('font-mono', perf.avg_acceptance_seconds > 30 ? 'text-red-500' : 'text-emerald-500')}>{perf.avg_acceptance_seconds}s</span></TableCell>
                        <TableCell><span className={cn('font-mono', perf.avg_delivery_minutes > 10 ? 'text-amber-500' : 'text-emerald-500')}>{perf.avg_delivery_minutes}m</span></TableCell>
                        <TableCell><span className={cn('font-mono', perf.completion_rate_pct < 95 ? 'text-red-500' : 'text-emerald-500')}>{perf.completion_rate_pct}%</span></TableCell>
                        <TableCell><Badge variant={perf.sla_breach_count > 5 ? 'destructive' : 'outline'}>{perf.sla_breach_count}</Badge></TableCell>
                        <TableCell><div className="flex items-center gap-1"><span className="text-amber-500">★</span><span className="font-mono">{perf.rating.toFixed(1)}</span></div></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Charts */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* On-Time / Avg Delivery / Failure Rate bar chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Performance Overview</CardTitle>
                <CardDescription className="text-xs">On-time %, avg delivery (min), failure rate %</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={perfBarData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                      <Bar dataKey="onTime" fill="#10b981" name="On-Time %" radius={[4,4,0,0]} />
                      <Bar dataKey="avgDelivery" fill="#6366f1" name="Avg Delivery (m)" radius={[4,4,0,0]} />
                      <Bar dataKey="failRate" fill="#ef4444" name="Fail Rate %" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Failure Reasons Pie */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Failure Reasons Distribution</CardTitle>
                <CardDescription className="text-xs">Top reasons for delivery failures</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-56 flex items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={failureReasons} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                        {failureReasons.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 justify-center">
                  {failureReasons.map((fr) => (
                    <span key={fr.name} className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: fr.color }} />
                      {fr.name}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Escalation Reason-Code Dialog */}
      <Dialog open={!!escalationModal} onOpenChange={(open) => { if (!open) { setEscalationModal(null); setReasonCode(''); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {escalationModal?.action === 'remove_assignment' ? <><Trash2 className="h-5 w-5 text-red-500" /> Remove Assignment</> : <><ArrowRightLeft className="h-5 w-5 text-blue-500" /> Reassign Order</>}
            </DialogTitle>
            <DialogDescription>
              Runner: <span className="font-medium">{escalationModal?.runner.name}</span> — This action will be logged.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Reason Code <span className="text-red-500">*</span></Label>
              <Select value={reasonCode.startsWith('preset:') ? reasonCode : ''} onValueChange={(v) => setReasonCode(v)}>
                <SelectTrigger><SelectValue placeholder="Select a reason..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="preset:Runner unresponsive">Runner unresponsive</SelectItem>
                  <SelectItem value="preset:Customer complaint">Customer complaint</SelectItem>
                  <SelectItem value="preset:SLA at risk">SLA at risk</SelectItem>
                  <SelectItem value="preset:Route blocked">Route blocked</SelectItem>
                  <SelectItem value="preset:Ops manager override">Ops manager override</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Or provide custom reason</Label>
              <Textarea placeholder="Describe the reason..." value={reasonCode.startsWith('preset:') ? '' : reasonCode} onChange={(e) => setReasonCode(e.target.value)} rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEscalationModal(null); setReasonCode(''); }}>Cancel</Button>
            <Button disabled={!reasonCode.trim()} onClick={handleEscalation}>Confirm & Log</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
