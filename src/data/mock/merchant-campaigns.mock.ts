import type { Campaign } from '@/types/coupon.types';
import type { Coupon } from '@/types/coupon.types';

const SHOP_ID = 'sky-lounge-premier';

export const mockCoupons: Coupon[] = [
  { id: 'cpn-1', code: 'WELCOME10', description: 'Welcome discount for new passengers', type: 'percentage', value: 10, min_order_value: 5, max_uses: 500, used_count: 187, valid_from: '2026-01-01T00:00:00Z', valid_to: '2026-06-30T23:59:59Z', status: 'active', shop_id: SHOP_ID, stacking_allowed: false, campaign_id: null },
  { id: 'cpn-2', code: 'SAVE10', description: 'Save 10% on orders above AED 15', type: 'percentage', value: 10, min_order_value: 15, max_uses: 200, used_count: 43, valid_from: '2026-02-01T00:00:00Z', valid_to: '2026-03-31T23:59:59Z', status: 'active', shop_id: SHOP_ID, stacking_allowed: false, campaign_id: 'camp-1' },
  { id: 'cpn-3', code: 'BOGO-COFFEE', description: 'Buy one get one free on all coffees', type: 'bogo', value: 0, min_order_value: null, max_uses: 100, used_count: 100, valid_from: '2026-01-15T00:00:00Z', valid_to: '2026-02-15T23:59:59Z', status: 'depleted', shop_id: SHOP_ID, stacking_allowed: false, campaign_id: 'camp-5' },
  { id: 'cpn-4', code: 'GATEB-5OFF', description: 'AED 5 off at Gate B departures', type: 'fixed', value: 5, min_order_value: 10, max_uses: 300, used_count: 92, valid_from: '2026-02-10T00:00:00Z', valid_to: '2026-04-10T23:59:59Z', status: 'active', shop_id: SHOP_ID, stacking_allowed: true, campaign_id: 'camp-2' },
  { id: 'cpn-5', code: 'SUMMER23', description: 'Summer 2023 seasonal promotion', type: 'percentage', value: 15, min_order_value: 20, max_uses: 200, used_count: 200, valid_from: '2025-06-01T00:00:00Z', valid_to: '2025-09-30T23:59:59Z', status: 'expired', shop_id: SHOP_ID, stacking_allowed: false, campaign_id: null },
  { id: 'cpn-6', code: 'FREEWATER', description: 'Complimentary water with orders over AED 15', type: 'freebie', value: 0, min_order_value: 15, max_uses: null, used_count: 56, valid_from: '2026-02-01T00:00:00Z', valid_to: '2026-12-31T23:59:59Z', status: 'paused', shop_id: SHOP_ID, stacking_allowed: true, campaign_id: null },
];

export const mockCampaigns: Campaign[] = [
  {
    id: 'camp-1', name: 'Afternoon Boost - 20% Off Drinks', description: 'Encourage afternoon purchases with a discount on all drink orders above $15.',
    shop_id: SHOP_ID, status: 'active', start_date: '2026-02-01', end_date: '2026-03-31',
    time_window_start: '14:00', time_window_end: '17:00', target_zones: ['Zone A - Departures'], target_gates: [],
    discount_type: 'percentage', discount_value: 10, budget_cap: 5000, budget_spent: 1230,
    impressions: 8420, redemptions: 43, revenue_attributed: 2150, created_by: 'Manager', created_at: '2026-01-25T10:00:00Z',
  },
  {
    id: 'camp-2', name: 'Gate B Welcome Offer', description: '$5 off for passengers at international departure gates.',
    shop_id: SHOP_ID, status: 'active', start_date: '2026-02-10', end_date: '2026-04-10',
    time_window_start: '06:00', time_window_end: '22:00', target_zones: ['Zone B - International'], target_gates: ['B1','B2','B3','B4','B5','B6','B7','B8'],
    discount_type: 'fixed', discount_value: 5, budget_cap: 3000, budget_spent: 460,
    impressions: 5200, redemptions: 92, revenue_attributed: 3680, created_by: 'Manager', created_at: '2026-02-08T14:00:00Z',
  },
  {
    id: 'camp-3', name: 'Morning Rush Hour Special', description: 'Free pastry with any hot drink purchase before 10 AM.',
    shop_id: SHOP_ID, status: 'scheduled', start_date: '2026-03-01', end_date: '2026-03-31',
    time_window_start: '06:00', time_window_end: '10:00', target_zones: ['Zone A - Departures', 'Zone B - International'], target_gates: [],
    discount_type: 'freebie', discount_value: 0, budget_cap: 2000, budget_spent: 0,
    impressions: 0, redemptions: 0, revenue_attributed: 0, created_by: 'Manager', created_at: '2026-02-15T09:00:00Z',
  },
  {
    id: 'camp-4', name: 'Loyalty Program Launch', description: 'Earn double points on every purchase this month.',
    shop_id: SHOP_ID, status: 'paused', start_date: '2026-02-01', end_date: '2026-02-28',
    time_window_start: '00:00', time_window_end: '23:59', target_zones: [], target_gates: [],
    discount_type: 'percentage', discount_value: 5, budget_cap: null, budget_spent: 890,
    impressions: 12300, redemptions: 178, revenue_attributed: 5340, created_by: 'Manager', created_at: '2026-01-28T16:00:00Z',
  },
  {
    id: 'camp-5', name: 'Happy Hour BOGO Coffee', description: 'Buy one get one free on all coffees between 3-5 PM.',
    shop_id: SHOP_ID, status: 'ended', start_date: '2026-01-15', end_date: '2026-02-15',
    time_window_start: '15:00', time_window_end: '17:00', target_zones: ['Zone A - Departures'], target_gates: ['A1','A2','A3','A4'],
    discount_type: 'bogo', discount_value: 0, budget_cap: 1500, budget_spent: 1500,
    impressions: 6800, redemptions: 100, revenue_attributed: 2500, created_by: 'Manager', created_at: '2026-01-10T11:00:00Z',
  },
  {
    id: 'camp-6', name: 'New Year Health Kick', description: 'Draft campaign for healthy menu items promotion.',
    shop_id: SHOP_ID, status: 'draft', start_date: '2026-04-01', end_date: '2026-04-30',
    time_window_start: '08:00', time_window_end: '20:00', target_zones: [], target_gates: [],
    discount_type: 'percentage', discount_value: 15, budget_cap: 3000, budget_spent: 0,
    impressions: 0, redemptions: 0, revenue_attributed: 0, created_by: 'Manager', created_at: '2026-02-16T10:00:00Z',
  },
];
