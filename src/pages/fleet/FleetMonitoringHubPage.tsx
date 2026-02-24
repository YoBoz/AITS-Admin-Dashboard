// ──────────────────────────────────────
// Fleet Monitoring Hub — Live Fleet + Trolley Management + Overview
// ──────────────────────────────────────

import { useState, useEffect, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

const LiveFleetPage = lazy(() => import('../ops/LiveFleetPage'));
const TrolleyListPage = lazy(() => import('../trolleys/TrolleyListPage'));

type FleetTab = 'live-fleet' | 'trolleys';

const tabs: { key: FleetTab; label: string; icon: React.ElementType }[] = [
  { key: 'live-fleet', label: 'Live Fleet', icon: Radio },
  { key: 'trolleys', label: 'Trolley Management', icon: ShoppingCart },
];

export default function FleetMonitoringHubPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as FleetTab | null;
  const deviceParam = searchParams.get('device');
  const [activeTab, setActiveTab] = useState<FleetTab>(
    tabParam && tabs.some((t) => t.key === tabParam) ? tabParam : 'live-fleet'
  );

  useEffect(() => {
    if (tabParam && tabs.some((t) => t.key === tabParam) && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTabChange = (tab: FleetTab) => {
    setActiveTab(tab);
    setSearchParams((prev) => {
      prev.set('tab', tab);
      if (tab === 'live-fleet' && deviceParam) {
        prev.set('device', deviceParam);
      } else {
        prev.delete('device');
      }
      prev.delete('page');
      prev.delete('pageSize');
      return prev;
    }, { replace: true });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-bold font-montserrat text-foreground flex items-center gap-2">
          <Radio className="h-6 w-6 text-brand" />
          Fleet Monitoring
        </h1>
        <p className="text-sm text-muted-foreground font-lexend mt-1">
          Real-time fleet tracking and trolley management
        </p>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="border-b border-border mb-4">
        <nav className="flex gap-1 -mb-px overflow-x-auto" role="tablist">
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
                {activeTab === 'live-fleet' && <LiveFleetPage embedded initialDeviceId={deviceParam} />}
                {activeTab === 'trolleys' && <TrolleyListPage embedded />}
              </Suspense>
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
