import { useMemo } from 'react';
import { mapZones } from '@/data/mock/map.mock';
import { zoneNameMap } from '@/data/mock/heatmap.mock';
import { cn } from '@/lib/utils';

interface HeatmapOverlayProps {
  intensityMap: Record<string, number>;
  selectedZoneId?: string | null;
  onZoneHover?: (zoneId: string | null) => void;
  onZoneClick?: (zoneId: string) => void;
  isDark?: boolean;
}

function interpolateColor(intensity: number): string {
  // Blue (#3B82F6) → Amber (#F59E0B) → Red (#BE052E)
  const clampedIntensity = Math.max(0, Math.min(1, intensity));

  let r: number, g: number, b: number;

  if (clampedIntensity < 0.5) {
    const t = clampedIntensity * 2;
    r = Math.round(59 + (245 - 59) * t);
    g = Math.round(130 + (158 - 130) * t);
    b = Math.round(246 + (11 - 246) * t);
  } else {
    const t = (clampedIntensity - 0.5) * 2;
    r = Math.round(245 + (190 - 245) * t);
    g = Math.round(158 + (5 - 158) * t);
    b = Math.round(11 + (46 - 11) * t);
  }

  return `rgb(${r}, ${g}, ${b})`;
}

export function HeatmapOverlay({
  intensityMap,
  selectedZoneId,
  onZoneHover,
  onZoneClick,
  isDark = false,
}: HeatmapOverlayProps) {
  const zones = useMemo(() => {
    return mapZones.map((zone) => ({
      ...zone,
      intensity: intensityMap[zone.id] ?? 0,
      color: interpolateColor(intensityMap[zone.id] ?? 0),
      name: zoneNameMap[zone.id] || zone.name,
    }));
  }, [intensityMap]);

  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid meet"
      className={cn('absolute inset-0 w-full h-full pointer-events-none')}
      style={{ zIndex: 10 }}
    >
      {zones.map((zone) => (
        <g
          key={zone.id}
          className="pointer-events-auto cursor-pointer"
          onMouseEnter={() => onZoneHover?.(zone.id)}
          onMouseLeave={() => onZoneHover?.(null)}
          onClick={() => onZoneClick?.(zone.id)}
        >
          <rect
            x={zone.x}
            y={zone.y}
            width={zone.width}
            height={zone.height}
            fill={zone.color}
            opacity={0.65}
            rx={4}
            stroke={selectedZoneId === zone.id ? '#fff' : 'transparent'}
            strokeWidth={selectedZoneId === zone.id ? 2.5 : 0}
            style={{ transition: 'fill 800ms ease, opacity 800ms ease' }}
          />
          <text
            x={zone.x + zone.width / 2}
            y={zone.y + zone.height / 2 - 6}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={zone.width < 80 ? 7 : 10}
            fill={isDark ? '#fff' : '#fff'}
            fontFamily="Poppins, sans-serif"
            fontWeight="600"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
          >
            {zone.name}
          </text>
          <text
            x={zone.x + zone.width / 2}
            y={zone.y + zone.height / 2 + 10}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={zone.width < 80 ? 7 : 9}
            fill="rgba(255,255,255,0.85)"
            fontFamily="Roboto Mono, monospace"
            fontWeight="500"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            {Math.round(zone.intensity * 100)}%
          </text>
        </g>
      ))}
    </svg>
  );
}

export { interpolateColor };
