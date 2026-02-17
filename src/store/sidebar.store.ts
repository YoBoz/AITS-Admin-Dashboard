import { create } from 'zustand';

interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggle: () => void;
  setCollapsed: (collapsed: boolean) => void;
  openMobile: () => void;
  closeMobile: () => void;
}

const getInitialCollapsed = (): boolean => {
  try {
    const stored = localStorage.getItem('aits-sidebar-collapsed');
    return stored === 'true';
  } catch {
    return false;
  }
};

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: getInitialCollapsed(),
  isMobileOpen: false,
  toggle: () =>
    set((state) => {
      const next = !state.isCollapsed;
      localStorage.setItem('aits-sidebar-collapsed', String(next));
      return { isCollapsed: next };
    }),
  setCollapsed: (collapsed: boolean) => {
    localStorage.setItem('aits-sidebar-collapsed', String(collapsed));
    set({ isCollapsed: collapsed });
  },
  openMobile: () => set({ isMobileOpen: true }),
  closeMobile: () => set({ isMobileOpen: false }),
}));
