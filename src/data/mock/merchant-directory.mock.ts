// ──────────────────────────────────────
// Merchant Directory Mock Data — Phase 9
// ──────────────────────────────────────

export interface PendingMerchant {
  id: string;
  company_name: string;
  logo_placeholder: string;
  category: string;
  location_requested: string;
  submitted_by: string;
  submitted_at: string;
  contact_email: string;
  contact_phone: string;
  documents_submitted: string[];
  days_pending: number;
  notes: string | null;
}

export interface MerchantPerformance {
  shop_id: string;
  orders_this_month: number;
  acceptance_sla_seconds: number;
  refund_threshold: number;
  sla_breach_pct: number;
  performance_score: number;
}

function ts(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

export const pendingMerchantsData: PendingMerchant[] = [
  {
    id: 'pm-001',
    company_name: 'Al Barsha Gourmet LLC',
    logo_placeholder: 'AB',
    category: 'Food & Dining',
    location_requested: 'Zone A — Gate A3 corridor',
    submitted_by: 'Khalid Al Mansoori',
    submitted_at: ts(5),
    contact_email: 'k.almansoori@albarshagourmet.ae',
    contact_phone: '+971 50 123 4567',
    documents_submitted: ['trade_license.pdf', 'food_safety_cert.pdf', 'insurance_policy.pdf', 'menu_catalog.pdf'],
    days_pending: 5,
    notes: null,
  },
  {
    id: 'pm-002',
    company_name: 'SkyTech Electronics',
    logo_placeholder: 'ST',
    category: 'Electronics',
    location_requested: 'Zone B — Near departure lounge',
    submitted_by: 'Priya Sharma',
    submitted_at: ts(8),
    contact_email: 'p.sharma@skytechme.com',
    contact_phone: '+971 55 987 6543',
    documents_submitted: ['trade_license.pdf', 'product_catalog.pdf', 'insurance_policy.pdf'],
    days_pending: 8,
    notes: 'Requested premium counter placement',
  },
  {
    id: 'pm-003',
    company_name: 'Desert Rose Perfumes',
    logo_placeholder: 'DR',
    category: 'Perfumes & Cosmetics',
    location_requested: 'Zone C — Luxury corridor',
    submitted_by: 'Fatima Al Hashimi',
    submitted_at: ts(3),
    contact_email: 'f.hashimi@desertroseperfumes.com',
    contact_phone: '+971 52 456 7890',
    documents_submitted: ['trade_license.pdf', 'brand_authorization.pdf', 'product_safety_sheet.pdf', 'insurance_policy.pdf', 'floor_plan_proposal.pdf'],
    days_pending: 3,
    notes: 'International brand. Requires expedited review.',
  },
];

// Performance data for existing shops (augments shops.mock.ts)
// Performance data for existing shops — IDs match shops.mock.ts (SHOP-XXX format)
export const merchantPerformanceData: MerchantPerformance[] = [
  { shop_id: 'SHOP-001', orders_this_month: 342, acceptance_sla_seconds: 120, refund_threshold: 50, sla_breach_pct: 3.2, performance_score: 94 },
  { shop_id: 'SHOP-002', orders_this_month: 189, acceptance_sla_seconds: 180, refund_threshold: 30, sla_breach_pct: 8.1, performance_score: 82 },
  { shop_id: 'SHOP-003', orders_this_month: 521, acceptance_sla_seconds: 90, refund_threshold: 50, sla_breach_pct: 1.5, performance_score: 97 },
  { shop_id: 'SHOP-004', orders_this_month: 78, acceptance_sla_seconds: 240, refund_threshold: 25, sla_breach_pct: 15.4, performance_score: 65 },
  { shop_id: 'SHOP-005', orders_this_month: 256, acceptance_sla_seconds: 150, refund_threshold: 40, sla_breach_pct: 5.6, performance_score: 88 },
  { shop_id: 'SHOP-006', orders_this_month: 134, acceptance_sla_seconds: 200, refund_threshold: 35, sla_breach_pct: 12.0, performance_score: 71 },
  { shop_id: 'SHOP-007', orders_this_month: 445, acceptance_sla_seconds: 100, refund_threshold: 50, sla_breach_pct: 2.1, performance_score: 95 },
  { shop_id: 'SHOP-008', orders_this_month: 67, acceptance_sla_seconds: 300, refund_threshold: 20, sla_breach_pct: 22.3, performance_score: 58 },
];
