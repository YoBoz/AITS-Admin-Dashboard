// ──────────────────────────────────────
// Global Rules Page — Phase 9
// ──────────────────────────────────────

import { useState, Suspense, lazy } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { Ticket, ShieldAlert, Timer } from 'lucide-react';

const CouponRulesTab = lazy(() => import('./CouponRulesTab'));
const FraudLimitsTab = lazy(() => import('./FraudLimitsTab'));
const ExpiryRulesTab = lazy(() => import('./ExpiryRulesTab'));

type Tab = 'coupons' | 'fraud' | 'expiry';

const tabs: { id: Tab; label: string; icon: typeof Ticket }[] = [
  { id: 'coupons', label: 'Coupon Rules', icon: Ticket },
  { id: 'fraud', label: 'Fraud Limits', icon: ShieldAlert },
  { id: 'expiry', label: 'Expiry & Retention', icon: Timer },
];

interface GlobalRulesPageProps {
  embedded?: boolean;
}

export default function GlobalRulesPage({ embedded }: GlobalRulesPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>('coupons');

  return (
    <div className="space-y-6">
      {!embedded && (
        <PageHeader
          title="Global Rules"
          subtitle="Configure platform-wide coupon constraints, fraud limits, and data retention policies."
        />
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
        {activeTab === 'coupons' && <CouponRulesTab />}
        {activeTab === 'fraud' && <FraudLimitsTab />}
        {activeTab === 'expiry' && <ExpiryRulesTab />}
      </Suspense>
    </div>
  );
}
