// ──────────────────────────────────────
// Roles & Permissions Mock Data
// ──────────────────────────────────────
import type { Permission, Role, PermissionGroup } from '@/types/permissions.types';

// ─── Permission Definitions ───
function perm(key: string, label: string, description: string, group: PermissionGroup, risk: Permission['risk_level']): Permission {
  return { id: key, key, label, description, group, risk_level: risk };
}

export const allPermissions: Permission[] = [
  // Dashboard
  perm('dashboard.view', 'View Dashboard', 'Access to the main dashboard overview', 'dashboard', 'low'),
  perm('dashboard.export', 'Export Dashboard', 'Export dashboard data and widgets', 'dashboard', 'low'),
  // Trolleys
  perm('trolleys.view', 'View Trolleys', 'View trolley list and details', 'trolleys', 'low'),
  perm('trolleys.create', 'Create Trolleys', 'Add new trolleys to the system', 'trolleys', 'medium'),
  perm('trolleys.edit', 'Edit Trolleys', 'Modify trolley information', 'trolleys', 'medium'),
  perm('trolleys.delete', 'Delete Trolleys', 'Remove trolleys from the system', 'trolleys', 'high'),
  perm('trolleys.maintenance_flag', 'Flag for Maintenance', 'Mark trolleys for maintenance', 'trolleys', 'medium'),
  perm('trolleys.export', 'Export Trolleys', 'Export trolley data', 'trolleys', 'low'),
  // Shops
  perm('shops.view', 'View Shops', 'View shop listing and details', 'shops', 'low'),
  perm('shops.create', 'Create Shops', 'Register new shop tenants', 'shops', 'medium'),
  perm('shops.edit', 'Edit Shops', 'Modify shop information', 'shops', 'medium'),
  perm('shops.delete', 'Delete Shops', 'Remove shops from the system', 'shops', 'high'),
  perm('shops.contract_manage', 'Manage Contracts', 'Create and modify shop contracts', 'shops', 'high'),
  perm('shops.export', 'Export Shops', 'Export shop data', 'shops', 'low'),
  // Visitors
  perm('visitors.view', 'View Visitors', 'Access visitor statistics', 'visitors', 'low'),
  perm('visitors.export', 'Export Visitors', 'Export visitor data', 'visitors', 'low'),
  // Heatmap
  perm('heatmap.view', 'View Heatmap', 'Access heatmap visualization', 'heatmap', 'low'),
  // Alerts
  perm('alerts.view', 'View Alerts', 'View system alerts', 'alerts', 'low'),
  perm('alerts.acknowledge', 'Acknowledge Alerts', 'Acknowledge active alerts', 'alerts', 'medium'),
  perm('alerts.resolve', 'Resolve Alerts', 'Resolve and close alerts', 'alerts', 'medium'),
  perm('alerts.dismiss', 'Dismiss Alerts', 'Dismiss non-critical alerts', 'alerts', 'medium'),
  perm('alerts.assign', 'Assign Alerts', 'Assign alerts to personnel', 'alerts', 'medium'),
  // Notifications
  perm('notifications.view', 'View Notifications', 'View notifications', 'notifications', 'low'),
  perm('notifications.send', 'Send Notifications', 'Send notifications to users', 'notifications', 'medium'),
  perm('notifications.manage', 'Manage Notifications', 'Configure notification settings', 'notifications', 'high'),
  // Complaints
  perm('complaints.view', 'View Complaints', 'View complaint tickets', 'complaints', 'low'),
  perm('complaints.assign', 'Assign Complaints', 'Assign complaints to agents', 'complaints', 'medium'),
  perm('complaints.resolve', 'Resolve Complaints', 'Mark complaints as resolved', 'complaints', 'medium'),
  perm('complaints.escalate', 'Escalate Complaints', 'Escalate complaints', 'complaints', 'high'),
  perm('complaints.close', 'Close Complaints', 'Close complaint tickets', 'complaints', 'medium'),
  // Offers
  perm('offers.view', 'View Offers', 'View offers and promotions', 'offers', 'low'),
  perm('offers.create', 'Create Offers', 'Create new offers', 'offers', 'medium'),
  perm('offers.edit', 'Edit Offers', 'Modify existing offers', 'offers', 'medium'),
  perm('offers.delete', 'Delete Offers', 'Remove offers', 'offers', 'high'),
  perm('offers.approve', 'Approve Offers', 'Approve offers for publishing', 'offers', 'high'),
  // Permissions
  perm('permissions.view', 'View Permissions', 'View users, roles, and permissions', 'permissions', 'medium'),
  perm('permissions.users_manage', 'Manage Users', 'Create, edit, suspend admin users', 'permissions', 'critical'),
  perm('permissions.roles_manage', 'Manage Roles', 'Create and modify roles', 'permissions', 'critical'),
  perm('permissions.audit_view', 'View Audit Log', 'View permission audit trail', 'permissions', 'medium'),
  // Settings
  perm('settings.view', 'View Settings', 'Access settings page', 'settings', 'low'),
  perm('settings.general_edit', 'Edit General Settings', 'Modify language, timezone, etc.', 'settings', 'medium'),
  perm('settings.security_edit', 'Edit Security Settings', 'Modify security configuration', 'settings', 'critical'),
  perm('settings.terminal_edit', 'Edit Terminal Settings', 'Modify terminal configuration', 'settings', 'critical'),
  // Reports
  perm('reports.view', 'View Reports', 'Access reports', 'reports', 'low'),
  perm('reports.export', 'Export Reports', 'Export report data', 'reports', 'medium'),
  perm('reports.schedule', 'Schedule Reports', 'Set up automated reports', 'reports', 'medium'),
  // Ops — Orders, Incidents, Policies, Fleet, Runners, Gates, SLA
  perm('orders.view', 'View Orders', 'Access ops orders console', 'ops', 'low'),
  perm('orders.override', 'Override Orders', 'Perform override actions on orders', 'ops', 'high'),
  perm('incidents.view', 'View Incidents', 'View incident list and details', 'ops', 'low'),
  perm('incidents.create', 'Create Incidents', 'Report new incidents', 'ops', 'medium'),
  perm('incidents.manage', 'Manage Incidents', 'Change status, assign, resolve incidents', 'ops', 'high'),
  perm('policies.view', 'View Policies', 'View zone and operational policies', 'ops', 'low'),
  perm('policies.manage', 'Manage Policies', 'Create, toggle, edit policies', 'ops', 'critical'),
  perm('fleet.view', 'View Fleet', 'Access live fleet map and device list', 'ops', 'low'),
  perm('fleet.actions', 'Device Actions', 'Lock, unlock, reboot, update devices', 'ops', 'high'),
  perm('runners.view', 'View Runners', 'View runner management page', 'ops', 'low'),
  perm('runners.manage', 'Manage Runners', 'Assign and manage runners', 'ops', 'medium'),
  perm('gates.view', 'View Gates', 'View gate management', 'ops', 'low'),
  perm('gates.manage', 'Manage Gates', 'Override gate assignments', 'ops', 'medium'),
  perm('sla.view', 'View SLA Analytics', 'Access SLA analytics dashboard', 'ops', 'low'),
  perm('audit.view', 'View Audit Logs', 'Access global audit log', 'ops', 'medium'),
];

