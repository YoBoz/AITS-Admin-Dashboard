// ──────────────────────────────────────
// Terminal Map Mock Data — Multi-Floor
// ──────────────────────────────────────

import type { FloorInfo, MapConfig, MapZone, PointOfInterest, TrolleyPosition } from '@/types/map.types';
import { trolleysData } from './trolleys.mock';

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// ─── Floor Definitions ───────────────────
export const floors: FloorInfo[] = [
  { id: 1, name: 'Departures', label: 'Floor 1 — Departures' },
  { id: 2, name: 'Arrivals', label: 'Floor 2 — Arrivals' },
  { id: 3, name: 'VIP & Executive', label: 'Floor 3 — VIP & Executive' },
];

// ─── Floor 1 — Departures (original layout enhanced) ───
const floor1Zones: MapZone[] = [
  { id: 'checkin', name: 'Check-in Hall', type: 'terminal', x: 80, y: 80, width: 320, height: 180, color_light: '#F0F0F0', color_dark: '#2A2A2A', shops: [], floor: 1 },
  { id: 'security', name: 'Security', type: 'security', x: 420, y: 80, width: 180, height: 180, color_light: '#FEF3C7', color_dark: '#2D2108', shops: [], floor: 1 },
  { id: 'customs', name: 'Customs & Immigration', type: 'customs', x: 620, y: 80, width: 280, height: 180, color_light: '#EDE9FE', color_dark: '#1E1B2E', shops: [], floor: 1 },
  { id: 'main_retail', name: 'Retail Zone', type: 'retail', x: 920, y: 80, width: 200, height: 180, color_light: '#DCFCE7', color_dark: '#0D2016', shops: ['SHOP-001', 'SHOP-005', 'SHOP-011', 'SHOP-017', 'SHOP-029', 'SHOP-045'], floor: 1 },
  { id: 'food_court', name: 'Food Court', type: 'food', x: 80, y: 290, width: 340, height: 140, color_light: '#FEE2E2', color_dark: '#2D0A0A', shops: ['SHOP-003', 'SHOP-012', 'SHOP-018', 'SHOP-027', 'SHOP-033', 'SHOP-038'], floor: 1 },
  { id: 'pharmacy', name: 'Pharma Plus', type: 'service', x: 440, y: 295, width: 110, height: 75, color_light: '#DCFCE7', color_dark: '#0D2016', shops: ['SHOP-007', 'SHOP-022', 'SHOP-036'], floor: 1 },
  { id: 'bank', name: 'Bank / ATM', type: 'service', x: 570, y: 295, width: 110, height: 75, color_light: '#FEF9C3', color_dark: '#1C1600', shops: ['SHOP-008', 'SHOP-014', 'SHOP-040'], floor: 1 },
  { id: 'duty_free', name: 'Duty Free', type: 'retail', x: 700, y: 290, width: 340, height: 140, color_light: '#DCFCE7', color_dark: '#0D2016', shops: ['SHOP-004', 'SHOP-010', 'SHOP-020', 'SHOP-037', 'SHOP-049'], floor: 1 },
  { id: 'lounge_a', name: 'Sky Lounge A', type: 'lounge', x: 80, y: 460, width: 160, height: 100, color_light: '#EDE9FE', color_dark: '#1E1B2E', shops: ['SHOP-006', 'SHOP-021'], floor: 1 },
  { id: 'washroom_a', name: 'WC', type: 'washroom', x: 260, y: 460, width: 60, height: 60, color_light: '#DBEAFE', color_dark: '#0A1628', shops: [], floor: 1 },
  { id: 'gates_a', name: 'Gates A1-A8', type: 'gate', x: 80, y: 580, width: 460, height: 140, color_light: '#F8FAFC', color_dark: '#1A1A1A', shops: [], floor: 1 },
  { id: 'lounge_b', name: 'Sky Lounge B', type: 'lounge', x: 880, y: 460, width: 160, height: 100, color_light: '#EDE9FE', color_dark: '#1E1B2E', shops: ['SHOP-035', 'SHOP-051'], floor: 1 },
  { id: 'washroom_b', name: 'WC', type: 'washroom', x: 800, y: 460, width: 60, height: 60, color_light: '#DBEAFE', color_dark: '#0A1628', shops: [], floor: 1 },
  { id: 'gates_b', name: 'Gates B1-B8', type: 'gate', x: 580, y: 580, width: 460, height: 140, color_light: '#F8FAFC', color_dark: '#1A1A1A', shops: [], floor: 1 },
];

