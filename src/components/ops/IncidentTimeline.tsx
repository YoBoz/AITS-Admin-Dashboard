// ──────────────────────────────────────
// Incident Timeline Component — Phase 8
// ──────────────────────────────────────

import { cn } from '@/lib/utils';
import { IncidentTimelineEntry, TimelineActionType } from '@/types/incident.types';
import { formatDistanceToNow } from 'date-fns';
import { 
  User, 
  Bot, 
  MessageSquare, 
  FileText,
  Settings,
  ArrowUp,
  Terminal,
} from 'lucide-react';

interface IncidentTimelineProps {
  entries: IncidentTimelineEntry[];
  className?: string;
}

function getActionIcon(actionType: TimelineActionType) {
  switch (actionType) {
    case 'status_change': return Settings;
    case 'assigned': return User;
    case 'note_added': return MessageSquare;
    case 'device_action': return Terminal;
    case 'escalation': return ArrowUp;
    case 'runbook_step': return FileText;
    default: return Settings;
  }
}

function getActionLabel(actionType: TimelineActionType): string {
  switch (actionType) {
    case 'status_change': return 'Status changed';
    case 'assigned': return 'Assigned';
    case 'note_added': return 'Note added';
    case 'device_action': return 'Device action';
    case 'escalation': return 'Escalated';
    case 'runbook_step': return 'Runbook step';
    default: return actionType;
  }
}

function isSystemActor(actor: string): boolean {
  return actor.toLowerCase() === 'system' || actor.toLowerCase().startsWith('auto');
}

function getActorStyles(actor: string) {
  if (isSystemActor(actor)) {
    return 'bg-violet-500/20 text-violet-400 border-violet-500/30';
  }
  return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
}

export function IncidentTimeline({ entries, className }: IncidentTimelineProps) {
  // Sort entries by timestamp descending (most recent first)
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className={cn('space-y-4', className)}>
      {sortedEntries.map((entry, index) => {
        const Icon = getActionIcon(entry.action_type);
        const isLast = index === sortedEntries.length - 1;
        const isResolved = entry.new_status === 'resolved';
        const isEscalation = entry.action_type === 'escalation';

        return (
          <div key={entry.id} className="relative flex gap-3">
            {/* Vertical line connector */}
            {!isLast && (
              <div className="absolute left-4 top-8 bottom-0 w-px bg-border" />
            )}

            {/* Icon */}
            <div
              className={cn(
                'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border',
                isResolved
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : isEscalation
                  ? 'bg-red-500/20 text-red-400 border-red-500/30'
                  : getActorStyles(entry.actor)
              )}
            >
              <Icon className="h-4 w-4" />
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{getActionLabel(entry.action_type)}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                </span>
              </div>
              
              {/* Actor */}
              <div className="flex items-center gap-1 mt-0.5">
                {isSystemActor(entry.actor) ? (
                  <Bot className="h-3 w-3 text-muted-foreground" />
                ) : (
                  <User className="h-3 w-3 text-muted-foreground" />
                )}
                <span className="text-xs text-muted-foreground">{entry.actor}</span>
              </div>

              {/* Content */}
              {entry.content && (
                <p className="mt-1 text-sm text-muted-foreground bg-muted/50 rounded px-2 py-1">
                  {entry.content}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
