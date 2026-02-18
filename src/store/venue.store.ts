// ──────────────────────────────────────
// Venue Store — Phase 8
// ──────────────────────────────────────

import { create } from 'zustand';
import type { Terminal, Floor, VenueZone, Gate, VenueNodeType } from '@/types/venue.types';
import { venueData } from '@/data/mock/venue.mock';

interface VenueState {
  terminal: Terminal;
  selectedNodeId: string | null;
  selectedNodeType: VenueNodeType | null;
  isLoading: boolean;

  // Actions
  setTerminal: (terminal: Terminal) => void;
  updateTerminal: (updates: Partial<Terminal>) => void;
  updateFloor: (floorId: string, updates: Partial<Floor>) => void;
  updateZone: (zoneId: string, updates: Partial<VenueZone>) => void;
  updateGate: (gateId: string, updates: Partial<Gate>) => void;
  selectNode: (id: string | null, type: VenueNodeType | null) => void;
  setLoading: (loading: boolean) => void;

  // Gate passenger count updates (for surge simulation)
  updateGatePassengerCount: (gateId: string, count: number) => void;
  randomizePassengerCounts: () => void;

  // Derived
  getFloorById: (id: string) => Floor | undefined;
  getZoneById: (id: string) => VenueZone | undefined;
  getGateById: (id: string) => Gate | undefined;
  getAllGates: () => Gate[];
  getAllZones: () => VenueZone[];
  getGatesInZone: (zoneId: string) => Gate[];
  getZonesOnFloor: (floorId: string) => VenueZone[];
  
  // Stats
  totalGates: () => number;
  totalZones: () => number;
  surgeGates: () => Gate[];
}

export const useVenueStore = create<VenueState>((set, get) => ({
  terminal: venueData,
  selectedNodeId: null,
  selectedNodeType: null,
  isLoading: false,

  setTerminal: (terminal) => set({ terminal }),

  updateTerminal: (updates) =>
    set((state) => ({
      terminal: { ...state.terminal, ...updates },
    })),

  updateFloor: (floorId, updates) =>
    set((state) => ({
      terminal: {
        ...state.terminal,
        floors: state.terminal.floors.map((f) =>
          f.id === floorId ? { ...f, ...updates } : f
        ),
      },
    })),

  updateZone: (zoneId, updates) =>
    set((state) => ({
      terminal: {
        ...state.terminal,
        floors: state.terminal.floors.map((floor) => ({
          ...floor,
          zones: floor.zones.map((zone) =>
            zone.id === zoneId ? { ...zone, ...updates } : zone
          ),
        })),
      },
    })),

  updateGate: (gateId, updates) =>
    set((state) => ({
      terminal: {
        ...state.terminal,
        floors: state.terminal.floors.map((floor) => ({
          ...floor,
          zones: floor.zones.map((zone) => ({
            ...zone,
            gates: zone.gates.map((gate) =>
              gate.id === gateId ? { ...gate, ...updates } : gate
            ),
          })),
        })),
      },
    })),

  selectNode: (id, type) =>
    set({ selectedNodeId: id, selectedNodeType: type }),

  setLoading: (loading) => set({ isLoading: loading }),

  updateGatePassengerCount: (gateId, count) => {
    get().updateGate(gateId, { passenger_count_estimate: count });
  },

  randomizePassengerCounts: () => {
    const gates = get().getAllGates();
    gates.forEach((gate) => {
      const change = Math.floor(Math.random() * 40) - 20; // -20 to +20
      const newCount = Math.max(50, Math.min(400, gate.passenger_count_estimate + change));
      get().updateGatePassengerCount(gate.id, newCount);
    });
  },

  getFloorById: (id) =>
    get().terminal.floors.find((f) => f.id === id),

  getZoneById: (id) => {
    for (const floor of get().terminal.floors) {
      const zone = floor.zones.find((z) => z.id === id);
      if (zone) return zone;
    }
    return undefined;
  },

  getGateById: (id) => {
    for (const floor of get().terminal.floors) {
      for (const zone of floor.zones) {
        const gate = zone.gates.find((g) => g.id === id);
        if (gate) return gate;
      }
    }
    return undefined;
  },

  getAllGates: () => {
    const gates: Gate[] = [];
    for (const floor of get().terminal.floors) {
      for (const zone of floor.zones) {
        gates.push(...zone.gates);
      }
    }
    return gates;
  },

  getAllZones: () => {
    const zones: VenueZone[] = [];
    for (const floor of get().terminal.floors) {
      zones.push(...floor.zones);
    }
    return zones;
  },

  getGatesInZone: (zoneId) => {
    const zone = get().getZoneById(zoneId);
    return zone?.gates || [];
  },

  getZonesOnFloor: (floorId) => {
    const floor = get().getFloorById(floorId);
    return floor?.zones || [];
  },

  totalGates: () => get().getAllGates().length,

  totalZones: () => get().getAllZones().length,

  surgeGates: () =>
    get().getAllGates().filter((g) => g.passenger_count_estimate > 200),
}));
