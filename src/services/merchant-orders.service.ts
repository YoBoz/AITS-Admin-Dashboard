/**
 * Merchant Order Service — Placeholder service layer for future API integration.
 * Currently wraps mock functions with async signatures to match future API shape.
 */
import { useOrdersStore } from '@/store/orders.store';
import type { Order } from '@/types/order.types';

// Simulate network latency
const simulateLatency = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const orderService = {
  /**
   * Accept an order — transitions from 'new' → 'accepted'
   */
  async acceptOrder(orderId: string): Promise<void> {
    await simulateLatency(200);
    useOrdersStore.getState().updateOrderStatus(orderId, 'accepted', {
      accepted_at: new Date().toISOString(),
    });
  },

  /**
   * Reject an order — transitions from 'new' → 'rejected'
   */
  async rejectOrder(orderId: string, reason: string, notes: string | null): Promise<void> {
    await simulateLatency(200);
    useOrdersStore.getState().rejectOrder(orderId, reason, notes);
  },

  /**
   * Start preparing — transitions from 'accepted' → 'preparing'
   */
  async startPreparing(orderId: string): Promise<void> {
    await simulateLatency(150);
    useOrdersStore.getState().updateOrderStatus(orderId, 'preparing', {
      preparing_started_at: new Date().toISOString(),
    });
  },

  /**
   * Mark order as ready — transitions from 'preparing' → 'ready'
   */
  async markReady(orderId: string): Promise<void> {
    await simulateLatency(150);
    useOrdersStore.getState().updateOrderStatus(orderId, 'ready', {
      ready_at: new Date().toISOString(),
    });
  },

  /**
   * Mark as picked up / in transit — transitions from 'ready' → 'in_transit'
   */
  async markPickedUp(orderId: string, runnerId: string, runnerName: string): Promise<void> {
    await simulateLatency(150);
    useOrdersStore.getState().updateOrderStatus(orderId, 'in_transit', {
      runner_id: runnerId,
      runner_name: runnerName,
    });
  },

  /**
   * Mark as delivered — transitions from 'in_transit' → 'delivered'
   */
  async markDelivered(orderId: string): Promise<void> {
    await simulateLatency(150);
    useOrdersStore.getState().updateOrderStatus(orderId, 'delivered', {
      delivered_at: new Date().toISOString(),
    });
  },

  /**
   * Request a refund
   */
  async requestRefund(
    orderId: string,
    amount: number,
    reason: string,
    notes: string | null
  ): Promise<void> {
    await simulateLatency(300);
    useOrdersStore.getState().requestRefund(orderId, amount, reason, notes);
  },

  /**
   * Fetch orders — placeholder for API call
   */
  async fetchOrders(_shopId: string): Promise<Order[]> {
    await simulateLatency(500);
    return useOrdersStore.getState().orders;
  },
};
