import { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useOrdersStore, type TabKey } from '@/store/orders.store';
import { OrderTabBar } from '@/components/merchant/OrderTabBar';
import { OrderCard } from '@/components/merchant/OrderCard';
import { OrderDetailPanel } from './OrderDetailPanel';
import { EmptyState } from '@/components/common/EmptyState';
import { ClipboardList, Inbox } from 'lucide-react';

const TAB_LABELS: Record<TabKey, string> = {
  new: 'New',
  preparing: 'Preparing',
  ready: 'Ready',
  completed: 'Completed',
  issues: 'Issues',
};

const ISSUE_STATUSES = ['rejected', 'failed', 'refund_requested', 'refunded'];

export default function OrdersInboxPage() {
  const { orders, activeTab, selectedOrderId, setActiveTab, selectOrder, countByTab } = useOrdersStore();

  const counts = countByTab();

  const tabs = (Object.keys(TAB_LABELS) as TabKey[]).map((key) => ({
    key,
    label: TAB_LABELS[key],
    count: counts[key],
  }));

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      switch (activeTab) {
        case 'new':
          return o.status === 'new';
        case 'preparing':
          return o.status === 'accepted' || o.status === 'preparing';
        case 'ready':
          return o.status === 'ready' || o.status === 'in_transit';
        case 'completed':
          return o.status === 'delivered';
        case 'issues':
          return ISSUE_STATUSES.includes(o.status);
        default:
          return false;
      }
    });
  }, [orders, activeTab]);

  const selectedOrder = selectedOrderId
    ? orders.find((o) => o.id === selectedOrderId) ?? null
    : null;

  return (
    <div className="flex gap-4 h-[calc(100vh-8rem)]">
      {/* Orders List — left side */}
      <div className="flex flex-col w-full lg:w-[400px] shrink-0">
        {/* Tab Bar */}
        <OrderTabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} className="mb-4" />

        {/* Count header */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-muted-foreground font-lexend">
            {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Order cards */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
          {filteredOrders.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No orders"
              description={`No ${TAB_LABELS[activeTab].toLowerCase()} orders right now.`}
            />
          ) : (
            <AnimatePresence>
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isSelected={order.id === selectedOrderId}
                  onClick={() => selectOrder(order.id)}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Detail Panel — right side */}
      <div className="hidden lg:flex flex-1 border-l border-border pl-4">
        {selectedOrder ? (
          <OrderDetailPanel order={selectedOrder} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              icon={ClipboardList}
              title="Select an order"
              description="Click on an order to view its details."
            />
          </div>
        )}
      </div>
    </div>
  );
}
