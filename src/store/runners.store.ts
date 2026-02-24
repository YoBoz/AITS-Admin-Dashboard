// ──────────────────────────────────────
// Runners Store (Zustand)
// ──────────────────────────────────────

import { create } from 'zustand';
import type { Runner, RunnerFilters } from '@/types/runner.types';
import { runnersData } from '@/data/mock/runners.mock';

interface RunnersState {
  runners: Runner[];
  filters: RunnerFilters;
  selectedRunnerId: string | null;

  setFilters: (filters: Partial<RunnerFilters>) => void;
  resetFilters: () => void;
  selectRunner: (id: string | null) => void;
  getFilteredRunners: () => Runner[];
  getRunnerById: (id: string) => Runner | undefined;
  updateRunnerStatus: (id: string, status: Runner['status']) => void;
  assignOrder: (runnerId: string, orderId: string) => void;
  unassignOrder: (runnerId: string) => void;
  availableCount: () => number;
  assignedCount: () => number;
  offlineCount: () => number;
}

const defaultFilters: RunnerFilters = {
  search: '',
  status: 'all',
  zone: 'all',
};

export const useRunnersStore = create<RunnersState>((set, get) => ({
  runners: runnersData,
  filters: { ...defaultFilters },
  selectedRunnerId: null,

  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () => set({ filters: { ...defaultFilters } }),
  selectRunner: (id) => set({ selectedRunnerId: id }),

  getFilteredRunners: () => {
    const { runners, filters } = get();
    return runners.filter((r) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!r.name.toLowerCase().includes(q) && !r.employee_id.toLowerCase().includes(q) && !r.id.toLowerCase().includes(q)) return false;
      }
      if (filters.status !== 'all' && r.status !== filters.status) return false;
      if (filters.zone !== 'all' && r.current_zone !== filters.zone) return false;
      return true;
    });
  },

  getRunnerById: (id) => get().runners.find((r) => r.id === id),

  updateRunnerStatus: (id, status) => set((state) => ({
    runners: state.runners.map((r) => r.id === id ? { ...r, status, last_seen: new Date().toISOString() } : r),
  })),

  assignOrder: (runnerId, orderId) => set((state) => ({
    runners: state.runners.map((r) => r.id === runnerId ? { ...r, status: 'assigned' as const, current_order_id: orderId } : r),
  })),

  unassignOrder: (runnerId) => set((state) => ({
    runners: state.runners.map((r) => r.id === runnerId ? { ...r, status: 'available' as const, current_order_id: null } : r),
  })),

  availableCount: () => get().runners.filter((r) => r.status === 'available').length,
  assignedCount: () => get().runners.filter((r) => ['assigned', 'in_transit'].includes(r.status)).length,
  offlineCount: () => get().runners.filter((r) => r.status === 'offline').length,
}));
