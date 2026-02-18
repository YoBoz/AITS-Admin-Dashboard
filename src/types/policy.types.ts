// ──────────────────────────────────────
// Policy Types — Phase 8
// ──────────────────────────────────────

export type PolicyType =
  | 'restricted_zone'
  | 'wheel_lock_zone'
  | 'speed_limit'
  | 'no_entry'
  | 'time_restricted';

export type PolicyStatus = 'active' | 'inactive' | 'scheduled';

export type ConditionOperator = 'eq' | 'neq' | 'gt' | 'lt' | 'in' | 'between';

export interface PolicyCondition {
  field: string; // e.g. 'zone_id', 'device_speed', 'time_of_day'
  operator: ConditionOperator;
  value: string | number | string[];
}

export type PolicyActionType =
  | 'wheel_lock'
  | 'alert_ops'
  | 'notify_device'
  | 'block_entry'
  | 'reduce_speed'
  | 'quarantine';

export interface PolicyAction {
  type: PolicyActionType;
  params: Record<string, string | number>;
}

export interface PolicyOverride {
  id: string;
  overridden_by: string;
  override_reason: string;
  override_notes: string | null;
  device_id: string | null;
  timestamp: string;
  duration_minutes: number | null;
  policy_id?: string;
  policy_name?: string;
  zone?: string;
  outcome?: string;
}

export interface Policy {
  id: string;
  name: string;
  type: PolicyType;
  status: PolicyStatus;
  zone_ids: string[];
  gate_ids: string[];
  description: string;
  conditions: PolicyCondition[];
  actions: PolicyAction[];
  overrides: PolicyOverride[];
  created_at: string;
  created_by: string;
  effective_from: string | null;
  effective_to: string | null;
  last_triggered_at: string | null;
  trigger_count: number;
}

export interface PolicyFilters {
  search: string;
  type: PolicyType | 'all';
  status: PolicyStatus | 'all';
  zone: string | 'all';
}
