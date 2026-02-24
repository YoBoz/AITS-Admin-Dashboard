export type MerchantRole = 'manager' | 'cashier' | 'kitchen' | 'developer';

export type MerchantPermission =
  | 'dashboard.view'
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
  | 'delivery.view'
  | 'delivery.edit'
  | 'campaigns.view'
  | 'campaigns.create'
  | 'coupons.validate'
  | 'coupons.create'
  | 'refunds.view'
  | 'refunds.request'
  | 'reports.view'
  | 'staff.view'
  | 'staff.manage'
  | 'settings.view'
  | 'settings.edit'
  | 'analytics.view'
  | 'debug_mode'
  | 'override_states';

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

export interface MerchantDeliverySettings {
  delivery_radius_km: number;
  base_delivery_fee: number;
  free_delivery_above: number | null;
  estimated_delivery_minutes: number;
  delivery_time_windows: { start: string; end: string }[];
  runner_preference: 'any' | 'dedicated' | 'pool';
  allow_scheduled_delivery: boolean;
}

export interface AutoPauseConfig {
  enabled: boolean;
  pause_after_minutes: number;
  resume_automatically: boolean;
  resume_after_minutes: number;
}

export const ROLE_PERMISSIONS: Record<MerchantRole, MerchantPermission[]> = {
  /**
   * Manager — full order control, menu, capacity (within bounds),
   * refund up to threshold, create campaigns.
   */
  manager: [
    'dashboard.view',
    'orders.view', 'orders.accept', 'orders.reject', 'orders.prepare', 'orders.ready',
    'menu.view', 'menu.edit', 'menu.publish',
    'sla.view', 'sla.edit', 'capacity.edit',
    'delivery.view', 'delivery.edit',
    'campaigns.view', 'campaigns.create',
    'coupons.validate', 'coupons.create',
    'refunds.view', 'refunds.request',
    'reports.view',
    'staff.view', 'staff.manage',
    'settings.view', 'settings.edit',
    'analytics.view',
  ],
  /**
   * Cashier — view orders, accept orders (optional), mark preparing/ready (optional).
   * Cannot refund, cannot change SLA, cannot edit menu, cannot create campaigns.
   */
  cashier: [
    'dashboard.view',
    'orders.view', 'orders.accept', 'orders.prepare', 'orders.ready',
    'coupons.validate',
    'settings.view',
    // NO: orders.reject, sla.edit, capacity.edit, menu.edit, menu.publish,
    //     campaigns.create, refunds.request, analytics.view
  ],
  /**
   * Kitchen — view preparing/ready, mark preparing/ready ONLY.
   * No accept, no reject, no menu, no SLA, no refund, no campaigns.
   */
  kitchen: [
    'dashboard.view',
    'orders.view', 'orders.prepare', 'orders.ready',
    // NO: orders.accept, orders.reject, menu.*, sla.*, capacity.*, campaigns.*,
    //     coupons.*, refunds.*, analytics.*
  ],
  /**
   * Developer — superuser for testing, all permissions + debug.
   */
  developer: [
    'dashboard.view',
    'orders.view', 'orders.accept', 'orders.reject', 'orders.prepare', 'orders.ready',
    'menu.view', 'menu.edit', 'menu.publish',
    'sla.view', 'sla.edit', 'capacity.edit',
    'delivery.view', 'delivery.edit',
    'campaigns.view', 'campaigns.create',
    'coupons.validate', 'coupons.create',
    'refunds.view', 'refunds.request',
    'reports.view',
    'staff.view', 'staff.manage',
    'settings.view', 'settings.edit',
    'analytics.view',
    'debug_mode', 'override_states',
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
