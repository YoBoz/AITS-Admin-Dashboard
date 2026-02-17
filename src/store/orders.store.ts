import { create } from 'zustand';
import type { Order, OrderStatus } from '@/types/order.types';
import { mockOrders } from '@/data/mock/merchant-orders.mock';

export type TabKey = 'new' | 'preparing' | 'ready' | 'completed' | 'issues';

interface OrdersState {
  orders: Order[];
  activeTab: TabKey;
  selectedOrderId: string | null;
  isPolling: boolean;

  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: OrderStatus, extra?: Partial<Order>) => void;
  rejectOrder: (id: string, reason: string, notes: string | null) => void;
  requestRefund: (id: string, amount: number, reason: string, notes: string | null) => void;
  selectOrder: (id: string | null) => void;
  setActiveTab: (tab: TabKey) => void;
  startPolling: () => void;
  stopPolling: () => void;

  countByTab: () => Record<TabKey, number>;
}

const ISSUE_STATUSES: OrderStatus[] = ['rejected', 'failed', 'refund_requested', 'refunded'];

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: mockOrders,
  activeTab: 'new',
  selectedOrderId: null,
  isPolling: false,

  addOrder: (order) =>
    set((state) => ({ orders: [order, ...state.orders] })),

  updateOrderStatus: (id, status, extra) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id
          ? {
              ...o,
              ...extra,
              status,
              event_log: [
                ...o.event_log,
                { timestamp: new Date().toISOString(), actor: 'Staff', action: `Status → ${status}`, details: null },
              ],
            }
          : o
      ),
    })),

  rejectOrder: (id, reason, notes) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id
          ? {
              ...o,
              status: 'rejected' as OrderStatus,
              reject_reason: reason,
              reject_notes: notes,
              event_log: [
                ...o.event_log,
                { timestamp: new Date().toISOString(), actor: 'Staff', action: 'Order rejected', details: `Reason: ${reason}${notes ? ` - ${notes}` : ''}` },
              ],
            }
          : o
      ),
    })),

  requestRefund: (id, amount, reason, notes) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id
          ? {
              ...o,
              status: 'refund_requested' as OrderStatus,
              refund_status: 'pending_approval' as const,
              refund_amount: amount,
              refund_reason: reason,
              event_log: [
                ...o.event_log,
                { timestamp: new Date().toISOString(), actor: 'Staff', action: 'Refund requested', details: `$${amount.toFixed(2)} - ${reason}${notes ? `: ${notes}` : ''}` },
              ],
            }
          : o
      ),
    })),

  selectOrder: (id) => set({ selectedOrderId: id }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  startPolling: () => set({ isPolling: true }),
  stopPolling: () => set({ isPolling: false }),

  countByTab: () => {
    const orders = get().orders;
    return {
      new: orders.filter((o) => o.status === 'new').length,
      preparing: orders.filter((o) => o.status === 'accepted' || o.status === 'preparing').length,
      ready: orders.filter((o) => o.status === 'ready').length,
      completed: orders.filter((o) => o.status === 'delivered' || o.status === 'in_transit').length,
      issues: orders.filter((o) => ISSUE_STATUSES.includes(o.status)).length,
    };
  },
}));
