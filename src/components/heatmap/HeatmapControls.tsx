import type { DataMode, TimeRange } from '@/types/visitor.types';
import { modeLabelMap } from '@/data/mock/heatmap.mock';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import {
  Users, Clock, ShoppingCart, Tag,
} from 'lucide-react';

interface HeatmapControlsProps {
  mode: DataMode;
  onModeChange: (mode: DataMode) => void;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  categoryFilter: string[];
  onCategoryFilterChange: (categories: string[]) => void;
  hourRange: [number, number];
  onHourRangeChange: (range: [number, number]) => void;
}

const modeIcons: Record<DataMode, React.ReactNode> = {
  visitors: <Users className="h-3.5 w-3.5" />,
  dwell: <Clock className="h-3.5 w-3.5" />,
  trolleys: <ShoppingCart className="h-3.5 w-3.5" />,
  offers: <Tag className="h-3.5 w-3.5" />,
};

const dataModes: DataMode[] = ['visitors', 'dwell', 'trolleys', 'offers'];
const timeRanges: { value: TimeRange; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
];

const zoneCategories = [
  { key: 'all', label: 'All' },
  { key: 'retail', label: 'Retail' },
  { key: 'food', label: 'Food' },
  { key: 'lounge', label: 'Lounge' },
  { key: 'gate', label: 'Gates' },
  { key: 'washroom', label: 'WC' },
  { key: 'service', label: 'Services' },
];

export function HeatmapControls({
  mode, onModeChange,
  timeRange, onTimeRangeChange,
  categoryFilter, onCategoryFilterChange,
  hourRange, onHourRangeChange,
}: HeatmapControlsProps) {

  const toggleCategory = (key: string) => {
    if (key === 'all') {
      onCategoryFilterChange(['all']);
      return;
    }
    let next = categoryFilter.filter((c) => c !== 'all');
    if (next.includes(key)) {
      next = next.filter((c) => c !== key);
    } else {
      next.push(key);
    }
    if (next.length === 0) next = ['all'];
    onCategoryFilterChange(next);
  };

  return (
    <div className="space-y-5">
      {/* Data Mode */}
      <div>
        <h3 className="text-xs font-semibold font-poppins text-muted-foreground uppercase tracking-wider mb-2">
          Data Mode
        </h3>
        <div className="grid grid-cols-2 gap-1.5">
          {dataModes.map((m) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-2 rounded-md text-xs font-lexend transition-all',
                mode === m
                  ? 'bg-brand text-white shadow-sm'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              )}
            >
              {modeIcons[m]}
              {modeLabelMap[m]}
            </button>
          ))}
        </div>
      </div>

      {/* Time Range */}
      <div>
        <h3 className="text-xs font-semibold font-poppins text-muted-foreground uppercase tracking-wider mb-2">
          Time Range
        </h3>
        <div className="flex rounded-lg border border-border overflow-hidden">
          {timeRanges.map((tr) => (
            <button
              key={tr.value}
              onClick={() => onTimeRangeChange(tr.value)}
              className={cn(
                'flex-1 py-1.5 text-[11px] font-lexend transition-colors',
                timeRange === tr.value
                  ? 'bg-brand text-white'
                  : 'bg-card text-muted-foreground hover:bg-muted/50'
              )}
            >
              {tr.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="text-xs font-semibold font-poppins text-muted-foreground uppercase tracking-wider mb-2">
          Zone Category
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {zoneCategories.map((cat) => {
            const active =
              cat.key === 'all' ? categoryFilter.includes('all') : categoryFilter.includes(cat.key);
            return (
              <button
                key={cat.key}
                onClick={() => toggleCategory(cat.key)}
                className={cn(
                  'px-2.5 py-1 rounded-full text-[11px] font-lexend border transition-all',
                  active
                    ? 'bg-brand/10 border-brand text-brand'
                    : 'bg-card border-border text-muted-foreground hover:border-brand/50'
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time of Day Slider */}
      <div>
        <h3 className="text-xs font-semibold font-poppins text-muted-foreground uppercase tracking-wider mb-2">
          Time of Day
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={23}
              value={hourRange[0]}
              onChange={(e) => onHourRangeChange([Math.min(Number(e.target.value), hourRange[1]), hourRange[1]])}
              className="w-full accent-brand h-1.5"
            />
            <input
              type="range"
              min={0}
              max={23}
              value={hourRange[1]}
              onChange={(e) => onHourRangeChange([hourRange[0], Math.max(Number(e.target.value), hourRange[0])])}
              className="w-full accent-brand h-1.5"
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
            <span>{String(hourRange[0]).padStart(2, '0')}:00</span>
            <span>{String(hourRange[1]).padStart(2, '0')}:59</span>
          </div>
        </div>
      </div>

      {/* Reset */}
      <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => {
        onModeChange('visitors');
        onTimeRangeChange('today');
        onCategoryFilterChange(['all']);
        onHourRangeChange([0, 23]);
      }}>
        Reset All Filters
      </Button>
    </div>
  );
}
