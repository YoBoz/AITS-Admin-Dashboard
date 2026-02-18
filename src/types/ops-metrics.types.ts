// ──────────────────────────────────────
// Ops Metrics Types — Phase 8
// ──────────────────────────────────────

export interface MerchantSLABreakdown {
  merchant_name: string;
  merchant_id: string;
  median: number;
  breach_pct: number;
  total_orders: number;
  p95_acceptance: number;
  on_time_delivery_pct: number;
}

export interface OrderAcceptanceMetrics {
  median_seconds: number;
  p95_seconds: number;
  sla_breached_count: number;
  sla_breached_pct: number;
  by_merchant: MerchantSLABreakdown[];
}

export interface DeliveryMetrics {
  median_minutes: number;
  p95_minutes: number;
  sla_breached_count: number;
  on_time_pct: number;
}

export interface DeviceUptimeMetrics {
  overall_pct: number;
  by_zone: Record<string, number>;
  offline_incidents_count: number;
}

export interface RunnerPerformanceMetrics {
  avg_acceptance_seconds: number;
  completion_rate_pct: number;
  fail_reasons: Record<string, number>;
}

export interface SLAMetrics {
  period: string;
  order_acceptance: OrderAcceptanceMetrics;
  delivery: DeliveryMetrics;
  device_uptime: DeviceUptimeMetrics;
  runner_performance: RunnerPerformanceMetrics;
}

export type SLAPeriod = 'today' | 'this_week' | 'this_month' | 'custom';

// Fleet health types
export interface FleetHealthSummary {
  online: number;
  low_battery: number;
  critical_battery: number;
  offline: number;
  maintenance: number;
  sensor_fault: number;
  total: number;
}

export interface BatteryDistribution {
  range: string;
  count: number;
  percentage: number;
}

export interface OfflineTimelinePoint {
  hour: string;
  count: number;
}
