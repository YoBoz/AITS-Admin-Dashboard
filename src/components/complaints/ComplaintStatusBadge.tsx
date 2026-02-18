import { cn } from '@/lib/utils';
import type { ComplaintStatus } from '@/types/complaint.types';
import {
  Circle, Clock, MessageSquare, CheckCircle, XCircle, AlertTriangle,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/Tooltip';

interface ComplaintStatusBadgeProps {
  status: ComplaintStatus;
  className?: string;
}

const config: Record<ComplaintStatus, { icon: React.ReactNode; label: string; classes: string }> = {
  open: {
    icon: <Circle className="h-3 w-3" />,
    label: 'Open',
    classes: 'bg-status-info/10 text-status-info border-status-info/30',
  },
  in_progress: {
    icon: <Clock className="h-3 w-3" />,
    label: 'In Progress',
    classes: 'bg-status-warning/10 text-status-warning border-status-warning/30',
  },
  pending_response: {
    icon: <MessageSquare className="h-3 w-3" />,
    label: 'Pending',
    classes: 'bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-800',
  },
  resolved: {
    icon: <CheckCircle className="h-3 w-3" />,
    label: 'Resolved',
    classes: 'bg-status-success/10 text-status-success border-status-success/30',
  },
  closed: {
    icon: <XCircle className="h-3 w-3" />,
    label: 'Closed',
    classes: 'bg-muted text-muted-foreground border-border',
  },
  escalated: {
    icon: <AlertTriangle className="h-3 w-3" />,
    label: 'Escalated',
    classes: 'bg-destructive/10 text-destructive border-destructive/30',
  },
};

export function ComplaintStatusBadge({ status, className }: ComplaintStatusBadgeProps) {
  const cfg = config[status];
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold font-lexend max-w-[100px]',
            cfg.classes,
            className
          )}
        >
          {cfg.icon}
          <span className="truncate">{cfg.label}</span>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">{cfg.label}</p>
      </TooltipContent>
    </Tooltip>
  );
}
