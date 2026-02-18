import { create } from 'zustand';
import type { Campaign, Coupon } from '@/types/coupon.types';

// ─── Mock campaigns ──────────────────────────────────────────────────
const mockCampaigns: Campaign[] = [
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
