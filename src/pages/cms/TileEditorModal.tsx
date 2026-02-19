// ──────────────────────────────────────
// Tile Editor Modal — Phase 9
// ──────────────────────────────────────

import { useState, useEffect } from 'react';
import { FormModal } from '@/components/common/FormModal';
import { Input } from '@/components/ui/Input';
import { useContentStore } from '@/store/content.store';
import { toast } from 'sonner';
import type { RecommendedTile } from '@/types/content.types';

interface Props {
  tile: RecommendedTile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EMPTY: Omit<RecommendedTile, 'id'> = {
  type: 'shop',
  entity_id: null,
  title: { en: '', ar: '', fr: '' },
  subtitle: { en: '', ar: '', fr: '' },
  image_url: '/images/placeholder.jpg',
  placement: 'home_grid',
  position: 1,
  target_gates: [],
  is_active: true,
};

export default function TileEditorModal({ tile, open, onOpenChange }: Props) {
  const { addTile, updateTile } = useContentStore();
  const isEdit = !!tile;

  const [form, setForm] = useState<typeof EMPTY>(EMPTY);

  useEffect(() => {
    if (tile) {
      setForm({
        type: tile.type,
        entity_id: tile.entity_id,
        title: { ...tile.title },
        subtitle: { ...tile.subtitle },
        image_url: tile.image_url,
        placement: tile.placement,
        position: tile.position,
        target_gates: [...tile.target_gates],
        is_active: tile.is_active,
      });
    } else {
      setForm(EMPTY);
    }
  }, [tile, open]);

  const set = <K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setTitle = (lang: 'en' | 'ar' | 'fr', value: string) =>
    setForm((prev) => ({ ...prev, title: { ...prev.title, [lang]: value } }));

  const handleSubmit = () => {
    if (!form.title.en.trim()) {
      toast.error('English title is required');
      return;
    }

    if (isEdit && tile) {
      updateTile(tile.id, form);
      toast.success('Tile updated');
    } else {
      addTile({
        ...form,
        id: `TILE-${Date.now().toString(36).toUpperCase()}`,
      });
      toast.success('Tile created');
    }
    onOpenChange(false);
  };

  const selectCls = 'h-9 rounded-md border border-border bg-background px-3 text-xs font-lexend w-full';

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit Tile' : 'New Tile'}
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <button onClick={() => onOpenChange(false)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">{isEdit ? 'Save Changes' : 'Create Tile'}</button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Type</label>
            <select value={form.type} onChange={(e) => set('type', e.target.value as RecommendedTile['type'])} className={selectCls}>
              <option value="shop">Shop</option>
              <option value="category">Category</option>
              <option value="offer">Offer</option>
              <option value="navigation">Navigation</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Entity ID</label>
            <Input value={form.entity_id ?? ''} onChange={(e) => set('entity_id', e.target.value || null)} placeholder="e.g. SHP-001" />
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Title (EN)*</label>
          <Input value={form.title.en} onChange={(e) => setTitle('en', e.target.value)} placeholder="English title" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Title (AR)</label>
            <Input dir="rtl" value={form.title.ar} onChange={(e) => setTitle('ar', e.target.value)} placeholder="العنوان بالعربية" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Title (FR)</label>
            <Input value={form.title.fr} onChange={(e) => setTitle('fr', e.target.value)} placeholder="Titre en français" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Placement</label>
            <select value={form.placement} onChange={(e) => set('placement', e.target.value as RecommendedTile['placement'])} className={selectCls}>
              <option value="home_grid">Home Grid</option>
              <option value="sidebar_widget">Sidebar Widget</option>
              <option value="post_checkin">Post Check-in</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Position</label>
            <Input type="number" min={1} value={form.position} onChange={(e) => set('position', parseInt(e.target.value) || 1)} />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => set('is_active', e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              Active
            </label>
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Image URL</label>
          <Input value={form.image_url ?? ''} onChange={(e) => set('image_url', e.target.value || null)} placeholder="https://..." />
        </div>

        {/* Preview */}
        <div className="flex items-center gap-4 pt-2 border-t border-border">
          <div className="w-20 h-20 rounded-lg overflow-hidden border border-border bg-muted/30 flex-shrink-0">
            <img
              src={form.image_url ?? '/images/placeholder.jpg'}
              alt="preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
              }}
            />
          </div>
          <div className="text-xs space-y-1">
            <p className="font-semibold">{form.title.en || 'Tile Title'}</p>
            <p className="text-muted-foreground">{form.type} · Position #{form.position}</p>
            <p className="text-muted-foreground">{form.placement.replace(/_/g, ' ')}</p>
          </div>
        </div>
      </div>
    </FormModal>
  );
}
