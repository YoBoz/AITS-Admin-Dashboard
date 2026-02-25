// ──────────────────────────────────────
// Fleet Monitoring Hub — O-A1 Live Fleet + Trolley Mgmt + Fleet Alerts
// ──────────────────────────────────────

import { useState, useEffect, lazy, Suspense, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, AlertTriangle, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useTrolleysStore } from '@/store/trolleys.store';
import { usePermissionsStore } from '@/store/permissions.store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { toast } from 'sonner';

const TrolleyListPage = lazy(() => import('../trolleys/TrolleyListPage'));

type FleetTab = 'fleet-management' | 'fleet-alerts';

const tabs: { key: FleetTab; label: string; icon: React.ElementType }[] = [
  { key: 'fleet-management', label: 'Fleet Management', icon: ShoppingCart },
  { key: 'fleet-alerts', label: 'Fleet Alerts', icon: Bell },
];

type FleetAlertType = 'Offline' | 'LowBattery' | 'SensorFault';
type FleetAlertSeverity = 'critical' | 'warning' | 'info';
type FleetAlertStatus = 'open' | 'acknowledged' | 'escalated';

interface FleetAlert {
  id: string;
  device_id: string;
  type: FleetAlertType;
  severity: FleetAlertSeverity;
  message: string;
  created_at: string;
  status: FleetAlertStatus;
}

