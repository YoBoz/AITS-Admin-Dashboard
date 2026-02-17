import { cn } from '@/lib/utils';
import type { AlertSeverity } from '@/types/alert.types';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface AlertSeverityBadgeProps {
  severity: AlertSeverity;
  className?: string;
}

const config: Record<AlertSeverity, { icon: React.ReactNode; label: string; classes: string }> = {
  critical: {
    icon: <AlertCircle className="h-3 w-3" />,
    label: 'Critical',
    classes: 'bg-destructive/10 text-destructive border-destructive/30',
  },
  warning: {
    icon: <AlertTriangle className="h-3 w-3" />,
    label: 'Warning',
    classes: 'bg-status-warning/10 text-status-warning border-status-warning/30',
  },
  info: {
    icon: <Info className="h-3 w-3" />,
    label: 'Info',
    classes: 'bg-status-info/10 text-status-info border-status-info/30',
  },
};

export function AlertSeverityBadge({ severity, className }: AlertSeverityBadgeProps) {
  const cfg = config[severity];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold font-lexend',
        cfg.classes,
        className
      )}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}
