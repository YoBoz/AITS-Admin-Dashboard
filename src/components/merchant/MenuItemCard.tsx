import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Switch } from '@/components/ui/Switch';
import type { MenuItem } from '@/types/menu.types';
import { GripVertical, Pencil, AlertTriangle, Tag } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  onEdit?: () => void;
  onToggleAvailability?: (available: boolean) => void;
  className?: string;
}

export function MenuItemCard({ item, onEdit, onToggleAvailability, className }: MenuItemCardProps) {
  const isDraft = item.status === 'draft';
  const isOOS = !item.is_available;

  return (
    <div
      className={cn(
        'group flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted/30',
        isOOS && 'opacity-60',
        isDraft && 'border-dashed',
        className
      )}
    >
      {/* Drag handle */}
      <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/40 cursor-grab" />

      {/* Image */}
      {item.image_url ? (
        <img
          src={item.image_url}
          alt={item.name}
          className="h-12 w-12 rounded-md object-cover shrink-0"
        />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted shrink-0">
          <Tag className="h-5 w-5 text-muted-foreground" />
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
          {isDraft && (
            <Badge variant="outline" className="text-[10px]">
              Draft
            </Badge>
          )}
          {isOOS && (
            <Badge variant="destructive" className="text-[10px]">
              Out of Stock
            </Badge>
          )}
        </div>
        {item.description && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">{item.description}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold text-foreground">
            AED {item.price.toFixed(2)}
          </span>
          {item.allergens.length > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] text-status-warning">
              <AlertTriangle className="h-3 w-3" />
              {item.allergens.join(', ')}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <Switch
          checked={item.is_available}
          onCheckedChange={(v) => onToggleAvailability?.(v)}
          aria-label={`Toggle availability for ${item.name}`}
        />
        <button
          onClick={onEdit}
          className="rounded-md p-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-muted hover:text-foreground transition-all"
          aria-label={`Edit ${item.name}`}
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