function generateFleetAlerts(trolleys: { id: string; status: string; battery: number; location_confidence?: number }[]): FleetAlert[] {
  const alerts: FleetAlert[] = [];
  const now = Date.now();
  trolleys.forEach((t, i) => {
    if (t.status === 'offline') {
      alerts.push({
        id: `FA-${String(i + 1).padStart(4, '0')}-OFF`,
        device_id: t.id,
        type: 'Offline',
        severity: 'critical',
        message: `${t.id} went offline`,
        created_at: new Date(now - Math.random() * 7200000).toISOString(),
        status: 'open',
      });
    }
    if (t.battery < 20) {
      alerts.push({
        id: `FA-${String(i + 1).padStart(4, '0')}-BAT`,
        device_id: t.id,
        type: 'LowBattery',
        severity: 'warning',
        message: `${t.id} battery at ${t.battery}%`,
        created_at: new Date(now - Math.random() * 3600000).toISOString(),
        status: 'open',
      });
    }
    if ((t.location_confidence ?? 100) < 30 && t.status !== 'offline') {
      alerts.push({
        id: `FA-${String(i + 1).padStart(4, '0')}-SNS`,
        device_id: t.id,
        type: 'SensorFault',
        severity: 'warning',
        message: `${t.id} sensor confidence ${t.location_confidence}%`,
        created_at: new Date(now - Math.random() * 5400000).toISOString(),
        status: 'open',
      });
    }
  });
  return alerts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

function logAudit(action: string, resourceId: string, resourceLabel: string) {
  usePermissionsStore.getState().addAuditEntry({
    id: `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    actor_id: 'USR-admin-001',
    actor_name: 'Admin User',
    actor_role: 'super_admin',
    action,
    resource_type: 'fleet_alert',
    resource_id: resourceId,
    resource_label: resourceLabel,
    changes: null,
    ip_address: '10.0.1.42',
    timestamp: new Date().toISOString(),
    result: 'success',
  });
}

function FleetAlertsTab() {
  const { trolleys } = useTrolleysStore();
  const generated = useMemo(() => generateFleetAlerts(trolleys), [trolleys]);
  const [alerts, setAlerts] = useState<FleetAlert[]>(generated);

  useEffect(() => { setAlerts(generateFleetAlerts(trolleys)); }, [trolleys]);

  const handleAcknowledge = (alert: FleetAlert) => {
    setAlerts((prev) => prev.map((a) => a.id === alert.id ? { ...a, status: 'acknowledged' as const } : a));
    logAudit('fleet_alert_acknowledged', alert.id, `${alert.type} alert for ${alert.device_id}`);
    toast.success(`Alert ${alert.id} acknowledged`);
  };

  const handleEscalate = (alert: FleetAlert) => {
    setAlerts((prev) => prev.map((a) => a.id === alert.id ? { ...a, status: 'escalated' as const } : a));
    logAudit('incident_created_from_alert', alert.id, `Escalated ${alert.type} alert for ${alert.device_id}`);
    toast.success('Alert escalated to incident');
  };

  const sevColor: Record<FleetAlertSeverity, string> = {
    critical: 'bg-red-500/20 text-red-500',
    warning: 'bg-amber-500/20 text-amber-500',
    info: 'bg-blue-500/20 text-blue-500',
  };
  const statusColor: Record<FleetAlertStatus, string> = {
    open: 'bg-red-500/20 text-red-500',
    acknowledged: 'bg-blue-500/20 text-blue-500',
    escalated: 'bg-purple-500/20 text-purple-500',
  };

  const openCount = alerts.filter((a) => a.status === 'open').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          {openCount} open alert{openCount !== 1 ? 's' : ''}
        </Badge>
        <p className="text-sm text-muted-foreground">{alerts.length} total alerts from fleet telemetry</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Fleet Alerts</CardTitle>
          <CardDescription>Offline, low-battery, and sensor fault alerts derived from live fleet data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alert ID</TableHead>
                  <TableHead>Device ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.slice(0, 40).map((alert) => (
                  <TableRow key={alert.id} className={cn(alert.status === 'open' && alert.severity === 'critical' && 'bg-red-500/5')}>
                    <TableCell className="font-mono text-sm">{alert.id}</TableCell>
                    <TableCell className="font-mono text-sm">{alert.device_id}</TableCell>
                    <TableCell>{alert.type}</TableCell>
                    <TableCell><Badge className={cn('text-[11px]', sevColor[alert.severity])}>{alert.severity}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(alert.created_at).toLocaleTimeString()}</TableCell>
                    <TableCell><Badge className={cn('text-[11px]', statusColor[alert.status])}>{alert.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      {alert.status === 'open' && (
                        <div className="flex gap-1 justify-end">
                          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleAcknowledge(alert)}>Acknowledge</Button>
                          <Button variant="destructive" size="sm" className="h-7 text-xs" onClick={() => handleEscalate(alert)}>Escalate</Button>
                        </div>
                      )}
                      {alert.status !== 'open' && <span className="text-xs text-muted-foreground capitalize">{alert.status}</span>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {alerts.length === 0 && (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-1">No fleet alerts</h3>
              <p className="text-sm text-muted-foreground">All devices operating normally</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function FleetMonitoringHubPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as FleetTab | null;
  const [activeTab, setActiveTab] = useState<FleetTab>(
    tabParam && tabs.some((t) => t.key === tabParam) ? tabParam : 'fleet-management'
  );

  useEffect(() => {
    if (tabParam && tabs.some((t) => t.key === tabParam) && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTabChange = (tab: FleetTab) => {
    setActiveTab(tab);
    setSearchParams((prev) => {
      prev.set('tab', tab);
      prev.delete('device');
      prev.delete('page');
      prev.delete('pageSize');
      return prev;
    }, { replace: true });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-bold font-montserrat text-foreground flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-brand" />
          Fleet Monitoring
        </h1>
        <p className="text-sm text-muted-foreground font-lexend mt-1">
          Fleet management, alerts, and device monitoring
        </p>
      </div>

      <div className="border-b border-border mb-4">
        <nav className="flex gap-1 -mb-px" role="tablist">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleTabChange(tab.key)}
                className={cn(
                  'group relative flex items-center gap-2 px-4 py-3 text-sm font-lexend font-medium transition-all duration-200 whitespace-nowrap',
                  'border-b-2 -mb-[1px]',
                  isActive ? 'border-brand text-brand' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
                )}
              >
                <tab.icon className={cn('h-4 w-4', isActive ? 'text-brand' : 'text-muted-foreground group-hover:text-foreground')} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <ErrorBoundary>
              <Suspense fallback={<LoadingScreen />}>
                {activeTab === 'fleet-management' && <TrolleyListPage embedded />}
                {activeTab === 'fleet-alerts' && <FleetAlertsTab />}
              </Suspense>
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
