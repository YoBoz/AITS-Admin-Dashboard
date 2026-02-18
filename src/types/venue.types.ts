// ──────────────────────────────────────
// Venue Types — Phase 8
// ──────────────────────────────────────

import type { MapZone } from './map.types';

export interface Gate {
  id: string;
  name: string; // A1, B4, etc.
  code: string; // Display code like A1, B4
  zone_id: string;
  concourse: string;
  is_international: boolean;
  current_flight: string | null;
  passenger_count_estimate: number;
  // Phase 8 additions
  status: 'open' | 'boarding' | 'delayed' | 'closed';
  passengerCount: number;
  flightNumber?: string;
  destination?: string;
  departureTime?: string;
}

export interface Corridor {
  id: string;
  name: string;
  connects_zones: string[];
  width_meters: number;
  is_restricted: boolean;
}

export interface VenueZone {
  id: string;
  floor_id: string;
  floorId: string; // Alias for floor_id
  name: string;
  type: MapZone['type'];
  corridors: Corridor[];
  gates: Gate[];
  area_sqm: number;
  max_capacity: number | null;
  has_wifi: boolean;
  has_power_outlets: boolean;
  is_restricted?: boolean;
  isRestricted?: boolean; // Alias
  trolleyCount: number; // Phase 8 addition
  maxTrolleys?: number;
}

export interface Floor {
  id: string;
  terminal_id: string;
  floor_number: number;
  name: string;
  zones: VenueZone[];
}

export interface Terminal {
  id: string;
  name: string;
  iata_code: string;
  floors: Floor[];
  support_email?: string;
}

export type VenueNodeType = 'terminal' | 'floor' | 'zone' | 'gate';
