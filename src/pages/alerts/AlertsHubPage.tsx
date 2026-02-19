// ──────────────────────────────────────
// Alerts Hub — Unified Alerts, Incidents & Complaints
// Sub-tabs: Alerts | Incidents | Complaints
// ──────────────────────────────────────

import { useState, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Siren,
  MessageSquareWarning,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useAlertsStore } from '@/store/alerts.store';
import { useIncidentsStore } from '@/store/incidents.store';
import { useComplaintsStore } from '@/store/complaints.store';

const AlertsPage = lazy(() => import('./AlertsPage'));
const IncidentsPage = lazy(() => import('../ops/IncidentsPage'));
const ComplaintsPage = lazy(() => import('../complaints/ComplaintsPage'));

type AlertsTab = 'alerts' | 'incidents' | 'complaints';

const tabsDef: { key: AlertsTab; label: string; icon: React.ElementType; description: string }[] = [
  { key: 'alerts', label: 'Alerts', icon: AlertTriangle, description: 'System & device alerts' },
  { key: 'incidents', label: 'Incidents', icon: Siren, description: 'Operational incidents' },
  { key: 'complaints', label: 'Complaints', icon: MessageSquareWarning, description: 'Visitor complaints' },
];

export default function AlertsHubPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as AlertsTab | null;
  const [activeTab, setActiveTab] = useState<AlertsTab>(
    tabParam && tabsDef.some((t) => t.key === tabParam) ? tabParam : 'alerts'
  );

  // Badge counts
  const alertStats = useAlertsStore((s) => s.getStats());
  const incidents = useIncidentsStore((s) => s.incidents);
  const complaintStats = useComplaintsStore((s) => s.getStats());

  const openIncidents = incidents.filter((i) => i.status === 'open' || i.status === 'investigating').length;

  const handleTabChange = (tab: AlertsTab) => {
    setActiveTab(tab);
    setSearchParams({ tab }, { replace: true });
  };

  const getBadge = (tab: AlertsTab): number => {
    switch (tab) {
      case 'alerts':
        return alertStats.critical + alertStats.warnings;
      case 'incidents':
        return openIncidents;
      case 'complaints':
        return complaintStats.open + complaintStats.escalated;
      default:
        return 0;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Hub Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-montserrat text-foreground flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-brand" />
          Alerts & Issues
        </h1>
        <p className="text-sm text-muted-foreground font-lexend mt-1">
          Unified view of system alerts, operational incidents, and visitor complaints
        </p>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="border-b border-border mb-6">
        <nav className="flex gap-1 -mb-px" role="tablist">
          {tabsDef.map((tab) => {
            const isActive = activeTab === tab.key;
            const badgeCount = getBadge(tab.key);
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
                {badgeCount > 0 && (
                  <span
                    className={cn(
                      'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold text-white',
                      isActive ? 'bg-brand' : 'bg-muted-foreground/60'
                    )}
                  >
                    {badgeCount}
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
                {activeTab === 'alerts' && <AlertsPage embedded />}
                {activeTab === 'incidents' && <IncidentsPage embedded />}
                {activeTab === 'complaints' && <ComplaintsPage embedded />}
              </Suspense>
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
