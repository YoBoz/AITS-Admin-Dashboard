// ──────────────────────────────────────
// Compliance Page — Phase 9
// ──────────────────────────────────────

import { useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/common/PageHeader';
import { ShieldCheck, FileSearch, AlertTriangle, CreditCard, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const ConsentAuditTab = lazy(() => import('./ConsentAuditTab'));
const DeviceQuarantineTab = lazy(() => import('./DeviceQuarantineTab'));
const DSARFlowTab = lazy(() => import('./DSARFlowTab'));
const PaymentComplianceTab = lazy(() => import('./PaymentComplianceTab'));
const ImmutableAuditTab = lazy(() => import('./ImmutableAuditTab'));

const tabs = [
  { id: 'consent', label: 'Consent Audit', icon: ShieldCheck },
  { id: 'quarantine', label: 'Device Quarantine', icon: AlertTriangle },
  { id: 'dsar', label: 'DSAR Requests', icon: FileSearch },
  { id: 'payment', label: 'Payment Compliance', icon: CreditCard },
  { id: 'audit', label: 'Immutable Audit Log', icon: Link2 },
];

interface CompliancePageProps {
  embedded?: boolean;
}

export default function CompliancePage({ embedded }: CompliancePageProps) {
  const [activeTab, setActiveTab] = useState('consent');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {!embedded && (
        <PageHeader
          title="Compliance Center"
          subtitle="Security, consent audit trails, DSAR management, and immutable logs"
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

      {/* Tab content */}
      <Suspense fallback={<div className="py-12 text-center text-sm text-muted-foreground">Loading…</div>}>
        {activeTab === 'consent' && <ConsentAuditTab />}
        {activeTab === 'quarantine' && <DeviceQuarantineTab />}
        {activeTab === 'dsar' && <DSARFlowTab />}
        {activeTab === 'payment' && <PaymentComplianceTab />}
        {activeTab === 'audit' && <ImmutableAuditTab />}
      </Suspense>
    </motion.div>
  );
}
