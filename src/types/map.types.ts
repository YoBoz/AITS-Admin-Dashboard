export interface MapZone {
  id: string;
  name: string;
  type: 'terminal' | 'gate' | 'retail' | 'food' | 'lounge' | 'service' | 'washroom' | 'security' | 'customs';
  x: number;
  y: number;
  width: number;
  height: number;
  color_light: string;
  color_dark: string;
  shops: string[];
}

export interface PointOfInterest {
  id: string;
  label: string;
  type: 'info_desk' | 'first_aid' | 'charging_station' | 'elevator' | 'atm' | 'escalator';
  x: number;
  y: number;
  shop_id: string | null;
}

export interface TrolleyPosition {
  trolley_id: string;
  x: number;
  y: number;
  status: 'active' | 'idle' | 'charging' | 'maintenance';
  battery: number;
  zone_id: string;
  imei: string;
}

export interface MapConfig {
  width: number;
  height: number;
  zones: MapZone[];
  poi_list: PointOfInterest[];
}

export interface MapFiltersState {
  show_trolleys: boolean;
  show_shops: boolean;
  show_zones: boolean;
  show_pois: boolean;
  show_lounges: boolean;
  show_washrooms: boolean;
  show_gates: boolean;
  trolley_status_filter: TrolleyPosition['status'] | 'all';
  search: string;
}

export type MapLayer = 'trolleys' | 'shops' | 'zones' | 'pois' | 'lounges' | 'washrooms' | 'gates';
