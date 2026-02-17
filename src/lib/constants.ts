import type { Role } from '@/types';

export const APP_NAME = 'Ai-TS';
export const APP_FULL_NAME = 'Airport Intelligent Trolley System';
export const APP_VERSION = '1.0.0';

export const STORAGE_KEYS = {
  THEME: 'aits-theme',
  USER: 'aits-user',
  LANGUAGE: 'aits-language',
  TOKEN: 'aits-token',
} as const;

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  TROLLEYS: '/dashboard/trolleys',
  TERMINALS: '/dashboard/terminals',
  ANALYTICS: '/dashboard/analytics',
  USERS: '/dashboard/users',
  SETTINGS: '/dashboard/settings',
  REPORTS: '/dashboard/reports',
  NOTIFICATIONS: '/dashboard/notifications',
  MAP: '/dashboard/map',
  // Merchant routes
  MERCHANT_LOGIN: '/merchant/login',
  MERCHANT_ORDERS: '/merchant/orders',
  MERCHANT_MENU: '/merchant/menu',
  MERCHANT_COUPONS: '/merchant/coupons',
  MERCHANT_SETTINGS: '/merchant/settings',
  MERCHANT_SWITCH_ROLE: '/merchant/switch-role',
} as const;

export const ROLES: Role[] = ['super_admin', 'terminal_admin', 'operator', 'viewer'];

export const DEFAULT_LANGUAGE = 'en';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
] as const;
