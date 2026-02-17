export type ShopCategory =
  | 'retail'
  | 'restaurant'
  | 'cafe'
  | 'lounge'
  | 'pharmacy'
  | 'electronics'
  | 'fashion'
  | 'services'
  | 'bank'
  | 'washroom'
  | 'gate'
  | 'other';

export interface Contract {
  id: string;
  start_date: string;
  end_date: string;
  monthly_fee: number;
  revenue_share_percent: number;
  status: 'active' | 'expiring_soon' | 'expired' | 'pending_renewal';
  auto_renew: boolean;
  terms_file_url: string | null;
  signed_at: string;
}

export interface Shop {
  id: string;
  name: string;
  company_name: string;
  category: ShopCategory;
  logo_url: string | null;
  location: {
    zone: string;
    unit_number: string;
    floor: number;
    coordinates: { x: number; y: number };
  };
  contact: { name: string; email: string; phone: string };
  contract: Contract;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  registered_at: string;
  offers_count: number;
  total_visitors: number;
  rating: number;
  description: string;
}