// ─── Floor 2 — Arrivals ───
const floor2Zones: MapZone[] = [
  { id: 'arrivals_hall', name: 'Arrivals Hall', type: 'terminal', x: 80, y: 80, width: 480, height: 200, color_light: '#F0FFF4', color_dark: '#1A2E1A', shops: [], floor: 2 },
  { id: 'immigration_exit', name: 'Immigration Exit', type: 'customs', x: 580, y: 80, width: 240, height: 200, color_light: '#EDE9FE', color_dark: '#1E1B2E', shops: [], floor: 2 },
  { id: 'transfer_desk', name: 'Transfer Desk', type: 'service', x: 840, y: 80, width: 280, height: 200, color_light: '#FEF3C7', color_dark: '#2D2108', shops: [], floor: 2 },
  { id: 'baggage_claim_a', name: 'Baggage Claim A', type: 'baggage', x: 80, y: 310, width: 360, height: 180, color_light: '#DBEAFE', color_dark: '#0A1628', shops: [], floor: 2 },
  { id: 'baggage_claim_b', name: 'Baggage Claim B', type: 'baggage', x: 460, y: 310, width: 360, height: 180, color_light: '#DBEAFE', color_dark: '#0A1628', shops: [], floor: 2 },
  { id: 'lost_luggage', name: 'Lost & Found', type: 'service', x: 840, y: 310, width: 180, height: 90, color_light: '#FEE2E2', color_dark: '#2D0A0A', shops: [], floor: 2 },
  { id: 'arrivals_retail', name: 'Arrivals Retail', type: 'retail', x: 840, y: 420, width: 180, height: 150, color_light: '#DCFCE7', color_dark: '#0D2016', shops: ['SHOP-052', 'SHOP-053', 'SHOP-054'], floor: 2 },
  { id: 'car_rental', name: 'Car Rental', type: 'service', x: 80, y: 520, width: 250, height: 130, color_light: '#FEF9C3', color_dark: '#1C1600', shops: ['SHOP-055', 'SHOP-056'], floor: 2 },
  { id: 'ground_transport', name: 'Ground Transport', type: 'transport', x: 350, y: 520, width: 340, height: 130, color_light: '#F1F5F9', color_dark: '#1E293B', shops: [], floor: 2 },
  { id: 'meeters_hall', name: 'Meeters & Greeters', type: 'terminal', x: 710, y: 580, width: 310, height: 130, color_light: '#FFF7ED', color_dark: '#1C1006', shops: ['SHOP-057', 'SHOP-058'], floor: 2 },
  { id: 'washroom_arr', name: 'WC', type: 'washroom', x: 460, y: 670, width: 60, height: 50, color_light: '#DBEAFE', color_dark: '#0A1628', shops: [], floor: 2 },
];

// ─── Floor 3 — VIP & Executive ───
const floor3Zones: MapZone[] = [
  { id: 'vip_reception', name: 'VIP Reception', type: 'vip', x: 80, y: 80, width: 320, height: 200, color_light: '#FFF7ED', color_dark: '#2D1F06', shops: [], floor: 3 },
  { id: 'premium_lounge', name: 'Premium Lounge', type: 'lounge', x: 420, y: 80, width: 360, height: 200, color_light: '#F5F3FF', color_dark: '#1B1530', shops: ['SHOP-060', 'SHOP-061'], floor: 3 },
  { id: 'business_center', name: 'Business Center', type: 'conference', x: 800, y: 80, width: 320, height: 200, color_light: '#EFF6FF', color_dark: '#0C1929', shops: [], floor: 3 },
  { id: 'exec_dining', name: 'Executive Dining', type: 'food', x: 80, y: 310, width: 300, height: 160, color_light: '#FEF2F2', color_dark: '#2D0A0A', shops: ['SHOP-062', 'SHOP-063'], floor: 3 },
  { id: 'spa_wellness', name: 'Spa & Wellness', type: 'service', x: 400, y: 310, width: 260, height: 160, color_light: '#ECFDF5', color_dark: '#0A2318', shops: ['SHOP-064'], floor: 3 },
  { id: 'premium_retail', name: 'Premium Retail', type: 'retail', x: 680, y: 310, width: 260, height: 160, color_light: '#DCFCE7', color_dark: '#0D2016', shops: ['SHOP-065', 'SHOP-066', 'SHOP-067'], floor: 3 },
  { id: 'vip_washroom', name: 'WC', type: 'washroom', x: 960, y: 310, width: 60, height: 60, color_light: '#DBEAFE', color_dark: '#0A1628', shops: [], floor: 3 },
  { id: 'conf_room_a', name: 'Conference A', type: 'conference', x: 80, y: 500, width: 240, height: 140, color_light: '#F1F5F9', color_dark: '#1E293B', shops: [], floor: 3 },
  { id: 'conf_room_b', name: 'Conference B', type: 'conference', x: 340, y: 500, width: 240, height: 140, color_light: '#F1F5F9', color_dark: '#1E293B', shops: [], floor: 3 },
  { id: 'private_suites', name: 'Private Suites', type: 'vip', x: 600, y: 500, width: 300, height: 140, color_light: '#FFFBEB', color_dark: '#1C1600', shops: [], floor: 3 },
  { id: 'exec_lounge', name: 'Executive Lounge', type: 'executive', x: 920, y: 400, width: 200, height: 240, color_light: '#F5F3FF', color_dark: '#1B1530', shops: ['SHOP-068', 'SHOP-069'], floor: 3 },
];

