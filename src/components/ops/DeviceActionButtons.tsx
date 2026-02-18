// ──────────────────────────────────────
// Device Action Buttons Component — Phase 8
// ──────────────────────────────────────

import { Lock, Unlock, RotateCcw, Download, Wrench, ShieldOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { usePermissions } from '@/hooks/usePermissions';
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
  deviceId: _deviceId, // Reserved for future API integration
  deviceStatus,
  onAction,
  isLoading,
  className,
}: DeviceActionButtonsProps) {
  const { can } = usePermissions();

  const visibleActions = actions.filter((a) => {
    if (a.permission && !can(a.permission)) return false;
    if (a.showWhen && !a.showWhen(deviceStatus)) return false;
    return true;
  });

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {visibleActions.map((actionConfig) => {
        const Icon = actionConfig.icon;
        return (
          <Button
            key={actionConfig.action}
            size="sm"
            variant={actionConfig.variant}
            disabled={isLoading}
            onClick={() => onAction(actionConfig.action)}
            className="h-8 text-xs gap-1.5"
          >
            <Icon className="h-3.5 w-3.5" />
            {actionConfig.label}
          </Button>
        );
      })}
    </div>
  );
}

export function getActionConfig(action: DeviceAction): ActionConfig | undefined {
  return actions.find((a) => a.action === action);
}
