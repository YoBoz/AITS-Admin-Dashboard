// ──────────────────────────────────────
// Banner Editor Modal — Phase 9
// ──────────────────────────────────────

import { useState, useEffect } from 'react';
import { FormModal } from '@/components/common/FormModal';
import { Input } from '@/components/ui/Input';
import { useContentStore } from '@/store/content.store';
import { toast } from 'sonner';
import type { Banner, BannerStatus } from '@/types/content.types';

interface Props {
  banner: Banner | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const emptyContent = () => ({ title: '', body: '', cta_text: '', cta_link: '' });

const EMPTY: Omit<Banner, 'id' | 'created_at'> = {
  name: '',
  content: { en: emptyContent(), ar: emptyContent(), fr: emptyContent() },
  image_url: '/images/placeholder.jpg',
  target_zones: [],
  target_gates: [],
  placement: 'home_hero',
  status: 'draft',
  priority: 10,
  start_date: new Date().toISOString().slice(0, 10),
  end_date: null,
  created_by: 'Current Admin',
};

export default function BannerEditorModal({ banner, open, onOpenChange }: Props) {
  const { addBanner, updateBanner } = useContentStore();
  const isEdit = !!banner;

  const [form, setForm] = useState<typeof EMPTY>(EMPTY);

  useEffect(() => {
    if (banner) {
      setForm({
        name: banner.name,
        content: { ...banner.content },
        image_url: banner.image_url,
        target_zones: [...banner.target_zones],
        target_gates: [...banner.target_gates],
        placement: banner.placement,
        status: banner.status,
        priority: banner.priority,
        start_date: banner.start_date,
        end_date: banner.end_date,
        created_by: banner.created_by,
      });
    } else {
      setForm(EMPTY);
    }
  }, [banner, open]);

  const set = <K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setContent = (lang: string, field: string, value: string) =>
    setForm((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [lang]: { ...(prev.content[lang] || emptyContent()), [field]: value },
      },
    }));

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error('Banner name is required');
      return;
    }
    if (!form.content.en?.title.trim()) {
      toast.error('English title is required');
      return;
    }

    if (isEdit && banner) {
      updateBanner(banner.id, form);
      toast.success('Banner updated');
    } else {
      addBanner({
        ...form,
        id: `BNR-${Date.now().toString(36).toUpperCase()}`,
        created_at: new Date().toISOString(),
      });
      toast.success('Banner created');
    }
    onOpenChange(false);
  };

  const selectCls = 'h-9 rounded-md border border-border bg-background px-3 text-xs font-lexend w-full';

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit Banner' : 'New Banner'}
      size="xl"
      footer={
        <div className="flex justify-end gap-3">
          <button onClick={() => onOpenChange(false)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">{isEdit ? 'Save Changes' : 'Create Banner'}</button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — Form */}
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Banner Name*</label>
            <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Banner name" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Title (EN)*</label>
            <Input value={form.content.en?.title || ''} onChange={(e) => setContent('en', 'title', e.target.value)} placeholder="English title" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Title (AR)</label>
            <Input dir="rtl" value={form.content.ar?.title || ''} onChange={(e) => setContent('ar', 'title', e.target.value)} placeholder="العنوان بالعربية" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Title (FR)</label>
            <Input value={form.content.fr?.title || ''} onChange={(e) => setContent('fr', 'title', e.target.value)} placeholder="Titre en français" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Placement</label>
              <select value={form.placement} onChange={(e) => set('placement', e.target.value as Banner['placement'])} className={selectCls}>
                <option value="home_hero">Home Hero</option>
                <option value="gate_notification">Gate Notification</option>
                <option value="category_header">Category Header</option>
                <option value="interstitial">Interstitial</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Status</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value as BannerStatus)} className={selectCls}>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="scheduled">Scheduled</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Body (EN)</label>
              <Input value={form.content.en?.body || ''} onChange={(e) => setContent('en', 'body', e.target.value)} placeholder="Body text" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">CTA Text (EN)</label>
              <Input value={form.content.en?.cta_text || ''} onChange={(e) => setContent('en', 'cta_text', e.target.value)} placeholder="Button label" />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">CTA Link (EN)</label>
            <Input value={form.content.en?.cta_link || ''} onChange={(e) => setContent('en', 'cta_link', e.target.value)} placeholder="URL or ID" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Priority</label>
              <Input type="number" value={form.priority} onChange={(e) => set('priority', parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Start Date</label>
              <Input type="date" value={form.start_date ?? ''} onChange={(e) => set('start_date', e.target.value || null)} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">End Date</label>
              <Input type="date" value={form.end_date ?? ''} onChange={(e) => set('end_date', e.target.value || null)} />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Image URL</label>
            <Input value={form.image_url ?? ''} onChange={(e) => set('image_url', e.target.value || null)} placeholder="https://..." />
          </div>
        </div>

        {/* Right — Preview */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground">Live Preview</h4>
          <div className="relative w-full overflow-hidden rounded-xl border border-border bg-muted/30" style={{ aspectRatio: '16 / 5' }}>
            <img
              src={form.image_url ?? '/images/placeholder.jpg'}
              alt="preview"
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <p className="text-white text-sm font-semibold drop-shadow-sm">
                {form.content.en?.title || 'Banner Title'}
              </p>
            </div>
          </div>

          {/* Multilingual Preview */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground">Multilingual Titles</h4>
            {(['en', 'ar', 'fr'] as const).map((lang) => (
              <div key={lang} className="flex items-center gap-2 text-xs">
                <span className="w-6 text-muted-foreground uppercase font-mono">{lang}</span>
                <span className={`${lang === 'ar' ? 'text-right dir-rtl' : ''} ${form.content[lang]?.title ? '' : 'text-muted-foreground italic'}`}>
                  {form.content[lang]?.title || '(empty)'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FormModal>
  );
}
