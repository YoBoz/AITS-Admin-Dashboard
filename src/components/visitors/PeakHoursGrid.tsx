import { useState, useMemo } from 'react';
import { SectionCard } from '@/components/common/SectionCard';
import { peakHoursGrid } from '@/data/mock/visitors.mock';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/utils';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

function intensityToColor(value: number, max: number): string {
  const ratio = value / max;
  if (ratio < 0.15) return 'bg-blue-100 dark:bg-blue-950';
  if (ratio < 0.3) return 'bg-blue-200 dark:bg-blue-900';
  if (ratio < 0.45) return 'bg-amber-100 dark:bg-amber-950';
  if (ratio < 0.6) return 'bg-amber-200 dark:bg-amber-900';
  if (ratio < 0.75) return 'bg-orange-200 dark:bg-orange-900';
  if (ratio < 0.85) return 'bg-red-200 dark:bg-red-900/70';
  return 'bg-red-400 dark:bg-red-800';
}

export function PeakHoursGrid() {
  const [hovered, setHovered] = useState<{ day: number; hour: number } | null>(null);

  const { max, busiestCell, quietestCell } = useMemo(() => {
    let maxVal = 0;
    let busiest = { day: 0, hour: 0, val: 0 };
    let quietest = { day: 0, hour: 0, val: Infinity };

    peakHoursGrid.forEach((row, d) => {
      row.forEach((val, h) => {
        if (val > maxVal) maxVal = val;
        if (val > busiest.val) busiest = { day: d, hour: h, val };
        if (val < quietest.val) quietest = { day: d, hour: h, val };
      });
    });

    return { max: maxVal, busiestCell: busiest, quietestCell: quietest };
  }, []);

  return (
    <SectionCard title="Peak Hours by Day of Week" subtitle="Visitor density heatmap grid">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-[600px]">
          {/* Column headers (hours) */}
          <div className="flex ml-10">
            {hours.map((h, i) => (
              i % 2 === 0 && (
                <div
                  key={h}
                  className="text-[8px] font-mono text-muted-foreground"
                  style={{ width: `${100 / 24 * 2}%`, minWidth: 20 }}
                >
                  {h}
                </div>
              )
            ))}
          </div>

          {/* Grid rows */}
          {peakHoursGrid.map((row, dayIdx) => (
            <div key={dayIdx} className="flex items-center">
              <span className="w-10 text-[10px] font-mono text-muted-foreground shrink-0">
                {days[dayIdx]}
              </span>
              <div className="flex flex-1 gap-[1px]">
                {row.map((value, hourIdx) => (
                  <div
                    key={hourIdx}
                    className={cn(
                      'aspect-square rounded-[2px] transition-all duration-150 cursor-default relative',
                      intensityToColor(value, max),
                      hovered?.day === dayIdx && hovered?.hour === hourIdx && 'ring-1 ring-foreground scale-125 z-10'
                    )}
                    style={{ flex: 1, minWidth: 12, minHeight: 12 }}
                    onMouseEnter={() => setHovered({ day: dayIdx, hour: hourIdx })}
                    onMouseLeave={() => setHovered(null)}
                    title={`${days[dayIdx]} ${hours[hourIdx]}: ${formatNumber(value)} visitors`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hover tooltip */}
      {hovered && (
        <div className="mt-2 text-xs font-lexend text-muted-foreground">
          {days[hovered.day]} {hours[hovered.hour]}:{' '}
          <span className="font-mono text-foreground font-semibold">
            {formatNumber(peakHoursGrid[hovered.day][hovered.hour])} visitors
          </span>
        </div>
      )}

      {/* Stats */}
      <div className="mt-3 flex flex-col sm:flex-row gap-2 text-xs font-lexend">
        <div className="flex-1 bg-red-50 dark:bg-red-950/30 rounded-md px-3 py-2">
          <span className="text-muted-foreground">Busiest Hour: </span>
          <span className="font-semibold text-foreground">
            {days[busiestCell.day]} {hours[busiestCell.hour]} - {hours[busiestCell.hour + 1] || '00:00'}
          </span>
          <span className="text-muted-foreground"> (avg {formatNumber(busiestCell.val)} visitors)</span>
        </div>
        <div className="flex-1 bg-blue-50 dark:bg-blue-950/30 rounded-md px-3 py-2">
          <span className="text-muted-foreground">Quietest Hour: </span>
          <span className="font-semibold text-foreground">
            {days[quietestCell.day]} {hours[quietestCell.hour]} - {hours[quietestCell.hour + 1] || '00:00'}
          </span>
          <span className="text-muted-foreground"> (avg {formatNumber(quietestCell.val)} visitors)</span>
        </div>
      </div>
    </SectionCard>
  );
}
