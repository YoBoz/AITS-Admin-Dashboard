import { create } from 'zustand';
import type { MerchantUser, MerchantSLASettings, MerchantCapacitySettings } from '@/types/merchant.types';

const STORAGE_KEY = 'aits-merchant-user';

interface MerchantState {
  merchantUser: MerchantUser | null;
  slaSettings: MerchantSLASettings;
  capacitySettings: MerchantCapacitySettings;
  storeStatus: 'open' | 'busy' | 'closed';
  isStoreOpen: boolean;

  setMerchantUser: (user: MerchantUser) => void;
  logout: () => void;
  setSLASettings: (settings: Partial<MerchantSLASettings>) => void;
  setCapacitySettings: (settings: Partial<MerchantCapacitySettings>) => void;
  setStoreStatus: (status: 'open' | 'busy' | 'closed') => void;
}

function getStoredUser(): MerchantUser | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export const useMerchantStore = create<MerchantState>((set) => ({
  merchantUser: getStoredUser(),
  storeStatus: 'open',
  isStoreOpen: true,

  slaSettings: {
    acceptance_sla_seconds: 90,
    max_concurrent_orders: 15,
    busy_auto_throttle_at: 10,
    is_store_closed: false,
    close_reason: null,
    estimated_reopen: null,
  },

  capacitySettings: {
    current_queue_length: 3,
    max_queue_length: 20,
    avg_prep_time_minutes: 12,
    is_accepting_orders: true,
  },

  setMerchantUser: (user) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    set({ merchantUser: user });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ merchantUser: null });
  },

  setSLASettings: (settings) =>
    set((state) => ({
      slaSettings: { ...state.slaSettings, ...settings },
    })),

  setCapacitySettings: (settings) =>
    set((state) => ({
      capacitySettings: { ...state.capacitySettings, ...settings },
    })),

  setStoreStatus: (status) => set({ storeStatus: status, isStoreOpen: status !== 'closed' }),
}));
