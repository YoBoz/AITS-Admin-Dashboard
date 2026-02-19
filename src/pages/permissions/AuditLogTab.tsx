import { useState, useEffect, useRef } from 'react';
import { SectionCard } from '@/components/common/SectionCard';
import { RoleBadge } from '@/components/permissions/RoleBadge';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { usePermissionsStore } from '@/store/permissions.store';
import { formatDistanceToNow } from 'date-fns';
import { Search, RefreshCw, ChevronDown, ChevronRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import type { AuditLogEntry } from '@/types/permissions.types';

const actionOptions = [
  { value: 'all', label: 'All Actions' },
  { value: 'user.login', label: 'Logins' },
  { value: 'user.created', label: 'User Created' },
  { value: 'user.suspended', label: 'User Suspended' },
  { value: 'role.created', label: 'Role Created' },
  { value: 'role.updated', label: 'Role Updated' },
  { value: 'permission.granted', label: 'Permission Granted' },
  { value: 'settings.updated', label: 'Settings Updated' },
];

const resultOptions = [
  { value: 'all', label: 'All Results' },
  { value: 'success', label: 'Success' },
  { value: 'failed', label: 'Failed' },
  { value: 'blocked', label: 'Blocked' },
];

const roleColorMap: Record<string, string> = {
  'Super Admin': '#BE052E',
  'Terminal Admin': '#7C3AED',
  'Operator': '#2563EB',
  'Viewer': '#059669',
  'Reporting Specialist': '#D97706',
  'Senior Operator': '#0891B2',
};

function ChangesCell({ changes }: { changes: AuditLogEntry['changes'] }) {
  const [expanded, setExpanded] = useState(false);
  if (!changes || changes.length === 0) return <span className="text-muted-foreground">—</span>;

  return (
    <div>
      <button
        className="flex items-center gap-1 text-primary text-[10px] hover:underline"
        onClick={() => setExpanded(!expanded)}
      >
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

function ImmutableAuditCallout() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
      <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
      <div className="flex-1 text-xs text-blue-800 dark:text-blue-300">
        <strong>Immutable Audit Log:</strong> For tamper-proof, hash-chained compliance audit trails with export capabilities, visit the Compliance Center.
      </div>
      <button
        onClick={() => navigate('/dashboard/compliance')}
        className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors flex-shrink-0"
      >
        Open Compliance
      </button>
    </div>
  );
}

export default function AuditLogTab() {
  const { getFilteredAuditLog, auditFilters, setAuditFilters, addAuditEntry, users } = usePermissionsStore();
  const [autoRefresh, setAutoRefresh] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const filtered = getFilteredAuditLog();

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const actions = ['user.login', 'settings.updated', 'permission.granted'];
        const action = actions[Math.floor(Math.random() * actions.length)];
        addAuditEntry({
          id: `audit-live-${Date.now()}`,
          actor_id: randomUser.id,
          actor_name: randomUser.name,
          actor_role: randomUser.role_label,
          action,
          resource_type: action.split('.')[0],
          resource_id: randomUser.id,
          resource_label: randomUser.name,
          changes: null,
          ip_address: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          timestamp: new Date().toISOString(),
          result: 'success',
        });
      }, 30000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoRefresh, addAuditEntry, users]);

  const resultBadge = (result: AuditLogEntry['result']) => {
    const map = {
      success: 'success' as const,
      failed: 'warning' as const,
      blocked: 'destructive' as const,
    };
    return <Badge variant={map[result]} className="text-[9px]">{result}</Badge>;
  };

  return (
    <div className="space-y-4">
      {/* Immutable Audit Callout (Phase 9) */}
      <ImmutableAuditCallout />

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search actor or resource..."
            value={auditFilters.search}
            onChange={(e) => setAuditFilters({ search: e.target.value })}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <select
          value={auditFilters.action}
          onChange={(e) => setAuditFilters({ action: e.target.value })}
          className="h-9 rounded-md border border-input bg-background px-3 text-xs font-lexend"
        >
          {actionOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          value={auditFilters.result}
          onChange={(e) => setAuditFilters({ result: e.target.value })}
          className="h-9 rounded-md border border-input bg-background px-3 text-xs font-lexend"
        >
          {resultOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <RefreshCw className={cn('h-3.5 w-3.5 text-muted-foreground', autoRefresh && 'animate-spin')} />
          <span className="text-xs text-muted-foreground font-lexend">Auto-refresh</span>
          <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
        </div>
      </div>

      {/* Table */}
      <SectionCard title="Audit Log" subtitle={`${filtered.length} entries`}>
        <div className="overflow-auto max-h-[500px]">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-card border-b border-border">
              <tr>
                {['Timestamp', 'Actor', 'Action', 'Resource Type', 'Resource', 'Changes', 'IP Address', 'Result'].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-[10px] font-poppins font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.id} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="px-3 py-2 font-mono text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="font-lexend text-foreground">{entry.actor_name}</span>
                      <RoleBadge label={entry.actor_role} color={roleColorMap[entry.actor_role] || '#6B7280'} />
                    </div>
                  </td>
                  <td className="px-3 py-2 font-mono text-foreground">{entry.action}</td>
                  <td className="px-3 py-2 font-mono text-muted-foreground capitalize">{entry.resource_type}</td>
                  <td className="px-3 py-2 font-lexend text-foreground">{entry.resource_label}</td>
                  <td className="px-3 py-2"><ChangesCell changes={entry.changes} /></td>
                  <td className="px-3 py-2 font-mono text-muted-foreground">{entry.ip_address}</td>
                  <td className="px-3 py-2">{resultBadge(entry.result)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">No audit entries match the filters.</div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
