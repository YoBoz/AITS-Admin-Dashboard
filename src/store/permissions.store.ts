// ──────────────────────────────────────
// Permissions & RBAC Store (Zustand)
// ──────────────────────────────────────
import { create } from 'zustand';
import type { AdminUser, Role, Permission, AuditLogEntry } from '@/types/permissions.types';
import { usersData } from '@/data/mock/users.mock';
import { rolesData, allPermissions } from '@/data/mock/roles.mock';
import { auditLogData } from '@/data/mock/audit.mock';

interface PermissionsFilters {
  search: string;
  role: string;
  status: string;
  terminal: string;
}

interface AuditFilters {
  search: string;
  action: string;
  result: string;
}

interface PermissionsState {
  users: AdminUser[];
  roles: Role[];
  permissions: Permission[];
  auditLog: AuditLogEntry[];
  filters: PermissionsFilters;
  auditFilters: AuditFilters;

  // User actions
  addUser: (user: AdminUser) => void;
  updateUser: (id: string, updates: Partial<AdminUser>) => void;
  deactivateUser: (id: string) => void;

  // Role actions
  addRole: (role: Role) => void;
  updateRole: (id: string, updates: Partial<Role>) => void;
  deleteRole: (id: string) => void;
  updateRolePermissions: (roleId: string, permissions: string[]) => void;

  // Audit actions
  addAuditEntry: (entry: AuditLogEntry) => void;

  // Filter actions
  setFilters: (filters: Partial<PermissionsFilters>) => void;
  setAuditFilters: (filters: Partial<AuditFilters>) => void;
  resetFilters: () => void;

  // Selectors
  getFilteredUsers: () => AdminUser[];
  getFilteredAuditLog: () => AuditLogEntry[];
  getUserStats: () => { total: number; active: number; pending: number; suspended: number };
  getRoleById: (id: string) => Role | undefined;
}

const defaultFilters: PermissionsFilters = {
  search: '',
  role: 'all',
  status: 'all',
  terminal: 'all',
};

const defaultAuditFilters: AuditFilters = {
  search: '',
  action: 'all',
  result: 'all',
};

export const usePermissionsStore = create<PermissionsState>((set, get) => ({
  users: usersData,
  roles: rolesData,
  permissions: allPermissions,
  auditLog: auditLogData,
  filters: { ...defaultFilters },
  auditFilters: { ...defaultAuditFilters },

  addUser: (user) =>
    set((state) => ({ users: [user, ...state.users] })),

  updateUser: (id, updates) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
    })),

  deactivateUser: (id) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === id ? { ...u, status: 'suspended' as const } : u,
      ),
    })),

  addRole: (role) =>
    set((state) => ({ roles: [...state.roles, role] })),

  updateRole: (id, updates) =>
    set((state) => ({
      roles: state.roles.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    })),

  deleteRole: (id) =>
    set((state) => ({
      roles: state.roles.filter((r) => r.id !== id),
      users: state.users.map((u) =>
        u.role === id ? { ...u, role: 'viewer', role_label: 'Viewer' } : u,
      ),
    })),

  updateRolePermissions: (roleId, permissions) =>
    set((state) => ({
      roles: state.roles.map((r) =>
        r.id === roleId ? { ...r, permissions } : r,
      ),
    })),

  addAuditEntry: (entry) =>
    set((state) => ({ auditLog: [entry, ...state.auditLog] })),

  setFilters: (f) =>
    set((state) => ({ filters: { ...state.filters, ...f } })),

  setAuditFilters: (f) =>
    set((state) => ({ auditFilters: { ...state.auditFilters, ...f } })),

  resetFilters: () =>
    set({ filters: { ...defaultFilters } }),

  getFilteredUsers: () => {
    const { users, filters } = get();
    return users.filter((u) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !u.name.toLowerCase().includes(q) &&
          !u.email.toLowerCase().includes(q)
        )
          return false;
      }
      if (filters.role !== 'all' && u.role !== filters.role) return false;
      if (filters.status !== 'all' && u.status !== filters.status) return false;
      if (filters.terminal !== 'all' && u.terminal !== filters.terminal) return false;
      return true;
    });
  },

  getFilteredAuditLog: () => {
    const { auditLog, auditFilters } = get();
    return auditLog.filter((e) => {
      if (auditFilters.search) {
        const q = auditFilters.search.toLowerCase();
        if (
          !e.actor_name.toLowerCase().includes(q) &&
          !e.resource_label.toLowerCase().includes(q) &&
          !e.action.toLowerCase().includes(q)
        )
          return false;
      }
      if (auditFilters.action !== 'all' && !e.action.startsWith(auditFilters.action)) return false;
      if (auditFilters.result !== 'all' && e.result !== auditFilters.result) return false;
      return true;
    });
  },

  getUserStats: () => {
    const { users } = get();
    return {
      total: users.length,
      active: users.filter((u) => u.status === 'active').length,
      pending: users.filter((u) => u.status === 'pending_invite').length,
      suspended: users.filter((u) => u.status === 'suspended' || u.status === 'inactive').length,
    };
  },

  getRoleById: (id) => get().roles.find((r) => r.id === id),
}));
