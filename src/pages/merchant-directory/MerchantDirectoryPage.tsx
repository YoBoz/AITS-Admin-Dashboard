// ──────────────────────────────────────
// Merchant Directory Page — Phase 9
// ──────────────────────────────────────

import { useState, Suspense, lazy, useMemo } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { MerchantApprovalCard } from '@/components/merchant-directory/MerchantApprovalCard';
import {
  pendingMerchantsData,
  merchantPerformanceData,
  type PendingMerchant,
} from '@/data/mock/merchant-directory.mock';
import { Building2, Clock, Star, Search, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/Input';

const MerchantApprovalModal = lazy(() => import('./MerchantApprovalModal'));
const MerchantDetailModal = lazy(() => import('./MerchantDetailModal'));

type Tab = 'active' | 'pending' | 'suspended';

export default function MerchantDirectoryPage({ embedded }: { embedded?: boolean }) {
  const [activeTab, setActiveTab] = useState<Tab>('pending');
  const [search, setSearch] = useState('');
  const [selectedPending, setSelectedPending] = useState<PendingMerchant | null>(null);
  const [showDetail, setShowDetail] = useState<string | null>(null);

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'pending', label: 'Pending Approval', count: pendingMerchantsData.length },
    { id: 'active', label: 'Active Merchants', count: merchantPerformanceData.length },
    { id: 'suspended', label: 'Suspended' },
  ];

  // Stats
  const avgScore = useMemo(() => {
    const scores = merchantPerformanceData.map((m) => m.performance_score);
    return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  }, []);

  const slaBreeches = useMemo(
    () => merchantPerformanceData.filter((m) => m.sla_breach_pct > 10).length,
    [],
  );

  const filteredPending = useMemo(() => {
    if (!search) return pendingMerchantsData;
    const q = search.toLowerCase();
    return pendingMerchantsData.filter(
      (m) => m.company_name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q),
    );
  }, [search]);

  const filteredPerformance = useMemo(() => {
    return merchantPerformanceData;
  }, []);

  const stats = [
    { label: 'Pending Applications', value: pendingMerchantsData.length, icon: Clock, color: 'text-amber-600 dark:text-amber-400' },
    { label: 'Active Merchants', value: merchantPerformanceData.length, icon: Building2, color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Avg Performance Score', value: avgScore, icon: Star, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'SLA Breeches (>10%)', value: slaBreeches, icon: AlertTriangle, color: slaBreeches > 0 ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground' },
  ];

  return (
    <div className="space-y-6">
      {!embedded && (
        <PageHeader
          title="Merchant Directory"
          subtitle="Manage merchant onboarding, performance, and SLA compliance."
        />
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted/50">
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-lg font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-muted text-[10px]">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Pending Tab */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search applications..."
              className="pl-9 h-9 text-xs"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredPending.map((m) => (
              <MerchantApprovalCard key={m.id} merchant={m} onReview={setSelectedPending} />
            ))}
            {filteredPending.length === 0 && (
              <div className="col-span-full py-12 text-center text-sm text-muted-foreground">No pending applications.</div>
            )}
          </div>
        </div>
      )}

      {/* Active Tab */}
      {activeTab === 'active' && (
        <SectionCard title="Active Merchants">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Shop ID</th>
                  <th className="pb-2 pr-4 font-medium">Orders (Month)</th>
                  <th className="pb-2 pr-4 font-medium">Accept SLA</th>
                  <th className="pb-2 pr-4 font-medium">Refund Threshold</th>
                  <th className="pb-2 pr-4 font-medium">SLA Breach %</th>
                  <th className="pb-2 pr-4 font-medium">Score</th>
                  <th className="pb-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPerformance.map((m) => {
                  const scoreColor =
                    m.performance_score >= 90 ? 'text-emerald-600 dark:text-emerald-400' :
                    m.performance_score >= 70 ? 'text-amber-600 dark:text-amber-400' :
                    'text-red-600 dark:text-red-400';
                  const breachColor = m.sla_breach_pct > 10 ? 'text-red-600 dark:text-red-400' : '';

                  return (
                    <tr key={m.shop_id} className="hover:bg-muted/30">
                      <td className="py-2.5 pr-4 font-mono">{m.shop_id}</td>
                      <td className="py-2.5 pr-4">{m.orders_this_month}</td>
                      <td className="py-2.5 pr-4">{m.acceptance_sla_seconds}s</td>
                      <td className="py-2.5 pr-4">AED {m.refund_threshold}</td>
                      <td className={`py-2.5 pr-4 ${breachColor}`}>{m.sla_breach_pct}%</td>
                      <td className={`py-2.5 pr-4 font-semibold ${scoreColor}`}>{m.performance_score}</td>
                      <td className="py-2.5">
                        <button
                          onClick={() => setShowDetail(m.shop_id)}
                          className="text-primary hover:underline text-xs"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* Suspended Tab */}
      {activeTab === 'suspended' && (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No merchants are currently suspended.
        </div>
      )}

      {/* Modals */}
      <Suspense fallback={null}>
        {selectedPending && (
          <MerchantApprovalModal
            merchant={selectedPending}
            open={!!selectedPending}
            onOpenChange={(open) => { if (!open) setSelectedPending(null); }}
          />
        )}
        {showDetail && (
          <MerchantDetailModal
            shopId={showDetail}
            open={!!showDetail}
            onOpenChange={(open) => { if (!open) setShowDetail(null); }}
          />
        )}
      </Suspense>
    </div>
  );
}
