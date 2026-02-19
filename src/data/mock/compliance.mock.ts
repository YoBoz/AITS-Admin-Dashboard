// ──────────────────────────────────────
// Compliance Mock Data — Phase 9
// ──────────────────────────────────────

import type {
  ConsentRecord,
  QuarantinedDevice,
  DSARRequest,
  ImmutableAuditEntry,
  PaymentComplianceBoundary,
} from '@/types/compliance.types';

// ── Helpers ──────────────────────────

function ts(daysAgo: number, hours = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hours, Math.floor(Math.random() * 60), 0, 0);
  return d.toISOString();
}

function randomHex(len: number): string {
  const chars = '0123456789abcdef';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * 16)];
  return out;
}

function sha256Mock(): string {
  return randomHex(64);
}

const consentTypes: ConsentRecord['consent_type'][] = ['analytics', 'marketing', 'location', 'payment_data', 'all'];
const consentSources: ConsentRecord['source'][] = ['trolley_tab', 'web', 'app'];
const consentScopes = [
  'analytics_tracking', 'usage_statistics', 'crash_reports',
  'push_notifications', 'email_marketing', 'sms_offers',
  'gps_location', 'zone_tracking', 'indoor_positioning',
  'card_tokenization', 'transaction_history', 'payment_preferences',
];

const passengerAliases = Array.from({ length: 60 }, (_, i) => `PAX-${String(i + 1001).padStart(4, '0')}`);
const deviceImeis = [
  'IMEI-350001', 'IMEI-350002', 'IMEI-350003', 'IMEI-350004', 'IMEI-350005',
  'IMEI-350006', 'IMEI-350007', 'IMEI-350008', 'IMEI-350009', 'IMEI-350010',
  'IMEI-350011', 'IMEI-350012', 'IMEI-350013', 'IMEI-350014', 'IMEI-350015',
];

// ── Consent Records (120 entries) ────

export const consentRecordsData: ConsentRecord[] = Array.from({ length: 120 }, (_, i) => {
  const r = Math.random();
  let status: ConsentRecord['status'];
  if (r < 0.82) status = 'granted';
  else if (r < 0.92) status = 'declined';
  else status = 'withdrawn';

  const daysAgo = Math.floor(Math.random() * 30);
  const type = consentTypes[Math.floor(Math.random() * consentTypes.length)];
  const scopeCount = type === 'all' ? 6 : Math.floor(Math.random() * 4) + 1;
  const scope = consentScopes.sort(() => Math.random() - 0.5).slice(0, scopeCount);

  return {
    id: `consent-${String(i + 1).padStart(3, '0')}`,
    session_id: `SES-${randomHex(8).toUpperCase()}`,
    passenger_alias: passengerAliases[Math.floor(Math.random() * passengerAliases.length)],
    consent_type: type,
    status,
    granted_at: status === 'granted' || status === 'withdrawn' ? ts(daysAgo, 8 + Math.floor(Math.random() * 12)) : null,
    withdrawn_at: status === 'withdrawn' ? ts(daysAgo - Math.floor(Math.random() * 3)) : null,
    scope,
    device_id: deviceImeis[Math.floor(Math.random() * deviceImeis.length)],
    ip_hash: randomHex(16),
    version: Math.random() > 0.3 ? 'v2.1' : 'v2.0',
    source: consentSources[Math.floor(Math.random() * consentSources.length)],
  };
});

// ── Quarantined Devices (5 entries) ──

