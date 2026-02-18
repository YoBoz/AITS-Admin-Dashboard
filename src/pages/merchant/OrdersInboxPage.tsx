import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import Masonry from 'react-masonry-css';
import {
  ClipboardList, Clock, Package, CheckCircle2, AlertTriangle, Inbox,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOrdersStore, type TabKey } from '@/store/orders.store';
import { useMerchantAuth } from '@/hooks/useMerchantAuth';
import { useOrderPolling } from '@/hooks/useOrderPolling';
import { orderService } from '@/services/merchant-orders.service';
import { OrderCard } from '@/components/merchant/OrderCard';
import { RejectOrderModal } from '@/components/merchant/RejectOrderModal';
import type { LucideIcon } from 'lucide-react';

// ─── Tab Config ───────────────────────────────────────────────────────
interface TabConfig {
  key: TabKey;
  label: string;
  icon: LucideIcon;
  color: string;
  activeColor: string;
}

const TABS: TabConfig[] = [
  { key: 'new', label: 'New', icon: Inbox, color: 'text-blue-500', activeColor: 'bg-blue-500' },
  { key: 'preparing', label: 'Preparing', icon: Clock, color: 'text-amber-500', activeColor: 'bg-amber-500' },
  { key: 'ready', label: 'Ready', icon: Package, color: 'text-emerald-500', activeColor: 'bg-emerald-500' },
  { key: 'completed', label: 'Completed', icon: CheckCircle2, color: 'text-green-500', activeColor: 'bg-green-500' },
  { key: 'issues', label: 'Issues', icon: AlertTriangle, color: 'text-red-500', activeColor: 'bg-red-500' },
];

