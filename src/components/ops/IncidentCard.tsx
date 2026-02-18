// ──────────────────────────────────────
// Incident Card Component — Phase 8
// ──────────────────────────────────────

import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { IncidentSeverityBadge, getSeverityBorderColor } from './IncidentSeverityBadge';
import { Eye, UserPlus, CheckCircle, MonitorSmartphone, MapPin, Clock } from 'lucide-react';
import type { Incident } from '@/types/incident.types';

export interface IncidentCardProps {
  incident: Incident;
  onClick?: () => void;
  onView?: () => void;
  onAcknowledge?: () => void;
  onAssign?: () => void;
}

const statusConfig: Record<Incident['status'], { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  open: { label: 'Open', variant: 'destructive' },
  investigating: { label: 'Investigating', variant: 'default' },
  mitigating: { label: 'Mitigating', variant: 'secondary' },
  resolved: { label: 'Resolved', variant: 'outline' },
  post_mortem: { label: 'Post-Mortem', variant: 'outline' },
};

const typeLabels: Record<Incident['type'], string> = {
  zone_breach: 'Zone Breach',
  device_stuck: 'Device Stuck',
  kiosk_crash: 'Kiosk Crash',
  network_outage: 'Network Outage',
  battery_cluster: 'Battery Cluster',
  order_sla_breach: 'SLA Breach',
  runner_unavailable: 'Runner Unavailable',
  payment_failure: 'Payment Failure',
  security_alert: 'Security Alert',
  custom: 'Custom',
};

export function IncidentCard({ incident, onClick, onView, onAcknowledge, onAssign }: IncidentCardProps) {
  const statusCfg = statusConfig[incident.status];
  const isActive = !['resolved', 'post_mortem'].includes(incident.status);
  const isPulse = incident.severity === 'p1_critical' && isActive;

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative rounded-lg border bg-card p-4 transition-all hover:shadow-md',
        'border-l-4',
        getSeverityBorderColor(incident.severity),
        onClick && 'cursor-pointer'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <IncidentSeverityBadge severity={incident.severity} pulse={isPulse} />
            <Badge variant={statusCfg.variant} className="text-[10px]">
              {statusCfg.label}
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              {typeLabels[incident.type]}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground font-mono">{incident.incident_number}</p>
          <h3 className="text-sm font-semibold font-poppins text-foreground truncate">
            {incident.title}
          </h3>
        </div>
      </div>

      {/* Stats Row */}
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        {incident.affected_devices.length > 0 && (
          <div className="flex items-center gap-1">
            <MonitorSmartphone className="h-3 w-3" />
            <span>{incident.affected_devices.length} device(s)</span>
          </div>
        )}
        {incident.affected_zones.length > 0 && (
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{incident.affected_zones.length} zone(s)</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{formatDistanceToNow(new Date(incident.detected_at), { addSuffix: true })}</span>
        </div>
      </div>

      {/* Assigned */}
      {incident.assigned_to && (
        <p className="mt-2 text-xs text-muted-foreground">
          Assigned to: <span className="font-medium text-foreground">{incident.assigned_to}</span>
        </p>
      )}

      {/* Actions */}
      <div className="mt-3 flex items-center gap-2">
        <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={onView}>
          <Eye className="h-3 w-3" />
          View
        </Button>
        {incident.status === 'open' && (
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={onAcknowledge}>
            <CheckCircle className="h-3 w-3" />
            Acknowledge
          </Button>
        )}
        {!incident.assigned_to && isActive && (
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={onAssign}>
            <UserPlus className="h-3 w-3" />
            Assign
          </Button>
        )}
      </div>
    </div>
  );
}