export const quarantinedDevicesData: QuarantinedDevice[] = [
  {
    device_id: 'trolley-042',
    device_imei: 'IMEI-350042',
    quarantine_reason: 'suspicious_behavior',
    quarantined_at: ts(2, 14),
    quarantined_by: 'Amira Khoury',
    notes: 'Trolley reported erratic GPS coordinates outside terminal boundaries. Under investigation.',
    status: 'active_quarantine',
    incident_id: 'INC-2026-0032',
    cleared_at: null,
    cleared_by: null,
    clearance_notes: null,
    behavioral_flags: ['erratic movement', 'zone breach', 'signal spoofing suspected'],
  },
  {
    device_id: 'trolley-078',
    device_imei: 'IMEI-350078',
    quarantine_reason: 'security_breach',
    quarantined_at: ts(1, 9),
    quarantined_by: 'Omar Farouk',
    notes: 'Firmware integrity check failed. Device isolated for forensic review.',
    status: 'active_quarantine',
    incident_id: 'INC-2026-0035',
    cleared_at: null,
    cleared_by: null,
    clearance_notes: null,
    behavioral_flags: ['unauthorized firmware', 'repeated policy violations'],
  },
  {
    device_id: 'trolley-091',
    device_imei: 'IMEI-350091',
    quarantine_reason: 'policy_violation',
    quarantined_at: ts(3, 11),
    quarantined_by: 'System Auto-detect',
    notes: 'Multiple session anomalies detected within 1 hour window.',
    status: 'under_investigation',
    incident_id: null,
    cleared_at: null,
    cleared_by: null,
    clearance_notes: null,
    behavioral_flags: ['erratic movement', 'repeated policy violations'],
  },
  {
    device_id: 'trolley-015',
    device_imei: 'IMEI-350015',
    quarantine_reason: 'hardware_fault',
    quarantined_at: ts(14, 16),
    quarantined_by: 'Amira Khoury',
    notes: 'NFC reader malfunction causing payment failures. Replaced and cleared.',
    status: 'cleared',
    incident_id: null,
    cleared_at: ts(10, 11),
    cleared_by: 'Omar Farouk',
    clearance_notes: 'Hardware replaced. All firmware checks passed. Returned to active fleet.',
    behavioral_flags: [],
  },
  {
    device_id: 'trolley-023',
    device_imei: 'IMEI-350023',
    quarantine_reason: 'manual',
    quarantined_at: ts(21, 8),
    quarantined_by: 'Lina Abbas',
    notes: 'Pulled for routine security audit. All checks cleared.',
    status: 'cleared',
    incident_id: null,
    cleared_at: ts(18, 15),
    cleared_by: 'Lina Abbas',
    clearance_notes: 'Routine audit complete. No issues found.',
    behavioral_flags: [],
  },
];

// ── DSAR Requests (8 entries) ────────