export const allPermissionKeys = allPermissions.map((p) => p.key);

export const permissionsByGroup: Record<PermissionGroup, Permission[]> = allPermissions.reduce(
  (acc, p) => {
    if (!acc[p.group]) acc[p.group] = [];
    acc[p.group].push(p);
    return acc;
  },
  {} as Record<PermissionGroup, Permission[]>,
);

export const permissionGroupLabels: Record<PermissionGroup, string> = {
  dashboard: 'Dashboard',
  trolleys: 'Trolleys',
  shops: 'Shops',
  visitors: 'Visitors',
  heatmap: 'Heatmap',
  alerts: 'Alerts',
  notifications: 'Notifications',
  complaints: 'Complaints',
  offers: 'Offers',
  permissions: 'Permissions',
  settings: 'Settings',
  reports: 'Reports',
  ops: 'Operations',
};

// ─── Default Roles ───
const allKeys = allPermissionKeys;

const operatorPermissions = [
  'trolleys.view', 'trolleys.edit', 'trolleys.maintenance_flag',
  'alerts.view', 'alerts.acknowledge', 'alerts.resolve', 'alerts.dismiss', 'alerts.assign',
  'complaints.view', 'complaints.assign', 'complaints.resolve',
  'dashboard.view',
  'notifications.view',
  // Ops — operators can view + create + act on incidents & orders, but NOT modify RBAC or policies
  'orders.view', 'orders.override',
  'incidents.view', 'incidents.create', 'incidents.manage',
  'fleet.view', 'fleet.actions',
  'runners.view', 'runners.manage',
  'gates.view', 'gates.manage',
  'sla.view',
  'audit.view',
];

