import { useMemo } from 'react';
import { mapZones, poiList, trolleyPositions, gatePositionsByFloor, floors } from '@/data/mock/map.mock';
import { shopsData } from '@/data/mock/shops.mock';
import { TrolleyMapMarker } from '@/components/trolleys/TrolleyMapMarker';
import type { MapZone } from '@/types/map.types';

interface AirportMapSVGProps {
  mini?: boolean;
  floor?: number;
  activeLayers?: string[];
  selectedZoneId?: string | null;
  selectedTrolleyId?: string | null;
  selectedShopId?: string | null;
  highlightTrolleyId?: string | null;
  isDark?: boolean;
  onZoneClick?: (zone: MapZone) => void;
  onTrolleyClick?: (trolleyId: string) => void;
  onShopClick?: (shopId: string) => void;
}

export function AirportMapSVG({
  mini = false,
  floor = 1,
  activeLayers = ['zones', 'trolleys', 'shops', 'pois', 'lounges', 'washrooms', 'gates'],
  selectedZoneId,
  selectedTrolleyId,
  selectedShopId,
  highlightTrolleyId,
  isDark = false,
  onZoneClick,
  onTrolleyClick,
  onShopClick,
}: AirportMapSVGProps) {
  const showZones = activeLayers.includes('zones');
  const showTrolleys = activeLayers.includes('trolleys');
  const showShops = activeLayers.includes('shops');
  const showPois = activeLayers.includes('pois');
  const showGates = activeLayers.includes('gates');

  // Filter data by floor
  const floorZones = useMemo(() => mapZones.filter((z) => z.floor === floor), [floor]);
  const floorPois = useMemo(() => poiList.filter((p) => p.floor === floor), [floor]);
  const floorTrolleys = useMemo(() => trolleyPositions.filter((t) => t.floor === floor), [floor]);
  const floorGates = useMemo(() => gatePositionsByFloor[floor] || [], [floor]);
  const floorInfo = floors.find((f) => f.id === floor);

  const shopPositions = useMemo(() => {
    // Get shop IDs associated with zones on this floor
    const shopIdsOnFloor = new Set(floorZones.flatMap((z) => z.shops));
    return shopsData
      .filter((s) => shopIdsOnFloor.has(s.id))
      .map((s) => {
        // Position shops inside their assigned zone
        const zone = floorZones.find((z) => z.shops.includes(s.id));
        if (zone) {
          const shopIdx = zone.shops.indexOf(s.id);
          const cols = Math.max(2, Math.ceil(Math.sqrt(zone.shops.length)));
          const col = shopIdx % cols;
          const row = Math.floor(shopIdx / cols);
          const spacingX = (zone.width - 20) / cols;
          const spacingY = (zone.height - 20) / Math.ceil(zone.shops.length / cols);
          return {
            ...s,
            cx: zone.x + 10 + col * spacingX + spacingX / 2,
            cy: zone.y + 10 + row * spacingY + spacingY / 2,
          };
        }
        return { ...s, cx: s.location.coordinates.x * 1.1, cy: s.location.coordinates.y * 0.9 + 50 };
      });
  }, [floorZones]);

  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-full"
      style={{ maxHeight: mini ? 300 : undefined }}
    >
      {/* Background */}
      <rect x="0" y="0" width="1200" height="800" fill={isDark ? '#111' : '#ffffff'} rx="8" />

      {/* Subtle grid pattern */}
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke={isDark ? '#1a1a1a' : '#f1f5f9'} strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="1200" height="800" fill="url(#grid)" />

      {/* Zone rectangles */}
      {showZones &&
        floorZones.map((zone) => (
          <g
            key={zone.id}
            onClick={() => !mini && onZoneClick?.(zone)}
            style={{ cursor: mini ? 'default' : 'pointer' }}
          >
            <rect
              x={zone.x}
              y={zone.y}
              width={zone.width}
              height={zone.height}
              fill={isDark ? zone.color_dark : zone.color_light}
              stroke={selectedZoneId === zone.id ? '#BE052E' : (isDark ? '#333' : '#ddd')}
              strokeWidth={selectedZoneId === zone.id ? 2.5 : 1}
              rx={6}
              className="transition-all duration-200"
            />
            {/* Zone label */}
            <text
              x={zone.x + zone.width / 2}
              y={zone.y + zone.height / 2 - (zone.height > 100 ? 5 : 0)}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={zone.width < 80 ? 8 : 11}
              fill={isDark ? '#aaa' : '#555'}
              fontFamily="Poppins, sans-serif"
              fontWeight="600"
            >
              {zone.name}
            </text>
            {zone.type !== 'terminal' && zone.type !== 'gate' && (
              <text
                x={zone.x + zone.width / 2}
                y={zone.y + zone.height / 2 + 12}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={8}
                fill={isDark ? '#666' : '#999'}
                fontFamily="Lexend, sans-serif"
              >
                {zone.type}
              </text>
            )}
            {/* Shop count badge */}
            {zone.shops.length > 0 && !mini && (
              <g>
                <rect
                  x={zone.x + zone.width - 28}
                  y={zone.y + 4}
                  width={24}
                  height={16}
                  rx={8}
                  fill="#BE052E"
                  opacity={0.85}
                />
                <text
                  x={zone.x + zone.width - 16}
                  y={zone.y + 12}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={8}
                  fill="white"
                  fontWeight="700"
                  fontFamily="Roboto Mono, monospace"
                >
                  {zone.shops.length}
                </text>
              </g>
            )}
          </g>
        ))}

      {/* Gate / Carousel markers */}
      {showGates &&
        floorGates.map((gate) => (
          <g key={gate.id}>
            <rect
              x={gate.x}
              y={gate.y}
              width={gate.w}
              height={gate.h}
              fill={isDark ? '#222' : '#fff'}
              stroke={isDark ? '#444' : '#ccc'}
              strokeWidth={0.8}
              rx={3}
            />
            <text
              x={gate.x + gate.w / 2}
              y={gate.y + gate.h / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={8}
              fill={isDark ? '#888' : '#666'}
              fontWeight="600"
              fontFamily="Roboto Mono, monospace"
            >
              {gate.id}
            </text>
          </g>
        ))}

      {/* POI icons */}
      {showPois &&
        floorPois.map((poi) => {
          const color =
            poi.type === 'info_desk' ? '#3b82f6' :
            poi.type === 'first_aid' ? '#ef4444' :
            poi.type === 'charging_station' ? '#10b981' :
            poi.type === 'atm' ? '#f59e0b' :
            poi.type === 'luggage_cart' ? '#8b5cf6' :
            poi.type === 'prayer_room' ? '#14b8a6' :
            '#9ca3af';
          const icon =
            poi.type === 'info_desk' ? 'i' :
            poi.type === 'first_aid' ? '+' :
            poi.type === 'charging_station' ? '⚡' :
            poi.type === 'elevator' ? '↕' :
            poi.type === 'escalator' ? '↗' :
            poi.type === 'atm' ? '$' :
            poi.type === 'luggage_cart' ? '🧳' :
            poi.type === 'prayer_room' ? '🕌' : '•';

          return (
            <g key={poi.id}>
              <circle cx={poi.x} cy={poi.y} r={mini ? 6 : 10} fill={color} opacity={0.2} />
              <circle cx={poi.x} cy={poi.y} r={mini ? 4 : 7} fill={color} opacity={0.8} />
              <text
                x={poi.x}
                y={poi.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={mini ? 6 : 9}
                fill="white"
                fontWeight="bold"
              >
                {icon}
              </text>
              {!mini && (
                <title>{poi.label}</title>
              )}
            </g>
          );
        })}

      {/* Shop markers */}
      {showShops &&
        !mini &&
        shopPositions.map((shop) => {
          const categoryColor: Record<string, string> = {
            retail: '#3B82F6',
            fashion: '#3B82F6',
            electronics: '#3B82F6',
            pharmacy: '#3B82F6',
            bank: '#3B82F6',
            services: '#3B82F6',
            lounge: '#8B5CF6',
            cafe: '#8B5CF6',
            restaurant: '#F97316',
            washroom: '#14B8A6',
            gate: '#6B7280',
            other: '#6B7280',
          };
          const markerColor = categoryColor[shop.category] || '#3B82F6';
          return (
            <g
              key={shop.id}
              onClick={(e) => {
                e.stopPropagation();
                onShopClick?.(shop.id);
              }}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={shop.cx}
                cy={shop.cy}
                r={selectedShopId === shop.id ? 10 : 6}
                fill={markerColor}
                opacity={selectedShopId === shop.id ? 1 : 0.75}
                stroke={selectedShopId === shop.id ? '#fff' : 'none'}
                strokeWidth={2}
                className="transition-all duration-200"
              />
              {selectedShopId === shop.id && (
                <text
                  x={shop.cx}
                  y={shop.cy - 14}
                  textAnchor="middle"
                  fontSize={8}
                  fill={isDark ? '#fff' : '#111'}
                  fontFamily="Poppins, sans-serif"
                  fontWeight="600"
                >
                  {shop.name}
                </text>
              )}
              <title>{shop.name} ({shop.category})</title>
            </g>
          );
        })}

      {/* Trolley markers */}
      {showTrolleys &&
        floorTrolleys.slice(0, mini ? 20 : undefined).map((t) => (
          <TrolleyMapMarker
            key={t.trolley_id}
            x={t.x}
            y={t.y}
            status={t.status}
            battery={t.battery}
            selected={selectedTrolleyId === t.trolley_id || highlightTrolleyId === t.trolley_id}
            onClick={mini ? undefined : () => onTrolleyClick?.(t.trolley_id)}
          />
        ))}

      {/* Highlight trolley position if specified */}
      {highlightTrolleyId && (() => {
        const t = floorTrolleys.find((tp) => tp.trolley_id === highlightTrolleyId);
        if (!t) return null;
        return (
          <circle cx={t.x} cy={t.y} r={15} fill="#BE052E" opacity={0.15}>
            <animate attributeName="r" values="10;20;10" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.2;0.05;0.2" dur="2s" repeatCount="indefinite" />
          </circle>
        );
      })()}

      {/* Title */}
      {!mini && (
        <text x={600} y={30} textAnchor="middle" fontSize={14} fill={isDark ? '#aaa' : '#555'} fontFamily="Montserrat, sans-serif" fontWeight="700">
          {floorInfo?.label || `Airport Terminal — Floor ${floor}`}
        </text>
      )}
    </svg>
  );
}
