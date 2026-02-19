// ──────────────────────────────────────
// Content Management Page — Phase 9
// ──────────────────────────────────────

import { useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/common/PageHeader';
import { Image, LayoutGrid, Languages } from 'lucide-react';
import { cn } from '@/lib/utils';

const BannersTab = lazy(() => import('./BannersTab'));
const RecommendedTilesTab = lazy(() => import('./RecommendedTilesTab'));
const MultilingualCopyTab = lazy(() => import('./MultilingualCopyTab'));

const tabs = [
  { id: 'banners', label: 'Banners', icon: Image },
  { id: 'tiles', label: 'Recommended Tiles', icon: LayoutGrid },
  { id: 'copy', label: 'Multilingual Copy', icon: Languages },
];

export default function ContentManagementPage({ embedded }: { embedded?: boolean }) {
  const [activeTab, setActiveTab] = useState('banners');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {!embedded && (
        <PageHeader
          title="Content Management"
          subtitle="Manage banners, recommended tiles, and passenger-facing copy"
        />
      )}

      {/* Tab bar */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-border pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-lexend whitespace-nowrap border-b-2 transition-colors',
                active
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30',
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <Suspense fallback={<div className="py-12 text-center text-sm text-muted-foreground">Loading…</div>}>
        {activeTab === 'banners' && <BannersTab />}
        {activeTab === 'tiles' && <RecommendedTilesTab />}
        {activeTab === 'copy' && <MultilingualCopyTab />}
      </Suspense>
    </motion.div>
  );
}
