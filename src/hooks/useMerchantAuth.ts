import { useState, useCallback } from 'react';
import { useMerchantStore } from '@/store/merchant.store';
import type { MerchantUser, MerchantRole, MerchantPermission } from '@/types/merchant.types';
import { ROLE_PERMISSIONS as rolePermissions } from '@/types/merchant.types';

const MOCK_MERCHANT_USERS: Record<string, { password: string; user: MerchantUser }> = {
  'manager@demo.ai-ts': {
    password: 'Password123',
    user: {
      id: 'mu-1', name: 'Sarah Mitchell', email: 'manager@demo.ai-ts',
      merchant_role: 'manager', shop_id: 'sky-lounge-premier', shop_name: 'Sky Lounge Premier',
      available_roles: ['manager', 'cashier', 'kitchen', 'developer'],
      permissions: rolePermissions.manager,
    },
  },
  'cashier@demo.ai-ts': {
    password: 'Password123',
    user: {
      id: 'mu-2', name: 'James Wilson', email: 'cashier@demo.ai-ts',
      merchant_role: 'cashier', shop_id: 'sky-lounge-premier', shop_name: 'Sky Lounge Premier',
      available_roles: ['cashier'],
      permissions: rolePermissions.cashier,
    },
  },
  'kitchen@demo.ai-ts': {
    password: 'Password123',
    user: {
      id: 'mu-3', name: 'Carlos Reyes', email: 'kitchen@demo.ai-ts',
      merchant_role: 'kitchen', shop_id: 'sky-lounge-premier', shop_name: 'Sky Lounge Premier',
      available_roles: ['kitchen'],
      permissions: rolePermissions.kitchen,
    },
  },
  'developer@demo.ai-ts': {
    password: 'Password123',
    user: {
      id: 'mu-4', name: 'Alex Dev', email: 'developer@demo.ai-ts',
      merchant_role: 'developer', shop_id: 'sky-lounge-premier', shop_name: 'Sky Lounge Premier',
      available_roles: ['manager', 'cashier', 'kitchen', 'viewer', 'developer'],
      permissions: rolePermissions.developer,
    },
  },
  'viewer@demo.ai-ts': {
    password: 'Password123',
    user: {
      id: 'mu-5', name: 'Dana Viewer', email: 'viewer@demo.ai-ts',
      merchant_role: 'viewer', shop_id: 'sky-lounge-premier', shop_name: 'Sky Lounge Premier',
      available_roles: ['viewer'],
      permissions: rolePermissions.viewer,
    },
  },
};

export function useMerchantAuth() {
  const { merchantUser, setMerchantUser, logout: storeLogout } = useMerchantStore();
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const entry = MOCK_MERCHANT_USERS[email];
    if (!entry || entry.password !== password) {
      setIsLoading(false);
      throw new Error('Invalid email or password');
    }

    setMerchantUser(entry.user);
    setIsLoading(false);
    return entry.user;
  }, [setMerchantUser]);

  const logout = useCallback(() => {
    storeLogout();
  }, [storeLogout]);

  const switchRole = useCallback((role: MerchantRole) => {
    if (!merchantUser) return;
    const perms = rolePermissions[role];
    setMerchantUser({
      ...merchantUser,
      merchant_role: role,
      permissions: perms,
    });
  }, [merchantUser, setMerchantUser]);

  const canDo = useCallback((permission: MerchantPermission): boolean => {
    return merchantUser?.permissions.includes(permission) ?? false;
  }, [merchantUser]);

  return {
    merchantUser,
    merchantRole: merchantUser?.merchant_role ?? null,
    isAuthenticated: !!merchantUser,
    isLoading,
    login,
    logout,
    switchRole,
    canDo,
  };
}
