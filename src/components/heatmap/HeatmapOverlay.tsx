import { useMemo } from 'react';
import { mapZones } from '@/data/mock/map.mock';
import { shopsData } from '@/data/mock/shops.mock';
import { zoneNameMap } from '@/data/mock/heatmap.mock';
import { cn } from '@/lib/utils';

interface HeatmapOverlayProps {
  intensityMap: Record<string, number>;
  floor?: number;
  selectedZoneId?: string | null;
  showShopMarkers?: boolean;
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
  floor = 1,
  selectedZoneId,
  showShopMarkers = true,
  onZoneHover,
  onZoneClick,
  isDark: _isDark = false,
}: HeatmapOverlayProps) {
  const zones = useMemo(() => {
    return mapZones
      .filter((zone) => zone.floor === floor)
      .map((zone) => ({
        ...zone,
        intensity: intensityMap[zone.id] ?? 0,
        color: interpolateColor(intensityMap[zone.id] ?? 0),
        displayName: zoneNameMap[zone.id] || zone.name,
      }));
  }, [intensityMap, floor]);

  // Get shops positioned within their zones for shop-level heatmap markers
  const shopMarkers = useMemo(() => {
    if (!showShopMarkers) return [];
    const floorZones = mapZones.filter((z) => z.floor === floor);
    const markers: { id: string; name: string; category: string; cx: number; cy: number; zoneIntensity: number }[] = [];

    floorZones.forEach((zone) => {
      if (zone.shops.length === 0) return;
      const zoneIntensity = intensityMap[zone.id] ?? 0;

      zone.shops.forEach((shopId, idx) => {
        const shop = shopsData.find((s) => s.id === shopId);
        if (!shop) return;

        // Position within zone grid
        const cols = Math.max(2, Math.ceil(Math.sqrt(zone.shops.length)));
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const spacingX = (zone.width - 16) / cols;
        const spacingY = (zone.height - 16) / Math.ceil(zone.shops.length / cols);

        markers.push({
          id: shopId,
          name: shop.name,
          category: shop.category,
          cx: zone.x + 8 + col * spacingX + spacingX / 2,
          cy: zone.y + 8 + row * spacingY + spacingY / 2,
          zoneIntensity,
        });
      });
    });

    return markers;
  }, [floor, intensityMap, showShopMarkers]);

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
            opacity={0.6}
            rx={6}
            stroke={selectedZoneId === zone.id ? '#fff' : 'transparent'}
            strokeWidth={selectedZoneId === zone.id ? 2.5 : 0}
            style={{ transition: 'fill 800ms ease, opacity 800ms ease' }}
          />
          <text
            x={zone.x + zone.width / 2}
            y={zone.y + zone.height / 2 - (zone.shops.length > 0 ? 10 : 6)}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={zone.width < 80 ? 7 : 10}
            fill="#fff"
            fontFamily="Poppins, sans-serif"
            fontWeight="600"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
          >
            {zone.displayName}
          </text>
          <text
            x={zone.x + zone.width / 2}
            y={zone.y + zone.height / 2 + (zone.shops.length > 0 ? 4 : 10)}
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

      {/* Shop markers within zones — visible dots showing individual shop locations */}
      {showShopMarkers && shopMarkers.map((shop) => (
        <g key={shop.id}>
          <circle
            cx={shop.cx}
            cy={shop.cy}
            r={5}
            fill="white"
            opacity={0.9}
            stroke="rgba(0,0,0,0.3)"
            strokeWidth={0.5}
          />
          <circle
            cx={shop.cx}
            cy={shop.cy}
            r={3}
            fill={interpolateColor(shop.zoneIntensity * (0.8 + Math.random() * 0.4))}
            opacity={1}
          />
          <title>{shop.name} ({shop.category})</title>
        </g>
      ))}
    </svg>
  );
}

export { interpolateColor };
