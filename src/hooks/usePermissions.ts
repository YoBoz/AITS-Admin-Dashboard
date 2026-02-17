// ──────────────────────────────────────
// usePermissions Hook – RBAC gating
// ──────────────────────────────────────
import { useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePermissionsStore } from '@/store/permissions.store';

export function usePermissions() {
  const { user } = useAuth();
  const { roles, users } = usePermissionsStore();

  const effectivePermissions = useMemo(() => {
    if (!user) return new Set<string>();

    // Find the admin user record
    const adminUser = users.find((u) => u.id === user.id || u.email === user.email);
    const role = roles.find((r) => r.id === (adminUser?.role ?? user.role));

    const perms = new Set<string>(role?.permissions ?? []);

    // Add overrides
    if (adminUser?.permissions_override) {
      adminUser.permissions_override.forEach((p) => perms.add(p));
    }

    return perms;
  }, [user, roles, users]);

  const can = (permission: string): boolean => {
    return effectivePermissions.has(permission);
  };

  const canAny = (permissions: string[]): boolean => {
    return permissions.some((p) => effectivePermissions.has(p));
  };

  const canAll = (permissions: string[]): boolean => {
    return permissions.every((p) => effectivePermissions.has(p));
  };

  return { can, canAny, canAll };
}
