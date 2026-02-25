// ──────────────────────────────────────
// Admin Ops Reports — O-A4
// OpsSummaryDashboard, MerchantSLA, DeviceUptime, IncidentReport, Export
// ──────────────────────────────────────

import { useState, useMemo, useCallback, useEffect } from 'react';
import { usePermissionsStore } from '@/store/permissions.store';
import { Button } from '@/components/ui/Button';
// Input removed — not used
import { Badge } from '@/components/ui/Badge';
import { Label } from '@/components/ui/Label';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  BarChart3,
  Users,
  Cpu,
  ShieldAlert,
  Clock,
  TrendingUp,
  AlertTriangle,
  Download,
  FileText,
  Wifi,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ── Audit helper ───────────────────────────────────
function logAudit(action: string, resourceId: string, resourceLabel: string) {
  usePermissionsStore.getState().addAuditEntry({
    id: `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    actor_id: 'USR-admin-001',
    actor_name: 'Admin User',
    actor_role: 'super_admin',
    action,
    resource_type: 'ops_report',
    resource_id: resourceId,
    resource_label: resourceLabel,
    changes: null,
    ip_address: '10.0.1.42',
    timestamp: new Date().toISOString(),
    result: 'success',
  });
}

// ── Types ──────────────────────────────────────────
type ReportTab = 'summary' | 'sla' | 'device' | 'incident';

// ── Mock KPI Data ──────────────────────────────────
const kpiData = {
  ActiveSessions: 1_248,
  OrdersPerHour: 312,
  AcceptanceSLABreaches: 18,
  DeliverySLABreaches: 7,
  IncidentsOpen: 4,
  DevicesOffline: 11,
};

// ── Merchant SLA mock ──────────────────────────────
interface MerchantSLA {
  name: string;
  terminal: string;
  avgAcceptance: number;    // seconds
  rejectRate: number;       // %
  delayRate: number;        // %
  complianceScore: number;  // 0-100
}

const merchantSLAData: MerchantSLA[] = [
  { name: 'Airport Bites', terminal: 'Terminal 1', avgAcceptance: 42, rejectRate: 2.1, delayRate: 5.8, complianceScore: 94 },
  { name: 'Duty Free Delights', terminal: 'Terminal 1', avgAcceptance: 38, rejectRate: 1.5, delayRate: 3.2, complianceScore: 97 },
  { name: 'SkyLounge Cafe', terminal: 'Terminal 2', avgAcceptance: 55, rejectRate: 4.3, delayRate: 8.1, complianceScore: 86 },
  { name: 'Terminal Treats', terminal: 'Terminal 2', avgAcceptance: 48, rejectRate: 3.0, delayRate: 6.5, complianceScore: 91 },
  { name: 'CloudKitchen Express', terminal: 'Terminal 3', avgAcceptance: 35, rejectRate: 1.2, delayRate: 2.9, complianceScore: 98 },
  { name: 'Runway Grill', terminal: 'Terminal 1', avgAcceptance: 60, rejectRate: 5.0, delayRate: 12.4, complianceScore: 79 },
  { name: 'Horizon Bakery', terminal: 'Terminal 3', avgAcceptance: 44, rejectRate: 2.8, delayRate: 4.6, complianceScore: 93 },
  { name: 'First Class Sushi', terminal: 'Terminal 2', avgAcceptance: 51, rejectRate: 3.5, delayRate: 7.2, complianceScore: 88 },
];

// ── Device Uptime mock ─────────────────────────────
const uptimeData = [
  { terminal: 'Terminal 1', uptimePercent: 97.2, avgOfflineMin: 18, devices: 96 },
  { terminal: 'Terminal 2', uptimePercent: 94.8, avgOfflineMin: 35, devices: 84 },
  { terminal: 'Terminal 3', uptimePercent: 98.1, avgOfflineMin: 12, devices: 100 },
];

const batteryTrendData = [
  { hour: '06:00', Terminal1: 85, Terminal2: 82, Terminal3: 88 },
  { hour: '08:00', Terminal1: 78, Terminal2: 75, Terminal3: 84 },
  { hour: '10:00', Terminal1: 72, Terminal2: 68, Terminal3: 79 },
  { hour: '12:00', Terminal1: 65, Terminal2: 60, Terminal3: 73 },
  { hour: '14:00', Terminal1: 58, Terminal2: 53, Terminal3: 67 },
  { hour: '16:00', Terminal1: 52, Terminal2: 48, Terminal3: 62 },
  { hour: '18:00', Terminal1: 70, Terminal2: 65, Terminal3: 76 },
  { hour: '20:00', Terminal1: 80, Terminal2: 74, Terminal3: 83 },
];

const offlineDistData = [
  { bucket: '<5 min', count: 32 },
  { bucket: '5-15 min', count: 18 },
  { bucket: '15-30 min', count: 7 },
  { bucket: '30-60 min', count: 3 },
  { bucket: '>60 min', count: 1 },
];

// ── Incident mock ──────────────────────────────────
const incidentByType = [
  { type: 'Device Offline', count: 14 },
  { type: 'SLA Breach', count: 25 },
  { type: 'Gate Congestion', count: 8 },
  { type: 'Runner No-show', count: 5 },
  { type: 'Payment Failure', count: 3 },
];

const incidentBySeverity = [
  { name: 'Critical', value: 4, color: '#ef4444' },
  { name: 'High', value: 12, color: '#f97316' },
  { name: 'Medium', value: 22, color: '#eab308' },
  { name: 'Low', value: 17, color: '#22c55e' },
];

const avgResolutionData = [
  { day: 'Mon', minutes: 42 },
  { day: 'Tue', minutes: 38 },
  { day: 'Wed', minutes: 55 },
  { day: 'Thu', minutes: 33 },
  { day: 'Fri', minutes: 47 },
  { day: 'Sat', minutes: 28 },
  { day: 'Sun', minutes: 25 },
];

const repeatIncidents = [
  { element: 'Device TRY-0042', occurrences: 5, lastSeen: '2h ago' },
  { element: 'Gate C3', occurrences: 3, lastSeen: '6h ago' },
  { element: 'Merchant: Runway Grill', occurrences: 4, lastSeen: '1d ago' },
  { element: 'Runner: Hassan Al-Rashid', occurrences: 2, lastSeen: '3h ago' },
];

// ── Orders-per-hour trend ──────────────────────────
const ordersPerHourTrend = [
  { hour: '06:00', orders: 45 },
  { hour: '07:00', orders: 112 },
  { hour: '08:00', orders: 235 },
  { hour: '09:00', orders: 298 },
  { hour: '10:00', orders: 312 },
  { hour: '11:00', orders: 287 },
  { hour: '12:00', orders: 342 },
  { hour: '13:00', orders: 318 },
  { hour: '14:00', orders: 265 },
  { hour: '15:00', orders: 289 },
  { hour: '16:00', orders: 301 },
  { hour: '17:00', orders: 278 },
  { hour: '18:00', orders: 198 },
];

// ── CSV Export ─────────────────────────────────────
function exportCSV(filename: string, headers: string[], rows: string[][]) {
  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
  logAudit('ops_report_exported', filename, `Exported ${filename}`);
  toast.success(`Exported ${filename}`);
}

// ── Component ──────────────────────────────────────
export default function AdminReportsPage() {
  const [tab, setTab] = useState<ReportTab>('summary');
  const [dateRange, setDateRange] = useState('today');
  const [terminal, setTerminal] = useState('all');

  // Log view on mount + tab change
  useEffect(() => {
    logAudit('ops_report_viewed', tab, `Viewed ${tab} report`);
  }, [tab]);

  // Filtered SLA data
  const filteredSLA = useMemo(
    () => merchantSLAData.filter((m) => terminal === 'all' || m.terminal === terminal),
    [terminal],
  );

  // Export handlers per tab
  const handleExport = useCallback(() => {
    if (tab === 'summary') {
      exportCSV('ops-summary.csv', ['KPI', 'Value'], Object.entries(kpiData).map(([k, v]) => [k, String(v)]));
    } else if (tab === 'sla') {
      exportCSV('merchant-sla.csv', ['Merchant', 'Terminal', 'AvgAcceptance(s)', 'RejectRate(%)', 'DelayRate(%)', 'Score'], filteredSLA.map((m) => [m.name, m.terminal, String(m.avgAcceptance), String(m.rejectRate), String(m.delayRate), String(m.complianceScore)]));
    } else if (tab === 'device') {
      exportCSV('device-uptime.csv', ['Terminal', 'Uptime(%)', 'AvgOffline(min)', 'Devices'], uptimeData.map((d) => [d.terminal, String(d.uptimePercent), String(d.avgOfflineMin), String(d.devices)]));
    } else {
      exportCSV('incident-report.csv', ['Type', 'Count'], incidentByType.map((i) => [i.type, String(i.count)]));
    }
  }, [tab, filteredSLA]);

  const tabs: { id: ReportTab; label: string; icon: React.ReactNode }[] = [
    { id: 'summary', label: 'Ops Summary', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'sla', label: 'Merchant SLA', icon: <Clock className="h-4 w-4" /> },
    { id: 'device', label: 'Device Uptime', icon: <Cpu className="h-4 w-4" /> },
    { id: 'incident', label: 'Incidents', icon: <ShieldAlert className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 font-montserrat">
            <FileText className="h-6 w-6 text-brand" />
            Ops Reports
          </h1>
          <p className="text-muted-foreground text-sm mt-1 font-lexend">
            Operational KPIs, SLA compliance, device health, and incident analytics
          </p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2 self-start">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Global Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-1.5">
              <Label className="text-xs">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-1.5">
              <Label className="text-xs">Terminal</Label>
              <Select value={terminal} onValueChange={setTerminal}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Terminals</SelectItem>
                  <SelectItem value="Terminal 1">Terminal 1</SelectItem>
                  <SelectItem value="Terminal 2">Terminal 2</SelectItem>
                  <SelectItem value="Terminal 3">Terminal 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit flex-wrap">
        {tabs.map((t) => (
          <Button key={t.id} variant={tab === t.id ? 'default' : 'ghost'} size="sm" onClick={() => setTab(t.id)} className="gap-1.5">
            {t.icon}{t.label}
          </Button>
        ))}
      </div>

      {/* ═══ Summary Tab ═══ */}
      {tab === 'summary' && (
        <div className="space-y-6">
          {/* KPI cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Active Sessions', value: kpiData.ActiveSessions.toLocaleString(), icon: <Users className="h-5 w-5" />, color: 'text-blue-500' },
              { label: 'Orders / Hour', value: kpiData.OrdersPerHour, icon: <TrendingUp className="h-5 w-5" />, color: 'text-emerald-500' },
              { label: 'Accept SLA Breaches', value: kpiData.AcceptanceSLABreaches, icon: <AlertTriangle className="h-5 w-5" />, color: 'text-amber-500' },
              { label: 'Delivery SLA Breaches', value: kpiData.DeliverySLABreaches, icon: <Clock className="h-5 w-5" />, color: 'text-red-500' },
              { label: 'Incidents Open', value: kpiData.IncidentsOpen, icon: <ShieldAlert className="h-5 w-5" />, color: 'text-orange-500' },
              { label: 'Devices Offline', value: kpiData.DevicesOffline, icon: <Wifi className="h-5 w-5" />, color: 'text-gray-500' },
            ].map((kpi) => (
              <Card key={kpi.label}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn('opacity-60', kpi.color)}>{kpi.icon}</span>
                  </div>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Orders per hour trend */}
          <Card>
            <CardHeader><CardTitle className="text-base">Orders Per Hour Trend</CardTitle></CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ordersPerHourTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ═══ Merchant SLA Tab ═══ */}
      {tab === 'sla' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Merchant SLA Compliance</CardTitle>
            <CardDescription>Ranked by SLA compliance score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Merchant Name</TableHead>
                    <TableHead>Terminal</TableHead>
                    <TableHead>Avg Acceptance (s)</TableHead>
                    <TableHead>Reject Rate (%)</TableHead>
                    <TableHead>Delay Rate (%)</TableHead>
                    <TableHead>SLA Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...filteredSLA].sort((a, b) => b.complianceScore - a.complianceScore).map((m, i) => (
                    <TableRow key={m.name}>
                      <TableCell className="font-mono text-muted-foreground">{i + 1}</TableCell>
                      <TableCell className="font-medium">{m.name}</TableCell>
                      <TableCell>{m.terminal}</TableCell>
                      <TableCell className="font-mono">{m.avgAcceptance}s</TableCell>
                      <TableCell className="font-mono">{m.rejectRate}%</TableCell>
                      <TableCell className={cn('font-mono', m.delayRate > 8 && 'text-red-500')}>{m.delayRate}%</TableCell>
                      <TableCell>
                        <Badge className={cn('font-mono text-xs',
                          m.complianceScore >= 95 ? 'bg-emerald-500/20 text-emerald-500' :
                          m.complianceScore >= 85 ? 'bg-amber-500/20 text-amber-500' :
                          'bg-red-500/20 text-red-500'
                        )}>
                          {m.complianceScore}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ═══ Device Uptime Tab ═══ */}
      {tab === 'device' && (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {uptimeData.map((d) => (
              <Card key={d.terminal}>
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1">{d.terminal}</p>
                  <p className={cn('text-3xl font-bold', d.uptimePercent >= 97 ? 'text-emerald-500' : d.uptimePercent >= 95 ? 'text-amber-500' : 'text-red-500')}>
                    {d.uptimePercent}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Avg offline: {d.avgOfflineMin} min &middot; {d.devices} devices
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Battery Trend */}
          <Card>
            <CardHeader><CardTitle className="text-base">Average Battery Level Trend</CardTitle></CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={batteryTrendData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} unit="%" />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', borderRadius: 8, fontSize: 12 }} />
                    <Legend />
                    <Line type="monotone" dataKey="Terminal1" stroke="#3b82f6" strokeWidth={2} dot={false} name="Terminal 1" />
                    <Line type="monotone" dataKey="Terminal2" stroke="#f97316" strokeWidth={2} dot={false} name="Terminal 2" />
                    <Line type="monotone" dataKey="Terminal3" stroke="#22c55e" strokeWidth={2} dot={false} name="Terminal 3" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Offline Distribution */}
          <Card>
            <CardHeader><CardTitle className="text-base">Offline Duration Distribution</CardTitle></CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={offlineDistData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="bucket" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="count" fill="#f97316" radius={[4,4,0,0]} name="Occurrences" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ═══ Incident Tab ═══ */}
      {tab === 'incident' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* By Type */}
            <Card>
              <CardHeader><CardTitle className="text-base">Incident Volume by Type</CardTitle></CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={incidentByType} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis dataKey="type" type="category" tick={{ fontSize: 11 }} width={120} />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', borderRadius: 8, fontSize: 12 }} />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0,4,4,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* By Severity */}
            <Card>
              <CardHeader><CardTitle className="text-base">Incident Volume by Severity</CardTitle></CardHeader>
              <CardContent>
                <div className="h-56 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={incidentBySeverity} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`} labelLine={false}>
                        {incidentBySeverity.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', borderRadius: 8, fontSize: 12 }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Avg Time to Resolve */}
          <Card>
            <CardHeader><CardTitle className="text-base">Average Time to Resolve (minutes)</CardTitle></CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={avgResolutionData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} unit=" min" />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', borderRadius: 8, fontSize: 12 }} />
                    <Line type="monotone" dataKey="minutes" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: '#ef4444' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Repeat Incidents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Repeat Incidents</CardTitle>
              <CardDescription>Elements with recurring incidents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Element</TableHead>
                      <TableHead>Occurrences</TableHead>
                      <TableHead>Last Seen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {repeatIncidents.map((r) => (
                      <TableRow key={r.element}>
                        <TableCell className="font-medium">{r.element}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">{r.occurrences}</Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{r.lastSeen}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