export const dsarRequestsData: DSARRequest[] = [
  {
    id: 'dsar-001',
    ticket_id: 'DSAR-20260205-0001',
    type: 'access',
    status: 'verifying',
    submitted_by_alias: 'PAX-1042',
    submitted_at: ts(14),
    due_by: ts(-16), // 30 days from submission
    data_categories: ['session_history', 'payment_records', 'consent_logs'],
    data_found: null,
    response_notes: null,
    completed_at: null,
    assigned_to: 'Amira Khoury',
    timeline: [
      { timestamp: ts(14), actor: 'System', action: 'DSAR request received', note: null },
      { timestamp: ts(13), actor: 'Amira Khoury', action: 'Identity verification initiated', note: 'Requested ID proof via email' },
    ],
  },
  {
    id: 'dsar-002',
    ticket_id: 'DSAR-20260208-0002',
    type: 'deletion',
    status: 'received',
    submitted_by_alias: 'hash:a3f9c2...e81d',
    submitted_at: ts(11),
    due_by: ts(-19),
    data_categories: ['all_personal_data'],
    data_found: null,
    response_notes: null,
    completed_at: null,
    assigned_to: null,
    timeline: [
      { timestamp: ts(11), actor: 'System', action: 'DSAR request received', note: 'Deletion request for all personal data' },
    ],
  },
  {
    id: 'dsar-003',
    ticket_id: 'DSAR-20260201-0003',
    type: 'portability',
    status: 'processing',
    submitted_by_alias: 'PAX-1088',
    submitted_at: ts(18),
    due_by: ts(-12),
    data_categories: ['session_history', 'order_records', 'location_data'],
    data_found: true,
    response_notes: 'Data export prepared in JSON format.',
    completed_at: null,
    assigned_to: 'Omar Farouk',
    timeline: [
      { timestamp: ts(18), actor: 'System', action: 'DSAR request received', note: null },
      { timestamp: ts(17), actor: 'Omar Farouk', action: 'Assigned for processing', note: null },
      { timestamp: ts(15), actor: 'Omar Farouk', action: 'Identity verified', note: 'Passport check passed' },
      { timestamp: ts(12), actor: 'Omar Farouk', action: 'Data collection started', note: 'Querying 3 data categories' },
    ],
  },
  {
    id: 'dsar-004',
    ticket_id: 'DSAR-20260130-0004',
    type: 'rectification',
    status: 'processing',
    submitted_by_alias: 'PAX-1015',
    submitted_at: ts(20),
    due_by: ts(-10),
    data_categories: ['passenger_profile', 'payment_preferences'],
    data_found: true,
    response_notes: null,
    completed_at: null,
    assigned_to: 'Lina Abbas',
    timeline: [
      { timestamp: ts(20), actor: 'System', action: 'DSAR request received', note: 'Rectification of incorrect payment preferences' },
      { timestamp: ts(19), actor: 'Lina Abbas', action: 'Assigned', note: null },
      { timestamp: ts(17), actor: 'Lina Abbas', action: 'Identity verified', note: null },
    ],
  },
  {
    id: 'dsar-005',
    ticket_id: 'DSAR-20260128-0005',
    type: 'access',
    status: 'processing',
    submitted_by_alias: 'PAX-1099',
    submitted_at: ts(22),
    due_by: ts(-8),
    data_categories: ['session_history', 'consent_logs'],
    data_found: true,
    response_notes: 'Compiling session logs for last 90 days.',
    completed_at: null,
    assigned_to: 'Amira Khoury',
    timeline: [
      { timestamp: ts(22), actor: 'System', action: 'DSAR request received', note: null },
      { timestamp: ts(21), actor: 'Amira Khoury', action: 'Assigned', note: null },
      { timestamp: ts(19), actor: 'Amira Khoury', action: 'Verified and processing', note: null },
    ],
  },
  {
    id: 'dsar-006',
    ticket_id: 'DSAR-20260120-0006',
    type: 'deletion',
    status: 'completed',
    submitted_by_alias: 'PAX-1023',
    submitted_at: ts(30),
    due_by: ts(0),
    data_categories: ['session_history', 'location_data', 'analytics_data'],
    data_found: true,
    response_notes: 'All requested data categories deleted. Confirmation sent.',
    completed_at: ts(5),
    assigned_to: 'Omar Farouk',
    timeline: [
      { timestamp: ts(30), actor: 'System', action: 'DSAR request received', note: null },
      { timestamp: ts(29), actor: 'Omar Farouk', action: 'Assigned', note: null },
      { timestamp: ts(27), actor: 'Omar Farouk', action: 'Identity verified', note: null },
      { timestamp: ts(20), actor: 'Omar Farouk', action: 'Data located across 3 systems', note: null },
      { timestamp: ts(7), actor: 'Omar Farouk', action: 'Data deletion executed', note: 'Deleted from primary + backup stores' },
      { timestamp: ts(5), actor: 'Omar Farouk', action: 'DSAR completed', note: 'Confirmation email sent' },
    ],
  },
  {
    id: 'dsar-007',
    ticket_id: 'DSAR-20260115-0007',
    type: 'access',
    status: 'completed',
    submitted_by_alias: 'hash:f23b91...c44a',
    submitted_at: ts(35),
    due_by: ts(-5),
    data_categories: ['consent_logs', 'payment_records'],
    data_found: true,
    response_notes: 'Export provided as encrypted PDF. Decryption key sent separately.',
    completed_at: ts(12),
    assigned_to: 'Lina Abbas',
    timeline: [
      { timestamp: ts(35), actor: 'System', action: 'DSAR request received', note: null },
      { timestamp: ts(34), actor: 'Lina Abbas', action: 'Assigned', note: null },
      { timestamp: ts(30), actor: 'Lina Abbas', action: 'Identity verified', note: null },
      { timestamp: ts(20), actor: 'Lina Abbas', action: 'Data export prepared', note: null },
      { timestamp: ts(12), actor: 'Lina Abbas', action: 'Response sent', note: 'Encrypted PDF via secure channel' },
    ],
  },
  {
    id: 'dsar-008',
    ticket_id: 'DSAR-20260110-0008',
    type: 'restriction',
    status: 'completed',
    submitted_by_alias: 'PAX-1077',
    submitted_at: ts(40),
    due_by: ts(-10),
    data_categories: ['marketing_data', 'analytics_data'],
    data_found: true,
    response_notes: 'Marketing and analytics processing restricted. Consent updated.',
    completed_at: ts(18),
    assigned_to: 'Amira Khoury',
    timeline: [
      { timestamp: ts(40), actor: 'System', action: 'DSAR request received', note: null },
      { timestamp: ts(38), actor: 'Amira Khoury', action: 'Assigned', note: null },
      { timestamp: ts(35), actor: 'Amira Khoury', action: 'Verified', note: null },
      { timestamp: ts(20), actor: 'Amira Khoury', action: 'Processing restriction applied', note: null },
      { timestamp: ts(18), actor: 'Amira Khoury', action: 'Completed', note: 'Restriction confirmed active' },
    ],
  },
];

