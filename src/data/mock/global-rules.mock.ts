// ──────────────────────────────────────
// Global Rules Mock Data — Phase 9
// ──────────────────────────────────────

import type { CouponRule, FraudLimit, ExpiryRule } from '@/types/global-rules.types';

function ts(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

export const couponRulesData: CouponRule[] = [
  {
    id: 'cr-001',
    name: 'Max Discount Percentage',
    rule_type: 'max_discount_pct',
    value: 40,
    scope: 'global',
    is_active: true,
    description: 'Maximum discount any coupon can apply is 40% of order value.',
    updated_at: ts(10),
    updated_by: 'Amira Khoury',
  },
  {
    id: 'cr-002',
    name: 'Minimum Order Value',
    rule_type: 'min_order_value',
    value: 15,
    scope: 'global',
    is_active: true,
    description: 'A minimum order of AED 15 is required for any coupon to apply.',
    updated_at: ts(15),
    updated_by: 'Omar Farouk',
  },
  {
    id: 'cr-003',
    name: 'Max Uses Per User Per Day',
    rule_type: 'max_uses_per_user',
    value: 2,
    scope: 'global',
    is_active: true,
    description: 'A passenger can use a maximum of 2 coupons per day across all merchants.',
    updated_at: ts(20),
    updated_by: 'Amira Khoury',
  },
  {
    id: 'cr-004',
    name: 'Coupon Stacking Policy',
    rule_type: 'stacking_policy',
    value: 'first_coupon_wins',
    scope: 'global',
    is_active: true,
    description: 'Coupon stacking is not allowed. Only the first applied coupon is honored.',
    updated_at: ts(30),
    updated_by: 'Amira Khoury',
  },
  {
    id: 'cr-005',
    name: 'Lounge Category Override',
    rule_type: 'max_discount_pct',
    value: 50,
    scope: 'per_category',
    is_active: true,
    description: 'Lounges may offer up to 50% discount for access passes.',
    updated_at: ts(5),
    updated_by: 'Omar Farouk',
  },
  {
    id: 'cr-006',
    name: 'Max Campaign Duration',
    rule_type: 'expiry_max_days',
    value: 90,
    scope: 'global',
    is_active: true,
    description: 'No coupon campaign can run for more than 90 days.',
    updated_at: ts(45),
    updated_by: 'Amira Khoury',
  },
];

export const fraudLimitsData: FraudLimit[] = [
  {
    id: 'fl-001',
    name: 'Max Refunds Per Session',
    limit_type: 'max_refunds_per_day',
    threshold: 3,
    action: 'block',
    is_active: true,
    triggered_count_today: 2,
    description: 'Block passenger after 3 refunds in a single session to prevent refund fraud.',
  },
  {
    id: 'fl-002',
    name: 'Refund Value Cap',
    limit_type: 'max_refund_pct_of_order',
    threshold: 100,
    action: 'block',
    is_active: true,
    triggered_count_today: 0,
    description: 'Refund cannot exceed 100% of order value. Blocks over-refund attempts.',
  },
  {
    id: 'fl-003',
    name: 'Coupon Velocity Alert',
    limit_type: 'suspicious_coupon_velocity',
    threshold: 5,
    action: 'flag',
    is_active: true,
    triggered_count_today: 7,
    description: 'Flag if same coupon code used more than 5 times in 1 hour across different sessions.',
  },
  {
    id: 'fl-004',
    name: 'Max Orders Per Session',
    limit_type: 'max_orders_per_session',
    threshold: 4,
    action: 'require_ops_approval',
    is_active: true,
    triggered_count_today: 1,
    description: 'Require ops approval for any single session placing more than 4 orders.',
  },
  {
    id: 'fl-005',
    name: 'Repeated Fraud Flag Block',
    limit_type: 'block_repeated_refund_passenager',
    threshold: 3,
    action: 'block',
    is_active: true,
    triggered_count_today: 0,
    description: 'Block passenger alias after 3 fraud flags accumulated within 7 days.',
  },
];

export const expiryRulesData: ExpiryRule[] = [
  {
    id: 'er-001',
    name: 'Session-Based Coupon Expiry',
    description: 'Coupons distributed during a trolley session expire when the session ends (trolley return or flight departure).',
    rule: 'Expires at session end',
    is_active: true,
    updated_at: ts(20),
    updated_by: 'Amira Khoury',
  },
  {
    id: 'er-002',
    name: 'Maximum Campaign Duration',
    description: 'No promotional campaign can run for more than 90 calendar days.',
    rule: 'Max 90 days from start',
    is_active: true,
    updated_at: ts(30),
    updated_by: 'Omar Farouk',
  },
  {
    id: 'er-003',
    name: 'Contract-Linked Offer Expiry',
    description: 'Offers linked to a merchant contract automatically expire when the contract ends.',
    rule: 'Expires with contract end date',
    is_active: true,
    updated_at: ts(45),
    updated_by: 'Amira Khoury',
  },
  {
    id: 'er-004',
    name: 'Flash Sale Limit',
    description: 'Flash sale offers cannot exceed 48 hours in duration.',
    rule: 'Max 48 hours',
    is_active: true,
    updated_at: ts(10),
    updated_by: 'Lina Abbas',
  },
  {
    id: 'er-005',
    name: 'Inactive Coupon Cleanup',
    description: 'Unused coupons are automatically marked as expired after 7 days of inactivity.',
    rule: '7 days without use',
    is_active: false,
    updated_at: ts(60),
    updated_by: 'Omar Farouk',
  },
];
