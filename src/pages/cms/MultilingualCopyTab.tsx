// ──────────────────────────────────────
// Multilingual Copy Tab — Phase 9
// ──────────────────────────────────────

import { useState, useMemo } from 'react';
import { LanguageTabBar } from '@/components/cms/LanguageTabBar';
import { CopyEditorRow } from '@/components/cms/CopyEditorRow';
import { SectionCard } from '@/components/common/SectionCard';
import { useContentStore } from '@/store/content.store';
import { Upload, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'navigation', label: 'Navigation' },
  { value: 'notifications', label: 'Notifications' },
  { value: 'messages', label: 'Messages' },
  { value: 'labels', label: 'Labels' },
  { value: 'errors', label: 'Errors' },
];

export default function MultilingualCopyTab() {
  const { copyEntries, activeLanguage, setActiveLanguage, updateCopyEntry, publishAllDrafts } = useContentStore();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return copyEntries.filter((e) => {
      if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return e.key.toLowerCase().includes(q) || (e.translations.en || '').toLowerCase().includes(q);
      }
      return true;
    });
  }, [copyEntries, categoryFilter, search]);

  const draftCount = useMemo(
    () => copyEntries.filter((e) => !e.is_published).length,
    [copyEntries],
  );

  const completionStats = useMemo(() => {
    const total = copyEntries.length;
    const enFilled = copyEntries.filter((e) => (e.translations.en || '').trim() !== '').length;
    const arFilled = copyEntries.filter((e) => (e.translations.ar || '').trim() !== '').length;
    const frFilled = copyEntries.filter((e) => (e.translations.fr || '').trim() !== '').length;
    return {
      en: total > 0 ? Math.round((enFilled / total) * 100) : 0,
      ar: total > 0 ? Math.round((arFilled / total) * 100) : 0,
      fr: total > 0 ? Math.round((frFilled / total) * 100) : 0,
    };
  }, [copyEntries]);

  const handleSave = (key: string, lang: string, value: string) => {
    updateCopyEntry(key, lang, value);
    toast.success('Copy updated');
  };

  const handlePublishAll = () => {
    publishAllDrafts();
    toast.success(`Published ${draftCount} draft entries`);
  };

  const selectCls = 'h-9 rounded-md border border-border bg-background px-3 text-xs font-lexend';

  return (
    <div className="space-y-5">
      {/* Language Tabs */}
      <LanguageTabBar
        activeLanguage={activeLanguage}
        onLanguageChange={setActiveLanguage}
        completionStats={completionStats}
      />

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Search keys or values..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 w-64 rounded-md border border-border bg-background px-3 text-xs font-lexend placeholder:text-muted-foreground"
        />
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={selectCls}>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <div className="flex-1" />
        <button
          className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg border border-border hover:bg-muted/50 transition-colors"
        >
          <Upload className="h-3.5 w-3.5" /> Import CSV
        </button>
        {draftCount > 0 && (
          <button
            onClick={handlePublishAll}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            <CheckCircle className="h-3.5 w-3.5" /> Publish All Drafts ({draftCount})
          </button>
        )}
      </div>

      {/* Table */}
      <SectionCard title={`Copy Entries — ${activeLanguage.toUpperCase()}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-2 pr-3 font-medium w-40">Key</th>
                <th className="pb-2 pr-3 font-medium w-48">English (Reference)</th>
                <th className="pb-2 pr-3 font-medium flex-1">{activeLanguage === 'en' ? 'Value' : `${activeLanguage.toUpperCase()} Translation`}</th>
                <th className="pb-2 pr-3 font-medium w-24">Status</th>
                <th className="pb-2 font-medium w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((entry) => (
                <CopyEditorRow
                  key={entry.key}
                  entry={entry}
                  activeLanguage={activeLanguage}
                  onSave={handleSave}
                />
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">No entries match your filters.</div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
