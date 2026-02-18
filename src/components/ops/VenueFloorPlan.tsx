// ──────────────────────────────────────
// Venue Floor Plan Component — Phase 8
// Simple interactive floor visualization
// ──────────────────────────────────────

import { cn } from '@/lib/utils';
import { VenueZone, Gate } from '@/types/venue.types';
import type { MapZone } from '@/types/map.types';
import { 
  Store, 
  Utensils, 
  Plane, 
  Users, 
  AlertTriangle,
  Coffee,
  Wifi,
  Shield,
  Stamp,
} from 'lucide-react';

interface VenueFloorPlanProps {
  zones: VenueZone[];
  gates: Gate[];
  selectedZoneId?: string;
  onZoneClick?: (zone: VenueZone) => void;
  onGateClick?: (gate: Gate) => void;
  className?: string;
}

function getZoneIcon(type: MapZone['type']) {
  switch (type) {
    case 'retail': return Store;
    case 'food': return Utensils;
    case 'gate': return Plane;
    case 'lounge': return Coffee;
    case 'service': return Wifi;
    case 'security': return Shield;
    case 'customs': return Stamp;
    default: return Users;
  }
}

function getZoneColor(type: MapZone['type']) {
  switch (type) {
    case 'retail': return 'bg-blue-500/20 border-blue-500/50 hover:bg-blue-500/30';
    case 'food': return 'bg-amber-500/20 border-amber-500/50 hover:bg-amber-500/30';
    case 'gate': return 'bg-emerald-500/20 border-emerald-500/50 hover:bg-emerald-500/30';
    case 'lounge': return 'bg-violet-500/20 border-violet-500/50 hover:bg-violet-500/30';
    case 'service': return 'bg-cyan-500/20 border-cyan-500/50 hover:bg-cyan-500/30';
    case 'security': return 'bg-red-500/20 border-red-500/50 hover:bg-red-500/30';
    case 'customs': return 'bg-orange-500/20 border-orange-500/50 hover:bg-orange-500/30';
    default: return 'bg-gray-500/20 border-gray-500/50 hover:bg-gray-500/30';
  }
}

function getGateStatusColor(status: Gate['status']) {
  switch (status) {
    case 'boarding': return 'bg-emerald-500 text-white';
    case 'delayed': return 'bg-amber-500 text-white';
    case 'closed': return 'bg-red-500 text-white';
    default: return 'bg-muted text-muted-foreground';
  }
}

export function VenueFloorPlan({
  zones,
  gates,
  selectedZoneId,
  onZoneClick,
  onGateClick,
  className,
}: VenueFloorPlanProps) {
  // Group gates by concourse (A or B based on name/code)
  const gatesA = gates.filter(g => g.name.startsWith('A') || g.code?.startsWith('A'));
  const gatesB = gates.filter(g => g.name.startsWith('B') || g.code?.startsWith('B'));

  return (
    <div className={cn('space-y-6', className)}>
      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        {[
          { type: 'retail' as const, label: 'Retail' },
          { type: 'food' as const, label: 'Food Court' },
          { type: 'gate' as const, label: 'Gate Area' },
          { type: 'lounge' as const, label: 'Lounge' },
          { type: 'service' as const, label: 'Services' },
        ].map(({ type, label }) => {
          const Icon = getZoneIcon(type);
          return (
            <div key={type} className="flex items-center gap-1.5">
              <div className={cn('h-3 w-3 rounded border', getZoneColor(type).split(' ').slice(0, 2).join(' '))} />
              <Icon className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">{label}</span>
            </div>
          );
        })}
      </div>

      {/* Zone grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {zones.map((zone) => {
          const Icon = getZoneIcon(zone.type);
          const isSelected = zone.id === selectedZoneId;
          const isRestricted = zone.is_restricted || zone.isRestricted;

          return (
            <button
              key={zone.id}
              className={cn(
                'p-4 rounded-lg border-2 text-left transition-all',
                getZoneColor(zone.type),
                isSelected && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
                isRestricted && 'border-red-500/50'
              )}
              onClick={() => onZoneClick?.(zone)}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-4 w-4" />
                <span className="font-medium text-sm truncate">{zone.name}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{zone.trolleyCount || 0} trolleys</span>
                </div>
                {isRestricted && (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Gates section */}
      <div className="space-y-4">
        <h4 className="font-semibold text-sm">Gates</h4>
        
        {/* Concourse A */}
        {gatesA.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Concourse A</p>
            <div className="flex flex-wrap gap-2">
              {gatesA.map((gate) => (
                <button
                  key={gate.id}
                  className={cn(
                    'flex flex-col items-center p-2 rounded-lg border min-w-[60px] transition-all hover:scale-105',
                    getGateStatusColor(gate.status)
                  )}
                  onClick={() => onGateClick?.(gate)}
                >
                  <span className="font-bold text-sm">{gate.code || gate.name}</span>
                  <div className="flex items-center gap-0.5 mt-1">
                    <Users className="h-3 w-3" />
                    <span className="text-xs">{gate.passengerCount}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Concourse B */}
        {gatesB.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Concourse B</p>
            <div className="flex flex-wrap gap-2">
              {gatesB.map((gate) => (
                <button
                  key={gate.id}
                  className={cn(
                    'flex flex-col items-center p-2 rounded-lg border min-w-[60px] transition-all hover:scale-105',
                    getGateStatusColor(gate.status)
                  )}
                  onClick={() => onGateClick?.(gate)}
                >
                  <span className="font-bold text-sm">{gate.code || gate.name}</span>
                  <div className="flex items-center gap-0.5 mt-1">
                    <Users className="h-3 w-3" />
                    <span className="text-xs">{gate.passengerCount}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