// ─── Component ────────────────────────────────────────────────────────
export default function OrdersInboxPage() {
  const { merchantRole } = useMerchantAuth();
  const { orders, activeTab, setActiveTab, countByTab } = useOrdersStore();
  const counts = countByTab();

  // Kitchen role only sees Preparing + Ready tabs
  const isKitchen = merchantRole === 'kitchen';
  const visibleTabs = isKitchen
    ? TABS.filter((t) => t.key === 'preparing' || t.key === 'ready')
    : TABS;

  // Auto-select first visible tab if current tab isn't visible
  const effectiveTab = visibleTabs.some((t) => t.key === activeTab)
    ? activeTab
    : visibleTabs[0]?.key ?? 'new';

  // Start order simulation
  useOrderPolling();

  // Transitioning order IDs (for optimistic UI feedback)
  const [transitioningIds, setTransitioningIds] = useState<Set<string>>(new Set());

  // Reject modal state
  const [rejectModal, setRejectModal] = useState<{ open: boolean; orderId: string; orderNumber: string }>({
    open: false, orderId: '', orderNumber: '',
  });
  const [rejectLoading, setRejectLoading] = useState(false);

  // Filter orders by current tab
  const filteredOrders = useMemo(() => {
    const tab = effectiveTab;
    const issueStatuses = ['rejected', 'failed', 'refund_requested', 'refunded'];
    switch (tab) {
      case 'new':
        return orders.filter((o) => o.status === 'new');
      case 'preparing':
        return orders.filter((o) => o.status === 'accepted' || o.status === 'preparing');
      case 'ready':
        return orders.filter((o) => o.status === 'ready');
      case 'completed':
        return orders.filter((o) => o.status === 'delivered' || o.status === 'in_transit');
      case 'issues':
        return orders.filter((o) => issueStatuses.includes(o.status));
      default:
        return [];
    }
  }, [orders, effectiveTab]);

  // ─── Optimistic action handlers ───────────────────────────────────
  const withTransition = useCallback(async (id: string, action: () => Promise<void>) => {
    setTransitioningIds((prev) => new Set(prev).add(id));
    try {
      await action();
    } finally {
      setTransitioningIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, []);

  const handleAccept = useCallback((id: string) => {
    withTransition(id, () => orderService.acceptOrder(id));
  }, [withTransition]);

  const handleRejectClick = useCallback((id: string) => {
    const order = orders.find((o) => o.id === id);
    setRejectModal({ open: true, orderId: id, orderNumber: order?.order_number ?? '' });
  }, [orders]);

  const handleRejectConfirm = useCallback(async (reasonCode: string, notes: string | null) => {
    setRejectLoading(true);
    try {
      await withTransition(rejectModal.orderId, () =>
        orderService.rejectOrder(rejectModal.orderId, reasonCode, notes)
      );
    } finally {
      setRejectLoading(false);
      setRejectModal({ open: false, orderId: '', orderNumber: '' });
    }
  }, [rejectModal.orderId, withTransition]);

  const handleStartPreparing = useCallback((id: string) => {
    withTransition(id, () => orderService.startPreparing(id));
  }, [withTransition]);

  const handleMarkReady = useCallback((id: string) => {
    withTransition(id, () => orderService.markReady(id));
  }, [withTransition]);

  const handleMarkPickedUp = useCallback((id: string) => {
    withTransition(id, () => orderService.markPickedUp(id, 'runner-auto', 'Ali R.'));
  }, [withTransition]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-foreground">Orders Inbox</h1>
          <p className="text-xs text-muted-foreground font-lexend mt-0.5">
            Live orders · Role: <span className="font-semibold capitalize text-foreground">{merchantRole}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Quick stats — hidden for kitchen */}
          {!isKitchen && (
            <div className="hidden md:flex items-center gap-4 mr-2">
              <div className="text-center">
                <p className="text-lg font-bold font-montserrat text-blue-500">{counts.new}</p>
                <p className="text-[10px] text-muted-foreground">New</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold font-montserrat text-amber-500">{counts.preparing}</p>
                <p className="text-[10px] text-muted-foreground">Preparing</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold font-montserrat text-emerald-500">{counts.ready}</p>
                <p className="text-[10px] text-muted-foreground">Ready</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Segmented Tabs */}
      <div className="flex items-center gap-1 rounded-xl bg-muted/50 p-1 border border-border overflow-x-auto">
        {visibleTabs.map((tab) => {
          const isActive = effectiveTab === tab.key;
          const count = counts[tab.key];
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold font-lexend transition-all whitespace-nowrap flex-1 justify-center',
                isActive
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <tab.icon className={cn('h-3.5 w-3.5', isActive ? tab.color : '')} />
              <span>{tab.label}</span>
              {count > 0 && (
                <span
                  className={cn(
                    'ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold',
                    isActive
                      ? `${tab.activeColor} text-white`
                      : 'bg-muted-foreground/20 text-muted-foreground'
                  )}
                >
                  {count}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-lg bg-card shadow-sm -z-10"
                  transition={{ type: 'spring', duration: 0.3, bounce: 0.15 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Order Cards Grid */}
      <div className="min-h-[400px]">
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <ClipboardList className="h-12 w-12 text-muted-foreground/20 mb-3" />
            <h3 className="text-sm font-semibold font-montserrat text-muted-foreground">
              No {effectiveTab === 'issues' ? 'issue' : effectiveTab} orders
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {effectiveTab === 'new'
                ? 'New orders will appear here automatically'
                : 'Orders will move here as they progress'}
            </p>
          </motion.div>
        ) : (
          <Masonry
            breakpointCols={{ default: 3, 1280: 3, 1024: 2, 768: 2, 640: 1 }}
            className="masonry-grid"
            columnClassName="masonry-grid-column"
          >
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onAccept={handleAccept}
                onReject={handleRejectClick}
                onStartPreparing={handleStartPreparing}
                onMarkReady={handleMarkReady}
                onMarkPickedUp={handleMarkPickedUp}
                isTransitioning={transitioningIds.has(order.id)}
              />
            ))}
          </Masonry>
        )}
      </div>

      {/* Reject Modal */}
      <RejectOrderModal
        open={rejectModal.open}
        orderNumber={rejectModal.orderNumber}
        onClose={() => setRejectModal({ open: false, orderId: '', orderNumber: '' })}
        onConfirm={handleRejectConfirm}
        isLoading={rejectLoading}
      />
    </div>
  );
}
