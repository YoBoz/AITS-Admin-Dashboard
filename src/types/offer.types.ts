export type DiscountType = 'percentage' | 'fixed' | 'bogo' | 'freebie';

export interface Offer {
  id: string;
  shop_id: string;
  shop_name: string;
  title: string;
  description: string;
  discount_type: DiscountType;
  discount_value: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'scheduled' | 'expired' | 'paused';
  target_categories: string[];
  impressions: number;
  redemptions: number;
  image_url: string | null;
  created_by: string;
  created_at: string;
  priority: number; // 1-10
}

export interface OfferFilters {
  search: string;
  discount_type: DiscountType | 'all';
  status: Offer['status'] | 'all';
  shop_id: string | 'all';
  date_range: { start: string; end: string } | null;
}
