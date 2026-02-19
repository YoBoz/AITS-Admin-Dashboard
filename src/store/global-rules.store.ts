// ──────────────────────────────────────
// Global Rules Store — Phase 9
// ──────────────────────────────────────

import { create } from 'zustand';
import type { CouponRule, FraudLimit, ExpiryRule } from '@/types/global-rules.types';
import { couponRulesData, fraudLimitsData, expiryRulesData } from '@/data/mock/global-rules.mock';

interface GlobalRulesState {
  couponRules: CouponRule[];
  fraudLimits: FraudLimit[];
  expiryRules: ExpiryRule[];

  // Coupon rule actions
  updateRule: (id: string, updates: Partial<CouponRule>) => void;
  toggleRule: (id: string) => void;

  // Fraud limit actions
  updateFraudLimit: (id: string, updates: Partial<FraudLimit>) => void;
  toggleFraudLimit: (id: string) => void;

  // Expiry rule actions
  updateExpiryRule: (id: string, updates: Partial<ExpiryRule>) => void;
  toggleExpiryRule: (id: string) => void;
}

export const useGlobalRulesStore = create<GlobalRulesState>((set) => ({
  couponRules: couponRulesData,
  fraudLimits: fraudLimitsData,
  expiryRules: expiryRulesData,

  updateRule: (id, updates) =>
    set((state) => ({
      couponRules: state.couponRules.map((r) =>
        r.id === id ? { ...r, ...updates, updated_at: new Date().toISOString() } : r,
      ),
    })),

  toggleRule: (id) =>
    set((state) => ({
      couponRules: state.couponRules.map((r) =>
        r.id === id ? { ...r, is_active: !r.is_active, updated_at: new Date().toISOString() } : r,
      ),
    })),

  updateFraudLimit: (id, updates) =>
    set((state) => ({
      fraudLimits: state.fraudLimits.map((l) =>
        l.id === id ? { ...l, ...updates } : l,
      ),
    })),

  toggleFraudLimit: (id) =>
    set((state) => ({
      fraudLimits: state.fraudLimits.map((l) =>
        l.id === id ? { ...l, is_active: !l.is_active } : l,
      ),
    })),

  updateExpiryRule: (id, updates) =>
    set((state) => ({
      expiryRules: state.expiryRules.map((r) =>
        r.id === id ? { ...r, ...updates, updated_at: new Date().toISOString() } : r,
      ),
    })),

  toggleExpiryRule: (id) =>
    set((state) => ({
      expiryRules: state.expiryRules.map((r) =>
        r.id === id ? { ...r, is_active: !r.is_active, updated_at: new Date().toISOString() } : r,
      ),
    })),
}));
