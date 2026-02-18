// ──────────────────────────────────────
// SLA Metrics Mock Data — Phase 8
// ──────────────────────────────────────

import type { SLAMetrics, MerchantSLABreakdown, BatteryDistribution, OfflineTimelinePoint } from '@/types/ops-metrics.types';

// Merchant SLA breakdown data
const merchantsSLA: MerchantSLABreakdown[] = [
  { merchant_id: 'SHOP-001', merchant_name: 'Costa Coffee', median: 38, breach_pct: 3.2, total_orders: 245, p95_acceptance: 72, on_time_delivery_pct: 91.2 },
  { merchant_id: 'SHOP-003', merchant_name: 'McDonald\'s', median: 52, breach_pct: 8.4, total_orders: 412, p95_acceptance: 98, on_time_delivery_pct: 84.6 },
  { merchant_id: 'SHOP-004', merchant_name: 'Dubai Duty Free', median: 35, breach_pct: 2.1, total_orders: 189, p95_acceptance: 65, on_time_delivery_pct: 94.8 },
  { merchant_id: 'SHOP-005', merchant_name: 'WHSmith', median: 41, breach_pct: 4.5, total_orders: 156, p95_acceptance: 78, on_time_delivery_pct: 89.3 },
  { merchant_id: 'SHOP-012', merchant_name: 'Shake Shack', median: 58, breach_pct: 9.8, total_orders: 287, p95_acceptance: 105, on_time_delivery_pct: 82.1 },
  { merchant_id: 'SHOP-018', merchant_name: 'Paul Bakery', median: 44, breach_pct: 5.6, total_orders: 198, p95_acceptance: 82, on_time_delivery_pct: 88.4 },
];

// Today's metrics
export const todaySLAMetrics: SLAMetrics = {
  period: 'today',
  order_acceptance: {
    median_seconds: 42,
    p95_seconds: 85,
    sla_breached_count: 23,
    sla_breached_pct: 5.8,
    by_merchant: merchantsSLA,
  },
  delivery: {
    median_minutes: 18,
    p95_minutes: 32,
    sla_breached_count: 15,
    on_time_pct: 87.6,
  },
  device_uptime: {
    overall_pct: 99.1,
    by_zone: {
      checkin: 99.5,
      security: 99.8,
      customs: 99.9,
      main_retail: 98.7,
      food_court: 98.2,
      duty_free: 99.3,
      lounge_a: 99.6,
      lounge_b: 99.4,
      gates_a: 98.9,
      gates_b: 99.1,
    },
    offline_incidents_count: 4,
  },
  runner_performance: {
    avg_acceptance_seconds: 28,
    completion_rate_pct: 94.2,
    fail_reasons: {
      'no_runner_available': 12,
      'order_cancelled': 8,
      'merchant_delay': 15,
      'gate_change': 6,
      'passenger_no_show': 4,
    },
  },
};

// This week's metrics
export const weekSLAMetrics: SLAMetrics = {
  period: 'this_week',
  order_acceptance: {
    median_seconds: 44,
    p95_seconds: 88,
    sla_breached_count: 156,
    sla_breached_pct: 6.2,
    by_merchant: merchantsSLA.map((m) => ({ ...m, breach_pct: m.breach_pct + 0.5, total_orders: m.total_orders * 7 })),
  },
  delivery: {
    median_minutes: 19,
    p95_minutes: 34,
    sla_breached_count: 98,
    on_time_pct: 86.4,
  },
  device_uptime: {
    overall_pct: 98.8,
    by_zone: {
      checkin: 99.2,
      security: 99.5,
      customs: 99.7,
      main_retail: 98.1,
      food_court: 97.8,
      duty_free: 98.9,
      lounge_a: 99.3,
      lounge_b: 99.1,
      gates_a: 98.4,
      gates_b: 98.7,
    },
    offline_incidents_count: 23,
  },
  runner_performance: {
    avg_acceptance_seconds: 31,
    completion_rate_pct: 93.8,
    fail_reasons: {
      'no_runner_available': 78,
      'order_cancelled': 52,
      'merchant_delay': 94,
      'gate_change': 38,
      'passenger_no_show': 26,
    },
  },
};

// This month's metrics
export const monthSLAMetrics: SLAMetrics = {
  period: 'this_month',
  order_acceptance: {
    median_seconds: 43,
    p95_seconds: 86,
    sla_breached_count: 612,
    sla_breached_pct: 5.9,
    by_merchant: merchantsSLA.map((m) => ({ ...m, breach_pct: m.breach_pct + 0.2, total_orders: m.total_orders * 30 })),
  },
  delivery: {
    median_minutes: 18,
    p95_minutes: 33,
    sla_breached_count: 385,
    on_time_pct: 87.1,
  },
  device_uptime: {
    overall_pct: 99.0,
    by_zone: {
      checkin: 99.3,
      security: 99.6,
      customs: 99.8,
      main_retail: 98.4,
      food_court: 98.0,
      duty_free: 99.1,
      lounge_a: 99.4,
      lounge_b: 99.2,
      gates_a: 98.6,
      gates_b: 98.9,
    },
    offline_incidents_count: 89,
  },
  runner_performance: {
    avg_acceptance_seconds: 29,
    completion_rate_pct: 94.0,
    fail_reasons: {
      'no_runner_available': 312,
      'order_cancelled': 208,
      'merchant_delay': 376,
      'gate_change': 152,
      'passenger_no_show': 104,
    },
  },
};

// Battery distribution for health monitoring
export const batteryDistribution: BatteryDistribution[] = [
  { range: '0-10%', count: 6, percentage: 2.1 },
  { range: '11-20%', count: 12, percentage: 4.3 },
  { range: '21-30%', count: 18, percentage: 6.4 },
  { range: '31-40%', count: 24, percentage: 8.6 },
  { range: '41-50%', count: 32, percentage: 11.4 },
  { range: '51-60%', count: 45, percentage: 16.1 },
  { range: '61-70%', count: 52, percentage: 18.6 },
  { range: '71-80%', count: 48, percentage: 17.1 },
  { range: '81-90%', count: 28, percentage: 10.0 },
  { range: '91-100%', count: 15, percentage: 5.4 },
];

// Offline timeline (last 24 hours)
export const offlineTimeline: OfflineTimelinePoint[] = Array.from({ length: 24 }, (_, i) => {
  const hour = new Date();
  hour.setHours(hour.getHours() - (23 - i));
  return {
    hour: hour.toISOString().slice(11, 16),
    count: Math.floor(Math.random() * 8) + (i === 14 ? 15 : i === 8 ? 12 : 2),
  };
});

// Acceptance time distribution for SLA dashboard
export const acceptanceTimeDistribution = [
  { bucket: '0-30s', count: 156, within_sla: true },
  { bucket: '31-60s', count: 98, within_sla: true },
  { bucket: '61-90s', count: 45, within_sla: false },
  { bucket: '91-120s', count: 18, within_sla: false },
  { bucket: '120s+', count: 8, within_sla: false },
];

// Uptime data for chart (last 30 days)
export const uptimeData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const baseUptime = 99.0;
  // Add some variance with occasional dips
  const variance = Math.random() * 0.5;
  const hasIncident = i === 12 || i === 22; // Simulate incidents on specific days
  return {
    date: date.toISOString().slice(0, 10),
    uptime: hasIncident ? 97.5 + Math.random() * 0.5 : baseUptime + variance,
    incident: hasIncident ? `INC-${String(i + 1).padStart(5, '0')}` : null,
  };
});
