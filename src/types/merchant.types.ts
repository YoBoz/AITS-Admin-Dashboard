export type MerchantRole = 'manager' | 'cashier' | 'kitchen' | 'developer';

export type MerchantPermission =
  | 'orders.view'
  | 'orders.accept'
  | 'orders.reject'
  | 'orders.prepare'
  | 'orders.ready'
  | 'menu.view'
  | 'menu.edit'
  | 'menu.publish'
  | 'sla.view'
  | 'sla.edit'
  | 'capacity.edit'
  | 'campaigns.view'
  | 'campaigns.create'
  | 'coupons.validate'
  | 'refunds.view'
  | 'refunds.request'
  | 'analytics.view';

export interface MerchantUser {
  id: string;
  name: string;
  email: string;
  merchant_role: MerchantRole;
  shop_id: string;
  shop_name: string;
  available_roles: MerchantRole[];
  permissions: MerchantPermission[];
}

export interface MerchantSLASettings {
  acceptance_sla_seconds: number;
  max_concurrent_orders: number;
  busy_auto_throttle_at: number;
  is_store_closed: boolean;
  close_reason: string | null;
  estimated_reopen: string | null;
}

export interface MerchantCapacitySettings {
  current_queue_length: number;
  max_queue_length: number;
  avg_prep_time_minutes: number;
  is_accepting_orders: boolean;
}

export const ROLE_PERMISSIONS: Record<MerchantRole, MerchantPermission[]> = {
  manager: [
    'orders.view', 'orders.accept', 'orders.reject', 'orders.prepare', 'orders.ready',
    'menu.view', 'menu.edit', 'menu.publish',
    'sla.view', 'sla.edit', 'capacity.edit',
    'campaigns.view', 'campaigns.create',
    'coupons.validate',
    'refunds.view', 'refunds.request', // Managers can refund up to threshold
    'analytics.view',
  ],
  cashier: [
    'orders.view', 'orders.accept', 'orders.reject', 'orders.prepare', 'orders.ready',
    'coupons.validate',
    // Cashiers CANNOT request refunds — refunds.request is not included
  ],
  kitchen: [
    'orders.view', 'orders.prepare', 'orders.ready',
  ],
  developer: [
    'orders.view',
    'menu.view', 'menu.edit', 'menu.publish',
  ],
};

// Refund threshold configuration
export const REFUND_CONFIG = {
  /** Max auto-approve amount (AED) — above this requires ops approval */
  maxAutoApprove: 50,
  /** Manager daily refund limit */
  dailyLimitManager: 10,
  /** Amount threshold requiring ops approval even for managers */
  opsApprovalThreshold: 100,
};
