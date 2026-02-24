export interface Coupon {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed' | 'bogo' | 'freebie';
  value: number;
  min_order_value: number | null;
  max_uses: number | null;
  used_count: number;
  valid_from: string;
  valid_to: string;
  status: 'active' | 'expired' | 'depleted' | 'paused';
  shop_id: string;
  stacking_allowed: boolean;
  campaign_id: string | null;
}

export interface CampaignLanguageVersion {
  language: 'en' | 'ar' | 'fr';
  name: string;
  description: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  shop_id: string;
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'ended';
  start_date: string;
  end_date: string;
  time_window_start: string;
  time_window_end: string;
  target_zones: string[];
  target_gates: string[];
  discount_type: Coupon['type'];
  discount_value: number;
  budget_cap: number | null;
  budget_spent: number;
  impressions: number;
  redemptions: number;
  revenue_attributed: number;
  created_by: string;
  created_at: string;
  /** Localized versions of campaign name & description */
  language_versions?: CampaignLanguageVersion[];
  /** Whether scheduler auto-executes this campaign on the start_date */
  auto_execute?: boolean;
}
