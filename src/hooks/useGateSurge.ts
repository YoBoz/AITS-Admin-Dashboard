// ──────────────────────────────────────
// useGateSurge Hook — Phase 8
// Gate surge detection and management
// ──────────────────────────────────────

import { useMemo } from 'react';
import { useVenueStore } from '@/store/venue.store';
import type { Gate } from '@/types/venue.types';

interface GateSurgeStatus {
  gate: Gate;
  status: 'normal' | 'elevated' | 'surge';
}

interface UseGateSurgeReturn {
  surgeGates: Gate[];
  elevatedGates: Gate[];
  isSurgeActive: boolean;
  gateStatuses: GateSurgeStatus[];
  getSurgeStatus: (passengerCount: number) => 'normal' | 'elevated' | 'surge';
}

const SURGE_THRESHOLD = 200;
const ELEVATED_THRESHOLD = 150;

export function useGateSurge(): UseGateSurgeReturn {
  const { getAllGates } = useVenueStore();
  
  const allGates = getAllGates();

  const getSurgeStatus = (passengerCount: number): 'normal' | 'elevated' | 'surge' => {
    if (passengerCount >= SURGE_THRESHOLD) return 'surge';
    if (passengerCount >= ELEVATED_THRESHOLD) return 'elevated';
    return 'normal';
  };

  const gateStatuses = useMemo<GateSurgeStatus[]>(() => {
    return allGates.map((gate) => ({
      gate,
      status: getSurgeStatus(gate.passenger_count_estimate),
    }));
  }, [allGates]);

  const surgeGates = useMemo(() => {
    return allGates.filter((g) => g.passenger_count_estimate >= SURGE_THRESHOLD);
  }, [allGates]);

  const elevatedGates = useMemo(() => {
    return allGates.filter(
      (g) => g.passenger_count_estimate >= ELEVATED_THRESHOLD && g.passenger_count_estimate < SURGE_THRESHOLD
    );
  }, [allGates]);

  const isSurgeActive = surgeGates.length > 0;

  return {
    surgeGates,
    elevatedGates,
    isSurgeActive,
    gateStatuses,
    getSurgeStatus,
  };
}
