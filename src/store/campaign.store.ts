import { create } from 'zustand';
import type { Campaign, CampaignLanguageVersion, Coupon } from '@/types/coupon.types';

// ─── Mock campaigns ──────────────────────────────────────────────────
const mockCampaigns: Campaign[] = [
  // Sky Lounge Premier campaigns (matches merchant dashboard)
  {
    id: 'camp-1',
    name: 'February Favourites',
    description: '20 AED off orders over 100 AED during February',
    shop_id: 'sky-lounge-premier',
    status: 'active',
    start_date: '2026-02-01',
    end_date: '2026-02-28',
    time_window_start: '08:00',
    time_window_end: '22:00',
    target_zones: ['Zone A - Departures'],
    target_gates: ['A1', 'A2', 'A3'],
    discount_type: 'fixed',
    discount_value: 20,
    budget_cap: 5000,
    budget_spent: 1340,
    impressions: 890,
    redemptions: 67,
    revenue_attributed: 6700,
    created_by: 'manager@demo.ai-ts',
    created_at: '2026-01-28T10:00:00Z',
  },
  {
    id: 'camp-2',
    name: 'BOGO Beverages',
    description: 'Buy one get one free on all beverages',
    shop_id: 'sky-lounge-premier',
    status: 'ended',
    start_date: '2026-01-15',
    end_date: '2026-02-15',
    time_window_start: '10:00',
    time_window_end: '18:00',
    target_zones: ['Zone A - Departures', 'Zone B - International'],
    target_gates: [],
    discount_type: 'bogo',
    discount_value: 0,
    budget_cap: 3000,
    budget_spent: 3000,
    impressions: 1200,
    redemptions: 300,
    revenue_attributed: 9000,
    created_by: 'manager@demo.ai-ts',
    created_at: '2026-01-10T14:00:00Z',
  },
  // SHOP-001 (Starbucks) campaigns
  {
    id: 'camp-3',
    name: 'Morning Coffee Rush',
    description: 'Free pastry with grande or larger drinks before 10 AM',
    shop_id: 'SHOP-001',
    status: 'active',
    start_date: '2026-02-01',
    end_date: '2026-04-30',
    time_window_start: '06:00',
    time_window_end: '10:00',
    target_zones: ['Zone A - Departures', 'Zone B - International'],
    target_gates: ['A1', 'A2', 'B1', 'B2'],
    discount_type: 'freebie',
    discount_value: 0,
    budget_cap: 8000,
    budget_spent: 2340,
    impressions: 3200,
    redemptions: 234,
    revenue_attributed: 11700,
    created_by: 'store.manager@starbucks.ae',
    created_at: '2026-01-25T09:00:00Z',
  },
  {
    id: 'camp-6',
    name: 'Happy Hour Specials',
    description: '30% off all Frappuccinos between 2-5 PM',
    shop_id: 'SHOP-001',
    status: 'active',
    start_date: '2026-02-15',
    end_date: '2026-03-31',
    time_window_start: '14:00',
    time_window_end: '17:00',
    target_zones: ['Zone A - Departures'],
    target_gates: [],
    discount_type: 'percentage',
    discount_value: 30,
    budget_cap: 4000,
    budget_spent: 890,
    impressions: 1890,
    redemptions: 156,
    revenue_attributed: 4680,
    created_by: 'store.manager@starbucks.ae',
    created_at: '2026-02-10T11:00:00Z',
  },
  // SHOP-003 (McDonald's) campaigns
  {
    id: 'camp-4',
    name: 'Big Mac Attack',
    description: 'Buy 1 Get 1 Free Big Mac - Limited Time',
    shop_id: 'SHOP-003',
    status: 'active',
    start_date: '2026-02-01',
    end_date: '2026-03-31',
    time_window_start: '11:00',
    time_window_end: '22:00',
    target_zones: ['Zone A - Departures', 'Zone B - International', 'Zone C - Arrivals'],
    target_gates: [],
    discount_type: 'bogo',
    discount_value: 0,
    budget_cap: 15000,
    budget_spent: 8750,
    impressions: 8900,
    redemptions: 1567,
    revenue_attributed: 47010,
    created_by: 'manager@mcdonalds.ae',
    created_at: '2026-01-20T14:00:00Z',
  },
  {
    id: 'camp-7',
    name: 'Family Meal Deal',
    description: '25% off Family Bundles on weekends',
    shop_id: 'SHOP-003',
    status: 'scheduled',
    start_date: '2026-03-01',
    end_date: '2026-04-30',
    time_window_start: '12:00',
    time_window_end: '20:00',
    target_zones: ['Zone A - Departures'],
    target_gates: [],
    discount_type: 'percentage',
    discount_value: 25,
    budget_cap: 10000,
    budget_spent: 0,
    impressions: 0,
    redemptions: 0,
    revenue_attributed: 0,
    created_by: 'manager@mcdonalds.ae',
    created_at: '2026-02-18T10:00:00Z',
  },
  // SHOP-009 (Costa Coffee) campaigns
  {
    id: 'camp-5',
    name: 'Morning Brew Special',
    description: 'Free cookie with any drink before 10am',
    shop_id: 'SHOP-009',
    status: 'active',
    start_date: '2026-02-01',
    end_date: '2026-05-31',
    time_window_start: '06:00',
    time_window_end: '10:00',
    target_zones: ['Zone B - International'],
    target_gates: ['B1', 'B2', 'B3', 'B4'],
    discount_type: 'freebie',
    discount_value: 0,
    budget_cap: 6000,
    budget_spent: 1890,
    impressions: 2100,
    redemptions: 189,
    revenue_attributed: 5670,
    created_by: 'manager@costacoffee.ae',
    created_at: '2026-01-28T08:00:00Z',
  },
  // SHOP-004 (Duty Free Electronics) campaigns
  {
    id: 'camp-8',
    name: 'Tech Travel Deals',
    description: 'Save 50 AED on electronics over 500 AED',
    shop_id: 'SHOP-004',
    status: 'active',
    start_date: '2026-01-15',
    end_date: '2026-08-31',
    time_window_start: '00:00',
    time_window_end: '23:59',
    target_zones: ['Zone A - Departures', 'Zone B - International'],
    target_gates: [],
    discount_type: 'fixed',
    discount_value: 50,
    budget_cap: 20000,
    budget_spent: 3900,
    impressions: 4500,
    redemptions: 78,
    revenue_attributed: 46800,
    created_by: 'admin@dutyfree.ae',
    created_at: '2026-01-10T16:00:00Z',
  },
  // SHOP-002 (Hudson News) campaigns
  {
    id: 'camp-9',
    name: 'Travel Essentials',
    description: '10 AED off purchases over 50 AED',
    shop_id: 'SHOP-002',
    status: 'paused',
    start_date: '2026-01-01',
    end_date: '2026-06-30',
    time_window_start: '00:00',
    time_window_end: '23:59',
    target_zones: ['Zone A - Departures'],
    target_gates: [],
    discount_type: 'fixed',
    discount_value: 10,
    budget_cap: 5000,
    budget_spent: 890,
    impressions: 1200,
    redemptions: 89,
    revenue_attributed: 5340,
    created_by: 'manager@hudsonnews.ae',
    created_at: '2025-12-20T12:00:00Z',
  },
];

