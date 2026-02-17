import { useState, useCallback } from 'react';
import { useMerchantStore } from '@/store/merchant.store';
import type { MerchantUser, MerchantRole, MerchantPermission } from '@/types/merchant.types';
import { ROLE_PERMISSIONS as rolePermissions } from '@/types/merchant.types';

const MOCK_MERCHANT_USERS: Record<string, { password: string; user: MerchantUser }> = {
  'manager@skylounge.io': {
    password: 'Manager@123',
    user: {
      id: 'mu-1', name: 'Sarah Mitchell', email: 'manager@skylounge.io',
      merchant_role: 'manager', shop_id: 'sky-lounge-premier', shop_name: 'Sky Lounge Premier',
      available_roles: ['manager', 'cashier', 'kitchen', 'developer'],
      permissions: rolePermissions.manager,
    },
  },
  'cashier@skylounge.io': {
    password: 'Cashier@123',
    user: {
      id: 'mu-2', name: 'James Wilson', email: 'cashier@skylounge.io',
      merchant_role: 'cashier', shop_id: 'sky-lounge-premier', shop_name: 'Sky Lounge Premier',
      available_roles: ['cashier'],
      permissions: rolePermissions.cashier,
    },
  },
  'kitchen@skylounge.io': {
    password: 'Kitchen@123',
    user: {
      id: 'mu-3', name: 'Carlos Reyes', email: 'kitchen@skylounge.io',
      merchant_role: 'kitchen', shop_id: 'sky-lounge-premier', shop_name: 'Sky Lounge Premier',
      available_roles: ['kitchen'],
      permissions: rolePermissions.kitchen,
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
