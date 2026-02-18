// ──────────────────────────────────────
// Venue Mock Data — Phase 8
// ──────────────────────────────────────

import type { Terminal, Floor, VenueZone, Gate, Corridor } from '@/types/venue.types';

// Flight numbers for gates
const flightNumbers = [
  'EK204', 'EK512', 'QR101', 'BA107', 'LH489', 'AF218', 'KL456', 'SQ321',
  'CX880', 'NH203', 'JL045', 'QF008', 'UA912', 'AA156', 'DL078', 'VS401',
];

// Generate random passenger counts for surge simulation
function randomPassengerCount(seed: number): number {
  return Math.floor(50 + Math.sin(seed) * 150 + 150);
}

// Helper to determine gate status based on flight
function gateStatus(hasFlight: boolean, seed: number): 'open' | 'boarding' | 'delayed' | 'closed' {
  if (!hasFlight) return seed % 3 === 0 ? 'closed' : 'open';
  const statusSeed = seed % 10;
  if (statusSeed < 4) return 'boarding';
  if (statusSeed === 9) return 'delayed';
  return 'open';
}

// Gates for Gates A zone
const gatesA: Gate[] = [
  { id: 'gate-a1', name: 'A1', code: 'A1', zone_id: 'gates_a', concourse: 'A', is_international: true, current_flight: flightNumbers[0], passenger_count_estimate: randomPassengerCount(1), status: gateStatus(true, 1), passengerCount: randomPassengerCount(1) },
  { id: 'gate-a2', name: 'A2', code: 'A2', zone_id: 'gates_a', concourse: 'A', is_international: true, current_flight: flightNumbers[1], passenger_count_estimate: randomPassengerCount(2), status: gateStatus(true, 2), passengerCount: randomPassengerCount(2) },
  { id: 'gate-a3', name: 'A3', code: 'A3', zone_id: 'gates_a', concourse: 'A', is_international: false, current_flight: flightNumbers[2], passenger_count_estimate: randomPassengerCount(3), status: gateStatus(true, 3), passengerCount: randomPassengerCount(3) },
  { id: 'gate-a4', name: 'A4', code: 'A4', zone_id: 'gates_a', concourse: 'A', is_international: false, current_flight: null, passenger_count_estimate: randomPassengerCount(4), status: gateStatus(false, 4), passengerCount: randomPassengerCount(4) },
  { id: 'gate-a5', name: 'A5', code: 'A5', zone_id: 'gates_a', concourse: 'A', is_international: true, current_flight: flightNumbers[3], passenger_count_estimate: randomPassengerCount(5), status: gateStatus(true, 5), passengerCount: randomPassengerCount(5) },
  { id: 'gate-a6', name: 'A6', code: 'A6', zone_id: 'gates_a', concourse: 'A', is_international: true, current_flight: flightNumbers[4], passenger_count_estimate: randomPassengerCount(6), status: gateStatus(true, 6), passengerCount: randomPassengerCount(6) },
  { id: 'gate-a7', name: 'A7', code: 'A7', zone_id: 'gates_a', concourse: 'A', is_international: false, current_flight: null, passenger_count_estimate: randomPassengerCount(7), status: gateStatus(false, 7), passengerCount: randomPassengerCount(7) },
  { id: 'gate-a8', name: 'A8', code: 'A8', zone_id: 'gates_a', concourse: 'A', is_international: false, current_flight: flightNumbers[5], passenger_count_estimate: randomPassengerCount(8), status: gateStatus(true, 8), passengerCount: randomPassengerCount(8) },
];

// Gates for Gates B zone
const gatesB: Gate[] = [
  { id: 'gate-b1', name: 'B1', code: 'B1', zone_id: 'gates_b', concourse: 'B', is_international: true, current_flight: flightNumbers[6], passenger_count_estimate: randomPassengerCount(9), status: gateStatus(true, 9), passengerCount: randomPassengerCount(9) },
  { id: 'gate-b2', name: 'B2', code: 'B2', zone_id: 'gates_b', concourse: 'B', is_international: true, current_flight: flightNumbers[7], passenger_count_estimate: randomPassengerCount(10), status: gateStatus(true, 10), passengerCount: randomPassengerCount(10) },
  { id: 'gate-b3', name: 'B3', code: 'B3', zone_id: 'gates_b', concourse: 'B', is_international: true, current_flight: flightNumbers[8], passenger_count_estimate: randomPassengerCount(11), status: gateStatus(true, 11), passengerCount: randomPassengerCount(11) },
  { id: 'gate-b4', name: 'B4', code: 'B4', zone_id: 'gates_b', concourse: 'B', is_international: false, current_flight: flightNumbers[9], passenger_count_estimate: randomPassengerCount(12), status: gateStatus(true, 12), passengerCount: randomPassengerCount(12) },
  { id: 'gate-b5', name: 'B5', code: 'B5', zone_id: 'gates_b', concourse: 'B', is_international: false, current_flight: null, passenger_count_estimate: randomPassengerCount(13), status: gateStatus(false, 13), passengerCount: randomPassengerCount(13) },
  { id: 'gate-b6', name: 'B6', code: 'B6', zone_id: 'gates_b', concourse: 'B', is_international: true, current_flight: flightNumbers[10], passenger_count_estimate: randomPassengerCount(14), status: gateStatus(true, 14), passengerCount: randomPassengerCount(14) },
  { id: 'gate-b7', name: 'B7', code: 'B7', zone_id: 'gates_b', concourse: 'B', is_international: true, current_flight: flightNumbers[11], passenger_count_estimate: randomPassengerCount(15), status: gateStatus(true, 15), passengerCount: randomPassengerCount(15) },
  { id: 'gate-b8', name: 'B8', code: 'B8', zone_id: 'gates_b', concourse: 'B', is_international: false, current_flight: flightNumbers[12], passenger_count_estimate: randomPassengerCount(16), status: gateStatus(true, 16), passengerCount: randomPassengerCount(16) },
];

