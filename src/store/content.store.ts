// ──────────────────────────────────────
// Content / CMS Store — Phase 9
// ──────────────────────────────────────

import { create } from 'zustand';
import type { Banner, RecommendedTile, CopyEntry } from '@/types/content.types';
import { bannersData, recommendedTilesData, copyEntriesData } from '@/data/mock/content.mock';

interface ContentState {
  banners: Banner[];
  recommendedTiles: RecommendedTile[];
  copyEntries: CopyEntry[];
  activeLanguage: string;

  // Banner actions
  addBanner: (banner: Banner) => void;
  updateBanner: (id: string, updates: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;

  // Tile actions
  addTile: (tile: RecommendedTile) => void;
  updateTile: (id: string, updates: Partial<RecommendedTile>) => void;
  deleteTile: (id: string) => void;
  reorderTiles: (placement: string, orderedIds: string[]) => void;
  toggleTile: (id: string) => void;
  removeTile: (id: string) => void;
  reorderTile: (id: string, newPosition: number) => void;

  // Copy actions
  updateCopyEntry: (key: string, lang: string, value: string) => void;
  publishCopyEntry: (key: string) => void;
  publishAllDrafts: () => void;

  // Language
  setActiveLanguage: (lang: string) => void;
}

export const useContentStore = create<ContentState>((set) => ({
  banners: bannersData,
  recommendedTiles: recommendedTilesData,
  copyEntries: copyEntriesData,
  activeLanguage: 'en',

  addBanner: (banner) =>
    set((state) => ({ banners: [banner, ...state.banners] })),

  updateBanner: (id, updates) =>
    set((state) => ({
      banners: state.banners.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    })),

  deleteBanner: (id) =>
    set((state) => ({ banners: state.banners.filter((b) => b.id !== id) })),

  addTile: (tile) =>
    set((state) => ({ recommendedTiles: [...state.recommendedTiles, tile] })),

  updateTile: (id, updates) =>
    set((state) => ({
      recommendedTiles: state.recommendedTiles.map((t) =>
        t.id === id ? { ...t, ...updates } : t,
      ),
    })),

  deleteTile: (id) =>
    set((state) => ({ recommendedTiles: state.recommendedTiles.filter((t) => t.id !== id) })),

  reorderTiles: (placement, orderedIds) =>
    set((state) => ({
      recommendedTiles: state.recommendedTiles.map((t) => {
        if (t.placement !== placement) return t;
        const idx = orderedIds.indexOf(t.id);
        return idx >= 0 ? { ...t, position: idx + 1 } : t;
      }),
    })),

  toggleTile: (id) =>
    set((state) => ({
      recommendedTiles: state.recommendedTiles.map((t) =>
        t.id === id ? { ...t, is_active: !t.is_active } : t,
      ),
    })),

  removeTile: (id) =>
    set((state) => ({ recommendedTiles: state.recommendedTiles.filter((t) => t.id !== id) })),

  reorderTile: (id, newPosition) =>
    set((state) => ({
      recommendedTiles: state.recommendedTiles.map((t) =>
        t.id === id ? { ...t, position: newPosition } : t,
      ),
    })),

  updateCopyEntry: (key, lang, value) =>
    set((state) => ({
      copyEntries: state.copyEntries.map((c) =>
        c.key === key
          ? {
              ...c,
              translations: { ...c.translations, [lang]: value },
              last_updated: new Date().toISOString(),
              is_published: false,
            }
          : c,
      ),
    })),

  publishCopyEntry: (key) =>
    set((state) => ({
      copyEntries: state.copyEntries.map((c) =>
        c.key === key ? { ...c, is_published: true } : c,
      ),
    })),

  publishAllDrafts: () =>
    set((state) => ({
      copyEntries: state.copyEntries.map((c) => ({ ...c, is_published: true })),
    })),

  setActiveLanguage: (lang) => set({ activeLanguage: lang }),
}));
