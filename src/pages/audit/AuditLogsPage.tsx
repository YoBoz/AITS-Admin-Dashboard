// ──────────────────────────────────────
// Audit Logs Page — Standalone top-level audit log
// Enhanced with date range and entity type filters
// ──────────────────────────────────────

import { useState, useMemo } from 'react';
import { usePermissionsStore } from '@/store/permissions.store';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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
  ScrollText,
  Search,
  RefreshCw,
  Download,
  Filter,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Clock,
  User,
  FileText,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { AuditLogEntry } from '@/types/permissions.types';

const actionOptions = [
  { value: 'all', label: 'All Actions' },
  { value: 'user.login', label: 'User Login' },
  { value: 'user.created', label: 'User Created' },
  { value: 'user.suspended', label: 'User Suspended' },
  { value: 'role.created', label: 'Role Created' },
  { value: 'role.updated', label: 'Role Updated' },
  { value: 'permission.granted', label: 'Permission Granted' },
  { value: 'settings.updated', label: 'Settings Updated' },
  { value: 'order.override', label: 'Order Override' },
  { value: 'device.action', label: 'Device Action' },
  { value: 'incident.created', label: 'Incident Created' },
  { value: 'incident.resolved', label: 'Incident Resolved' },
  { value: 'policy.override', label: 'Policy Override' },
];

const resultOptions = [
  { value: 'all', label: 'All Results' },
  { value: 'success', label: 'Success' },
  { value: 'failed', label: 'Failed' },
  { value: 'blocked', label: 'Blocked' },
];

const entityOptions = [
  { value: 'all', label: 'All Entities' },
  { value: 'user', label: 'Users' },
  { value: 'role', label: 'Roles' },
  { value: 'order', label: 'Orders' },
  { value: 'device', label: 'Devices' },
  { value: 'incident', label: 'Incidents' },
  { value: 'policy', label: 'Policies' },
  { value: 'settings', label: 'Settings' },
];

function ChangesCell({ changes }: { changes: AuditLogEntry['changes'] }) {
  const [expanded, setExpanded] = useState(false);
  if (!changes || changes.length === 0) return <span className="text-muted-foreground">—</span>;
  return (
    <div>
      <button className="flex items-center gap-1 text-primary text-[10px] hover:underline" onClick={() => setExpanded(!expanded)}>
        {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        {changes.length} change{changes.length > 1 ? 's' : ''}
      </button>
      {expanded && (
        <div className="mt-1 text-[10px] space-y-1 bg-muted/50 rounded p-2">
          {changes.map((c, i) => (
            <div key={i} className="flex gap-2 font-mono">
              <span className="text-muted-foreground">{c.field}:</span>
              {c.from && <span className="text-red-400 line-through">{c.from}</span>}
              <span className="text-emerald-500">{c.to}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AuditLogsPage() {
  const { auditLog } = usePermissionsStore();
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [resultFilter, setResultFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = useMemo(() => {
    return auditLog.filter((entry) => {
      if (search) {
        const q = search.toLowerCase();
        if (!entry.actor_name.toLowerCase().includes(q) &&
            !entry.action.toLowerCase().includes(q) &&
            !(entry.resource_type || '').toLowerCase().includes(q) &&
            !(entry.resource_id || '').toLowerCase().includes(q)) return false;
      }
      if (actionFilter !== 'all' && entry.action !== actionFilter) return false;
      if (resultFilter !== 'all' && entry.result !== resultFilter) return false;
      if (entityFilter !== 'all') {
        const entityType = entry.action.split('.')[0];
        if (entityType !== entityFilter) return false;
      }
      if (dateFrom) {
        if (new Date(entry.timestamp) < new Date(dateFrom)) return false;
      }
      if (dateTo) {
        if (new Date(entry.timestamp) > new Date(dateTo + 'T23:59:59')) return false;
      }
      return true;
    });
  }, [auditLog, search, actionFilter, resultFilter, entityFilter, dateFrom, dateTo]);

  const successCount = auditLog.filter((e) => e.result === 'success').length;
  const failedCount = auditLog.filter((e) => e.result === 'failed').length;
  const blockedCount = auditLog.filter((e) => e.result === 'blocked').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ScrollText className="h-6 w-6 text-primary" />
            Audit Logs
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Immutable record of all system actions, overrides, and security events
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Entries</p>
                <p className="text-2xl font-bold">{auditLog.length}</p>
              </div>
              <FileText className="h-8 w-8 text-primary/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Successful</p>
                <p className="text-2xl font-bold text-emerald-500">{successCount}</p>
              </div>
              <ShieldCheck className="h-8 w-8 text-emerald-500/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-red-500">{failedCount}</p>
              </div>
              <Clock className="h-8 w-8 text-red-500/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Blocked</p>
                <p className="text-2xl font-bold text-amber-500">{blockedCount}</p>
              </div>
              <User className="h-8 w-8 text-amber-500/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {/* Row 1: Search */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by actor, action, resource..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            {/* Row 2: Filters */}
            <div className="flex flex-wrap gap-3">
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Action" /></SelectTrigger>
                <SelectContent>
                  {actionOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Entity" /></SelectTrigger>
                <SelectContent>
                  {entityOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={resultFilter} onValueChange={setResultFilter}>
                <SelectTrigger className="w-[140px]"><SelectValue placeholder="Result" /></SelectTrigger>
                <SelectContent>
                  {resultOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input type="date" placeholder="From" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-[160px]" />
              <Input type="date" placeholder="To" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-[160px]" />
            </div>
          </div>
          {(search || actionFilter !== 'all' || resultFilter !== 'all' || entityFilter !== 'all' || dateFrom || dateTo) && (
            <div className="mt-3 flex items-center gap-2">
              <Badge variant="outline" className="text-xs">{filtered.length} results</Badge>
              <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setActionFilter('all'); setResultFilter('all'); setEntityFilter('all'); setDateFrom(''); setDateTo(''); }}>
                Clear All Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Audit Trail</CardTitle>
          <CardDescription>{filtered.length} entries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Changes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.slice(0, 50).map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      <div>{new Date(entry.timestamp).toLocaleString()}</div>
                      <div className="text-[10px]">{formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}</div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{entry.actor_name}</p>
                        <p className="text-[10px] text-muted-foreground">{entry.actor_role}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {entry.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {entry.resource_type && (
                        <div>
                          <span className="font-mono text-xs">{entry.resource_type}</span>
                          {entry.resource_id && <span className="text-muted-foreground text-xs"> #{entry.resource_id}</span>}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        'text-[10px]',
                        entry.result === 'success' && 'bg-emerald-500/20 text-emerald-500',
                        entry.result === 'failed' && 'bg-red-500/20 text-red-500',
                        entry.result === 'blocked' && 'bg-amber-500/20 text-amber-500',
                      )}>
                        {entry.result}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">{entry.ip_address}</TableCell>
                    <TableCell>
                      <ChangesCell changes={entry.changes} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <ScrollText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-1">No audit entries found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
