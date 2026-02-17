export type TrolleyStatus = 'active' | 'idle' | 'charging' | 'maintenance' | 'offline';

export interface MaintenanceRecord {
  id: string;
  date: string;
  type: 'scheduled' | 'repair' | 'battery_replace' | 'firmware_update';
  description: string;
  technician: string;
  cost: number;
}

export interface Trolley {
  id: string;
  imei: string;
  serial_number: string;
  status: TrolleyStatus;
  battery: number;
  health_score: number;
  location: { x: number; y: number; zone: string; gate?: string };
  last_seen: string;
  assigned_gate: string;
  firmware_version: string;
  total_trips: number;
  today_trips: number;
  manufacturer: string;
  model: string;
  registered_at: string;
  last_maintenance: string;
  tab_model: string;
  tab_serial: string;
  notes: string;
  maintenance_history: MaintenanceRecord[];
}

export interface TrolleyFilters {
  status: TrolleyStatus | 'all';
  battery_min: number;
  battery_max: number;
  zone: string | 'all';
  search: string;
}
