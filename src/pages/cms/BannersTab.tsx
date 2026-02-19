// ──────────────────────────────────────
// Banners Tab — Phase 9
// ──────────────────────────────────────

import { useState, useMemo } from 'react';
import { BannerPreviewCard } from '@/components/cms/BannerPreviewCard';
import { useContentStore } from '@/store/content.store';
import { Plus } from 'lucide-react';
import BannerEditorModal from './BannerEditorModal';
import type { Banner } from '@/types/content.types';

export default function BannersTab() {
  const { banners, activeLanguage } = useContentStore();
  const [placementFilter, setPlacementFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editBanner, setEditBanner] = useState<Banner | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const filtered = useMemo(() => {
    return banners.filter((b) => {
      if (placementFilter !== 'all' && b.placement !== placementFilter) return false;
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;
      return true;
    });
  }, [banners, placementFilter, statusFilter]);

  const selectCls = 'h-9 rounded-md border border-border bg-background px-3 text-xs font-lexend';

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <select value={placementFilter} onChange={(e) => setPlacementFilter(e.target.value)} className={selectCls}>
          <option value="all">All Placements</option>
          <option value="home_hero">Home Hero</option>
          <option value="gate_notification">Gate Notification</option>
          <option value="category_header">Category Header</option>
          <option value="interstitial">Interstitial</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectCls}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="scheduled">Scheduled</option>
          <option value="draft">Draft</option>
          <option value="inactive">Inactive</option>
        </select>
        <div className="flex-1" />
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> New Banner
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((banner) => (
          <BannerPreviewCard
            key={banner.id}
            banner={banner}
            activeLang={activeLanguage}
            onEdit={setEditBanner}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm text-muted-foreground">No banners match your filters.</div>
        )}
      </div>

      {/* Editor Modal */}
      <BannerEditorModal
        banner={editBanner}
        open={!!editBanner || showCreate}
        onOpenChange={(open) => {
          if (!open) { setEditBanner(null); setShowCreate(false); }
        }}
      />
    </div>
  );
}
