import { create } from 'zustand';
import type { Trolley, TrolleyFilters } from '@/types/trolley.types';
import { trolleysData } from '@/data/mock/trolleys.mock';

interface TrolleysState {
  trolleys: Trolley[];
  filters: TrolleyFilters;
  selectedTrolley: Trolley | null;
  viewMode: 'table' | 'grid';
  isLoading: boolean;

  setTrolleys: (trolleys: Trolley[]) => void;
  addTrolley: (trolley: Trolley) => void;
  updateTrolley: (id: string, updates: Partial<Trolley>) => void;
  deleteTrolley: (id: string) => void;
  setFilters: (filters: Partial<TrolleyFilters>) => void;
  resetFilters: () => void;
  selectTrolley: (trolley: Trolley | null) => void;
  setViewMode: (mode: 'table' | 'grid') => void;
  setLoading: (loading: boolean) => void;
  getFilteredTrolleys: () => Trolley[];
  getStats: () => { total: number; active: number; needAttention: number; offline: number };
}

const defaultFilters: TrolleyFilters = {
  status: 'all',
  battery_min: 0,
  battery_max: 100,
  zone: 'all',
  search: '',
};

export const useTrolleysStore = create<TrolleysState>((set, get) => ({
  trolleys: trolleysData,
  filters: { ...defaultFilters },
  selectedTrolley: null,
  viewMode: 'table',
  isLoading: false,

  setTrolleys: (trolleys) => set({ trolleys }),

  addTrolley: (trolley) =>
    set((state) => ({ trolleys: [trolley, ...state.trolleys] })),

  updateTrolley: (id, updates) =>
    set((state) => ({
      trolleys: state.trolleys.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      selectedTrolley:
        state.selectedTrolley?.id === id
          ? { ...state.selectedTrolley, ...updates }
          : state.selectedTrolley,
    })),

  deleteTrolley: (id) =>
    set((state) => ({
      trolleys: state.trolleys.filter((t) => t.id !== id),
      selectedTrolley: state.selectedTrolley?.id === id ? null : state.selectedTrolley,
    })),

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  resetFilters: () => set({ filters: { ...defaultFilters } }),

  selectTrolley: (trolley) => set({ selectedTrolley: trolley }),

  setViewMode: (mode) => set({ viewMode: mode }),

  setLoading: (loading) => set({ isLoading: loading }),

  getFilteredTrolleys: () => {
    const { trolleys, filters } = get();
    return trolleys.filter((t) => {
      if (filters.status !== 'all' && t.status !== filters.status) return false;
      if (t.battery < filters.battery_min || t.battery > filters.battery_max) return false;
      if (filters.zone !== 'all' && t.location.zone !== filters.zone) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return (
          t.id.toLowerCase().includes(q) ||
          t.imei.toLowerCase().includes(q) ||
          t.serial_number.toLowerCase().includes(q) ||
          t.location.zone.toLowerCase().includes(q)
        );
      }
      return true;
    });
  },

  getStats: () => {
    const { trolleys } = get();
    return {
      total: trolleys.length,
      active: trolleys.filter((t) => t.status === 'active').length,
      needAttention: trolleys.filter(
        (t) => t.health_score < 80 || t.battery < 20 || t.status === 'maintenance'
      ).length,
      offline: trolleys.filter((t) => t.status === 'offline').length,
    };
  },
}));