// ── Payment Compliance Boundaries ────

export const paymentBoundariesData: PaymentComplianceBoundary[] = [
  {
    id: 'pcb-001',
    name: 'Card Data Tokenization',
    type: 'tokenization_requirement',
    scope: 'global',
    value: null,
    currency: null,
    is_active: true,
    description: 'All payment card data must be tokenized before storage. Raw PANs never stored in this system.',
    last_updated: ts(60),
    updated_by: 'Compliance Team',
  },
  {
    id: 'pcb-002',
    name: 'Manager Refund Threshold',
    type: 'refund_limit',
    scope: 'per_merchant',
    value: 50,
    currency: 'AED',
    is_active: true,
    description: 'Merchant managers can approve refunds up to this amount without ops approval.',
    last_updated: ts(15),
    updated_by: 'Omar Farouk',
  },
  {
    id: 'pcb-003',
    name: 'Session Transaction Cap',
    type: 'transaction_cap',
    scope: 'per_session',
    value: 500,
    currency: 'AED',
    is_active: true,
    description: 'Maximum order value per single passenger session.',
    last_updated: ts(30),
    updated_by: 'Amira Khoury',
  },
  {
    id: 'pcb-004',
    name: 'Accepted Currencies',
    type: 'currency_restriction',
    scope: 'global',
    value: null,
    currency: null,
    is_active: true,
    description: 'Currencies accepted for payment processing: AED, USD, EUR, GBP.',
    last_updated: ts(90),
    updated_by: 'Compliance Team',
  },
];

// ── Immutable Audit Log (80 entries) ──

const actors = [
  { id: 'usr-001', name: 'Amira Khoury', role: 'Super Admin' },
  { id: 'usr-002', name: 'Omar Farouk', role: 'Terminal Admin' },
  { id: 'usr-003', name: 'Lina Abbas', role: 'Operator' },
  { id: 'usr-004', name: 'System', role: 'System' },
  { id: 'usr-005', name: 'Youssef Hamdi', role: 'Senior Operator' },
];

const consentActions = [
  { action: 'Consent granted', entity_type: 'consent', cat: 'consent' as const },
  { action: 'Consent withdrawn', entity_type: 'consent', cat: 'consent' as const },
  { action: 'Consent form version updated', entity_type: 'consent_config', cat: 'consent' as const },
  { action: 'Consent record exported', entity_type: 'consent', cat: 'consent' as const },
  { action: 'Consent scope modified', entity_type: 'consent', cat: 'consent' as const },
];

const securityActions = [
  { action: 'Device quarantined', entity_type: 'device', cat: 'security' as const },
  { action: 'Device cleared from quarantine', entity_type: 'device', cat: 'security' as const },
  { action: 'Firmware integrity check triggered', entity_type: 'device', cat: 'security' as const },
  { action: 'Unauthorized access attempt blocked', entity_type: 'session', cat: 'security' as const },
  { action: 'Security policy updated', entity_type: 'policy', cat: 'security' as const },
];

