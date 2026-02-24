// ──────────────────────────────────────
// Device Action Buttons Component — Phase 8
// ──────────────────────────────────────

import { useState } from 'react';
import { Lock, Unlock, RotateCcw, Download, Wrench, ShieldOff, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { usePermissions } from '@/hooks/usePermissions';
import { usePermissionsStore } from '@/store/permissions.store';
import { reasonCodes } from '@/data/mock/reason-codes.mock';
import { cn } from '@/lib/utils';

export type DeviceAction = 'lock' | 'unlock' | 'reboot' | 'update_app' | 'maintenance' | 'quarantine';

interface DeviceActionButtonsProps {
  deviceId: string;
  deviceStatus: string;
  onAction: (action: DeviceAction) => void;
  isLoading?: boolean;
  className?: string;
}

interface ActionConfig {
  action: DeviceAction;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  variant: 'default' | 'secondary' | 'outline' | 'destructive' | 'ghost';
  confirm: boolean;
  permission?: string;
  showWhen?: (status: string) => boolean;
}

const actions: ActionConfig[] = [
  {
    action: 'lock',
    label: 'Lock Device',
    icon: Lock,
    variant: 'secondary',
    confirm: true,
    showWhen: (status) => status !== 'offline' && status !== 'maintenance',
  },
  {
    action: 'unlock',
    label: 'Unlock Device',
    icon: Unlock,
    variant: 'outline',
    confirm: false,
    showWhen: (status) => status === 'maintenance' || status === 'offline',
  },
  {
    action: 'reboot',
    label: 'Reboot',
    icon: RotateCcw,
    variant: 'outline',
    confirm: true,
    showWhen: (status) => status !== 'offline',
  },
  {
    action: 'update_app',
    label: 'Update App',
    icon: Download,
    variant: 'outline',
    confirm: false,
    showWhen: (status) => status !== 'offline',
  },
  {
    action: 'maintenance',
    label: 'Mark Maintenance',
    icon: Wrench,
    variant: 'outline',
    confirm: true,
    showWhen: (status) => status !== 'maintenance',
  },
  {
    action: 'quarantine',
    label: 'Quarantine',
    icon: ShieldOff,
    variant: 'destructive',
    confirm: true,
    permission: 'settings.security_edit',
  },
];

export function DeviceActionButtons({
  deviceId,
  deviceStatus,
  onAction,
  isLoading,
  className,
}: DeviceActionButtonsProps) {
  const { can } = usePermissions();
  const [confirmAction, setConfirmAction] = useState<ActionConfig | null>(null);
  const [actionReasonCode, setActionReasonCode] = useState('');
  const [actionNotes, setActionNotes] = useState('');

  const visibleActions = actions.filter((a) => {
    if (a.permission && !can(a.permission)) return false;
    if (a.showWhen && !a.showWhen(deviceStatus)) return false;
    return true;
  });

  const handleActionClick = (actionConfig: ActionConfig) => {
    if (actionConfig.confirm) {
      setConfirmAction(actionConfig);
    } else {
      executeAction(actionConfig);
    }
  };

  const executeAction = (actionConfig: ActionConfig) => {
    // Log audit entry for device actions with reason code
    const { addAuditEntry } = usePermissionsStore.getState();
    const reasonLabel = reasonCodes.ops_override.find(r => r.code === actionReasonCode)?.label ?? actionReasonCode;
    addAuditEntry({
      id: `audit-${Date.now()}`,
      actor_id: 'admin-001',
      actor_name: 'Current Admin',
      actor_role: 'ops_manager',
      action: `device:${actionConfig.action}`,
      resource_type: 'device',
      resource_id: deviceId,
      resource_label: `Device ${deviceId}`,
      changes: [
        { field: 'action', from: deviceStatus, to: actionConfig.action },
        { field: 'reason_code', from: '', to: reasonLabel || 'N/A' },
        ...(actionNotes ? [{ field: 'notes', from: '', to: actionNotes }] : []),
      ],
      ip_address: '10.0.0.1',
      timestamp: new Date().toISOString(),
      result: 'success',
    });
    onAction(actionConfig.action);
    setConfirmAction(null);
    setActionReasonCode('');
    setActionNotes('');
  };

  return (
    <>
      <div className={cn('flex flex-wrap gap-2', className)}>
        {visibleActions.map((actionConfig) => {
          const Icon = actionConfig.icon;
          return (
            <Button
              key={actionConfig.action}
              size="sm"
              variant={actionConfig.variant}
              disabled={isLoading}
              onClick={() => handleActionClick(actionConfig)}
              className="h-8 text-xs gap-1.5"
            >
              <Icon className="h-3.5 w-3.5" />
              {actionConfig.label}
            </Button>
          );
        })}
      </div>

      {/* Confirmation Dialog for destructive/critical actions */}
      <Dialog open={!!confirmAction} onOpenChange={(open) => { if (!open) { setConfirmAction(null); setActionReasonCode(''); setActionNotes(''); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Confirm Action
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to <strong>{confirmAction?.label.toLowerCase()}</strong> on device{' '}
              <strong>{deviceId}</strong>? This action will be logged in the audit trail.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Reason Code <span className="text-destructive">*</span></Label>
              <Select value={actionReasonCode} onValueChange={setActionReasonCode}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason..." />
                </SelectTrigger>
                <SelectContent>
                  {reasonCodes.ops_override.map((r) => (
                    <SelectItem key={r.code} value={r.code}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea
                placeholder="Additional context..."
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>
              Cancel
            </Button>
            <Button
              variant={confirmAction?.variant === 'destructive' ? 'destructive' : 'default'}
              onClick={() => confirmAction && executeAction(confirmAction)}
              disabled={!actionReasonCode}
            >
              {confirmAction?.label}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function getActionConfig(action: DeviceAction): ActionConfig | undefined {
  return actions.find((a) => a.action === action);
}
