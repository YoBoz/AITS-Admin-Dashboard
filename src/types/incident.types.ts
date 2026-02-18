// ──────────────────────────────────────
// Incident Types — Phase 8
// ──────────────────────────────────────

export type IncidentSeverity = 'p1_critical' | 'p2_high' | 'p3_medium' | 'p4_low';

export type IncidentType =
  | 'zone_breach'
  | 'device_stuck'
  | 'kiosk_crash'
  | 'network_outage'
  | 'battery_cluster'
  | 'order_sla_breach'
  | 'runner_unavailable'
  | 'payment_failure'
  | 'security_alert'
  | 'custom';

export type IncidentStatus = 'open' | 'investigating' | 'mitigating' | 'resolved' | 'post_mortem';

export type TimelineActionType =
  | 'status_change'
  | 'note_added'
  | 'assigned'
  | 'device_action'
  | 'escalation'
  | 'runbook_step';

export interface IncidentTimelineEntry {
  id: string;
  timestamp: string;
  actor: string;
  action_type: TimelineActionType;
  content: string;
  new_status: IncidentStatus | null;
}

export interface Incident {
  id: string;
  incident_number: string; // INC-YYYYMMDD-XXXX
  title: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  affected_devices: string[]; // trolley ids
  affected_zones: string[];
  affected_gates: string[];
  description: string;
  auto_detected: boolean;
  detected_at: string; // ISO
  acknowledged_at: string | null;
  resolved_at: string | null;
  assigned_to: string | null;
  resolution_code: string | null;
  resolution_notes: string | null;
  runbook_id: string | null;
  timeline: IncidentTimelineEntry[];
  linked_alerts: string[]; // alert ids
  impact_summary: string;
  created_by: string;
}

export type RunbookActionType = 'check' | 'command' | 'escalate' | 'notify' | 'wait';

export interface RunbookStep {
  order: number;
  title: string;
  description: string;
  action_type: RunbookActionType;
  is_completed: boolean;
}

export interface Runbook {
  id: string;
  name: string;
  incident_type: IncidentType;
  steps: RunbookStep[];
  estimated_resolution_minutes: number;
}

export interface IncidentFilters {
  search: string;
  severity: IncidentSeverity | 'all';
  type: IncidentType | 'all';
  status: IncidentStatus | 'all';
  assigned_to: string | 'all';
  date_from: string | null;
  date_to: string | null;
}
