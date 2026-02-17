import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { AlertHistoryEntry } from '@/types/alert.types';
import { CheckCircle, Clock, UserPlus, XCircle, AlertTriangle, Wrench } from 'lucide-react';

interface AlertTimelineProps {
  history: AlertHistoryEntry[];
}

const actionIcons: Record<string, React.ReactNode> = {
  created: <AlertTriangle className="h-3.5 w-3.5" />,
  acknowledged: <Clock className="h-3.5 w-3.5" />,
  resolved: <CheckCircle className="h-3.5 w-3.5" />,
  dismissed: <XCircle className="h-3.5 w-3.5" />,
  assigned: <UserPlus className="h-3.5 w-3.5" />,
  bulk_update: <Wrench className="h-3.5 w-3.5" />,
};

const actionColors: Record<string, string> = {
  created: 'bg-muted text-muted-foreground',
  acknowledged: 'bg-status-warning/20 text-status-warning',
  resolved: 'bg-status-success/20 text-status-success',
  dismissed: 'bg-muted text-muted-foreground',
  assigned: 'bg-status-info/20 text-status-info',
  bulk_update: 'bg-muted text-muted-foreground',
};

export function AlertTimeline({ history }: AlertTimelineProps) {
  if (history.length === 0) {
    return <p className="text-xs text-muted-foreground font-lexend">No history entries.</p>;
  }

  return (
    <div className="relative pl-6 space-y-4">
      {/* Vertical line */}
      <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />

      {history.map((entry, idx) => {
        const timeAgo = formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true });
        return (
          <div key={idx} className="relative flex gap-3">
            {/* Dot */}
            <div
              className={cn(
                'absolute -left-6 top-0.5 h-[22px] w-[22px] rounded-full flex items-center justify-center z-10',
                actionColors[entry.action] || 'bg-muted text-muted-foreground'
              )}
            >
              {actionIcons[entry.action] || <Clock className="h-3.5 w-3.5" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-poppins font-semibold text-foreground capitalize">
                  {entry.action.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {timeAgo}
                </span>
              </div>
              <div className="text-[11px] text-muted-foreground font-lexend">
                by {entry.actor}
              </div>
              {entry.note && (
                <p className="text-xs text-foreground/80 mt-0.5 font-lexend">{entry.note}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
