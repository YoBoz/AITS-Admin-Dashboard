import { useMemo } from 'react';
import { mapZones, poiList, trolleyPositions } from '@/data/mock/map.mock';
import { shopsData } from '@/data/mock/shops.mock';
import { TrolleyMapMarker } from '@/components/trolleys/TrolleyMapMarker';
import type { MapZone } from '@/types/map.types';

interface AirportMapSVGProps {
  mini?: boolean;
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

const gatePositions = [
  // Concourse A - left side
  { id: 'A1', x: 155, y: 590, w: 35, h: 25 },
  { id: 'A2', x: 200, y: 590, w: 35, h: 25 },
  { id: 'A3', x: 250, y: 590, w: 35, h: 25 },
  { id: 'A4', x: 300, y: 590, w: 35, h: 25 },
  { id: 'A5', x: 350, y: 590, w: 35, h: 25 },
  { id: 'A6', x: 400, y: 590, w: 35, h: 25 },
  { id: 'A7', x: 155, y: 665, w: 35, h: 25 },
  { id: 'A8', x: 200, y: 665, w: 35, h: 25 },
  // Concourse B - right side
  { id: 'B1', x: 705, y: 590, w: 35, h: 25 },
  { id: 'B2', x: 755, y: 590, w: 35, h: 25 },
  { id: 'B3', x: 810, y: 590, w: 35, h: 25 },
  { id: 'B4', x: 860, y: 590, w: 35, h: 25 },
  { id: 'B5', x: 910, y: 590, w: 35, h: 25 },
  { id: 'B6', x: 960, y: 590, w: 35, h: 25 },
  { id: 'B7', x: 705, y: 665, w: 35, h: 25 },
  { id: 'B8', x: 755, y: 665, w: 35, h: 25 },
];

export function AirportMapSVG({
  mini = false,
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

  const shopPositions = useMemo(() => {
    return shopsData.slice(0, 30).map((s) => ({
      ...s,
      cx: s.location.coordinates.x * 1.1,
      cy: s.location.coordinates.y * 0.9 + 50,
    }));
  }, []);

  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-full"
      style={{ maxHeight: mini ? 300 : undefined }}
    >
      {/* Background */}
      <rect x="0" y="0" width="1200" height="800" fill={isDark ? '#111' : '#ffffff'} rx="8" />

      {/* Zone rectangles */}
      {showZones &&
        mapZones.map((zone) => (
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
              rx={4}
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
          </g>
        ))}

      {/* Gate markers */}
      {showGates &&
        gatePositions.map((gate) => (
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
        poiList.map((poi) => {
          const color =
            poi.type === 'info_desk' ? '#3b82f6' :
            poi.type === 'first_aid' ? '#ef4444' :
            poi.type === 'charging_station' ? '#10b981' :
            poi.type === 'atm' ? '#f59e0b' :
            '#9ca3af';
          const icon =
            poi.type === 'info_desk' ? 'i' :
            poi.type === 'first_aid' ? '+' :
            poi.type === 'charging_station' ? '⚡' :
            poi.type === 'elevator' ? '↕' :
            poi.type === 'escalator' ? '↗' :
            poi.type === 'atm' ? '$' : '•';

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
                r={selectedShopId === shop.id ? 10 : 7}
                fill={markerColor}
                opacity={selectedShopId === shop.id ? 1 : 0.7}
                stroke={selectedShopId === shop.id ? '#fff' : 'none'}
                strokeWidth={2}
                className="transition-all duration-200"
              />
              <title>{shop.name} ({shop.category})</title>
            </g>
          );
        })}

      {/* Trolley markers */}
      {showTrolleys &&
        trolleyPositions.slice(0, mini ? 20 : undefined).map((t) => (
          <TrolleyMapMarker
            key={t.trolley_id}
            x={(t.x / 1200) * 1100 + 50}
            y={(t.y / 800) * 650 + 75}
            status={t.status}
            battery={t.battery}
            selected={selectedTrolleyId === t.trolley_id || highlightTrolleyId === t.trolley_id}
            onClick={mini ? undefined : () => onTrolleyClick?.(t.trolley_id)}
          />
        ))}

      {/* Highlight trolley position if specified */}
      {highlightTrolleyId && (() => {
        const t = trolleyPositions.find((tp) => tp.trolley_id === highlightTrolleyId);
        if (!t) return null;
        const cx = (t.x / 1200) * 1100 + 50;
        const cy = (t.y / 800) * 650 + 75;
        return (
          <circle cx={cx} cy={cy} r={15} fill="#BE052E" opacity={0.15}>
            <animate attributeName="r" values="10;20;10" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.2;0.05;0.2" dur="2s" repeatCount="indefinite" />
          </circle>
        );
      })()}

      {/* Title */}
      {!mini && (
        <text x={600} y={30} textAnchor="middle" fontSize={14} fill={isDark ? '#aaa' : '#555'} fontFamily="Montserrat, sans-serif" fontWeight="700">
          Airport Terminal — Floor Plan
        </text>
      )}
    </svg>
  );
}
