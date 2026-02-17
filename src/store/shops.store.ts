import { create } from 'zustand';
import type { Shop } from '@/types/shop.types';
import { shopsData } from '@/data/mock/shops.mock';

interface ShopFilters {
  search: string;
  category: string | 'all';
  status: Shop['status'] | 'all';
  contract_status: string | 'all';
  sort_by: 'name' | 'visitors' | 'revenue' | 'contract_expiry';
}

interface ShopsState {
  shops: Shop[];
  filters: ShopFilters;
  selectedShop: Shop | null;
  viewMode: 'table' | 'grid';
  isLoading: boolean;

  setShops: (shops: Shop[]) => void;
  addShop: (shop: Shop) => void;
  updateShop: (id: string, updates: Partial<Shop>) => void;
  deleteShop: (id: string) => void;
  setFilters: (filters: Partial<ShopFilters>) => void;
  resetFilters: () => void;
  selectShop: (shop: Shop | null) => void;
  setViewMode: (mode: 'table' | 'grid') => void;
  setLoading: (loading: boolean) => void;
  getFilteredShops: () => Shop[];
  getStats: () => { active: number; expiringContracts: number; pending: number; totalMonthlyRevenue: number };
}

const defaultFilters: ShopFilters = {
  search: '',
  category: 'all',
  status: 'all',
  contract_status: 'all',
  sort_by: 'name',
};

export const useShopsStore = create<ShopsState>((set, get) => ({
  shops: shopsData,
  filters: { ...defaultFilters },
  selectedShop: null,
  viewMode: 'table',
  isLoading: false,

  setShops: (shops) => set({ shops }),

  addShop: (shop) =>
    set((state) => ({ shops: [shop, ...state.shops] })),

  updateShop: (id, updates) =>
    set((state) => ({
      shops: state.shops.map((s) => (s.id === id ? { ...s, ...updates } : s)),
      selectedShop:
        state.selectedShop?.id === id
          ? { ...state.selectedShop, ...updates }
          : state.selectedShop,
    })),

  deleteShop: (id) =>
    set((state) => ({
      shops: state.shops.filter((s) => s.id !== id),
      selectedShop: state.selectedShop?.id === id ? null : state.selectedShop,
    })),

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  resetFilters: () => set({ filters: { ...defaultFilters } }),

  selectShop: (shop) => set({ selectedShop: shop }),

  setViewMode: (mode) => set({ viewMode: mode }),

  setLoading: (loading) => set({ isLoading: loading }),

  getFilteredShops: () => {
    const { shops, filters } = get();
    let filtered = shops.filter((s) => {
      if (filters.status !== 'all' && s.status !== filters.status) return false;
      if (filters.category !== 'all' && s.category !== filters.category) return false;
      if (filters.contract_status !== 'all' && s.contract.status !== filters.contract_status) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.company_name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
        );
      }
      return true;
    });

    // Sort
    switch (filters.sort_by) {
      case 'visitors':
        filtered.sort((a, b) => b.total_visitors - a.total_visitors);
        break;
      case 'revenue':
        filtered.sort((a, b) => b.contract.monthly_fee - a.contract.monthly_fee);
        break;
      case 'contract_expiry':
        filtered.sort((a, b) => new Date(a.contract.end_date).getTime() - new Date(b.contract.end_date).getTime());
        break;
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  },

  getStats: () => {
    const { shops } = get();
    return {
      active: shops.filter((s) => s.status === 'active').length,
      expiringContracts: shops.filter((s) => s.contract.status === 'expiring_soon').length,
      pending: shops.filter((s) => s.status === 'pending').length,
      totalMonthlyRevenue: shops.reduce((sum, s) => sum + s.contract.monthly_fee, 0),
    };
  },
}));
