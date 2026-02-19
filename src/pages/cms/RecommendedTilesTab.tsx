// ──────────────────────────────────────
// Recommended Tiles Tab — Phase 9
// ──────────────────────────────────────

import { useState, useMemo, useCallback } from 'react';
import { TilePreviewCard } from '@/components/cms/TilePreviewCard';
import { useContentStore } from '@/store/content.store';
import { Plus } from 'lucide-react';
import TileEditorModal from './TileEditorModal';
import type { RecommendedTile } from '@/types/content.types';

export default function RecommendedTilesTab() {
  const { recommendedTiles, updateTile, deleteTile } = useContentStore();
  const [placementFilter, setPlacementFilter] = useState('all');
  const [editTile, setEditTile] = useState<RecommendedTile | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const filtered = useMemo(() => {
    const sorted = [...recommendedTiles].sort((a, b) => a.position - b.position);
    if (placementFilter === 'all') return sorted;
    return sorted.filter((t) => t.placement === placementFilter);
  }, [recommendedTiles, placementFilter]);

  const handleMoveUp = useCallback(
    (tile: RecommendedTile) => {
      if (tile.position <= 1) return;
      updateTile(tile.id, { position: tile.position - 1 });
    },
    [updateTile],
  );

  const handleMoveDown = useCallback(
    (tile: RecommendedTile) => {
      updateTile(tile.id, { position: tile.position + 1 });
    },
    [updateTile],
  );

  const selectCls = 'h-9 rounded-md border border-border bg-background px-3 text-xs font-lexend';

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <select value={placementFilter} onChange={(e) => setPlacementFilter(e.target.value)} className={selectCls}>
          <option value="all">All Placements</option>
          <option value="home_grid">Home Grid</option>
          <option value="sidebar_widget">Sidebar Widget</option>
          <option value="post_checkin">Post Check-in</option>
        </select>
        <div className="flex-1" />
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> New Tile
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
        {filtered.map((tile) => (
          <TilePreviewCard
            key={tile.id}
            tile={tile}
            onEdit={setEditTile}
            onToggle={() => updateTile(tile.id, { is_active: !tile.is_active })}
            onDelete={() => deleteTile(tile.id)}
            onMoveUp={() => handleMoveUp(tile)}
            onMoveDown={() => handleMoveDown(tile)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm text-muted-foreground">No tiles match your filter.</div>
        )}
      </div>

      {/* Notes */}
      <p className="text-xs text-muted-foreground">
        Use the up/down arrows on each tile to reorder. Positions are saved automatically.
      </p>

      {/* Editor Modal */}
      <TileEditorModal
        tile={editTile}
        open={!!editTile || showCreate}
        onOpenChange={(open) => {
          if (!open) { setEditTile(null); setShowCreate(false); }
        }}
      />
    </div>
  );
}
