// ──────────────────────────────────────
// Device Status Card Component — Phase 8
// ──────────────────────────────────────

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Battery, Wifi, WifiOff, MapPin, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Trolley } from '@/types/trolley.types';

interface DeviceStatusCardProps {
  device: Trolley;
  isSelected?: boolean;
  onClick?: () => void;
}

const statusColors: Record<Trolley['status'], string> = {
  active: 'bg-emerald-500',
  idle: 'bg-blue-500',
  charging: 'bg-cyan-500',
  maintenance: 'bg-purple-500',
  offline: 'bg-red-500',
};

const statusLabels: Record<Trolley['status'], string> = {
  active: 'Active',
  idle: 'Idle',
  charging: 'Charging',
  maintenance: 'Maintenance',
  offline: 'Offline',
};

function getBatteryColor(battery: number): string {
  if (battery <= 10) return 'text-red-500';
  if (battery <= 25) return 'text-amber-500';
  if (battery <= 50) return 'text-yellow-500';
  return 'text-emerald-500';
}

function getBatteryBgColor(battery: number): string {
  if (battery <= 10) return 'bg-red-500';
  if (battery <= 25) return 'bg-amber-500';
  if (battery <= 50) return 'bg-yellow-500';
  return 'bg-emerald-500';
}

export function DeviceStatusCard({ device, isSelected, onClick }: DeviceStatusCardProps) {
  const isOffline = device.status === 'offline';
  const batteryColor = getBatteryColor(device.battery);
  const batteryBgColor = getBatteryBgColor(device.battery);

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-3 rounded-lg border bg-card cursor-pointer transition-all hover:bg-muted/50',
        isSelected && 'ring-2 ring-brand bg-brand/5',
        isOffline && 'opacity-75'
      )}
    >
      <div className="flex items-center justify-between gap-2">
        {/* IMEI */}
        <div className="flex items-center gap-2 min-w-0">
          <span className={cn('h-2 w-2 rounded-full', statusColors[device.status])} />
          <span className="text-xs font-mono text-foreground truncate">
            {device.imei.slice(-8)}
          </span>
        </div>

        {/* Status */}
        <Badge variant="outline" className="text-[10px] shrink-0">
          {statusLabels[device.status]}
        </Badge>
      </div>

      {/* Zone */}
      <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
        <MapPin className="h-3 w-3" />
        <span className="truncate">{device.location.zone}</span>
        {device.location.gate && <span>• {device.location.gate}</span>}
      </div>

      {/* Battery Bar */}
      <div className="mt-2">
        <div className="flex items-center justify-between text-[10px] mb-1">
          <div className="flex items-center gap-1">
            <Battery className={cn('h-3 w-3', batteryColor)} />
            <span className={cn('font-medium', batteryColor)}>{device.battery}%</span>
          </div>
          {isOffline ? (
            <WifiOff className="h-3 w-3 text-red-500" />
          ) : (
            <Wifi className="h-3 w-3 text-emerald-500" />
          )}
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all', batteryBgColor)}
            style={{ width: `${device.battery}%` }}
          />
        </div>
      </div>

      {/* Last Seen */}
      <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>
          {formatDistanceToNow(new Date(device.last_seen), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}
