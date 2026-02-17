// ──────────────────────────────────────
// Audit Log Mock Data
// ──────────────────────────────────────
import type { AuditLogEntry } from '@/types/permissions.types';

function ts(daysAgo: number, hours = 10, minutes = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

const actors = [
  { id: 'u-001', name: 'Admin User', role: 'Super Admin' },
  { id: 'u-002', name: 'Fatima Al-Rashid', role: 'Terminal Admin' },
  { id: 'u-003', name: 'Marcus Chen', role: 'Terminal Admin' },
  { id: 'u-005', name: 'Hassan Al-Maktoum', role: 'Operator' },
  { id: 'u-008', name: 'Aisha Binti Yusuf', role: 'Operator' },
  { id: 'u-013', name: 'Lina Dubois', role: 'Reporting Specialist' },
];

function actor(idx: number) { return actors[idx % actors.length]; }

let id = 1;
function entry(
  daysAgo: number,
  hour: number,
  actorIdx: number,
  action: string,
  resourceType: string,
  resourceId: string,
  resourceLabel: string,
  result: AuditLogEntry['result'],
  changes: AuditLogEntry['changes'] = null,
): AuditLogEntry {
  const a = actor(actorIdx);
  return {
    id: `audit-${String(id++).padStart(3, '0')}`,
    actor_id: a.id,
    actor_name: a.name,
    actor_role: a.role,
    action,
    resource_type: resourceType,
    resource_id: resourceId,
    resource_label: resourceLabel,
    changes,
    ip_address: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    timestamp: ts(daysAgo, hour),
    result,
  };
}

export const auditLogData: AuditLogEntry[] = [
  // User logins (20)
  entry(0, 8, 0, 'user.login', 'user', 'u-001', 'Admin User', 'success'),
  entry(0, 7, 1, 'user.login', 'user', 'u-002', 'Fatima Al-Rashid', 'success'),
  entry(0, 9, 4, 'user.login', 'user', 'u-008', 'Aisha Binti Yusuf', 'success'),
  entry(0, 10, 3, 'user.login', 'user', 'u-005', 'Hassan Al-Maktoum', 'success'),
  entry(1, 8, 0, 'user.login', 'user', 'u-001', 'Admin User', 'success'),
  entry(1, 7, 2, 'user.login', 'user', 'u-003', 'Marcus Chen', 'success'),
  entry(1, 14, 5, 'user.login', 'user', 'u-013', 'Lina Dubois', 'success'),
  entry(2, 9, 1, 'user.login', 'user', 'u-002', 'Fatima Al-Rashid', 'success'),
  entry(2, 11, 3, 'user.login', 'user', 'u-005', 'Hassan Al-Maktoum', 'success'),
  entry(3, 8, 0, 'user.login', 'user', 'u-001', 'Admin User', 'success'),
  entry(4, 9, 4, 'user.login', 'user', 'u-008', 'Aisha Binti Yusuf', 'success'),
  entry(5, 10, 2, 'user.login', 'user', 'u-003', 'Marcus Chen', 'success'),
  entry(6, 8, 0, 'user.login', 'user', 'u-001', 'Admin User', 'success'),
  entry(7, 7, 1, 'user.login', 'user', 'u-002', 'Fatima Al-Rashid', 'success'),
  entry(8, 15, 0, 'user.login', 'user', 'u-001', 'Admin User', 'failed'),
  entry(10, 9, 3, 'user.login', 'user', 'u-005', 'Hassan Al-Maktoum', 'success'),
  entry(12, 8, 0, 'user.login', 'user', 'u-001', 'Admin User', 'success'),
  entry(15, 10, 5, 'user.login', 'user', 'u-013', 'Lina Dubois', 'success'),
  entry(20, 11, 2, 'user.login', 'user', 'u-003', 'Marcus Chen', 'success'),
  entry(25, 9, 4, 'user.login', 'user', 'u-008', 'Aisha Binti Yusuf', 'success'),

  // User created (8)
  entry(1, 10, 0, 'user.created', 'user', 'u-018', 'Elena Volkov', 'success'),
  entry(3, 11, 0, 'user.created', 'user', 'u-016', 'Isabelle Moreau', 'success'),
  entry(10, 14, 0, 'user.created', 'user', 'u-017', 'Rajesh Kapoor', 'success'),
  entry(15, 9, 0, 'user.created', 'user', 'u-011', 'Khalid Al-Amiri', 'success'),
  entry(18, 10, 1, 'user.created', 'user', 'u-012', 'Omar Faisal', 'success'),
  entry(20, 11, 2, 'user.created', 'user', 'u-010', 'Maria Santos', 'success'),
  entry(22, 15, 0, 'user.created', 'user', 'u-013', 'Lina Dubois', 'success'),
  entry(25, 9, 1, 'user.created', 'user', 'u-009', 'James O\'Brien', 'success'),

  // User suspended (2)
  entry(8, 16, 1, 'user.suspended', 'user', 'u-009', 'James O\'Brien', 'success', [
    { field: 'status', from: 'active', to: 'suspended' },
  ]),
  entry(15, 12, 0, 'user.suspended', 'user', 'u-004', 'Sarah Patel', 'success', [
    { field: 'status', from: 'active', to: 'inactive' },
  ]),

  // Role updated (5)
  entry(2, 15, 0, 'role.updated', 'role', 'senior_operator', 'Senior Operator', 'success', [
    { field: 'permissions', from: '12 permissions', to: '14 permissions' },
  ]),
  entry(5, 11, 0, 'role.updated', 'role', 'reporting_specialist', 'Reporting Specialist', 'success', [
    { field: 'permissions', from: '10 permissions', to: '13 permissions' },
  ]),
  entry(10, 14, 0, 'role.updated', 'role', 'operator', 'Operator', 'success', [
    { field: 'description', from: 'Basic operations', to: 'Day-to-day operations: trolleys, alerts, complaints' },
  ]),
  entry(14, 10, 0, 'role.updated', 'role', 'viewer', 'Viewer', 'success', [
    { field: 'permissions', from: '8 permissions', to: '9 permissions' },
  ]),
  entry(20, 16, 0, 'role.updated', 'role', 'terminal_admin', 'Terminal Admin', 'success', [
    { field: 'permissions', from: '45 permissions', to: '47 permissions' },
  ]),

  // Role created (2)
  entry(12, 10, 0, 'role.created', 'role', 'reporting_specialist', 'Reporting Specialist', 'success'),
  entry(18, 14, 0, 'role.created', 'role', 'senior_operator', 'Senior Operator', 'success'),

  // Permission granted (10)
  entry(2, 16, 0, 'permission.granted', 'user', 'u-011', 'Khalid Al-Amiri', 'success', [
    { field: 'permissions_override', from: '', to: 'complaints.escalate' },
  ]),
  entry(4, 11, 0, 'permission.granted', 'role', 'operator', 'Operator', 'success', [
    { field: 'permission', from: '', to: 'alerts.assign' },
  ]),
  entry(6, 14, 0, 'permission.granted', 'role', 'reporting_specialist', 'Reporting Specialist', 'success', [
    { field: 'permission', from: '', to: 'reports.schedule' },
  ]),
  entry(7, 10, 0, 'permission.granted', 'role', 'senior_operator', 'Senior Operator', 'success', [
    { field: 'permission', from: '', to: 'shops.view' },
  ]),
  entry(9, 15, 1, 'permission.granted', 'user', 'u-006', 'Priya Sharma', 'success', [
    { field: 'permissions_override', from: '', to: 'shops.view' },
  ]),
  entry(11, 9, 0, 'permission.granted', 'role', 'viewer', 'Viewer', 'success', [
    { field: 'permission', from: '', to: 'offers.view' },
  ]),
  entry(13, 16, 2, 'permission.granted', 'user', 'u-007', 'Tom Eriksson', 'success', [
    { field: 'permissions_override', from: '', to: 'complaints.escalate' },
  ]),
  entry(16, 11, 0, 'permission.granted', 'role', 'terminal_admin', 'Terminal Admin', 'success', [
    { field: 'permission', from: '', to: 'complaints.close' },
  ]),
  entry(19, 14, 0, 'permission.granted', 'role', 'operator', 'Operator', 'success', [
    { field: 'permission', from: '', to: 'trolleys.maintenance_flag' },
  ]),
  entry(24, 10, 0, 'permission.granted', 'role', 'senior_operator', 'Senior Operator', 'success', [
    { field: 'permission', from: '', to: 'complaints.escalate' },
  ]),

  // Settings updated (13)
  entry(0, 11, 0, 'settings.updated', 'settings', 'general', 'General Settings', 'success', [
    { field: 'language', from: 'en', to: 'ar' },
  ]),
  entry(0, 11, 0, 'settings.updated', 'settings', 'general', 'General Settings', 'success', [
    { field: 'language', from: 'ar', to: 'en' },
  ]),
  entry(1, 14, 0, 'settings.updated', 'settings', 'appearance', 'Appearance Settings', 'success', [
    { field: 'theme', from: 'light', to: 'dark' },
  ]),
  entry(2, 10, 0, 'settings.updated', 'settings', 'terminal', 'Terminal Settings', 'success', [
    { field: 'low_battery_threshold', from: '15', to: '20' },
  ]),
  entry(3, 16, 0, 'settings.updated', 'settings', 'notifications', 'Notification Settings', 'success', [
    { field: 'sound_alerts', from: 'true', to: 'false' },
  ]),
  entry(5, 9, 0, 'settings.updated', 'settings', 'security', 'Security Settings', 'success', [
    { field: 'session_timeout', from: '30 min', to: '1 hour' },
  ]),
  entry(7, 11, 1, 'settings.updated', 'settings', 'terminal', 'Terminal Settings', 'success', [
    { field: 'offer_rotation_interval', from: '10', to: '15' },
  ]),
  entry(10, 10, 0, 'settings.updated', 'settings', 'data', 'Data Settings', 'success', [
    { field: 'trolley_tracking_retention', from: '90 days', to: '180 days' },
  ]),
  entry(12, 15, 0, 'settings.updated', 'settings', 'security', 'Security Settings', 'success', [
    { field: '2fa_enabled', from: 'false', to: 'true' },
  ]),
  entry(14, 10, 2, 'settings.updated', 'settings', 'appearance', 'Appearance Settings', 'success', [
    { field: 'compact_mode', from: 'false', to: 'true' },
  ]),
  entry(17, 14, 0, 'settings.updated', 'settings', 'data', 'Data Settings', 'success', [
    { field: 'export_format', from: 'CSV', to: 'Excel' },
  ]),
  entry(21, 11, 0, 'settings.updated', 'settings', 'notifications', 'Notification Settings', 'success', [
    { field: 'email_digest', from: 'Immediate', to: 'Daily' },
  ]),
  entry(28, 9, 0, 'settings.updated', 'settings', 'general', 'General Settings', 'success', [
    { field: 'timezone', from: 'UTC+3', to: 'UTC+4' },
  ]),
].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
