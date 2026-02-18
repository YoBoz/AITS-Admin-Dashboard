// ──────────────────────────────────────
// Policies Store — Phase 8
// ──────────────────────────────────────

import { create } from 'zustand';
import type { Policy, PolicyFilters, PolicyOverride, PolicyStatus } from '@/types/policy.types';
import { policiesData, allOverridesData } from '@/data/mock/policies.mock';

interface PoliciesState {
  policies: Policy[];
  overrideLog: PolicyOverride[];
  filters: PolicyFilters;
  selectedPolicyId: string | null;
  isLoading: boolean;

  // Actions
  setPolicies: (policies: Policy[]) => void;
  addPolicy: (policy: Policy) => void;
  updatePolicy: (id: string, updates: Partial<Policy>) => void;
  togglePolicy: (id: string) => void;
  deletePolicy: (id: string) => void;
  addOverride: (policyId: string, override: Omit<PolicyOverride, 'id' | 'timestamp'>) => void;
  setFilters: (filters: Partial<PolicyFilters>) => void;
  resetFilters: () => void;
  selectPolicy: (id: string | null) => void;
  setLoading: (loading: boolean) => void;

  // Derived
  getFilteredPolicies: () => Policy[];
  getPolicyById: (id: string) => Policy | undefined;
  getOverridesForPolicy: (policyId: string) => PolicyOverride[];
  
  // Stats
  activeCount: () => number;
  totalTriggers: () => number;
}

const defaultFilters: PolicyFilters = {
  search: '',
  type: 'all',
  status: 'all',
  zone: 'all',
};

export const usePoliciesStore = create<PoliciesState>((set, get) => ({
  policies: policiesData,
  overrideLog: allOverridesData,
  filters: { ...defaultFilters },
  selectedPolicyId: null,
  isLoading: false,

  setPolicies: (policies) => set({ policies }),

  addPolicy: (policy) =>
    set((state) => ({ policies: [policy, ...state.policies] })),

  updatePolicy: (id, updates) =>
    set((state) => ({
      policies: state.policies.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  togglePolicy: (id) =>
    set((state) => ({
      policies: state.policies.map((p) =>
        p.id === id
          ? { ...p, status: (p.status === 'active' ? 'inactive' : 'active') as PolicyStatus }
          : p
      ),
    })),

  deletePolicy: (id) =>
    set((state) => ({
      policies: state.policies.filter((p) => p.id !== id),
      selectedPolicyId: state.selectedPolicyId === id ? null : state.selectedPolicyId,
    })),

  addOverride: (policyId, override) => {
    const newOverride: PolicyOverride = {
      ...override,
      id: `OVR-${policyId}-${Date.now()}`,
      timestamp: new Date().toISOString(),
      policy_id: policyId,
    };

    set((state) => {
      const policy = state.policies.find((p) => p.id === policyId);
      return {
        policies: state.policies.map((p) =>
          p.id === policyId
            ? { ...p, overrides: [newOverride, ...p.overrides] }
            : p
        ),
        overrideLog: [
          { ...newOverride, policy_name: policy?.name || 'Unknown', zone: policy?.zone_ids[0] || 'N/A' },
          ...state.overrideLog,
        ],
      };
    });
  },

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  resetFilters: () => set({ filters: { ...defaultFilters } }),

  selectPolicy: (id) => set({ selectedPolicyId: id }),

  setLoading: (loading) => set({ isLoading: loading }),

  getFilteredPolicies: () => {
    const { policies, filters } = get();
    return policies.filter((p) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesSearch =
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }
      if (filters.type !== 'all' && p.type !== filters.type) return false;
      if (filters.status !== 'all' && p.status !== filters.status) return false;
      if (filters.zone !== 'all' && !p.zone_ids.includes(filters.zone)) return false;
      return true;
    });
  },

  getPolicyById: (id) => get().policies.find((p) => p.id === id),

  getOverridesForPolicy: (policyId) =>
    get().overrideLog.filter((o) => o.policy_id === policyId),

  activeCount: () => get().policies.filter((p) => p.status === 'active').length,

  totalTriggers: () =>
    get().policies.reduce((sum, p) => sum + p.trigger_count, 0),
}));
