// ──────────────────────────────────────
// useFleetLive Hook — Phase 8
// Live fleet simulation with device movement and status changes
// ──────────────────────────────────────

import { useEffect, useRef, useCallback } from 'react';
import { useTrolleysStore } from '@/store/trolleys.store';
import { useAlertsStore } from '@/store/alerts.store';
import { useVenueStore } from '@/store/venue.store';
import { toast } from 'sonner';

interface UseFleetLiveOptions {
  enabled?: boolean;
  movementInterval?: number; // ms, default 3000
  offlineInterval?: number; // ms, default 120000 (2 minutes)
}

export function useFleetLive(options: UseFleetLiveOptions = {}) {
  const {
    enabled = true,
    movementInterval = 3000,
    offlineInterval = 120000,
  } = options;

  const { trolleys, updateTrolley } = useTrolleysStore();
  const { addAlert } = useAlertsStore();
  const { randomizePassengerCounts } = useVenueStore();
  
  const movementTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const offlineTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const surgeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulate device movement
  const simulateMovement = useCallback(() => {
    const activeTrolleys = trolleys.filter(
      (t) => t.status === 'active' || t.status === 'idle'
    );
    
    // Move 10-15 random trolleys
    const count = Math.floor(Math.random() * 6) + 10;
    const toMove = activeTrolleys
      .sort(() => Math.random() - 0.5)
      .slice(0, count);

    toMove.forEach((trolley) => {
      // Random movement within bounds (±5-15 pixels)
      const dx = (Math.random() * 20 - 10) * (Math.random() > 0.5 ? 1 : -1);
      const dy = (Math.random() * 20 - 10) * (Math.random() > 0.5 ? 1 : -1);
      
      const newX = Math.max(100, Math.min(1100, trolley.location.x + dx));
      const newY = Math.max(100, Math.min(700, trolley.location.y + dy));

      updateTrolley(trolley.id, {
        location: { ...trolley.location, x: newX, y: newY },
        last_seen: new Date().toISOString(),
      });
    });

    // Randomly decrease battery for 2-3 trolleys
    const batteryCount = Math.floor(Math.random() * 2) + 2;
    const forBattery = activeTrolleys
      .filter((t) => t.battery > 5)
      .sort(() => Math.random() - 0.5)
      .slice(0, batteryCount);

    forBattery.forEach((trolley) => {
      const newBattery = Math.max(0, trolley.battery - 1);
      updateTrolley(trolley.id, { battery: newBattery });

      // Create alert if battery hits critical threshold
      if (newBattery === 10) {
        addAlert({
          id: `ALR-AUTO-${Date.now()}-${trolley.id}`,
          type: 'battery_low',
          severity: 'warning',
          title: `Critical Battery – ${trolley.imei}`,
          description: `Trolley ${trolley.imei} battery dropped to ${newBattery}%. Immediate charging required.`,
          trolley_id: trolley.id,
          trolley_imei: trolley.imei,
          zone: trolley.location.zone,
          status: 'active',
          created_at: new Date().toISOString(),
          acknowledged_at: null,
          resolved_at: null,
          assigned_to: null,
          resolution_notes: null,
          auto_generated: true,
          history: [
            {
              action: 'created',
              actor: 'system',
              timestamp: new Date().toISOString(),
              note: 'Auto-generated battery alert',
            },
          ],
        });

        toast.warning(`Low Battery: ${trolley.imei}`, {
          description: `Battery at ${newBattery}% in ${trolley.location.zone}`,
        });
      }
    });
  }, [trolleys, updateTrolley, addAlert]);

  // Simulate random device going offline
  const simulateOffline = useCallback(() => {
    const activeTrolleys = trolleys.filter(
      (t) => t.status === 'active' || t.status === 'idle'
    );
    
    if (activeTrolleys.length === 0) return;

    // Pick a random trolley to take offline
    const trolley = activeTrolleys[Math.floor(Math.random() * activeTrolleys.length)];
    
    updateTrolley(trolley.id, { status: 'offline' });

    // Create offline alert
    addAlert({
      id: `ALR-OFFLINE-${Date.now()}`,
      type: 'offline_trolley',
      severity: 'critical',
      title: `Trolley ${trolley.imei} Offline`,
      description: `Lost connection to Trolley ${trolley.imei} in zone ${trolley.location.zone}. Last seen just now.`,
      trolley_id: trolley.id,
      trolley_imei: trolley.imei,
      zone: trolley.location.zone,
      status: 'active',
      created_at: new Date().toISOString(),
      acknowledged_at: null,
      resolved_at: null,
      assigned_to: null,
      resolution_notes: null,
      auto_generated: true,
      history: [
        {
          action: 'created',
          actor: 'system',
          timestamp: new Date().toISOString(),
          note: 'Device went offline',
        },
      ],
    });

    toast.error(`Device Offline: ${trolley.imei}`, {
      description: `Lost connection in ${trolley.location.zone}`,
    });
  }, [trolleys, updateTrolley, addAlert]);

  // Start/stop simulation
  useEffect(() => {
    if (!enabled) {
      if (movementTimerRef.current) clearInterval(movementTimerRef.current);
      if (offlineTimerRef.current) clearInterval(offlineTimerRef.current);
      if (surgeTimerRef.current) clearInterval(surgeTimerRef.current);
      return;
    }

    // Movement simulation every 3 seconds
    movementTimerRef.current = setInterval(simulateMovement, movementInterval);

    // Offline simulation every 2 minutes
    offlineTimerRef.current = setInterval(simulateOffline, offlineInterval);

    // Passenger count changes every 30 seconds for surge simulation
    surgeTimerRef.current = setInterval(randomizePassengerCounts, 30000);

    return () => {
      if (movementTimerRef.current) clearInterval(movementTimerRef.current);
      if (offlineTimerRef.current) clearInterval(offlineTimerRef.current);
      if (surgeTimerRef.current) clearInterval(surgeTimerRef.current);
    };
  }, [enabled, movementInterval, offlineInterval, simulateMovement, simulateOffline, randomizePassengerCounts]);

  return {
    isActive: enabled,
  };
}
