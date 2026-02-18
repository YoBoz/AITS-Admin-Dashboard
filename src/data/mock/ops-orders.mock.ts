// ──────────────────────────────────────
// Ops Orders Mock Data — Phase 8
// ──────────────────────────────────────

import type { Order, OrderStatus, OrderEvent } from '@/types/order.types';

const merchants = [
  { id: 'SHOP-001', name: 'Costa Coffee' },
  { id: 'SHOP-003', name: "McDonald's" },
  { id: 'SHOP-004', name: 'Dubai Duty Free' },
  { id: 'SHOP-005', name: 'WHSmith' },
  { id: 'SHOP-012', name: 'Shake Shack' },
  { id: 'SHOP-018', name: 'Paul Bakery' },
];

const gates = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8'];
const zones = ['gates_a', 'gates_b', 'lounge_a', 'lounge_b', 'food_court'];
const runners = ['Runner Ali', 'Runner Sara', 'Runner Omar', 'Runner Fatima', 'Runner Ahmed', null];
const passengerAliases = ['Star Traveler', 'Globe Trekker', 'Sky Walker', 'Cloud Surfer', 'Jet Setter', 'Mile High', 'First Class', 'Business Pro', 'Transit King', 'Lounge Master'];

function generateOrderNumber(index: number): string {
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  return `ORD-${dateStr}-${String(index + 1).padStart(4, '0')}`;
}

function pastMinutes(minutesAgo: number): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - minutesAgo);
  return d.toISOString();
}

function futureMinutes(minutesAhead: number): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() + minutesAhead);
  return d.toISOString();
}

function generateEventLog(status: OrderStatus, createdAt: string, seed: number): OrderEvent[] {
  const events: OrderEvent[] = [
    { timestamp: createdAt, actor: 'system', action: 'order_created', details: 'Order placed by passenger' },
  ];

  const baseTime = new Date(createdAt).getTime();

  if (['accepted', 'preparing', 'ready', 'in_transit', 'delivered'].includes(status)) {
    events.push({
      timestamp: new Date(baseTime + 30000 + (seed % 30) * 1000).toISOString(),
      actor: merchants[seed % merchants.length].name,
      action: 'order_accepted',
      details: 'Merchant accepted order',
    });
  }

  if (['preparing', 'ready', 'in_transit', 'delivered'].includes(status)) {
    events.push({
      timestamp: new Date(baseTime + 120000 + (seed % 60) * 1000).toISOString(),
      actor: merchants[seed % merchants.length].name,
      action: 'preparation_started',
      details: 'Order preparation started',
    });
  }

  if (['ready', 'in_transit', 'delivered'].includes(status)) {
    events.push({
      timestamp: new Date(baseTime + 480000 + (seed % 120) * 1000).toISOString(),
      actor: merchants[seed % merchants.length].name,
      action: 'order_ready',
      details: 'Order ready for pickup',
    });
  }

  if (['in_transit', 'delivered'].includes(status)) {
    events.push({
      timestamp: new Date(baseTime + 540000 + (seed % 60) * 1000).toISOString(),
      actor: runners[seed % (runners.length - 1)] || 'Runner Ali',
      action: 'runner_assigned',
      details: 'Runner assigned for delivery',
    });
    events.push({
      timestamp: new Date(baseTime + 600000 + (seed % 60) * 1000).toISOString(),
      actor: runners[seed % (runners.length - 1)] || 'Runner Ali',
      action: 'picked_up',
      details: 'Order picked up from merchant',
    });
  }

  if (status === 'delivered') {
    events.push({
      timestamp: new Date(baseTime + 900000 + (seed % 180) * 1000).toISOString(),
      actor: runners[seed % (runners.length - 1)] || 'Runner Ali',
      action: 'delivered',
      details: 'Order delivered to passenger',
    });
  }

  if (status === 'rejected') {
    events.push({
      timestamp: new Date(baseTime + 45000 + (seed % 30) * 1000).toISOString(),
      actor: merchants[seed % merchants.length].name,
      action: 'order_rejected',
      details: 'Item unavailable',
    });
  }

  if (status === 'failed') {
    events.push({
      timestamp: new Date(baseTime + 30000).toISOString(),
      actor: merchants[seed % merchants.length].name,
      action: 'order_accepted',
      details: null,
    });
    events.push({
      timestamp: new Date(baseTime + 720000).toISOString(),
      actor: 'system',
      action: 'delivery_failed',
      details: 'Passenger not found at gate',
    });
  }

  return events;
}

// Generate 50 orders with varied statuses
const statusDistribution: OrderStatus[] = [
  'new', 'new', 'new', 'new', 'new',
  'accepted', 'accepted', 'accepted', 'accepted',
  'preparing', 'preparing', 'preparing', 'preparing', 'preparing', 'preparing',
  'ready', 'ready', 'ready', 'ready',
  'in_transit', 'in_transit', 'in_transit', 'in_transit', 'in_transit',
  'delivered', 'delivered', 'delivered', 'delivered', 'delivered', 'delivered', 'delivered', 'delivered', 'delivered', 'delivered',
  'delivered', 'delivered', 'delivered', 'delivered', 'delivered',
  'rejected', 'rejected',
  'failed',
  'refund_requested', 'refund_requested',
  'refunded',
];