// Corridors
const corridors: Corridor[] = [
  { id: 'cor-main-1', name: 'Main Corridor 1', connects_zones: ['checkin', 'security'], width_meters: 12, is_restricted: false },
  { id: 'cor-main-2', name: 'Main Corridor 2', connects_zones: ['security', 'customs'], width_meters: 10, is_restricted: false },
  { id: 'cor-retail', name: 'Retail Corridor', connects_zones: ['customs', 'main_retail', 'duty_free'], width_meters: 15, is_restricted: false },
  { id: 'cor-food', name: 'Food Court Corridor', connects_zones: ['main_retail', 'food_court'], width_meters: 8, is_restricted: false },
  { id: 'cor-gates-a', name: 'Concourse A Corridor', connects_zones: ['food_court', 'gates_a'], width_meters: 10, is_restricted: false },
  { id: 'cor-gates-b', name: 'Concourse B Corridor', connects_zones: ['duty_free', 'gates_b'], width_meters: 10, is_restricted: false },
  { id: 'cor-maint', name: 'Maintenance Corridor', connects_zones: ['security', 'gates_a'], width_meters: 4, is_restricted: true },
];

// Floor 1 Zones (Departures)
const floor1Zones: VenueZone[] = [
  {
    id: 'checkin',
    floor_id: 'floor-1',
    floorId: 'floor-1',
    name: 'Check-in Hall',
    type: 'terminal',
    corridors: [corridors[0]],
    gates: [],
    area_sqm: 6000,
    max_capacity: 2000,
    has_wifi: true,
    has_power_outlets: true,
    trolleyCount: 20,
  },
  {
    id: 'security',
    floor_id: 'floor-1',
    floorId: 'floor-1',
    name: 'Security',
    type: 'security',
    corridors: [corridors[0], corridors[1], corridors[6]],
    gates: [],
    area_sqm: 4000,
    max_capacity: 500,
    has_wifi: true,
    has_power_outlets: false,
    is_restricted: true,
    isRestricted: true,
    trolleyCount: 8,
  },
  {
    id: 'customs',
    floor_id: 'floor-1',
    floorId: 'floor-1',
    name: 'Customs & Immigration',
    type: 'customs',
    corridors: [corridors[1], corridors[2]],
    gates: [],
    area_sqm: 6000,
    max_capacity: 800,
    has_wifi: true,
    has_power_outlets: false,
    is_restricted: true,
    isRestricted: true,
    trolleyCount: 7,
  },
  {
    id: 'main_retail',
    floor_id: 'floor-1',
    floorId: 'floor-1',
    name: 'Retail Zone',
    type: 'retail',
    corridors: [corridors[2], corridors[3]],
    gates: [],
    area_sqm: 4000,
    max_capacity: 1200,
    has_wifi: true,
    has_power_outlets: true,
    trolleyCount: 25,
  },
  {
    id: 'food_court',
    floor_id: 'floor-1',
    floorId: 'floor-1',
    name: 'Food Court',
    type: 'food',
    corridors: [corridors[3], corridors[4]],
    gates: [],
    area_sqm: 5250,
    max_capacity: 1500,
    has_wifi: true,
    has_power_outlets: true,
    trolleyCount: 30,
  },
  {
    id: 'duty_free',
    floor_id: 'floor-1',
    floorId: 'floor-1',
    name: 'Duty Free',
    type: 'retail',
    corridors: [corridors[2], corridors[5]],
    gates: [],
    area_sqm: 5250,
    max_capacity: 1000,
    has_wifi: true,
    has_power_outlets: true,
    trolleyCount: 28,
  },
  {
    id: 'lounge_a',
    floor_id: 'floor-1',
    floorId: 'floor-1',
    name: 'Sky Lounge A',
    type: 'lounge',
    corridors: [],
    gates: [],
    area_sqm: 1920,
    max_capacity: 200,
    has_wifi: true,
    has_power_outlets: true,
    trolleyCount: 12,
  },
  {
    id: 'lounge_b',
    floor_id: 'floor-1',
    floorId: 'floor-1',
    name: 'Sky Lounge B',
    type: 'lounge',
    corridors: [],
    gates: [],
    area_sqm: 1920,
    max_capacity: 200,
    has_wifi: true,
    has_power_outlets: true,
    trolleyCount: 10,
  },
  {
    id: 'gates_a',
    floor_id: 'floor-1',
    floorId: 'floor-1',
    name: 'Gates A1-A8',
    type: 'gate',
    corridors: [corridors[4]],
    gates: gatesA,
    area_sqm: 4550,
    max_capacity: 2400,
    has_wifi: true,
    has_power_outlets: true,
    trolleyCount: 42,
  },
  {
    id: 'gates_b',
    floor_id: 'floor-1',
    floorId: 'floor-1',
    name: 'Gates B1-B8',
    type: 'gate',
    corridors: [corridors[5]],
    gates: gatesB,
    area_sqm: 4550,
    max_capacity: 2400,
    has_wifi: true,
    has_power_outlets: true,
    trolleyCount: 38,
  },
  {
    id: 'washroom_a',
    floor_id: 'floor-1',
    floorId: 'floor-1',
    name: 'Restrooms A',
    type: 'washroom',
    corridors: [],
    gates: [],
    area_sqm: 360,
    max_capacity: null,
    has_wifi: false,
    has_power_outlets: false,
    trolleyCount: 3,
  },
  {
    id: 'washroom_b',
    floor_id: 'floor-1',
    floorId: 'floor-1',
    name: 'Restrooms B',
    type: 'washroom',
    corridors: [],
    gates: [],
    area_sqm: 360,
    max_capacity: null,
    has_wifi: false,
    has_power_outlets: false,
    trolleyCount: 4,
  },
  {
    id: 'pharmacy',
    floor_id: 'floor-1',
    floorId: 'floor-1',
    name: 'Pharma Plus',
    type: 'service',
    corridors: [],
    gates: [],
    area_sqm: 800,
    max_capacity: 50,
    has_wifi: true,
    has_power_outlets: true,
    trolleyCount: 12,
  },
  {
    id: 'bank',
    floor_id: 'floor-1',
    floorId: 'floor-1',
    name: 'Bank / ATM',
    type: 'service',
    corridors: [],
    gates: [],
    area_sqm: 800,
    max_capacity: 30,
    has_wifi: true,
    has_power_outlets: true,
    trolleyCount: 10,
  },
];

