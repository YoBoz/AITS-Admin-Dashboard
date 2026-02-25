import { create } from 'zustand';
import type { MerchantUser, MerchantSLASettings, MerchantCapacitySettings, MerchantDeliverySettings, AutoPauseConfig } from '@/types/merchant.types';

const STORAGE_KEY = 'aits-merchant-user';

interface MerchantState {
  merchantUser: MerchantUser | null;
  slaSettings: MerchantSLASettings;
  capacitySettings: MerchantCapacitySettings;
  deliverySettings: MerchantDeliverySettings;
  autoPauseConfig: AutoPauseConfig;
  storeStatus: 'open' | 'busy' | 'closed';
  isStoreOpen: boolean;

  setMerchantUser: (user: MerchantUser) => void;
  logout: () => void;
  setSLASettings: (settings: Partial<MerchantSLASettings>) => void;
  setCapacitySettings: (settings: Partial<MerchantCapacitySettings>) => void;
  setDeliverySettings: (settings: Partial<MerchantDeliverySettings>) => void;
  setAutoPauseConfig: (config: Partial<AutoPauseConfig>) => void;
  setStoreStatus: (status: 'open' | 'busy' | 'closed') => void;
  /** Toggle between Normal and Busy mode. Busy: lowers ranking, limits new orders, does not cancel existing orders. */
  toggleBusyMode: () => void;
}

function getStoredUser(): MerchantUser | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export const useMerchantStore = create<MerchantState>((set, get) => ({
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

  deliverySettings: {
    delivery_mode: 'delivery_enabled',
    delivery_radius_km: 5,
    base_delivery_fee: 10,
    free_delivery_above: 100,
    estimated_delivery_minutes: 30,
    delivery_time_windows: [
      { start: '08:00', end: '22:00' },
    ],
    runner_preference: 'any',
    allow_scheduled_delivery: false,
    supported_areas: ['Gate A1-A12', 'Gate B1-B8'],
    cutoff_minutes: 20,
    pickup_verification: 'QR',
    packaging_readiness_required: true,
  },

  autoPauseConfig: {
    enabled: false,
    pause_after_minutes: 30,
    resume_automatically: false,
    resume_after_minutes: 60,
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

  setDeliverySettings: (settings) =>
    set((state) => ({
      deliverySettings: { ...state.deliverySettings, ...settings },
    })),

  setAutoPauseConfig: (config) =>
    set((state) => ({
      autoPauseConfig: { ...state.autoPauseConfig, ...config },
    })),

  setStoreStatus: (status) => set({ storeStatus: status, isStoreOpen: status !== 'closed' }),

  toggleBusyMode: () => {
    const { storeStatus } = get();
    if (storeStatus === 'closed') return; // cannot toggle busy when closed
    const newStatus = storeStatus === 'busy' ? 'open' : 'busy';
    set({ storeStatus: newStatus, isStoreOpen: true });
  },
}));
