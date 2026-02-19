// ──────────────────────────────────────
// Compliance Types — Phase 9
// ──────────────────────────────────────

export interface ConsentRecord {
  id: string;
  session_id: string;
  passenger_alias: string; // PAX-XXXX
  consent_type: 'analytics' | 'marketing' | 'location' | 'payment_data' | 'all';
  status: 'granted' | 'declined' | 'withdrawn' | 'pending';
  granted_at: string | null; // ISO
  withdrawn_at: string | null;
  scope: string[];
  device_id: string; // trolley IMEI
  ip_hash: string; // hashed, never raw IP
  version: string; // consent form version e.g. v2.1
  source: 'trolley_tab' | 'web' | 'app';
}

export interface QuarantinedDevice {
  device_id: string;
  device_imei: string;
  quarantine_reason: 'suspicious_behavior' | 'security_breach' | 'policy_violation' | 'hardware_fault' | 'manual';
  quarantined_at: string;
  quarantined_by: string;
  notes: string;
  status: 'active_quarantine' | 'under_investigation' | 'cleared' | 'decommissioned';
  incident_id: string | null;
  cleared_at: string | null;
  cleared_by: string | null;
  clearance_notes: string | null;
  behavioral_flags: string[];
}

export interface DSARRequest {
  id: string;
  ticket_id: string; // DSAR-YYYYMMDD-XXXX
  type: 'access' | 'deletion' | 'rectification' | 'portability' | 'restriction';
  status: 'received' | 'verifying' | 'processing' | 'completed' | 'rejected' | 'withdrawn';
  submitted_by_alias: string; // passenger alias or email hash
  submitted_at: string;
  due_by: string; // ISO - 30 days from submission under GDPR
  data_categories: string[];
  data_found: boolean | null;
  response_notes: string | null;
  completed_at: string | null;
  assigned_to: string | null;
  timeline: DSARTimelineEntry[];
}

export interface DSARTimelineEntry {
  timestamp: string;
  actor: string;
  action: string;
  note: string | null;
}

export interface PaymentComplianceBoundary {
  id: string;
  name: string;
  type: 'tokenization_requirement' | 'refund_limit' | 'currency_restriction' | 'transaction_cap';
  scope: 'global' | 'per_merchant' | 'per_session';
  value: number | null;
  currency: string | null;
  is_active: boolean;
  description: string;
  last_updated: string;
  updated_by: string;
}

export interface ImmutableAuditEntry {
  id: string;
  hash: string; // SHA-256 mock
  prev_hash: string; // chain link
  timestamp: string;
  actor_id: string;
  actor_name: string;
  actor_role: string;
  action_category: 'consent' | 'security' | 'payment' | 'policy' | 'data_access' | 'override' | 'config_change';
  action: string;
  entity_type: string;
  entity_id: string;
  data_before: string | null; // JSON stringified, redacted PII
  data_after: string | null;
  ip_hash: string;
  session_id: string;
  chain_valid: boolean; // always true in mock
}

export type ConsentStatus = ConsentRecord['status'];
export type DSARStatus = DSARRequest['status'];
export type QuarantineStatus = QuarantinedDevice['status'];
export type AuditActionCategory = ImmutableAuditEntry['action_category'];
