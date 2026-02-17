import { create } from 'zustand';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
}

interface UIState {
  isCommandPaletteOpen: boolean;
  isNotificationPanelOpen: boolean;
  isKeyboardShortcutsOpen: boolean;
  isOnboardingActive: boolean;
  onboardingStep: number;
  toasts: ToastItem[];
  isOffline: boolean;
  pageLoadingProgress: number;

  setCommandPaletteOpen: (open: boolean) => void;
  setNotificationPanelOpen: (open: boolean) => void;
  setKeyboardShortcutsOpen: (open: boolean) => void;
  setOnboardingActive: (active: boolean) => void;
  setOnboardingStep: (step: number) => void;
  addToast: (toast: ToastItem) => void;
  removeToast: (id: string) => void;
  setOffline: (offline: boolean) => void;
  setPageProgress: (progress: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCommandPaletteOpen: false,
  isNotificationPanelOpen: false,
  isKeyboardShortcutsOpen: false,
  isOnboardingActive: false,
  onboardingStep: 0,
  toasts: [],
  isOffline: !navigator.onLine,
  pageLoadingProgress: 0,

  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  setNotificationPanelOpen: (open) => set({ isNotificationPanelOpen: open }),
  setKeyboardShortcutsOpen: (open) => set({ isKeyboardShortcutsOpen: open }),
  setOnboardingActive: (active) => set({ isOnboardingActive: active }),
  setOnboardingStep: (step) => set({ onboardingStep: step }),
  addToast: (toast) =>
    set((state) => ({ toasts: [...state.toasts, toast] })),
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  setOffline: (offline) => set({ isOffline: offline }),
  setPageProgress: (progress) => set({ pageLoadingProgress: progress }),
}));
