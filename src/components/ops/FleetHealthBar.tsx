// ──────────────────────────────────────
// Fleet Health Bar Component — Phase 8
// ──────────────────────────────────────

import { useMemo } from 'react';
import { useTrolleysStore } from '@/store/trolleys.store';
import { cn } from '@/lib/utils';

interface FleetHealthBarProps {
  className?: string;
  showCounts?: boolean;
}

export function FleetHealthBar({ className, showCounts = true }: FleetHealthBarProps) {
  const { trolleys } = useTrolleysStore();

  const stats = useMemo(() => {
    const online = trolleys.filter((t) => t.status === 'active' || t.status === 'idle').length;
    const lowBattery = trolleys.filter((t) => t.battery > 10 && t.battery <= 25 && t.status !== 'offline').length;
    const criticalBattery = trolleys.filter((t) => t.battery <= 10 && t.status !== 'offline').length;
    const offline = trolleys.filter((t) => t.status === 'offline').length;
    const maintenance = trolleys.filter((t) => t.status === 'maintenance').length;
    const charging = trolleys.filter((t) => t.status === 'charging').length;
    const total = trolleys.length;

    return { online, lowBattery, criticalBattery, offline, maintenance, charging, total };
  }, [trolleys]);

  const segments = [
    { key: 'online', count: stats.online - stats.lowBattery - stats.criticalBattery, color: 'bg-emerald-500', label: 'Online' },
    { key: 'charging', count: stats.charging, color: 'bg-blue-500', label: 'Charging' },
    { key: 'lowBattery', count: stats.lowBattery, color: 'bg-amber-500', label: 'Low Battery' },
    { key: 'critical', count: stats.criticalBattery, color: 'bg-orange-500', label: 'Critical' },
    { key: 'maintenance', count: stats.maintenance, color: 'bg-purple-500', label: 'Maintenance' },
    { key: 'offline', count: stats.offline, color: 'bg-red-500', label: 'Offline' },
  ];

  return (
    <div className={cn('space-y-3', className)}>
      {/* Stacked Bar */}
      <div className="h-4 rounded-full overflow-hidden flex bg-muted">
        {segments.map((seg) => {
          const pct = stats.total > 0 ? (seg.count / stats.total) * 100 : 0;
          if (pct === 0) return null;
          return (
            <div
              key={seg.key}
              className={cn('h-full transition-all duration-500', seg.color)}
              style={{ width: `${pct}%` }}
              title={`${seg.label}: ${seg.count} (${pct.toFixed(1)}%)`}
            />
          );
        })}
      </div>

      {/* Counts */}
      {showCounts && (
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">Online</span>
            <span className="font-semibold text-foreground ml-auto">{stats.online}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-muted-foreground">Low Battery</span>
            <span className="font-semibold text-amber-500 ml-auto">{stats.lowBattery}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            <span className="text-muted-foreground">Critical</span>
            <span className="font-semibold text-orange-500 ml-auto">{stats.criticalBattery}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-muted-foreground">Offline</span>
            <span className="font-semibold text-red-500 ml-auto">{stats.offline}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-purple-500" />
            <span className="text-muted-foreground">Maintenance</span>
            <span className="font-semibold text-purple-500 ml-auto">{stats.maintenance}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">Charging</span>
            <span className="font-semibold text-blue-500 ml-auto">{stats.charging}</span>
          </div>
        </div>
      )}
    </div>
  );
}
