// ──────────────────────────────────────
// Terminal Map Mock Data
// ──────────────────────────────────────

import type { MapConfig, MapZone, PointOfInterest, TrolleyPosition } from '@/types/map.types';
import { trolleysData } from './trolleys.mock';

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const mapZones: MapZone[] = [
  { id: 'checkin', name: 'Check-in Hall', type: 'terminal', x: 100, y: 100, width: 300, height: 200, color_light: '#F0F0F0', color_dark: '#2A2A2A', shops: [] },
  { id: 'security', name: 'Security', type: 'security', x: 400, y: 100, width: 200, height: 200, color_light: '#FEF3C7', color_dark: '#2D2108', shops: [] },
  { id: 'customs', name: 'Customs & Immigration', type: 'customs', x: 600, y: 100, width: 300, height: 200, color_light: '#EDE9FE', color_dark: '#1E1B2E', shops: [] },
  { id: 'main_retail', name: 'Retail Zone', type: 'retail', x: 900, y: 100, width: 200, height: 200, color_light: '#DCFCE7', color_dark: '#0D2016', shops: ['SHOP-001', 'SHOP-005', 'SHOP-011', 'SHOP-017', 'SHOP-029', 'SHOP-045'] },
  { id: 'food_court', name: 'Food Court', type: 'food', x: 150, y: 300, width: 350, height: 150, color_light: '#FEE2E2', color_dark: '#2D0A0A', shops: ['SHOP-003', 'SHOP-012', 'SHOP-018', 'SHOP-027', 'SHOP-033', 'SHOP-038'] },
  { id: 'duty_free', name: 'Duty Free', type: 'retail', x: 700, y: 300, width: 350, height: 150, color_light: '#DCFCE7', color_dark: '#0D2016', shops: ['SHOP-004', 'SHOP-010', 'SHOP-020', 'SHOP-037', 'SHOP-049'] },
  { id: 'lounge_a', name: 'Sky Lounge A', type: 'lounge', x: 150, y: 450, width: 160, height: 120, color_light: '#EDE9FE', color_dark: '#1E1B2E', shops: ['SHOP-006', 'SHOP-021'] },
  { id: 'gates_a', name: 'Gates A1-A4', type: 'gate', x: 150, y: 570, width: 350, height: 130, color_light: '#F8FAFC', color_dark: '#1A1A1A', shops: [] },
  { id: 'lounge_b', name: 'Sky Lounge B', type: 'lounge', x: 890, y: 450, width: 160, height: 120, color_light: '#EDE9FE', color_dark: '#1E1B2E', shops: ['SHOP-035', 'SHOP-051'] },
  { id: 'gates_b', name: 'Gates B1-B8', type: 'gate', x: 700, y: 570, width: 350, height: 130, color_light: '#F8FAFC', color_dark: '#1A1A1A', shops: [] },
  { id: 'washroom_a', name: 'WC', type: 'washroom', x: 330, y: 450, width: 60, height: 60, color_light: '#DBEAFE', color_dark: '#0A1628', shops: [] },
  { id: 'washroom_b', name: 'WC', type: 'washroom', x: 700, y: 450, width: 60, height: 60, color_light: '#DBEAFE', color_dark: '#0A1628', shops: [] },
  { id: 'pharmacy', name: 'Pharma Plus', type: 'service', x: 400, y: 310, width: 100, height: 80, color_light: '#DCFCE7', color_dark: '#0D2016', shops: ['SHOP-007', 'SHOP-022', 'SHOP-036'] },
  { id: 'bank', name: 'Bank / ATM', type: 'service', x: 600, y: 310, width: 100, height: 80, color_light: '#FEF9C3', color_dark: '#1C1600', shops: ['SHOP-008', 'SHOP-014', 'SHOP-040'] },
];

export const poiList: PointOfInterest[] = [
  { id: 'poi-1', label: 'Information Desk', type: 'info_desk', x: 250, y: 200, shop_id: null },
  { id: 'poi-2', label: 'Information Desk B', type: 'info_desk', x: 850, y: 200, shop_id: null },
  { id: 'poi-3', label: 'First Aid Station', type: 'first_aid', x: 500, y: 250, shop_id: null },
  { id: 'poi-4', label: 'Charging Station A', type: 'charging_station', x: 200, y: 560, shop_id: null },
  { id: 'poi-5', label: 'Charging Station B', type: 'charging_station', x: 750, y: 560, shop_id: null },
  { id: 'poi-6', label: 'Charging Station C', type: 'charging_station', x: 550, y: 200, shop_id: null },
  { id: 'poi-7', label: 'Elevator 1', type: 'elevator', x: 350, y: 290, shop_id: null },
  { id: 'poi-8', label: 'Elevator 2', type: 'elevator', x: 700, y: 290, shop_id: null },
  { id: 'poi-9', label: 'Elevator 3', type: 'elevator', x: 150, y: 440, shop_id: null },
  { id: 'poi-10', label: 'Escalator A', type: 'escalator', x: 300, y: 290, shop_id: null },
  { id: 'poi-11', label: 'Escalator B', type: 'escalator', x: 800, y: 290, shop_id: null },
  { id: 'poi-12', label: 'ATM 1', type: 'atm', x: 620, y: 350, shop_id: 'SHOP-008' },
  { id: 'poi-13', label: 'ATM 2', type: 'atm', x: 920, y: 200, shop_id: 'SHOP-014' },
];

function generateTrolleyPositions(): TrolleyPosition[] {
  return trolleysData
    .filter((t) => t.status !== 'offline')
    .map((t, i) => {
      const r = (offset: number) => pseudoRandom(i * 41 + offset);
      // Map to the 1200x800 coordinate space
      const x = Math.round(r(1) * 1000) + 100;
      const y = Math.round(r(2) * 600) + 100;

      // Determine which zone they're in
      const zone = mapZones.find(
        (z) => x >= z.x && x <= z.x + z.width && y >= z.y && y <= z.y + z.height
      );

      return {
        trolley_id: t.id,
        x,
        y,
        status: t.status === 'offline' ? 'idle' : (t.status as TrolleyPosition['status']),
        battery: t.battery,
        zone_id: zone?.id || 'checkin',
        imei: t.imei,
      };
    });
}

export const trolleyPositions: TrolleyPosition[] = generateTrolleyPositions();

export const mapConfig: MapConfig = {
  width: 1200,
  height: 800,
  zones: mapZones,
  poi_list: poiList,
};
