import { cn } from '@/lib/utils';
import { floors } from '@/data/mock/map.mock';
import { Building2 } from 'lucide-react';

interface FloorSelectorProps {
  currentFloor: number;
  onFloorChange: (floor: number) => void;
  className?: string;
  compact?: boolean;
}

export function FloorSelector({ currentFloor, onFloorChange, className, compact = false }: FloorSelectorProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {!compact && <Building2 className="h-4 w-4 text-muted-foreground mr-1 shrink-0" />}
      {floors.map((floor) => (
        <button
          key={floor.id}
          onClick={() => onFloorChange(floor.id)}
          className={cn(
            'px-3 py-1.5 text-xs font-lexend font-medium rounded-md transition-all duration-200',
            'border',
            currentFloor === floor.id
              ? 'bg-brand text-white border-brand shadow-sm'
              : 'bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground',
          )}
          title={floor.label}
        >
          {compact ? `F${floor.id}` : floor.name}
        </button>
      ))}
    </div>
  );
}
