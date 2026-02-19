// ──────────────────────────────────────
// Trolley Hub — Unified Trolley Management
// Sub-tabs: Fleet Overview | Live Tracking | Health Monitor
// ──────────────────────────────────────

import { useState, useEffect, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Radio,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

const TrolleyListPage = lazy(() => import('./TrolleyListPage'));
const LiveFleetPage = lazy(() => import('../ops/LiveFleetPage'));
const HealthMonitoringPage = lazy(() => import('../ops/HealthMonitoringPage'));

type TrolleyTab = 'fleet' | 'live-tracking' | 'health';

const tabs: { key: TrolleyTab; label: string; icon: React.ElementType; description: string }[] = [
  { key: 'fleet', label: 'Fleet Overview', icon: ShoppingCart, description: 'Manage trolley fleet inventory' },
  { key: 'live-tracking', label: 'Live Tracking', icon: Radio, description: 'Real-time device positions' },
  { key: 'health', label: 'Health Monitor', icon: Activity, description: 'Fleet health & diagnostics' },
];

export default function TrolleyHubPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as TrolleyTab | null;
  const deviceParam = searchParams.get('device');
  const [activeTab, setActiveTab] = useState<TrolleyTab>(
    tabParam && tabs.some((t) => t.key === tabParam) ? tabParam : 'fleet'
  );

  // Sync activeTab when URL search params change (e.g. from embedded child navigation)
  useEffect(() => {
    if (tabParam && tabs.some((t) => t.key === tabParam) && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTabChange = (tab: TrolleyTab) => {
    setActiveTab(tab);
    // Preserve device param when switching to live-tracking, otherwise clear it
    if (tab === 'live-tracking' && deviceParam) {
      setSearchParams({ tab, device: deviceParam }, { replace: true });
    } else {
      setSearchParams({ tab }, { replace: true });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Hub Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-montserrat text-foreground flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-brand" />
          Trolley Management
        </h1>
        <p className="text-sm text-muted-foreground font-lexend mt-1">
          Unified fleet management, live tracking, and health monitoring
        </p>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="border-b border-border mb-6">
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
                  'group relative flex items-center gap-2 px-4 py-3 text-sm font-lexend font-medium transition-all duration-200',
                  'border-b-2 -mb-[1px]',
                  isActive
                    ? 'border-brand text-brand'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
                )}
              >
                <tab.icon className={cn('h-4 w-4', isActive ? 'text-brand' : 'text-muted-foreground group-hover:text-foreground')} />
                <span>{tab.label}</span>
                {tab.key === 'live-tracking' && (
                  <span className="flex h-2 w-2 ml-1">
                    <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-brand opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
                  </span>
                )}
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
                {activeTab === 'fleet' && <TrolleyListPage embedded />}
                {activeTab === 'live-tracking' && <LiveFleetPage embedded initialDeviceId={deviceParam} />}
                {activeTab === 'health' && <HealthMonitoringPage embedded />}
              </Suspense>
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
