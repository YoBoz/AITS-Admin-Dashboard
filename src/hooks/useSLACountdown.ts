import { useState, useEffect, useRef, useMemo } from 'react';

export type UrgencyLevel = 'ok' | 'warning' | 'critical';

interface SLACountdownResult {
  secondsLeft: number;
  isExpired: boolean;
  percentageLeft: number;
  urgencyLevel: UrgencyLevel;
}

interface UseSLACountdownOptions {
  /** ISO-8601 deadline string */
  slaBy: string | null;
  /** Only tick when status is relevant */
  active?: boolean;
  /** Total SLA window in seconds (default 90) — used for percentage calc */
  totalWindow?: number;
}

export function useSLACountdown({
  slaBy,
  active = true,
  totalWindow = 90,
}: UseSLACountdownOptions): SLACountdownResult {
  const deadline = useMemo(() => (slaBy ? new Date(slaBy).getTime() : null), [slaBy]);
  const [now, setNow] = useState(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!deadline || !active) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // tick immediately
    setNow(Date.now());

    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 1_000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [deadline, active]);

  if (!deadline) {
    return { secondsLeft: 0, isExpired: false, percentageLeft: 100, urgencyLevel: 'ok' };
  }

  const diff = Math.max(0, Math.floor((deadline - now) / 1000));
  const isExpired = diff <= 0;
  const pct = totalWindow > 0 ? Math.min(100, Math.max(0, (diff / totalWindow) * 100)) : 0;

  let urgencyLevel: UrgencyLevel = 'ok';
  if (diff <= 0) urgencyLevel = 'critical';
  else if (diff <= 30) urgencyLevel = 'critical';
  else if (diff <= 60) urgencyLevel = 'warning';

  return {
    secondsLeft: diff,
    isExpired,
    percentageLeft: pct,
    urgencyLevel,
  };
}
