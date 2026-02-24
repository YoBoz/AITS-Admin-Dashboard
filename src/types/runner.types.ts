// ──────────────────────────────────────
// Runner Types — Command Center
// ──────────────────────────────────────

export type RunnerStatus = 'available' | 'assigned' | 'in_transit' | 'returning' | 'offline' | 'on_break';

export interface Runner {
  id: string;
  name: string;
  employee_id: string;
  status: RunnerStatus;
  current_order_id: string | null;
  current_zone: string;
  current_gate: string | null;
  phone: string;
  shift_start: string;
  shift_end: string;
  total_deliveries_today: number;
  avg_delivery_time_minutes: number;
  acceptance_rate_pct: number;
  completion_rate_pct: number;
  last_seen: string;
  device_id: string | null;
  location: {
    x: number;
    y: number;
    floor: number;
    zone: string;
  };
}

export interface RunnerPerformance {
  runner_id: string;
  runner_name: string;
  total_deliveries: number;
  avg_acceptance_seconds: number;
  avg_delivery_minutes: number;
  completion_rate_pct: number;
  fail_count: number;
  rating: number;
  sla_breach_count: number;
}

export interface RunnerFilters {
  search: string;
  status: RunnerStatus | 'all';
  zone: string | 'all';
}
