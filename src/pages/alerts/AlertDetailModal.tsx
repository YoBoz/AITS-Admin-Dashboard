import { useState } from 'react';
import { FormModal } from '@/components/common/FormModal';
import { AlertSeverityBadge } from '@/components/alerts/AlertSeverityBadge';
import { AlertTimeline } from '@/components/alerts/AlertTimeline';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';
import { useAlertsStore } from '@/store/alerts.store';
import { toast } from 'sonner';
import type { Alert } from '@/types/alert.types';
import {
  Monitor, MapPin, FileText,
} from 'lucide-react';

interface AlertDetailModalProps {
  alert: Alert | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AlertDetailModal({ alert, open, onOpenChange }: AlertDetailModalProps) {
  const { acknowledgeAlert, resolveAlert, dismissAlert, assignAlert, alerts } = useAlertsStore();
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [assignTo, setAssignTo] = useState('');

  if (!alert) return null;

  const relatedAlerts = alerts.filter(
    (a) => a.id !== alert.id && ((a.trolley_id && a.trolley_id === alert.trolley_id) || (a.zone && a.zone === alert.zone))
  ).slice(0, 5);

  const handleAcknowledge = () => {
    acknowledgeAlert(alert.id, 'Admin');
    toast.success('Alert acknowledged');
  };

  const handleResolve = () => {
    resolveAlert(alert.id, 'Admin', resolutionNotes || 'Resolved by admin.');
    toast.success('Alert resolved');
    onOpenChange(false);
  };

  const handleDismiss = () => {
    dismissAlert(alert.id, 'Admin');
    toast.info('Alert dismissed');
    onOpenChange(false);
  };

  const handleAssign = () => {
    if (assignTo.trim()) {
      assignAlert(alert.id, assignTo.trim());
      toast.success(`Assigned to ${assignTo.trim()}`);
    }
  };

  return (
    <FormModal open={open} onOpenChange={onOpenChange} title={alert.title} subtitle={`Alert ${alert.id}`} size="xl">
      <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
        {/* Section: Alert Info */}
        <div>
          <h3 className="text-xs font-poppins font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Alert Information
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground font-lexend">Severity:</span>
              <AlertSeverityBadge severity={alert.severity} />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground font-lexend">Type:</span>
              <span className="font-mono text-xs text-foreground">{alert.type.replace('_', ' ')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground font-lexend">Status:</span>
              <Badge variant={alert.status === 'resolved' ? 'success' : alert.status === 'active' ? 'destructive' as 'default' : 'warning'} className="text-[10px]">
                {alert.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground font-lexend">Auto-generated:</span>
              <span className="text-foreground font-lexend">{alert.auto_generated ? 'Yes' : 'No'}</span>
            </div>
          </div>
          <p className="text-sm text-foreground/80 font-lexend mt-2">{alert.description}</p>
        </div>

        <Separator />

        {/* Section: Affected Asset */}
        {alert.trolley_id && (
          <div>
            <h3 className="text-xs font-poppins font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Affected Asset
            </h3>
            <div className="bg-muted/30 rounded-lg p-3 space-y-1.5">
              <div className="flex items-center gap-2 text-sm">
                <Monitor className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-mono text-xs">{alert.trolley_id}</span>
              </div>
              {alert.trolley_imei && (
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-mono text-xs">IMEI: {alert.trolley_imei}</span>
                </div>
              )}
              {alert.zone && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-lexend text-xs">{alert.zone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <Separator />

        {/* Section: Timeline */}
        <div>
          <h3 className="text-xs font-poppins font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Timeline
          </h3>
          <AlertTimeline history={alert.history} />
        </div>

        <Separator />

        {/* Section: Resolution */}
        {alert.status !== 'resolved' && alert.status !== 'dismissed' && (
          <div>
            <h3 className="text-xs font-poppins font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Resolution
            </h3>
            <textarea
              placeholder="Enter resolution notes..."
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              className="w-full h-20 rounded-md border border-border bg-background px-3 py-2 text-sm font-lexend placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand resize-none"
            />
            <div className="flex items-center gap-2 mt-2">
              <input
                placeholder="Assign to..."
                value={assignTo}
                onChange={(e) => setAssignTo(e.target.value)}
                className="flex-1 h-8 rounded-md border border-border bg-background px-3 text-sm font-lexend placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand"
              />
              <Button size="sm" variant="outline" onClick={handleAssign} disabled={!assignTo.trim()}>
                Assign
              </Button>
            </div>
          </div>
        )}

        {/* Section: Related Alerts */}
        {relatedAlerts.length > 0 && (
          <div>
            <h3 className="text-xs font-poppins font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Related Alerts ({relatedAlerts.length})
            </h3>
            <div className="space-y-1.5">
              {relatedAlerts.map((ra) => (
                <div key={ra.id} className="flex items-center justify-between bg-muted/30 rounded px-3 py-1.5">
                  <div className="flex items-center gap-2">
                    <AlertSeverityBadge severity={ra.severity} />
                    <span className="text-xs font-lexend text-foreground truncate max-w-[200px]">{ra.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">{ra.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-2 pt-4 border-t border-border mt-4">
        {alert.status === 'active' && (
          <>
            <Button variant="outline" size="sm" onClick={handleAcknowledge}>Acknowledge</Button>
            <Button variant="outline" size="sm" onClick={handleDismiss}>Dismiss</Button>
          </>
        )}
        {(alert.status === 'active' || alert.status === 'acknowledged') && (
          <Button size="sm" onClick={handleResolve}>Resolve</Button>
        )}
        <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>Close</Button>
      </div>
    </FormModal>
  );
}
