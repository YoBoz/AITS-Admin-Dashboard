import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { ComplaintTimelineEntry } from '@/types/complaint.types';
import {
  Circle, Clock, MessageSquare, CheckCircle, AlertTriangle, XCircle,
} from 'lucide-react';

interface ComplaintTimelineProps {
  timeline: ComplaintTimelineEntry[];
}

const statusIcons: Record<string, React.ReactNode> = {
  open: <Circle className="h-3.5 w-3.5" />,
  in_progress: <Clock className="h-3.5 w-3.5" />,
  pending_response: <MessageSquare className="h-3.5 w-3.5" />,
  resolved: <CheckCircle className="h-3.5 w-3.5" />,
  closed: <XCircle className="h-3.5 w-3.5" />,
  escalated: <AlertTriangle className="h-3.5 w-3.5" />,
};

const statusColors: Record<string, string> = {
  open: 'bg-status-info/20 text-status-info',
  in_progress: 'bg-status-warning/20 text-status-warning',
  pending_response: 'bg-orange-100 dark:bg-orange-900/30 text-orange-500',
  resolved: 'bg-status-success/20 text-status-success',
  closed: 'bg-muted text-muted-foreground',
  escalated: 'bg-destructive/20 text-destructive',
};

export function ComplaintTimeline({ timeline }: ComplaintTimelineProps) {
  if (timeline.length === 0) {
    return <p className="text-xs text-muted-foreground font-lexend">No timeline entries.</p>;
  }

  return (
    <div className="relative pl-6 space-y-4">
      <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />

      {timeline.map((entry, idx) => {
        const timeAgo = formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true });
        const colorClass = entry.status_change
          ? statusColors[entry.status_change] || 'bg-muted text-muted-foreground'
          : 'bg-muted text-muted-foreground';
        const icon = entry.status_change
          ? statusIcons[entry.status_change] || <Clock className="h-3.5 w-3.5" />
          : <Clock className="h-3.5 w-3.5" />;

        return (
          <div key={idx} className="relative flex gap-3">
            <div
              className={cn(
                'absolute -left-6 top-0.5 h-[22px] w-[22px] rounded-full flex items-center justify-center z-10',
                colorClass
              )}
            >
              {icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-xs font-poppins font-semibold text-foreground">
                  {entry.action}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">{timeAgo}</span>
              </div>
              <div className="text-[11px] text-muted-foreground font-lexend">by {entry.actor}</div>
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
