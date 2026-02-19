// ──────────────────────────────────────
// Tile Preview Card — Phase 9
// ──────────────────────────────────────

import { cn } from '@/lib/utils';
import { Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Switch } from '@/components/ui/Switch';
import type { RecommendedTile } from '@/types/content.types';

const typeColors: Record<RecommendedTile['type'], string> = {
  shop: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  offer: 'bg-green-500/10 text-green-700 dark:text-green-400',
  category: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  navigation: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
};

interface Props {
  tile: RecommendedTile;
  lang?: string;
  onEdit?: (tile: RecommendedTile) => void;
  onDelete?: (tile: RecommendedTile) => void;
  onToggle?: (tile: RecommendedTile) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export function TilePreviewCard({ tile, lang = 'en', onEdit, onDelete, onToggle, onMoveUp, onMoveDown }: Props) {
  const title = tile.title[lang] || tile.title.en || 'Untitled';
  const subtitle = tile.subtitle[lang] || tile.subtitle.en || '';

  return (
    <div className={cn(
      'relative rounded-xl border bg-card overflow-hidden group',
      tile.is_active ? 'border-border' : 'border-dashed border-muted-foreground/30 opacity-60',
    )}>
      {/* Image / placeholder */}
      <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative">
        <span className="text-3xl font-bold text-primary/20">{title[0]?.toUpperCase()}</span>

        {/* Position badge */}
        <span className="absolute top-2 left-2 h-6 w-6 rounded-full bg-card border border-border flex items-center justify-center text-[10px] font-bold">
          {tile.position}
        </span>

        {/* Drag handle & reorder arrows */}
        <span className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-0.5">
          {onMoveUp && (
            <button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} className="p-0.5 rounded bg-card/80 border border-border hover:bg-muted">
              <ChevronUp className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
          {onMoveDown && (
            <button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} className="p-0.5 rounded bg-card/80 border border-border hover:bg-muted">
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
        </span>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent">
          <p className="text-xs font-semibold text-white truncate">{title}</p>
          {subtitle && <p className="text-[10px] text-white/70 truncate">{subtitle}</p>}
        </div>
      </div>

      {/* Footer */}
      <div className="p-2.5 flex items-center justify-between">
        <span className={cn('text-[9px] font-semibold px-2 py-0.5 rounded-full capitalize', typeColors[tile.type])}>
          {tile.type}
        </span>
        <div className="flex items-center gap-1.5">
          <Switch
            checked={tile.is_active}
            onCheckedChange={() => onToggle?.(tile)}
            className="scale-75"
          />
          <button
            onClick={() => onEdit?.(tile)}
            className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors"
          >
            <Edit className="h-3 w-3" />
          </button>
          <button
            onClick={() => onDelete?.(tile)}
            className="p-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