const viewerPermissions = [
  'dashboard.view', 'trolleys.view', 'shops.view', 'visitors.view',
  'heatmap.view', 'alerts.view', 'notifications.view', 'complaints.view', 'offers.view',
];

const terminalAdminPermissions = allKeys.filter(
  (k) => k !== 'permissions.roles_manage',
);

export const rolesData: Role[] = [
  {
    id: 'super_admin',
    name: 'super_admin',
    label: 'Super Admin',
    color: '#BE052E',
    description: 'Full system access with no restrictions',
    permissions: [...allKeys],
    is_system_role: true,
    user_count: 1,
    created_at: '2024-01-15T09:00:00Z',
    created_by: 'system',
  },
  {
    id: 'terminal_admin',
    name: 'terminal_admin',
    label: 'Terminal Admin',
    color: '#7C3AED',
    description: 'Full access to terminal operations, cannot manage super admin accounts',
    permissions: terminalAdminPermissions,
    is_system_role: true,
    user_count: 3,
    created_at: '2024-01-15T09:00:00Z',
    created_by: 'system',
  },
  {
    id: 'operator',
    name: 'operator',
    label: 'Operator',
    color: '#2563EB',
    description: 'Day-to-day operations: trolleys, alerts, complaints',
    permissions: operatorPermissions,
    is_system_role: true,
    user_count: 8,
    created_at: '2024-01-15T09:00:00Z',
    created_by: 'system',
  },
  {
    id: 'viewer',
    name: 'viewer',
    label: 'Viewer',
    color: '#059669',
    description: 'Read-only access to dashboard and reports',
    permissions: viewerPermissions,
    is_system_role: true,
    user_count: 6,
    created_at: '2024-01-15T09:00:00Z',
    created_by: 'system',
  },
  {
    id: 'reporting_specialist',
    name: 'reporting_specialist',
    label: 'Reporting Specialist',
    color: '#D97706',
    description: 'Viewer access plus reporting and export capabilities',
    permissions: [...viewerPermissions, 'reports.view', 'reports.export', 'reports.schedule', 'dashboard.export'],
    is_system_role: false,
    user_count: 2,
    created_at: '2025-03-10T14:30:00Z',
    created_by: 'Admin User',
  },
  {
    id: 'senior_operator',
    name: 'senior_operator',
    label: 'Senior Operator',
    color: '#0891B2',
    description: 'Operator access plus shop viewing and complaint escalation',
    permissions: [...operatorPermissions, 'shops.view', 'complaints.escalate', 'offers.view'],
    is_system_role: false,
    user_count: 3,
    created_at: '2025-05-22T10:15:00Z',
    created_by: 'Admin User',
  },
];
