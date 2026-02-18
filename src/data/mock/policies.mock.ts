// ──────────────────────────────────────
// Policies Mock Data — Phase 8
// ──────────────────────────────────────

import type { Policy, PolicyOverride } from '@/types/policy.types';

const operators = ['Ahmed Al-Farsi', 'Sara Khalil', 'John Mitchell', 'Fatima Ben Ali', 'Omar Hassan'];

function pastDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

function generateOverrides(policyId: string, count: number, seed: number): PolicyOverride[] {
  const overrides: PolicyOverride[] = [];
  const reasons = [
    'Emergency maintenance access',
    'VIP escort operation',
    'Security drill',
    'Device retrieval',
    'Network troubleshooting',
    'Passenger assistance',
  ];

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor((seed + i) * 3) % 30;
    overrides.push({
      id: `OVR-${policyId}-${String(i + 1).padStart(3, '0')}`,
      overridden_by: operators[(seed + i) % operators.length],
      override_reason: reasons[(seed + i) % reasons.length],
      override_notes: i % 2 === 0 ? 'Approved by supervisor. Documented in security log.' : null,
      device_id: `TRL-${String(((seed + i) * 7) % 200 + 1).padStart(4, '0')}`,
      timestamp: pastDate(daysAgo),
      duration_minutes: [15, 30, 60, null][(seed + i) % 4],
      policy_id: policyId,
    });
  }

  return overrides.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export const policiesData: Policy[] = [
  // Restricted Zones
  {
    id: 'POL-001',
    name: 'Security Zone Restriction',
    type: 'restricted_zone',
    status: 'active',
    zone_ids: ['security'],
    gate_ids: [],
    description: 'Prevents unauthorized device entry into Security screening area. Triggers wheel lock and ops alert.',
    conditions: [
      { field: 'zone_id', operator: 'eq', value: 'security' },
      { field: 'device_authorized', operator: 'eq', value: 'false' },
    ],
    actions: [
      { type: 'wheel_lock', params: { immediate: 1 } },
      { type: 'alert_ops', params: { severity: 'critical', message: 'Unauthorized device in Security zone' } },
      { type: 'notify_device', params: { message: 'Device locked. Contact operations.' } },
    ],
    overrides: generateOverrides('POL-001', 3, 1),
    created_at: pastDate(90),
    created_by: 'Ahmed Al-Farsi',
    effective_from: null,
    effective_to: null,
    last_triggered_at: pastDate(2),
    trigger_count: 47,
  },
  {
    id: 'POL-002',
    name: 'Customs Area Restriction',
    type: 'restricted_zone',
    status: 'active',
    zone_ids: ['customs'],
    gate_ids: [],
    description: 'Customs and Immigration is a restricted zone. All devices entering without authorization are locked.',
    conditions: [
      { field: 'zone_id', operator: 'eq', value: 'customs' },
    ],
    actions: [
      { type: 'wheel_lock', params: { immediate: 1 } },
      { type: 'alert_ops', params: { severity: 'critical', message: 'Device entered Customs zone' } },
    ],
    overrides: generateOverrides('POL-002', 2, 2),
    created_at: pastDate(90),
    created_by: 'Ahmed Al-Farsi',
    effective_from: null,
    effective_to: null,
    last_triggered_at: pastDate(5),
    trigger_count: 23,
  },

  // No Entry
  {
    id: 'POL-003',
    name: 'Maintenance Corridor B Block',
    type: 'no_entry',
    status: 'active',
    zone_ids: [],
    gate_ids: [],
    description: 'Maintenance corridor B is closed to all devices. Staff-only access.',
    conditions: [
      { field: 'corridor_id', operator: 'eq', value: 'corridor_b_maint' },
    ],
    actions: [
      { type: 'block_entry', params: { redirect: 'corridor_a' } },
      { type: 'notify_device', params: { message: 'Area closed for maintenance. Please use alternate route.' } },
    ],
    overrides: generateOverrides('POL-003', 4, 3),
    created_at: pastDate(45),
    created_by: 'Sara Khalil',
    effective_from: null,
    effective_to: null,
    last_triggered_at: pastDate(1),
    trigger_count: 156,
  },

  // Speed Limit
  {
    id: 'POL-004',
    name: 'Food Court Speed Limit',
    type: 'speed_limit',
    status: 'active',
    zone_ids: ['food_court'],
    gate_ids: [],
    description: 'Crowded area speed restriction. Devices limited to 3 km/h during peak hours.',
    conditions: [
      { field: 'zone_id', operator: 'eq', value: 'food_court' },
      { field: 'device_speed', operator: 'gt', value: 3 },
      { field: 'time_of_day', operator: 'between', value: ['11:00', '14:00'] },
    ],
    actions: [
      { type: 'reduce_speed', params: { max_speed: 3 } },
      { type: 'notify_device', params: { message: 'Reduced speed zone. Please proceed carefully.' } },
    ],
    overrides: generateOverrides('POL-004', 2, 4),
    created_at: pastDate(60),
    created_by: 'John Mitchell',
    effective_from: null,
    effective_to: null,
    last_triggered_at: pastDate(0),
    trigger_count: 892,
  },

  // Time Restricted
  {
    id: 'POL-005',
    name: 'Night Mode - Gates A',
    type: 'time_restricted',
    status: 'active',
    zone_ids: ['gates_a'],
    gate_ids: ['A1', 'A2', 'A3', 'A4'],
    description: 'After 23:00, devices in Gates A area are locked until 05:00.',
    conditions: [
      { field: 'zone_id', operator: 'eq', value: 'gates_a' },
      { field: 'time_of_day', operator: 'between', value: ['23:00', '05:00'] },
    ],
    actions: [
      { type: 'wheel_lock', params: { immediate: 0, delay_seconds: 300 } },
      { type: 'notify_device', params: { message: 'Night mode active. Device will lock in 5 minutes.' } },
      { type: 'alert_ops', params: { severity: 'info', message: 'Device entering night mode in Gates A' } },
    ],
    overrides: generateOverrides('POL-005', 5, 5),
    created_at: pastDate(120),
    created_by: 'Fatima Ben Ali',
    effective_from: null,
    effective_to: null,
    last_triggered_at: pastDate(1),
    trigger_count: 234,
  },
  {
    id: 'POL-006',
    name: 'Night Mode - Retail Zone',
    type: 'time_restricted',
    status: 'active',
    zone_ids: ['main_retail', 'duty_free'],
    gate_ids: [],
    description: 'Retail areas closed after 22:00. Devices redirected to charging stations.',
    conditions: [
      { field: 'zone_id', operator: 'in', value: ['main_retail', 'duty_free'] },
      { field: 'time_of_day', operator: 'between', value: ['22:00', '06:00'] },
    ],
    actions: [
      { type: 'notify_device', params: { message: 'Retail zone closed. Returning to dock.' } },
      { type: 'alert_ops', params: { severity: 'info', message: 'Device in closed retail zone' } },
    ],
    overrides: generateOverrides('POL-006', 3, 6),
    created_at: pastDate(120),
    created_by: 'Fatima Ben Ali',
    effective_from: null,
    effective_to: null,
    last_triggered_at: pastDate(1),
    trigger_count: 567,
  },

  // Wheel Lock Zone
  {
    id: 'POL-007',
    name: 'Airside Restricted Zone',
    type: 'wheel_lock_zone',
    status: 'active',
    zone_ids: [],
    gate_ids: [],
    description: 'Automatic wheel lock for any device detected beyond passenger areas.',
    conditions: [
      { field: 'zone_type', operator: 'eq', value: 'airside_restricted' },
    ],
    actions: [
      { type: 'wheel_lock', params: { immediate: 1 } },
      { type: 'quarantine', params: { reason: 'airside_breach' } },
      { type: 'alert_ops', params: { severity: 'critical', message: 'AIRSIDE BREACH - Device quarantined' } },
    ],
    overrides: generateOverrides('POL-007', 2, 7),
    created_at: pastDate(180),
    created_by: 'Ahmed Al-Farsi',
    effective_from: null,
    effective_to: null,
    last_triggered_at: pastDate(14),
    trigger_count: 8,
  },

  // Scheduled policy (inactive)
  {
    id: 'POL-008',
    name: 'Ramadan Hours Adjustment',
    type: 'time_restricted',
    status: 'scheduled',
    zone_ids: ['food_court'],
    gate_ids: [],
    description: 'Modified operating hours during Ramadan. Food Court service adjusted.',
    conditions: [
      { field: 'zone_id', operator: 'eq', value: 'food_court' },
      { field: 'time_of_day', operator: 'between', value: ['05:00', '19:00'] },
    ],
    actions: [
      { type: 'reduce_speed', params: { max_speed: 2 } },
      { type: 'notify_device', params: { message: 'Ramadan hours in effect.' } },
    ],
    overrides: [],
    created_at: pastDate(10),
    created_by: 'Omar Hassan',
    effective_from: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    effective_to: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    last_triggered_at: null,
    trigger_count: 0,
  },
];

// Aggregated override log for the Override Log page
export const allOverridesData: PolicyOverride[] = policiesData
  .flatMap((p) => p.overrides.map((o) => ({ ...o, policy_name: p.name, zone: p.zone_ids[0] || 'N/A' })))
  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
