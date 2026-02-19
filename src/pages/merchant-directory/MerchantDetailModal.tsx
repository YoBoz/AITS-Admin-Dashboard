// ──────────────────────────────────────
// Merchant Detail Modal — Phase 9
// ──────────────────────────────────────

import { useState, useMemo } from 'react';
import { FormModal } from '@/components/common/FormModal';
import { SectionCard } from '@/components/common/SectionCard';
import { merchantPerformanceData } from '@/data/mock/merchant-directory.mock';
import { BarChart3, Clock, ShieldAlert, TrendingUp, Activity } from 'lucide-react';

interface Props {
  shopId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type DetailTab = 'info' | 'sla' | 'performance' | 'contract';

export default function MerchantDetailModal({ shopId, open, onOpenChange }: Props) {
  const [activeTab, setActiveTab] = useState<DetailTab>('performance');

  const perf = useMemo(
    () => merchantPerformanceData.find((m) => m.shop_id === shopId),
    [shopId],
  );

  const tabs: { id: DetailTab; label: string }[] = [
    { id: 'info', label: 'Info' },
    { id: 'sla', label: 'SLA Config' },
    { id: 'performance', label: 'Performance' },
    { id: 'contract', label: 'Contract' },
  ];

  const scoreColor = !perf ? ''
    : perf.performance_score >= 90 ? 'text-emerald-600 dark:text-emerald-400'
    : perf.performance_score >= 70 ? 'text-amber-600 dark:text-amber-400'
    : 'text-red-600 dark:text-red-400';

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={`Merchant Details — ${shopId}`}
      size="xl"
      footer={
        <div className="flex justify-end gap-3">
          <button onClick={() => onOpenChange(false)} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Close</button>
        </div>
      }
    >
      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Info Tab */}
      {activeTab === 'info' && (
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-muted-foreground">Shop ID</label>
              <p className="font-mono font-semibold mt-0.5">{shopId}</p>
            </div>
            <div>
              <label className="text-muted-foreground">Status</label>
              <p className="mt-0.5">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-medium">
                  Active
                </span>
              </p>
            </div>
          </div>
          <p className="text-muted-foreground">
            Full merchant info is available through the Shops page for real-time operational data.
          </p>
        </div>
      )}

      {/* SLA Tab */}
      {activeTab === 'sla' && perf && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <SectionCard title="Acceptance SLA">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-lg font-bold">{perf.acceptance_sla_seconds}s</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Max time to accept incoming orders</p>
            </SectionCard>
            <SectionCard title="Refund Threshold">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-500" />
                <span className="text-lg font-bold">AED {perf.refund_threshold}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Auto-refund limit without approval</p>
            </SectionCard>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
            SLA values can be adjusted by super admins through the Global Rules &gt; Fraud Limits section.
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && perf && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Orders (Month)', value: perf.orders_this_month, icon: BarChart3, color: 'text-blue-500' },
              { label: 'SLA Breach', value: `${perf.sla_breach_pct}%`, icon: Activity, color: perf.sla_breach_pct > 10 ? 'text-red-500' : 'text-muted-foreground' },
              { label: 'Accept SLA', value: `${perf.acceptance_sla_seconds}s`, icon: Clock, color: 'text-muted-foreground' },
              { label: 'Score', value: perf.performance_score, icon: TrendingUp, color: scoreColor },
            ].map((s) => (
              <div key={s.label} className="p-3 rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                  <span className="text-lg font-bold">{s.value}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Score bar */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Performance Score</span>
              <span className={`font-bold ${scoreColor}`}>{perf.performance_score}/100</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  perf.performance_score >= 90 ? 'bg-emerald-500' :
                  perf.performance_score >= 70 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${perf.performance_score}%` }}
              />
            </div>
          </div>

          {perf.sla_breach_pct > 10 && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs text-red-800 dark:text-red-300">
              <strong>Warning:</strong> SLA breach rate exceeds 10%. Consider reviewing merchant operational capacity or adjusting SLA thresholds.
            </div>
          )}
        </div>
      )}

      {/* Contract Tab */}
      {activeTab === 'contract' && (
        <div className="py-8 text-center text-sm text-muted-foreground">
          Contract management will be available in a future update.
        </div>
      )}

      {!perf && activeTab !== 'info' && (
        <div className="py-8 text-center text-sm text-muted-foreground">
          No performance data available for this merchant.
        </div>
      )}
    </FormModal>
  );
}
