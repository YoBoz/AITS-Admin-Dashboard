import { useEffect, useRef, useCallback } from 'react';
import { useOrdersStore } from '@/store/orders.store';
import { useMerchantStore } from '@/store/merchant.store';
import type { Order, OrderItem, OrderStatus } from '@/types/order.types';

// ---------- helpers ----------
const PAX_NAMES = ['Alex T.', 'Jordan M.', 'Sam K.', 'Riley P.', 'Morgan B.', 'Casey L.', 'Quinn D.', 'Avery S.'];
const GATES = ['A1','A2','A3','A4','A5','B1','B2','B3','B4','B5','B6','B7','B8'];
const ITEM_POOL: { name: string; price: number }[] = [
  { name: 'Americano', price: 5.5 }, { name: 'Cappuccino', price: 6 },
  { name: 'Latte', price: 6.5 }, { name: 'Flat White', price: 6 },
  { name: 'Espresso', price: 4.5 }, { name: 'Iced Latte', price: 7 },
  { name: 'Croissant', price: 4 }, { name: 'Club Sandwich', price: 12 },
  { name: 'Caesar Salad', price: 11 }, { name: 'Muffin', price: 5 },
  { name: 'Cookies (3)', price: 6 }, { name: 'Sparkling Water', price: 3 },
];

let orderSeq = 1000;

function randomEl<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateOrder(shopId: string): Order {
  orderSeq++;
  const now = new Date();
  const itemCount = Math.random() > 0.6 ? Math.floor(Math.random() * 3) + 2 : 1;
  const items: OrderItem[] = Array.from({ length: itemCount }, (_, i) => {
    const sample = randomEl(ITEM_POOL);
    const qty = Math.random() > 0.8 ? 2 : 1;
    return {
      id: `oi-gen-${orderSeq}-${i}`,
      menu_item_id: `mi-gen-${i}`,
      name: sample.name,
      quantity: qty,
      unit_price: sample.price,
      modifiers: [],
      notes: null,
      status: 'pending' as const,
    };
  });
  const subtotal = items.reduce((s, it) => s + it.unit_price * it.quantity, 0);
  const gate = randomEl(GATES);

  return {
    id: `ord-gen-${orderSeq}`,
    order_number: `SLP-${orderSeq}`,
    shop_id: shopId,
    status: 'new' as OrderStatus,
    created_at: now.toISOString(),
    accepted_at: null,
    preparing_started_at: null,
    ready_at: null,
    delivered_at: null,
    sla_accept_by: new Date(now.getTime() + 90_000).toISOString(),
    sla_deliver_by: new Date(now.getTime() + 1_800_000).toISOString(),
    passenger_alias: randomEl(PAX_NAMES),
    passenger_phone: '+971-50-555-' + String(Math.floor(Math.random() * 9000) + 1000),
    destination_gate: gate,
    destination_zone: gate.startsWith('A') ? 'Zone A - Departures' : 'Zone B - International',
    flight_number: `EK${Math.floor(Math.random() * 900) + 100}`,
    departure_time: new Date(now.getTime() + (Math.random() * 3 + 1) * 3600_000).toISOString(),
    items,
    subtotal,
    discount_applied: 0,
    service_fee: 1.5,
    total: subtotal + 1.5,
    currency: 'AED',
    payment_method: Math.random() > 0.5 ? 'card' : 'wallet',
    payment_status: 'paid',
    notes: null,
    reject_reason: null,
    reject_notes: null,
    refund_status: 'none',
    refund_amount: null,
    refund_reason: null,
    runner_id: null,
    runner_name: null,
    coupon_code: null,
    is_priority: Math.random() < 0.1,
    event_log: [
      { timestamp: now.toISOString(), actor: 'system', action: 'order_placed', details: 'Customer placed order' },
    ],
  };
}

// ---------- hook ----------
export function useOrderPolling() {
  const { addOrder, updateOrderStatus, orders, isPolling, startPolling, stopPolling } = useOrdersStore();
  const { merchantUser, isStoreOpen } = useMerchantStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickRef = useRef(0);

  const tick = useCallback(() => {
    if (!merchantUser || !isStoreOpen) return;

    tickRef.current++;
    const shopId = merchantUser.shop_id;

    // Every 15s (tick 1, 2, 3...) — add a new order
    if (tickRef.current % 1 === 0) {
      const order = generateOrder(shopId);
      addOrder(order);
      // 30 % chance of a second order
      if (Math.random() < 0.3) {
        const bonus = generateOrder(shopId);
        addOrder(bonus);
      }
    }

    // Every 3rd tick (~45 s) — auto-progress one accepted → preparing
    if (tickRef.current % 3 === 0) {
      const accepted = orders.filter((o) => o.status === 'accepted');
      if (accepted.length > 0) {
        const target = randomEl(accepted);
        updateOrderStatus(target.id, 'preparing');
      }
    }
  }, [merchantUser, isStoreOpen, addOrder, updateOrderStatus, orders]);

  useEffect(() => {
    if (!merchantUser || !isStoreOpen) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        stopPolling();
      }
      return;
    }

    if (!intervalRef.current) {
      startPolling();
      tickRef.current = 0;
      intervalRef.current = setInterval(tick, 15_000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        stopPolling();
      }
    };
  }, [merchantUser, isStoreOpen, tick, startPolling, stopPolling]);

  return { isPolling };
}
