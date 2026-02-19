// ──────────────────────────────────────
// Banner Preview Card — Phase 9
// ──────────────────────────────────────

import { cn } from '@/lib/utils';
import type { Banner } from '@/types/content.types';

const statusColors: Record<Banner['status'], string> = {
  active: 'bg-green-500/10 text-green-700 dark:text-green-400',
  scheduled: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  draft: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
  inactive: 'bg-red-500/10 text-red-700 dark:text-red-400',
};

const placementLabels: Record<Banner['placement'], string> = {
  home_hero: 'Home Hero',
  gate_notification: 'Gate Notification',
  category_header: 'Category Header',
  interstitial: 'Interstitial',
};

const languages = ['en', 'ar', 'fr'];
const langLabels: Record<string, string> = { en: 'EN', ar: 'AR', fr: 'FR' };

interface Props {
  banner: Banner;
  activeLang?: string;
  onEdit?: (banner: Banner) => void;
}

export function BannerPreviewCard({ banner, activeLang = 'en', onEdit }: Props) {
  const content = banner.content[activeLang] || banner.content.en || { title: '', body: '', cta_text: '', cta_link: '' };

  const langStatus = (lang: string) => {
    const c = banner.content[lang];
    if (!c) return 'red';
    if (c.title && c.body && c.cta_text) return 'green';
    if (c.title || c.body) return 'amber';
    return 'red';
  };

  return (
    <div
      className="group rounded-xl border border-border bg-card overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onEdit?.(banner)}
    >
      {/* Banner preview area — 16:5 ratio */}
      <div className="relative aspect-[16/5] bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex flex-col justify-center p-4">
        <span className={cn('absolute top-2 right-2 text-[9px] font-semibold px-2 py-0.5 rounded-full', statusColors[banner.status])}>
          {banner.status}
        </span>
        <h3 className="text-sm font-bold font-lexend text-foreground truncate">{content.title || 'Untitled'}</h3>
        {content.cta_text && (
          <span className="mt-1 inline-block text-[10px] font-medium px-3 py-1 rounded-full bg-primary text-primary-foreground w-fit">
            {content.cta_text}
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="p-3 space-y-2">
        <p className="text-xs font-medium font-lexend text-foreground truncate">{banner.name}</p>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            {placementLabels[banner.placement]}
          </span>
          {banner.start_date && banner.end_date && (
            <span className="text-[10px] text-muted-foreground">
              {new Date(banner.start_date).toLocaleDateString()} — {new Date(banner.end_date).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Language completion */}
        <div className="flex items-center gap-2">
          {languages.map((lang) => {
            const s = langStatus(lang);
            return (
              <div key={lang} className="flex items-center gap-1">
                <span className={cn(
                  'h-2 w-2 rounded-full',
                  s === 'green' ? 'bg-green-500' : s === 'amber' ? 'bg-amber-500' : 'bg-red-500',
                )} />
                <span className="text-[10px] text-muted-foreground">{langLabels[lang]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
