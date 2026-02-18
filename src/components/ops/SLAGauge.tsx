// ──────────────────────────────────────
// SLA Gauge Component — Phase 8
// ──────────────────────────────────────

import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SLAGaugeProps {
  value: number;
  label: string;
  subtitle?: string;
  trend?: number;
  unit?: string;
  threshold?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function getColor(value: number, threshold: number = 90): string {
  if (value >= threshold) return 'text-emerald-500';
  if (value >= threshold - 10) return 'text-amber-500';
  return 'text-red-500';
}

function getStrokeColor(value: number, threshold: number = 90): string {
  if (value >= threshold) return 'stroke-emerald-500';
  if (value >= threshold - 10) return 'stroke-amber-500';
  return 'stroke-red-500';
}

const sizeConfig = {
  sm: { size: 80, stroke: 8, fontSize: 'text-lg', labelSize: 'text-[10px]' },
  md: { size: 120, stroke: 10, fontSize: 'text-2xl', labelSize: 'text-xs' },
  lg: { size: 160, stroke: 12, fontSize: 'text-3xl', labelSize: 'text-sm' },
};

export function SLAGauge({
  value,
  label,
  subtitle,
  trend,
  unit = '%',
  threshold = 90,
  size = 'md',
  className,
}: SLAGaugeProps) {
  const config = sizeConfig[size];
  const radius = (config.size - config.stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  const TrendIcon = trend && trend > 0 ? TrendingUp : trend && trend < 0 ? TrendingDown : Minus;
  const trendColor = trend && trend > 0 ? 'text-emerald-500' : trend && trend < 0 ? 'text-red-500' : 'text-muted-foreground';

  return (
    <div className={cn('flex flex-col items-center', className)}>
      {/* Circular Gauge */}
      <div className="relative" style={{ width: config.size, height: config.size }}>
        <svg className="transform -rotate-90" width={config.size} height={config.size}>
          {/* Background circle */}
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            fill="none"
            className="stroke-muted"
            strokeWidth={config.stroke}
          />
          {/* Progress circle */}
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            fill="none"
            className={cn('transition-all duration-500', getStrokeColor(value, threshold))}
            strokeWidth={config.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Value in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('font-bold font-mono', config.fontSize, getColor(value, threshold))}>
            {value.toFixed(1)}{unit}
          </span>
        </div>
      </div>

      {/* Label */}
      <p className={cn('mt-2 font-medium text-foreground text-center', config.labelSize)}>{label}</p>
      
      {/* Subtitle / Trend */}
      <div className="flex items-center gap-1 mt-0.5">
        {trend !== undefined && (
          <>
            <TrendIcon className={cn('h-3 w-3', trendColor)} />
            <span className={cn('text-[10px]', trendColor)}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          </>
        )}
        {subtitle && (
          <span className="text-[10px] text-muted-foreground">{subtitle}</span>
        )}
      </div>
    </div>
  );
}
