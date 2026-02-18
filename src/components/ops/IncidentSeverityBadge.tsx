// ──────────────────────────────────────
// Incident Severity Badge Component — Phase 8
// ──────────────────────────────────────

import { cn } from '@/lib/utils';
import type { IncidentSeverity } from '@/types/incident.types';

interface IncidentSeverityBadgeProps {
  severity: IncidentSeverity;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
}

const severityConfig: Record<IncidentSeverity, { label: string; color: string; bgColor: string; borderColor: string }> = {
  p1_critical: {
    label: 'P1 CRITICAL',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-950',
    borderColor: 'border-red-300 dark:border-red-800',
  },
  p2_high: {
    label: 'P2 HIGH',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-950',
    borderColor: 'border-orange-300 dark:border-orange-800',
  },
  p3_medium: {
    label: 'P3 MEDIUM',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-950',
    borderColor: 'border-amber-300 dark:border-amber-800',
  },
  p4_low: {
    label: 'P4 LOW',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-950',
    borderColor: 'border-blue-300 dark:border-blue-800',
  },
};

const sizeClasses = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-0.5 text-xs',
  lg: 'px-2.5 py-1 text-sm',
};

export function IncidentSeverityBadge({ severity, size = 'md', pulse = false }: IncidentSeverityBadgeProps) {
  const config = severityConfig[severity];
  const shouldPulse = pulse && severity === 'p1_critical';

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold font-mono rounded border',
        config.color,
        config.bgColor,
        config.borderColor,
        sizeClasses[size],
        shouldPulse && 'animate-pulse'
      )}
    >
      {shouldPulse && (
        <span className="relative flex h-2 w-2 mr-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
      )}
      {config.label}
    </span>
  );
}

export function getSeverityColor(severity: IncidentSeverity): string {
  return severityConfig[severity].color;
}

export function getSeverityBorderColor(severity: IncidentSeverity): string {
  switch (severity) {
    case 'p1_critical': return 'border-l-red-500';
    case 'p2_high': return 'border-l-orange-500';
    case 'p3_medium': return 'border-l-amber-500';
    case 'p4_low': return 'border-l-blue-500';
  }
}