const paymentActions = [
  { action: 'Refund approved', entity_type: 'order', cat: 'payment' as const },
  { action: 'Transaction cap updated', entity_type: 'payment_boundary', cat: 'payment' as const },
  { action: 'Refund threshold modified', entity_type: 'payment_boundary', cat: 'payment' as const },
  { action: 'Payment method tokenized', entity_type: 'payment', cat: 'payment' as const },
];

const policyActions = [
  { action: 'Data retention policy updated', entity_type: 'policy', cat: 'policy' as const },
  { action: 'Coupon rule modified', entity_type: 'coupon_rule', cat: 'policy' as const },
  { action: 'Fraud limit updated', entity_type: 'fraud_limit', cat: 'policy' as const },
  { action: 'SLA threshold changed', entity_type: 'sla_config', cat: 'policy' as const },
  { action: 'Geofence policy updated', entity_type: 'geofence', cat: 'policy' as const },
];

const dsarActions = [
  { action: 'DSAR request received', entity_type: 'dsar', cat: 'data_access' as const },
  { action: 'DSAR identity verified', entity_type: 'dsar', cat: 'data_access' as const },
  { action: 'DSAR data exported', entity_type: 'dsar', cat: 'data_access' as const },
  { action: 'DSAR completed', entity_type: 'dsar', cat: 'data_access' as const },
  { action: 'PII data deleted per DSAR', entity_type: 'passenger_data', cat: 'data_access' as const },
];

const rbacActions = [
  { action: 'Role permissions updated', entity_type: 'role', cat: 'config_change' as const },
  { action: 'User role changed', entity_type: 'user', cat: 'config_change' as const },
  { action: 'New admin user created', entity_type: 'user', cat: 'config_change' as const },
  { action: 'Override approval granted', entity_type: 'override', cat: 'override' as const },
  { action: 'Emergency shutdown override', entity_type: 'device', cat: 'override' as const },
];

function buildAuditLog(): ImmutableAuditEntry[] {
  const allActions = [
    // 25 consent
    ...Array.from({ length: 25 }, () => consentActions[Math.floor(Math.random() * consentActions.length)]),
    // 15 security
    ...Array.from({ length: 15 }, () => securityActions[Math.floor(Math.random() * securityActions.length)]),
    // 10 payment
    ...Array.from({ length: 10 }, () => paymentActions[Math.floor(Math.random() * paymentActions.length)]),
    // 15 policy
    ...Array.from({ length: 15 }, () => policyActions[Math.floor(Math.random() * policyActions.length)]),
    // 10 dsar
    ...Array.from({ length: 10 }, () => dsarActions[Math.floor(Math.random() * dsarActions.length)]),
    // 5 rbac
    ...Array.from({ length: 5 }, () => rbacActions[Math.floor(Math.random() * rbacActions.length)]),
  ];

  // Sort by time (most recent first in creation, we'll reverse to get chronological)
  const entries: ImmutableAuditEntry[] = [];
  let prevHash = 'genesis';

  for (let i = 0; i < allActions.length; i++) {
    const daysAgo = 90 - Math.floor((i / allActions.length) * 90);
    const actor = actors[Math.floor(Math.random() * actors.length)];
    const act = allActions[i];
    const hash = sha256Mock();

    entries.push({
      id: `audit-${String(i + 1).padStart(3, '0')}`,
      hash,
      prev_hash: prevHash,
      timestamp: ts(daysAgo, Math.floor(Math.random() * 24)),
      actor_id: actor.id,
      actor_name: actor.name,
      actor_role: actor.role,
      action_category: act.cat,
      action: act.action,
      entity_type: act.entity_type,
      entity_id: `${act.entity_type}-${randomHex(4)}`,
      data_before: Math.random() > 0.5 ? JSON.stringify({ status: 'previous_value' }) : null,
      data_after: Math.random() > 0.3 ? JSON.stringify({ status: 'new_value' }) : null,
      ip_hash: randomHex(16),
      session_id: `SES-${randomHex(8).toUpperCase()}`,
      chain_valid: true,
    });

    prevHash = hash;
  }

  return entries;
}

export const immutableAuditLogData: ImmutableAuditEntry[] = buildAuditLog();
