import { motion } from 'framer-motion';
import { ComplaintStatusBadge } from './ComplaintStatusBadge';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Eye, Paperclip } from 'lucide-react';
import type { Complaint } from '@/types/complaint.types';

interface ComplaintItemProps {
  complaint: Complaint;
  onView?: (complaint: Complaint) => void;
}

const priorityVariant: Record<string, 'default' | 'destructive' | 'warning' | 'secondary'> = {
  high: 'destructive',
  medium: 'warning',
  low: 'secondary',
};

export function ComplaintItem({ complaint, onView }: ComplaintItemProps) {
  const timeAgo = formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true });
  const slaDue = new Date(complaint.sla_due_at);
  const now = new Date();
  const slaHoursLeft = (slaDue.getTime() - now.getTime()) / 3600000;

  let slaColor = 'text-status-success';
  let slaText = `${Math.round(slaHoursLeft)}h left`;
  if (complaint.sla_breached || slaHoursLeft < 0) {
    slaColor = 'text-destructive';
    slaText = 'Breached';
  } else if (slaHoursLeft < 8) {
    slaColor = 'text-status-warning';
    slaText = `${Math.round(slaHoursLeft)}h left`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg border border-border/60 bg-card hover:bg-muted/30 transition-colors',
        complaint.sla_breached && 'border-l-[3px] border-l-destructive'
      )}
    >
      <div className="flex-1 min-w-0 grid grid-cols-12 gap-2 items-center">
        {/* Ticket ID */}
        <div className="col-span-2">
          <button
            onClick={() => onView?.(complaint)}
            className="text-xs font-mono text-brand hover:underline truncate"
          >
            {complaint.ticket_id}
          </button>
        </div>

        {/* Subject */}
        <div className="col-span-3">
          <p className="text-xs font-lexend text-foreground truncate">{complaint.subject}</p>
        </div>

        {/* Category */}
        <div className="col-span-1">
          <span className="text-[10px] font-lexend text-muted-foreground capitalize">
            {complaint.category.replace('_', ' ')}
          </span>
        </div>

        {/* Priority */}
        <div className="col-span-1">
          <Badge variant={priorityVariant[complaint.priority]} className="text-[10px]">
            {complaint.priority}
          </Badge>
        </div>

        {/* Status */}
        <div className="col-span-2">
          <ComplaintStatusBadge status={complaint.status} />
        </div>

        {/* SLA */}
        <div className="col-span-1">
          <span className={cn('text-[10px] font-mono font-semibold', slaColor)}>
            {slaText}
          </span>
        </div>

        {/* Submitted */}
        <div className="col-span-1">
          <span className="text-[10px] font-mono text-muted-foreground">{timeAgo}</span>
        </div>

        {/* Actions */}
        <div className="col-span-1 flex items-center justify-end gap-1">
          {complaint.attachments > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
              <Paperclip className="h-3 w-3" /> {complaint.attachments}
            </span>
          )}
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onView?.(complaint)}>
            <Eye className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