// ─── Draft campaign defaults ──────────────────────────────────────────
export interface CampaignDraft {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  time_window_start: string;
  time_window_end: string;
  target_zones: string[];
  target_gates: string[];
  discount_type: Coupon['type'];
  discount_value: number;
  budget_cap: number | null;
  language_versions: CampaignLanguageVersion[];
  auto_execute: boolean;
}

const emptyDraft: CampaignDraft = {
  name: '',
  description: '',
  start_date: '',
  end_date: '',
  time_window_start: '08:00',
  time_window_end: '22:00',
  target_zones: [],
  target_gates: [],
  discount_type: 'percentage',
  discount_value: 10,
  budget_cap: null,
  language_versions: [],
  auto_execute: true,
};

// ─── Store ────────────────────────────────────────────────────────────
interface CampaignState {
  campaigns: Campaign[];
  draft: CampaignDraft;
  wizardStep: number; // 0-3

  // Draft management
  updateDraft: (updates: Partial<CampaignDraft>) => void;
  resetDraft: () => void;
  setWizardStep: (step: number) => void;

  // Campaign lifecycle
  saveDraft: () => string; // returns campaign id
  activateCampaign: (id: string) => void;
  pauseCampaign: (id: string) => void;
  endCampaign: (id: string) => void;
  deleteCampaign: (id: string) => void;
}

let nextCampId = 10;

export const useCampaignStore = create<CampaignState>((set, get) => ({
  campaigns: mockCampaigns,
  draft: { ...emptyDraft },
  wizardStep: 0,

  updateDraft: (updates) =>
    set((s) => ({ draft: { ...s.draft, ...updates } })),

  resetDraft: () =>
    set({ draft: { ...emptyDraft }, wizardStep: 0 }),

  setWizardStep: (step) => set({ wizardStep: step }),

  saveDraft: () => {
    const { draft, campaigns } = get();
    const id = `camp-new-${++nextCampId}`;
    const now = new Date().toISOString();
    const newCampaign: Campaign = {
      id,
      name: draft.name,
      description: draft.description,
      shop_id: 'sky-lounge-premier',
      status: 'draft',
      start_date: draft.start_date,
      end_date: draft.end_date,
      time_window_start: draft.time_window_start,
      time_window_end: draft.time_window_end,
      target_zones: draft.target_zones,
      target_gates: draft.target_gates,
      discount_type: draft.discount_type,
      discount_value: draft.discount_value,
      budget_cap: draft.budget_cap,
      budget_spent: 0,
      impressions: 0,
      redemptions: 0,
      revenue_attributed: 0,
      created_by: 'merchant',
      created_at: now,
      language_versions: draft.language_versions.length > 0 ? draft.language_versions : undefined,
      auto_execute: draft.auto_execute,
    };
    set({ campaigns: [newCampaign, ...campaigns], draft: { ...emptyDraft }, wizardStep: 0 });
    return id;
  },

  activateCampaign: (id) =>
    set((s) => ({
      campaigns: s.campaigns.map((c) =>
        c.id === id ? { ...c, status: 'active' as const } : c
      ),
    })),

  pauseCampaign: (id) =>
    set((s) => ({
      campaigns: s.campaigns.map((c) =>
        c.id === id ? { ...c, status: 'paused' as const } : c
      ),
    })),

  endCampaign: (id) =>
    set((s) => ({
      campaigns: s.campaigns.map((c) =>
        c.id === id ? { ...c, status: 'ended' as const } : c
      ),
    })),

  deleteCampaign: (id) =>
    set((s) => ({
      campaigns: s.campaigns.filter((c) => c.id !== id),
    })),
}));
