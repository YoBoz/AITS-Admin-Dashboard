import { useState, useMemo, useCallback } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SearchFilter } from '@/components/common/SearchFilter';
import { AlertStatsBar } from '@/components/alerts/AlertStatsBar';
import { AlertItem } from '@/components/alerts/AlertItem';
import AlertDetailModal from './AlertDetailModal';
import { useAlertsStore } from '@/store/alerts.store';
import { Button } from '@/components/ui/Button';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import type { Alert, AlertSeverity, AlertStatus, AlertType } from '@/types/alert.types';

const statusOptions: { value: AlertStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'acknowledged', label: 'Acknowledged' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'dismissed', label: 'Dismissed' },
];

const severityOptions: { value: AlertSeverity | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'critical', label: 'Critical' },
  { value: 'warning', label: 'Warning' },
  { value: 'info', label: 'Info' },
];

const typeOptions: { value: AlertType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'battery_low', label: 'Battery Low' },
  { value: 'offline_trolley', label: 'Offline' },
  { value: 'hardware_fault', label: 'Hardware' },
  { value: 'system_error', label: 'System' },
  { value: 'network_issue', label: 'Network' },
  { value: 'maintenance_due', label: 'Maintenance' },
  { value: 'unusual_activity', label: 'Unusual' },
];

export default function AlertsPage() {
  const store = useAlertsStore();
  const { filters, setFilters, getFilteredAlerts, acknowledgeAlert, resolveAlert, dismissAlert, bulkUpdateStatus, selectAlert, selectedAlert } = store;
  const stats = store.getStats();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailOpen, setDetailOpen] = useState(false);

  const filteredAlerts = getFilteredAlerts();

  // Sort: critical first, then by creation time desc
  const sortedAlerts = useMemo(() => {
    return [...filteredAlerts].sort((a, b) => {
      const sevOrder: Record<AlertSeverity, number> = { critical: 0, warning: 1, info: 2 };
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (a.status !== 'active' && b.status === 'active') return 1;
      if (sevOrder[a.severity] !== sevOrder[b.severity]) return sevOrder[a.severity] - sevOrder[b.severity];
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [filteredAlerts]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const handleBulkAcknowledge = () => {
    bulkUpdateStatus(Array.from(selectedIds), 'acknowledged');
    setSelectedIds(new Set());
    toast.success(`${selectedIds.size} alerts acknowledged`);
  };

  const handleBulkResolve = () => {
    bulkUpdateStatus(Array.from(selectedIds), 'resolved');
    setSelectedIds(new Set());
    toast.success(`${selectedIds.size} alerts resolved`);
  };

  const handleView = (alert: Alert) => {
    selectAlert(alert);
    setDetailOpen(true);
  };

  const handleAcknowledge = (id: string) => {
    acknowledgeAlert(id, 'Admin');
    toast.success('Alert acknowledged');
  };

  const handleResolve = (id: string) => {
    resolveAlert(id, 'Admin', 'Resolved via quick action.');
    toast.success('Alert resolved');
  };

  const handleDismiss = (id: string) => {
    dismissAlert(id, 'Admin');
    toast.info('Alert dismissed');
  };

  // Compute info count for stats bar
  const infoCount = store.alerts.filter(a => a.severity === 'info' && a.status === 'active').length;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Alerts"
        subtitle="Monitor and manage system alerts"
        actions={
          selectedIds.size > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-lexend">{selectedIds.size} selected</span>
              <Button size="sm" variant="outline" onClick={handleBulkAcknowledge}>Acknowledge</Button>
              <Button size="sm" onClick={handleBulkResolve}>Resolve</Button>
            </div>
          ) : undefined
        }
      />

      <AlertStatsBar
        critical={stats.critical}
        warnings={stats.warnings}
        info={infoCount}
        resolved={stats.resolved}
      />

      <SearchFilter
        searchValue={filters.search}
        onSearchChange={(val) => setFilters({ search: val })}
        searchPlaceholder="Search alerts..."
      >
        <select
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value as AlertStatus | 'all' })}
          className="h-9 rounded-md border border-border bg-background px-2 text-xs font-lexend"
        >
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          value={filters.severity}
          onChange={(e) => setFilters({ severity: e.target.value as AlertSeverity | 'all' })}
          className="h-9 rounded-md border border-border bg-background px-2 text-xs font-lexend"
        >
          {severityOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          value={filters.type}
          onChange={(e) => setFilters({ type: e.target.value as AlertType | 'all' })}
          className="h-9 rounded-md border border-border bg-background px-2 text-xs font-lexend"
        >
          {typeOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </SearchFilter>

      {/* Alerts List */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {sortedAlerts.map((alert) => (
            <AlertItem
              key={alert.id}
              alert={alert}
              selected={selectedIds.has(alert.id)}
              onSelect={toggleSelect}
              onView={handleView}
              onAcknowledge={handleAcknowledge}
              onResolve={handleResolve}
              onDismiss={handleDismiss}
            />
          ))}
        </AnimatePresence>
        {sortedAlerts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground font-lexend">
            No alerts match your filters.
          </div>
        )}
      </div>

      <AlertDetailModal
        alert={selectedAlert}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