export const mapZones: MapZone[] = [...floor1Zones, ...floor2Zones, ...floor3Zones];

// Helper to get zones by floor
export function getZonesByFloor(floor: number): MapZone[] {
  return mapZones.filter((z) => z.floor === floor);
}

// ─── POIs per Floor ───
const floor1POIs: PointOfInterest[] = [
  { id: 'poi-1', label: 'Information Desk', type: 'info_desk', x: 250, y: 180, shop_id: null, floor: 1 },
  { id: 'poi-2', label: 'Information Desk B', type: 'info_desk', x: 850, y: 180, shop_id: null, floor: 1 },
  { id: 'poi-3', label: 'First Aid Station', type: 'first_aid', x: 500, y: 230, shop_id: null, floor: 1 },
  { id: 'poi-4', label: 'Charging Station A', type: 'charging_station', x: 200, y: 560, shop_id: null, floor: 1 },
  { id: 'poi-5', label: 'Charging Station B', type: 'charging_station', x: 750, y: 560, shop_id: null, floor: 1 },
  { id: 'poi-6', label: 'Charging Station C', type: 'charging_station', x: 550, y: 180, shop_id: null, floor: 1 },
  { id: 'poi-7', label: 'Elevator 1', type: 'elevator', x: 350, y: 275, shop_id: null, floor: 1 },
  { id: 'poi-8', label: 'Elevator 2', type: 'elevator', x: 700, y: 275, shop_id: null, floor: 1 },
  { id: 'poi-9', label: 'Elevator 3', type: 'elevator', x: 150, y: 440, shop_id: null, floor: 1 },
  { id: 'poi-10', label: 'Escalator A', type: 'escalator', x: 320, y: 275, shop_id: null, floor: 1 },
  { id: 'poi-11', label: 'Escalator B', type: 'escalator', x: 800, y: 275, shop_id: null, floor: 1 },
  { id: 'poi-12', label: 'ATM 1', type: 'atm', x: 620, y: 335, shop_id: 'SHOP-008', floor: 1 },
  { id: 'poi-13', label: 'ATM 2', type: 'atm', x: 950, y: 180, shop_id: 'SHOP-014', floor: 1 },
];

const floor2POIs: PointOfInterest[] = [
  { id: 'poi-f2-1', label: 'Information Desk', type: 'info_desk', x: 300, y: 180, shop_id: null, floor: 2 },
  { id: 'poi-f2-2', label: 'Luggage Cart Station', type: 'luggage_cart', x: 180, y: 400, shop_id: null, floor: 2 },
  { id: 'poi-f2-3', label: 'Luggage Cart Station B', type: 'luggage_cart', x: 560, y: 400, shop_id: null, floor: 2 },
  { id: 'poi-f2-4', label: 'First Aid', type: 'first_aid', x: 700, y: 180, shop_id: null, floor: 2 },
  { id: 'poi-f2-5', label: 'Elevator 1', type: 'elevator', x: 350, y: 275, shop_id: null, floor: 2 },
  { id: 'poi-f2-6', label: 'Elevator 2', type: 'elevator', x: 700, y: 275, shop_id: null, floor: 2 },
  { id: 'poi-f2-7', label: 'Escalator', type: 'escalator', x: 530, y: 275, shop_id: null, floor: 2 },
  { id: 'poi-f2-8', label: 'ATM', type: 'atm', x: 930, y: 480, shop_id: null, floor: 2 },
  { id: 'poi-f2-9', label: 'Charging Station', type: 'charging_station', x: 500, y: 620, shop_id: null, floor: 2 },
];

