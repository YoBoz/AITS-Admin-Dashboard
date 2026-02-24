// ──────────────────────────────────────
// Merchant Management Hub — Shops, Merchant Directory, Notifications
// ──────────────────────────────────────

import { useState, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  Warehouse,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

const ShopListPage = lazy(() => import('./ShopListPage'));
const MerchantDirectoryPage = lazy(() => import('../merchant-directory/MerchantDirectoryPage'));

type ShopTab = 'shops' | 'merchants';

const tabs: { key: ShopTab; label: string; icon: React.ElementType; description: string }[] = [
  { key: 'shops', label: 'Shops & Contracts', icon: Store, description: 'Manage shop inventory and contracts' },
  { key: 'merchants', label: 'Merchant Directory', icon: Warehouse, description: 'Browse and manage merchants' },
];

export default function ShopHubPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as ShopTab | null;
  const [activeTab, setActiveTab] = useState<ShopTab>(
    tabParam && tabs.some((t) => t.key === tabParam) ? tabParam : 'shops'
  );

  const handleTabChange = (tab: ShopTab) => {
    setActiveTab(tab);
    setSearchParams((prev) => {
      prev.set('tab', tab);
      // Reset pagination when switching tabs
      prev.delete('page');
      prev.delete('pageSize');
      return prev;
    }, { replace: true });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Hub Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-montserrat text-foreground flex items-center gap-2">
          <Store className="h-6 w-6 text-brand" />
          Merchant Management
        </h1>
        <p className="text-sm text-muted-foreground font-lexend mt-1">
          Shops and merchant directory management
        </p>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="border-b border-border mb-6">
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
                {activeTab === 'shops' && <ShopListPage embedded />}
                {activeTab === 'merchants' && <MerchantDirectoryPage />}
              </Suspense>
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
