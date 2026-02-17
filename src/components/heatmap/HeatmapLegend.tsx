import { interpolateColor } from './HeatmapOverlay';
import type { DataMode } from '@/types/visitor.types';
import { modeLabelMap, modeUnitMap } from '@/data/mock/heatmap.mock';

interface HeatmapLegendProps {
  mode: DataMode;
}

export function HeatmapLegend({ mode }: HeatmapLegendProps) {
  const stops = Array.from({ length: 20 }, (_, i) => {
    const pct = i / 19;
    return { offset: `${Math.round(pct * 100)}%`, color: interpolateColor(pct) };
  });

  const gradientId = `heatmap-legend-gradient-${mode}`;

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-lg border border-border/50">
      <span className="text-[10px] font-lexend text-muted-foreground uppercase tracking-wider whitespace-nowrap">
        {modeLabelMap[mode]}
      </span>

      <div className="flex items-center gap-1.5 flex-1">
        <span className="text-[10px] font-mono text-muted-foreground">Low</span>
        <svg
          width="100%"
          height="12"
          className="flex-1 min-w-[80px] max-w-[200px]"
          viewBox="0 0 200 12"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              {stops.map((s, i) => (
                <stop key={i} offset={s.offset} stopColor={s.color} />
              ))}
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="200" height="12" fill={`url(#${gradientId})`} rx="3" />
        </svg>
        <span className="text-[10px] font-mono text-muted-foreground">Max</span>
      </div>

      <span className="text-[10px] font-lexend text-muted-foreground whitespace-nowrap">
        ({modeUnitMap[mode]})
      </span>
    </div>
  );
}
