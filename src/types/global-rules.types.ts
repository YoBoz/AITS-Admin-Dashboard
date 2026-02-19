// ──────────────────────────────────────
// Global Rules Types — Phase 9
// ──────────────────────────────────────

export interface CouponRule {
  id: string;
  name: string;
  rule_type: 'max_discount_pct' | 'min_order_value' | 'max_uses_per_user' | 'stacking_policy' | 'expiry_max_days' | 'blackout_dates';
  value: number | string | string[];
  scope: 'global' | 'per_category' | 'per_merchant';
  is_active: boolean;
  description: string;
  updated_at: string;
  updated_by: string;
}

export interface FraudLimit {
  id: string;
  name: string;
  limit_type: 'max_refunds_per_day' | 'max_refund_pct_of_order' | 'suspicious_coupon_velocity' | 'max_orders_per_session' | 'block_repeated_refund_passenager';
  threshold: number;
  action: 'flag' | 'block' | 'require_ops_approval' | 'alert_only';
  is_active: boolean;
  triggered_count_today: number;
  description: string;
}

export interface ExpiryRule {
  id: string;
  name: string;
  description: string;
  rule: string;
  is_active: boolean;
  updated_at: string;
  updated_by: string;
}
