import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { AlertSeverityBadge } from './AlertSeverityBadge';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import type { Alert } from '@/types/alert.types';

interface AlertItemProps {
  alert: Alert;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onView?: (alert: Alert) => void;
  onAcknowledge?: (id: string) => void;
  onResolve?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

const severityColors: Record<string, string> = {
  critical: 'border-l-destructive',
  warning: 'border-l-status-warning',
  info: 'border-l-status-info',
};

const statusVariants: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'info' | 'outline'> = {
  active: 'destructive' as 'default',
  acknowledged: 'warning',
  resolved: 'success',
  dismissed: 'secondary',
};

export const AlertItem = forwardRef<HTMLDivElement, AlertItemProps>(function AlertItem(
  { alert, selected, onSelect, onView, onAcknowledge, onResolve, onDismiss },
  ref
) {
  const timeAgo = formatDistanceToNow(new Date(alert.created_at), { addSuffix: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg border border-border/60 bg-card hover:bg-muted/30 transition-colors border-l-[3px]',
        severityColors[alert.severity],
        selected && 'ring-1 ring-brand bg-brand/5'
      )}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={selected}
        onChange={() => onSelect?.(alert.id)}
        className="mt-1 accent-brand h-4 w-4 rounded"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <AlertSeverityBadge severity={alert.severity} />
            <h4 className="text-sm font-poppins font-medium text-foreground truncate">
              {alert.title}
            </h4>
          </div>
          <Badge variant={statusVariants[alert.status] || 'secondary'} className="shrink-0 text-[10px]">
            {alert.status}
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground font-lexend mt-1 line-clamp-2">
          {alert.description}
        </p>

        <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground font-mono">
          {alert.trolley_id && <span>Trolley: {alert.trolley_id}</span>}
          {alert.zone && <span>Zone: {alert.zone}</span>}
          <span>{timeAgo}</span>
          {alert.assigned_to && (
            <span className="text-foreground">→ {alert.assigned_to}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onView?.(alert)} title="View details">
          <Eye className="h-3.5 w-3.5" />
        </Button>
        {alert.status === 'active' && (
          <>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onAcknowledge?.(alert.id)} title="Acknowledge">
              <CheckCircle className="h-3.5 w-3.5 text-status-warning" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onDismiss?.(alert.id)} title="Dismiss">
              <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </>
        )}
        {(alert.status === 'active' || alert.status === 'acknowledged') && (
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onResolve?.(alert.id)} title="Resolve">
            <CheckCircle className="h-3.5 w-3.5 text-status-success" />
          </Button>
        )}
      </div>
    </motion.div>
  );
});
