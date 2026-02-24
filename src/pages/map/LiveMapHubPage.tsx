// ──────────────────────────────────────
// Live Map Hub — Live Map + Heatmap sub-tabs
// ──────────────────────────────────────

import { useState, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

const TerminalMapPage = lazy(() => import('./TerminalMapPage'));
const HeatmapPage = lazy(() => import('../heatmap/HeatmapPage'));

type MapTab = 'live-map' | 'heatmap';

const tabs: { key: MapTab; label: string; icon: React.ElementType }[] = [
  { key: 'live-map', label: 'Live Map', icon: Map },
  { key: 'heatmap', label: 'Heatmap', icon: Flame },
];

export default function LiveMapHubPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as MapTab | null;
  const [activeTab, setActiveTab] = useState<MapTab>(
    tabParam && tabs.some((t) => t.key === tabParam) ? tabParam : 'live-map'
  );

  const handleTabChange = (tab: MapTab) => {
    setActiveTab(tab);
    setSearchParams((prev) => {
      prev.set('tab', tab);
      prev.delete('page');
      prev.delete('pageSize');
      return prev;
    }, { replace: true });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Sub-Tab Navigation */}
      <div className="border-b border-border mb-4">
        <nav className="flex gap-1 -mb-px" role="tablist">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleTabChange(tab.key)}
                className={cn(
                  'group relative flex items-center gap-2 px-4 py-3 text-sm font-lexend font-medium transition-all duration-200 whitespace-nowrap',
                  'border-b-2 -mb-[1px]',
                  isActive
                    ? 'border-brand text-brand'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
                )}
              >
                <tab.icon className={cn('h-4 w-4', isActive ? 'text-brand' : 'text-muted-foreground group-hover:text-foreground')} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <ErrorBoundary>
              <Suspense fallback={<LoadingScreen />}>
                {activeTab === 'live-map' && <TerminalMapPage />}
                {activeTab === 'heatmap' && <HeatmapPage />}
              </Suspense>
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
