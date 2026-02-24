import { create } from 'zustand';
import type { MapZone } from '@/types/map.types';

interface MapState {
  activeMapLayers: string[];
  selectedZone: MapZone | null;
  selectedShopId: string | null;
  selectedTrolleyId: string | null;
  zoomLevel: number;
  currentFloor: number;

  toggleLayer: (layer: string) => void;
  selectZone: (zone: MapZone | null) => void;
  selectShop: (shopId: string | null) => void;
  selectTrolley: (trolleyId: string | null) => void;
  clearSelection: () => void;
  setZoom: (level: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setFloor: (floor: number) => void;
}

export const useMapStore = create<MapState>((set) => ({
  activeMapLayers: ['zones', 'trolleys', 'shops', 'pois', 'lounges', 'washrooms', 'gates'],
  selectedZone: null,
  selectedShopId: null,
  selectedTrolleyId: null,
  zoomLevel: 1,
  currentFloor: 1,

  toggleLayer: (layer) =>
    set((state) => ({
      activeMapLayers: state.activeMapLayers.includes(layer)
        ? state.activeMapLayers.filter((l) => l !== layer)
        : [...state.activeMapLayers, layer],
    })),

  selectZone: (zone) =>
    set({ selectedZone: zone, selectedShopId: null, selectedTrolleyId: null }),

  selectShop: (shopId) =>
    set({ selectedShopId: shopId, selectedZone: null, selectedTrolleyId: null }),

  selectTrolley: (trolleyId) =>
    set({ selectedTrolleyId: trolleyId, selectedZone: null, selectedShopId: null }),

  clearSelection: () =>
    set({ selectedZone: null, selectedShopId: null, selectedTrolleyId: null }),

  setZoom: (level) =>
    set({ zoomLevel: Math.min(2.0, Math.max(0.5, level)) }),

  zoomIn: () =>
    set((state) => ({ zoomLevel: Math.min(2.0, state.zoomLevel + 0.2) })),

  zoomOut: () =>
    set((state) => ({ zoomLevel: Math.max(0.5, state.zoomLevel - 0.2) })),

  resetZoom: () => set({ zoomLevel: 1 }),

  setFloor: (floor) =>
    set({ currentFloor: floor, selectedZone: null, selectedShopId: null, selectedTrolleyId: null }),
}));
