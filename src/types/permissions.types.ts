// ──────────────────────────────────────
// Permissions & RBAC Types
// ──────────────────────────────────────

export type PermissionGroup =
  | 'dashboard'
  | 'trolleys'
  | 'shops'
  | 'visitors'
  | 'heatmap'
  | 'alerts'
  | 'notifications'
  | 'complaints'
  | 'offers'
  | 'permissions'
  | 'settings'
  | 'reports';

export interface Permission {
  id: string;
  key: string;
  label: string;
  description: string;
  group: PermissionGroup;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
}

export interface Role {
  id: string;
  name: string;
  label: string;
  description: string;
  color: string;
  permissions: string[];
  is_system_role: boolean;
  user_count: number;
  created_at: string;
  created_by: string;
}

export type AdminUserStatus = 'active' | 'inactive' | 'suspended' | 'pending_invite';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  role_label: string;
  avatar: string | null;
  status: AdminUserStatus;
  terminal: string;
  department: string;
  phone: string;
  last_login: string | null;
  created_at: string;
  invited_by: string;
  two_fa_enabled: boolean;
  permissions_override: string[];
}

export interface AuditLogEntry {
  id: string;
  actor_id: string;
  actor_name: string;
  actor_role: string;
  action: string;
  resource_type: string;
  resource_id: string;
  resource_label: string;
  changes: { field: string; from: string; to: string }[] | null;
  ip_address: string;
  timestamp: string;
  result: 'success' | 'failed' | 'blocked';
}