const floor3POIs: PointOfInterest[] = [
  { id: 'poi-f3-1', label: 'VIP Concierge', type: 'info_desk', x: 200, y: 180, shop_id: null, floor: 3 },
  { id: 'poi-f3-2', label: 'Elevator (Private)', type: 'elevator', x: 350, y: 275, shop_id: null, floor: 3 },
  { id: 'poi-f3-3', label: 'Elevator (Executive)', type: 'elevator', x: 700, y: 275, shop_id: null, floor: 3 },
  { id: 'poi-f3-4', label: 'Prayer Room', type: 'prayer_room', x: 960, y: 390, shop_id: null, floor: 3 },
  { id: 'poi-f3-5', label: 'Charging Lounge', type: 'charging_station', x: 550, y: 180, shop_id: null, floor: 3 },
  { id: 'poi-f3-6', label: 'First Aid (Private)', type: 'first_aid', x: 900, y: 180, shop_id: null, floor: 3 },
];

export const poiList: PointOfInterest[] = [...floor1POIs, ...floor2POIs, ...floor3POIs];

// Helper to get POIs by floor
export function getPOIsByFloor(floor: number): PointOfInterest[] {
  return poiList.filter((p) => p.floor === floor);
}

// ─── Gate positions per floor (for SVG rendering) ───
export const gatePositionsByFloor: Record<number, { id: string; x: number; y: number; w: number; h: number }[]> = {
  1: [
    // Concourse A
    { id: 'A1', x: 90, y: 600, w: 40, h: 26 },
    { id: 'A2', x: 140, y: 600, w: 40, h: 26 },
    { id: 'A3', x: 195, y: 600, w: 40, h: 26 },
    { id: 'A4', x: 250, y: 600, w: 40, h: 26 },
    { id: 'A5', x: 310, y: 600, w: 40, h: 26 },
    { id: 'A6', x: 370, y: 600, w: 40, h: 26 },
    { id: 'A7', x: 430, y: 600, w: 40, h: 26 },
    { id: 'A8', x: 90, y: 680, w: 40, h: 26 },
    // Concourse B
    { id: 'B1', x: 590, y: 600, w: 40, h: 26 },
    { id: 'B2', x: 645, y: 600, w: 40, h: 26 },
    { id: 'B3', x: 700, y: 600, w: 40, h: 26 },
    { id: 'B4', x: 755, y: 600, w: 40, h: 26 },
    { id: 'B5', x: 815, y: 600, w: 40, h: 26 },
    { id: 'B6', x: 875, y: 600, w: 40, h: 26 },
    { id: 'B7', x: 935, y: 600, w: 40, h: 26 },
    { id: 'B8', x: 995, y: 600, w: 40, h: 26 },
  ],
  2: [
    // Baggage carousels (rendered as "gates" visually)
    { id: 'C1', x: 120, y: 350, w: 60, h: 30 },
    { id: 'C2', x: 210, y: 350, w: 60, h: 30 },
    { id: 'C3', x: 300, y: 350, w: 60, h: 30 },
    { id: 'C4', x: 500, y: 350, w: 60, h: 30 },
    { id: 'C5', x: 590, y: 350, w: 60, h: 30 },
    { id: 'C6', x: 680, y: 350, w: 60, h: 30 },
  ],
  3: [], // VIP floor has no gates
};

// ─── Trolley Position Generation (floor-aware) ───
function generateTrolleyPositions(): TrolleyPosition[] {
  const allFloorZones = [
    { floor: 1, zones: floor1Zones },
    { floor: 2, zones: floor2Zones },
    { floor: 3, zones: floor3Zones },
  ];

  return trolleysData
    .filter((t) => t.status !== 'offline')
    .map((t, i) => {
      const r = (offset: number) => pseudoRandom(i * 41 + offset);
      // Distribute trolleys: ~60% floor 1, ~30% floor 2, ~10% floor 3
      const floorRoll = r(100);
      const floorIdx = floorRoll < 0.6 ? 0 : floorRoll < 0.9 ? 1 : 2;
      const floorData = allFloorZones[floorIdx];
      const floorZones = floorData.zones;
      const floor = floorData.floor;

      // Pick a random zone on the floor
      const zoneIdx = Math.floor(r(3) * floorZones.length);
      const zone = floorZones[zoneIdx];

      // Place trolley within that zone
      const x = Math.round(zone.x + r(4) * (zone.width - 20) + 10);
      const y = Math.round(zone.y + r(5) * (zone.height - 20) + 10);

      return {
        trolley_id: t.id,
        x,
        y,
        status: t.status === 'offline' ? 'idle' : (t.status as TrolleyPosition['status']),
        battery: t.battery,
        zone_id: zone.id,
        imei: t.imei,
        floor,
      };
    });
}

export const trolleyPositions: TrolleyPosition[] = generateTrolleyPositions();

// Helper to get trolleys by floor
export function getTrolleysByFloor(floor: number): TrolleyPosition[] {
  return trolleyPositions.filter((t) => t.floor === floor);
}

export const mapConfig: MapConfig = {
  width: 1200,
  height: 800,
  zones: mapZones,
  poi_list: poiList,
};