// Floor 2 Zones (Arrivals) - Simplified
const floor2Zones: VenueZone[] = [
  {
    id: 'arrivals_hall',
    floor_id: 'floor-2',
    floorId: 'floor-2',
    name: 'Arrivals Hall',
    type: 'terminal',
    corridors: [],
    gates: [],
    area_sqm: 8000,
    max_capacity: 3000,
    has_wifi: true,
    has_power_outlets: true,
    trolleyCount: 22,
  },
  {
    id: 'baggage_claim',
    floor_id: 'floor-2',
    floorId: 'floor-2',
    name: 'Baggage Claim',
    type: 'service',
    corridors: [],
    gates: [],
    area_sqm: 5000,
    max_capacity: 1500,
    has_wifi: true,
    has_power_outlets: false,
    trolleyCount: 14,
  },
  {
    id: 'arrivals_customs',
    floor_id: 'floor-2',
    floorId: 'floor-2',
    name: 'Arrivals Customs',
    type: 'customs',
    corridors: [],
    gates: [],
    area_sqm: 3000,
    max_capacity: 500,
    has_wifi: true,
    has_power_outlets: false,
    is_restricted: true,
    isRestricted: true,
    trolleyCount: 6,
  },
  {
    id: 'meeters_greeters',
    floor_id: 'floor-2',
    floorId: 'floor-2',
    name: 'Meeters & Greeters',
    type: 'terminal',
    corridors: [],
    gates: [],
    area_sqm: 2000,
    max_capacity: 800,
    has_wifi: true,
    has_power_outlets: true,
    trolleyCount: 18,
  },
];

// Floors
const floors: Floor[] = [
  {
    id: 'floor-1',
    terminal_id: 'terminal-dxb-t2',
    floor_number: 1,
    name: 'Departures',
    zones: floor1Zones,
  },
  {
    id: 'floor-2',
    terminal_id: 'terminal-dxb-t2',
    floor_number: 2,
    name: 'Arrivals',
    zones: floor2Zones,
  },
];

// Terminal
export const venueData: Terminal = {
  id: 'terminal-dxb-t2',
  name: 'Dubai International Airport - Terminal 2',
  iata_code: 'DXB',
  floors,
  support_email: 'ops-support@dxb-airport.ae',
};

// Helper to get all gates
export const allGates: Gate[] = [...gatesA, ...gatesB];

// Helper to get all zones flat
export const allZones: VenueZone[] = floors.flatMap((f) => f.zones);
