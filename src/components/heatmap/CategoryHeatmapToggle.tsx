import type { DataMode } from '@/types/visitor.types';
import { modeLabelMap } from '@/data/mock/heatmap.mock';
import { cn } from '@/lib/utils';
import { Users, Clock, ShoppingCart, Tag } from 'lucide-react';

interface CategoryHeatmapToggleProps {
  mode: DataMode;
  onModeChange: (mode: DataMode) => void;
}

const items: { mode: DataMode; icon: React.ReactNode; color: string }[] = [
  { mode: 'visitors', icon: <Users className="h-4 w-4" />, color: 'bg-blue-500' },
  { mode: 'dwell', icon: <Clock className="h-4 w-4" />, color: 'bg-amber-500' },
  { mode: 'trolleys', icon: <ShoppingCart className="h-4 w-4" />, color: 'bg-emerald-500' },
  { mode: 'offers', icon: <Tag className="h-4 w-4" />, color: 'bg-brand' },
];

export function CategoryHeatmapToggle({ mode, onModeChange }: CategoryHeatmapToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-card/80 backdrop-blur-sm rounded-lg border border-border/50 p-1">
      {items.map((item) => (
        <button
          key={item.mode}
          onClick={() => onModeChange(item.mode)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-lexend transition-all',
            mode === item.mode
              ? 'bg-brand text-white shadow-sm'
              : 'text-muted-foreground hover:bg-muted/50'
          )}
        >
          {item.icon}
          <span className="hidden sm:inline">{modeLabelMap[item.mode]}</span>
        </button>
      ))}
    </div>
  );
}
