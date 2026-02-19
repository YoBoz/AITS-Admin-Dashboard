// ──────────────────────────────────────
// Quarantine Status Card — Phase 9
// ──────────────────────────────────────

import { cn } from '@/lib/utils';
import { ShieldAlert, Eye, Search, CheckCircle2 } from 'lucide-react';
import type { QuarantinedDevice } from '@/types/compliance.types';

const statusLabels: Record<QuarantinedDevice['status'], string> = {
  active_quarantine: 'Active Quarantine',
  under_investigation: 'Under Investigation',
  cleared: 'Cleared',
  decommissioned: 'Decommissioned',
};

const statusColors: Record<QuarantinedDevice['status'], string> = {
  active_quarantine: 'bg-red-500/10 text-red-700 dark:text-red-400',
  under_investigation: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  cleared: 'bg-green-500/10 text-green-700 dark:text-green-400',
  decommissioned: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
};

interface Props {
  device: QuarantinedDevice;
  onViewIncident?: (incidentId: string) => void;
  onInvestigate?: (device: QuarantinedDevice) => void;
  onClear?: (device: QuarantinedDevice) => void;
}

export function QuarantineStatusCard({ device, onViewIncident, onInvestigate, onClear }: Props) {
  const isActive = device.status === 'active_quarantine' || device.status === 'under_investigation';

  return (
    <div className={cn('rounded-xl border overflow-hidden bg-card', isActive ? 'border-red-500/30' : 'border-border')}>
      {/* Header */}
      <div className={cn('px-4 py-3 flex items-center gap-3', isActive ? 'bg-red-500/10' : 'bg-muted/30')}>
        <ShieldAlert className={cn('h-5 w-5', isActive ? 'text-red-500' : 'text-muted-foreground')} />
        <span className="font-mono text-sm font-bold text-foreground">{device.device_imei}</span>
        <span className={cn('ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full', statusColors[device.status])}>
          {statusLabels[device.status]}
        </span>
      </div>

      <div className="p-4 space-y-3">
        {/* Reason */}
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Reason</p>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-500/10 text-red-700 dark:text-red-400 capitalize">
            {device.quarantine_reason.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Quarantined by & time */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>By: <strong className="text-foreground">{device.quarantined_by}</strong></span>
          <span>{new Date(device.quarantined_at).toLocaleDateString()}</span>
        </div>

        {/* Notes */}
        <p className="text-xs text-muted-foreground leading-relaxed">{device.notes}</p>

        {/* Behavioral flags */}
        {device.behavioral_flags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {device.behavioral_flags.map((flag) => (
              <span key={flag} className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-medium">
                {flag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        {isActive && (
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            {device.incident_id && onViewIncident && (
              <button
                onClick={() => onViewIncident(device.incident_id!)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors"
              >
                <Eye className="h-3 w-3" /> View Incident
              </button>
            )}
            {onInvestigate && device.status === 'active_quarantine' && (
              <button
                onClick={() => onInvestigate(device)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/50 text-xs font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 transition-colors"
              >
                <Search className="h-3 w-3" /> Investigate
              </button>
            )}
            {onClear && (
              <button
                onClick={() => onClear(device)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-green-500/50 text-xs font-medium text-green-700 dark:text-green-400 hover:bg-green-500/10 transition-colors"
              >
                <CheckCircle2 className="h-3 w-3" /> Clear
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
