import { create } from 'zustand';
import type { MerchantUser, MerchantSLASettings, MerchantCapacitySettings } from '@/types/merchant.types';

const STORAGE_KEY = 'aits-merchant-user';

interface MerchantState {
  merchantUser: MerchantUser | null;
  slaSettings: MerchantSLASettings;
  capacitySettings: MerchantCapacitySettings;
  isStoreOpen: boolean;

  setMerchantUser: (user: MerchantUser | null) => void;
  updateSLASettings: (settings: Partial<MerchantSLASettings>) => void;
  updateCapacity: (settings: Partial<MerchantCapacitySettings>) => void;
  toggleStore: (open: boolean, reason?: string, reopen?: string) => void;
  logout: () => void;
}

const getStoredUser = (): MerchantUser | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const useMerchantStore = create<MerchantState>((set) => ({
  merchantUser: getStoredUser(),
  slaSettings: {
    acceptance_sla_seconds: 90,
    max_concurrent_orders: 15,
    busy_auto_throttle_at: 12,
    is_store_closed: false,
    close_reason: null,
    estimated_reopen: null,
  },
  capacitySettings: {
    current_queue_length: 9,
    max_queue_length: 15,
    avg_prep_time_minutes: 10,
    is_accepting_orders: true,
  },
  isStoreOpen: true,

  setMerchantUser: (user) => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    set({ merchantUser: user });
  },

  updateSLASettings: (settings) =>
    set((state) => ({
      slaSettings: { ...state.slaSettings, ...settings },
    })),

  updateCapacity: (settings) =>
    set((state) => ({
      capacitySettings: { ...state.capacitySettings, ...settings },
    })),

  toggleStore: (open, reason, reopen) =>
    set((state) => ({
      isStoreOpen: open,
      slaSettings: {
        ...state.slaSettings,
        is_store_closed: !open,
        close_reason: open ? null : (reason ?? state.slaSettings.close_reason),
        estimated_reopen: open ? null : (reopen ?? state.slaSettings.estimated_reopen),
      },
      capacitySettings: {
        ...state.capacitySettings,
        is_accepting_orders: open,
      },
    })),

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ merchantUser: null });
  },
}));
