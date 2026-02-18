// ──────────────────────────────────────
// Policy Rule Card Component — Phase 8
// ──────────────────────────────────────

import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Edit, Power, PowerOff, History, ShieldAlert, Lock, Ban, Timer, Gauge } from 'lucide-react';
import type { Policy } from '@/types/policy.types';

interface PolicyRuleCardProps {
  policy: Policy;
  onEdit?: () => void;
  onToggle?: () => void;
  onViewOverrides?: () => void;
}

const typeConfig: Record<Policy['type'], { icon: React.ComponentType<{ className?: string }>; color: string; bgColor: string }> = {
  restricted_zone: { icon: ShieldAlert, color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-950' },
  wheel_lock_zone: { icon: Lock, color: 'text-orange-500', bgColor: 'bg-orange-100 dark:bg-orange-950' },
  speed_limit: { icon: Gauge, color: 'text-amber-500', bgColor: 'bg-amber-100 dark:bg-amber-950' },
  no_entry: { icon: Ban, color: 'text-red-700', bgColor: 'bg-red-100 dark:bg-red-950' },
  time_restricted: { icon: Timer, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-950' },
};

const typeLabels: Record<Policy['type'], string> = {
  restricted_zone: 'Restricted Zone',
  wheel_lock_zone: 'Wheel Lock Zone',
  speed_limit: 'Speed Limit',
  no_entry: 'No Entry',
  time_restricted: 'Time Restricted',
};

function generateRuleSummary(policy: Policy): string {
  const conditions = policy.conditions.map((c) => {
    if (c.field === 'zone_id') return `in zone ${c.value}`;
    if (c.field === 'time_of_day' && Array.isArray(c.value)) return `between ${c.value[0]} and ${c.value[1]}`;
    if (c.field === 'device_speed') return `speed > ${c.value} km/h`;
    return `${c.field} ${c.operator} ${c.value}`;
  }).join(' AND ');

  const actions = policy.actions.map((a) => {
    if (a.type === 'wheel_lock') return 'Lock Wheels';
    if (a.type === 'alert_ops') return 'Alert Ops';
    if (a.type === 'notify_device') return 'Notify Device';
    if (a.type === 'block_entry') return 'Block Entry';
    if (a.type === 'reduce_speed') return `Reduce Speed to ${a.params.max_speed}km/h`;
    if (a.type === 'quarantine') return 'Quarantine';
    return a.type;
  }).join(' + ');

  return `When ${conditions} → ${actions}`;
}

export function PolicyRuleCard({ policy, onEdit, onToggle, onViewOverrides }: PolicyRuleCardProps) {
  const config = typeConfig[policy.type];
  const Icon = config.icon;
  const isActive = policy.status === 'active';

  return (
    <div className={cn(
      'rounded-lg border bg-card p-4 transition-all hover:shadow-md',
      !isActive && 'opacity-60'
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={cn('p-2 rounded-lg', config.bgColor)}>
            <Icon className={cn('h-4 w-4', config.color)} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={cn('text-[10px]', config.color)}>
                {typeLabels[policy.type]}
              </Badge>
              <Badge variant={isActive ? 'default' : 'secondary'} className="text-[10px]">
                {policy.status === 'scheduled' ? 'Scheduled' : isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <h3 className="mt-1 text-sm font-semibold font-poppins text-foreground">
              {policy.name}
            </h3>
          </div>
        </div>
      </div>

      {/* Affected Zones/Gates */}
      {(policy.zone_ids.length > 0 || policy.gate_ids.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-1">
          {policy.zone_ids.map((z) => (
            <Badge key={z} variant="outline" className="text-[10px]">{z}</Badge>
          ))}
          {policy.gate_ids.map((g) => (
            <Badge key={g} variant="outline" className="text-[10px]">{g}</Badge>
          ))}
        </div>
      )}

      {/* Rule Summary */}
      <p className="mt-3 text-xs text-muted-foreground font-mono bg-muted/50 rounded p-2">
        {generateRuleSummary(policy)}
      </p>

      {/* Stats */}
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span>Triggered: <span className="font-semibold text-foreground">{policy.trigger_count}</span> times</span>
        {policy.last_triggered_at && (
          <span>Last: {formatDistanceToNow(new Date(policy.last_triggered_at), { addSuffix: true })}</span>
        )}
      </div>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-2">
        <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={onEdit}>
          <Edit className="h-3 w-3" />
          Edit
        </Button>
        <Button
          size="sm"
          variant={isActive ? 'outline' : 'default'}
          className="h-7 text-xs gap-1"
          onClick={onToggle}
        >
          {isActive ? <PowerOff className="h-3 w-3" /> : <Power className="h-3 w-3" />}
          {isActive ? 'Disable' : 'Enable'}
        </Button>
        {policy.overrides.length > 0 && (
          <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={onViewOverrides}>
            <History className="h-3 w-3" />
            {policy.overrides.length} Override(s)
          </Button>
        )}
      </div>
    </div>
  );
}
