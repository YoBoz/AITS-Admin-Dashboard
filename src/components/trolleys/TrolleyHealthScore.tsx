import { cn } from '@/lib/utils';

interface TrolleyHealthScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function TrolleyHealthScore({
  score,
  size = 'md',
  showLabel = true,
  className,
}: TrolleyHealthScoreProps) {
  const color =
    score >= 90 ? 'text-emerald-500' :
    score >= 75 ? 'text-blue-500' :
    score >= 60 ? 'text-amber-500' :
    'text-red-500';

  const strokeColor =
    score >= 90 ? '#10b981' :
    score >= 75 ? '#3b82f6' :
    score >= 60 ? '#f59e0b' :
    '#ef4444';

  const dimensions = {
    sm: { size: 36, stroke: 3, fontSize: 'text-[10px]' },
    md: { size: 48, stroke: 4, fontSize: 'text-xs' },
    lg: { size: 64, stroke: 5, fontSize: 'text-sm' },
  };

  const d = dimensions[size];
  const radius = (d.size - d.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative" style={{ width: d.size, height: d.size }}>
        <svg width={d.size} height={d.size} className="-rotate-90">
          <circle
            cx={d.size / 2}
            cy={d.size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={d.stroke}
            className="text-muted/30"
          />
          <circle
            cx={d.size / 2}
            cy={d.size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={d.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <span
          className={cn(
            'absolute inset-0 flex items-center justify-center font-mono font-bold',
            d.fontSize,
            color
          )}
        >
          {score}
        </span>
      </div>
      {showLabel && (
        <span className={cn('text-xs font-lexend text-muted-foreground')}>Health</span>
      )}
    </div>
  );
}