export const opsOrdersData: Order[] = statusDistribution.map((status, index) => {
  const merchant = merchants[index % merchants.length];
  const gate = gates[index % gates.length];
  const zone = zones[index % zones.length];
  const runner = ['in_transit', 'delivered'].includes(status) ? runners[index % (runners.length - 1)] : null;
  
  // Orders are spread across last 4 hours
  const minutesAgo = Math.floor(index * 4.5);
  const createdAt = pastMinutes(minutesAgo);
  
  // SLA times
  const slaAcceptBy = new Date(new Date(createdAt).getTime() + 90000).toISOString(); // 90 seconds
  const slaDeliverBy = new Date(new Date(createdAt).getTime() + 1800000).toISOString(); // 30 minutes

  // Determine if SLA breached (for some orders)
  const isAcceptanceBreached = index % 8 === 0 && ['accepted', 'preparing', 'ready', 'in_transit', 'delivered'].includes(status);
  const isDeliveryBreached = index % 12 === 0 && status === 'delivered';

  const items = [
    {
      id: `ITM-${index}-1`,
      menu_item_id: `MENU-${(index % 20) + 1}`,
      name: ['Cappuccino', 'Big Mac', 'Croissant', 'Magazine', 'Burger', 'Baguette'][index % 6],
      quantity: 1 + (index % 3),
      unit_price: [4.5, 8.99, 3.50, 12.00, 11.50, 5.00][index % 6],
      modifiers: index % 3 === 0 ? [{ name: 'Extra Shot', price: 1.00 }] : [],
      notes: index % 5 === 0 ? 'No ice please' : null,
      status: 'available' as const,
    },
  ];

  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity + item.modifiers.reduce((m, mod) => m + mod.price, 0), 0);

  return {
    id: `OPS-ORD-${String(index + 1).padStart(5, '0')}`,
    order_number: generateOrderNumber(index),
    status,
    created_at: createdAt,
    accepted_at: ['accepted', 'preparing', 'ready', 'in_transit', 'delivered'].includes(status)
      ? new Date(new Date(createdAt).getTime() + (isAcceptanceBreached ? 120000 : 35000)).toISOString()
      : null,
    preparing_started_at: ['preparing', 'ready', 'in_transit', 'delivered'].includes(status)
      ? new Date(new Date(createdAt).getTime() + 120000).toISOString()
      : null,
    ready_at: ['ready', 'in_transit', 'delivered'].includes(status)
      ? new Date(new Date(createdAt).getTime() + 480000).toISOString()
      : null,
    delivered_at: status === 'delivered'
      ? new Date(new Date(createdAt).getTime() + (isDeliveryBreached ? 2100000 : 900000)).toISOString()
      : null,
    sla_accept_by: slaAcceptBy,
    sla_deliver_by: slaDeliverBy,
    items,
    subtotal,
    discount_applied: index % 7 === 0 ? subtotal * 0.1 : 0,
    service_fee: 2.00,
    total: subtotal - (index % 7 === 0 ? subtotal * 0.1 : 0) + 2.00,
    currency: 'AED',
    destination_gate: gate,
    destination_zone: zone,
    passenger_alias: passengerAliases[index % passengerAliases.length],
    passenger_phone: `+971 50 ${String(1000000 + index * 1234).slice(0, 7)}`,
    flight_number: `EK${100 + (index % 900)}`,
    departure_time: futureMinutes(60 + (index % 180)),
    payment_method: ['card', 'apple_pay', 'google_pay'][index % 3],
    payment_status: status === 'refunded' ? 'refunded' : status === 'failed' ? 'failed' : 'paid',
    notes: index % 10 === 0 ? 'Please deliver ASAP - tight connection' : null,
    runner_id: runner ? `RUN-${String((index % 5) + 1).padStart(3, '0')}` : null,
    runner_name: runner,
    reject_reason: status === 'rejected' ? 'item_unavailable' : null,
    reject_notes: status === 'rejected' ? 'Requested item out of stock' : null,
    refund_status: status === 'refund_requested' ? 'pending_approval' : status === 'refunded' ? 'approved' : 'none',
    refund_amount: status === 'refunded' ? subtotal + 2.00 : null,
    refund_reason: status === 'refund_requested' || status === 'refunded' ? 'Order not delivered on time' : null,
    event_log: generateEventLog(status, createdAt, index),
    coupon_code: index % 15 === 0 ? 'WELCOME10' : null,
    shop_id: merchant.id,
    is_priority: index % 20 === 0,
  };
});

// Override reasons for ops orders console
export const opsOverrideReasons = [
  { code: 'passenger_no_show', label: 'Passenger No Show' },
  { code: 'gate_change', label: 'Gate Change' },
  { code: 'flight_delay', label: 'Flight Delay' },
  { code: 'merchant_issue', label: 'Merchant Issue' },
  { code: 'runner_unavailable', label: 'Runner Unavailable' },
  { code: 'system_error', label: 'System Error' },
  { code: 'passenger_request', label: 'Passenger Request' },
  { code: 'security_hold', label: 'Security Hold' },
  { code: 'quality_issue', label: 'Quality Issue' },
  { code: 'other', label: 'Other' },
];
