import type { Order, OrderItem, OrderStatus } from '@/types/order.types';

// ─── Helpers ───────────────────────────────────────────────────────────
const PAX_NAMES = [
  'Alex T.', 'Jordan M.', 'Sam K.', 'Riley P.', 'Morgan B.',
  'Casey L.', 'Quinn D.', 'Avery S.', 'Taylor W.', 'Blake H.',
  'Jamie R.', 'Drew C.', 'Charlie F.', 'Skyler N.', 'Harper G.',
];
const GATES = [
  'A1','A2','A3','A4','A5','A6','A7','A8',
  'B1','B2','B3','B4','B5','B6','B7','B8',
];
const FLIGHTS = ['EK','QR','BA','LH','AF','SV','FZ','WY','GF','KU'];
const ITEM_POOL: { name: string; price: number }[] = [
  { name: 'Americano', price: 5.5 }, { name: 'Cappuccino', price: 6 },
  { name: 'Latte', price: 6.5 }, { name: 'Flat White', price: 6 },
  { name: 'Espresso', price: 4.5 }, { name: 'Iced Latte', price: 7 },
  { name: 'Croissant', price: 4 }, { name: 'Club Sandwich', price: 12 },
  { name: 'Caesar Salad', price: 11 }, { name: 'Muffin', price: 5 },
  { name: 'Cookies (3)', price: 6 }, { name: 'Sparkling Water', price: 3 },
  { name: 'Chicken Wrap', price: 10 }, { name: 'Fruit Bowl', price: 8 },
  { name: 'Avocado Toast', price: 9 }, { name: 'Hot Chocolate', price: 6 },
  { name: 'Fresh Juice', price: 7.5 }, { name: 'Brownie', price: 5.5 },
];
const MODIFIERS = [
  { name: 'Oat Milk', price: 1 }, { name: 'Extra Shot', price: 1.5 },
  { name: 'Extra Cheese', price: 2 }, { name: 'No Sugar', price: 0 },
  { name: 'Gluten Free', price: 1.5 },
];

const now = Date.now();
function minsAgo(m: number) { return new Date(now - m * 60_000).toISOString(); }
function minsFromNow(m: number) { return new Date(now + m * 60_000).toISOString(); }
function randomEl<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

let seq = 1000;

function makeItems(count: number): OrderItem[] {
  return Array.from({ length: count }, (_, i) => {
    const sample = randomEl(ITEM_POOL);
    const qty = Math.random() > 0.7 ? 2 : 1;
    const mods = Math.random() > 0.6 ? [randomEl(MODIFIERS)] : [];
    return {
      id: `item-${seq}-${i}`,
      menu_item_id: `mi-${i}`,
      name: sample.name,
      quantity: qty,
      unit_price: sample.price,
      modifiers: mods,
      notes: Math.random() > 0.85 ? 'No ice please' : null,
      status: 'available' as const,
    };
  });
}

function makeOrder(
  status: OrderStatus,
  createdMinsAgo: number,
  slaRemainingMins?: number,
  extra?: Partial<Order>,
): Order {
  seq++;
  const itemCount = randomInt(1, 4);
  const items = makeItems(itemCount);
  const subtotal = items.reduce((s, it) => s + it.unit_price * it.quantity + it.modifiers.reduce((a, m) => a + m.price, 0), 0);
  const gate = randomEl(GATES);
  const flight = `${randomEl(FLIGHTS)}${randomInt(100, 999)}`;
  const slaAcceptBy = slaRemainingMins !== undefined
    ? minsFromNow(slaRemainingMins)
    : minsFromNow(2 - createdMinsAgo);

  const events: { timestamp: string; actor: string; action: string; details: string | null }[] = [
    { timestamp: minsAgo(createdMinsAgo), actor: 'System', action: 'Order placed', details: null },
  ];

  if (['accepted','preparing','ready','in_transit','delivered'].includes(status)) {
    events.push({ timestamp: minsAgo(createdMinsAgo - 0.5), actor: 'Staff', action: 'Status → accepted', details: null });
  }
  if (['preparing','ready','in_transit','delivered'].includes(status)) {
    events.push({ timestamp: minsAgo(createdMinsAgo - 1), actor: 'Staff', action: 'Status → preparing', details: null });
  }
  if (['ready','in_transit','delivered'].includes(status)) {
    events.push({ timestamp: minsAgo(createdMinsAgo - 3), actor: 'Staff', action: 'Status → ready', details: null });
  }
  if (status === 'rejected') {
    events.push({ timestamp: minsAgo(createdMinsAgo - 0.5), actor: 'Staff', action: 'Order rejected', details: 'Reason: Out of Stock' });
  }

  return {
    id: `ord-${seq}`,
    order_number: `SLP-${seq}`,
    shop_id: 'sky-lounge-premier',
    status,
    created_at: minsAgo(createdMinsAgo),
    accepted_at: ['accepted','preparing','ready','in_transit','delivered'].includes(status)
      ? minsAgo(createdMinsAgo - 0.5) : null,
    preparing_started_at: ['preparing','ready','in_transit','delivered'].includes(status)
      ? minsAgo(createdMinsAgo - 1) : null,
    ready_at: ['ready','in_transit','delivered'].includes(status)
      ? minsAgo(createdMinsAgo - 3) : null,
    delivered_at: status === 'delivered' ? minsAgo(1) : null,
    sla_accept_by: slaAcceptBy,
    sla_deliver_by: minsFromNow(20),
    passenger_alias: randomEl(PAX_NAMES),
    passenger_phone: `+971-50-${randomInt(100, 999)}-${randomInt(1000, 9999)}`,
    destination_gate: gate,
    destination_zone: gate.startsWith('A') ? 'Zone A - Departures' : 'Zone B - International',
    flight_number: flight,
    departure_time: minsFromNow(randomInt(45, 180)),
    items,
    subtotal: Math.round(subtotal * 100) / 100,
    discount_applied: 0,
    service_fee: 1.5,
    total: Math.round((subtotal + 1.5) * 100) / 100,
    currency: 'AED',
    payment_method: Math.random() > 0.5 ? 'Card' : 'Apple Pay',
    payment_status: 'paid',
    notes: Math.random() > 0.9 ? 'Please hurry, boarding soon' : null,
    reject_reason: status === 'rejected' ? 'Out of Stock' : null,
    reject_notes: status === 'rejected' ? 'Main item unavailable' : null,
    refund_status: status === 'refund_requested' ? 'pending_approval' : status === 'refunded' ? 'approved' : 'none',
    refund_amount: ['refund_requested', 'refunded'].includes(status) ? subtotal : null,
    refund_reason: ['refund_requested', 'refunded'].includes(status) ? 'Order issue' : null,
    runner_id: ['in_transit', 'delivered'].includes(status) ? 'runner-1' : null,
    runner_name: ['in_transit', 'delivered'].includes(status) ? 'Ali R.' : null,
    coupon_code: Math.random() > 0.9 ? 'WELCOME10' : null,
    is_priority: Math.random() < 0.15,
    event_log: events,
    ...extra,
  };
}

// ─── Generate realistic distribution ──────────────────────────────────
// 8 new orders with varying SLA remaining times
const newOrders: Order[] = [
  makeOrder('new', 0.3, 1.8),
  makeOrder('new', 0.5, 1.5),
  makeOrder('new', 0.8, 1.2),
  makeOrder('new', 1.0, 0.8),
  makeOrder('new', 1.2, 0.5),
  makeOrder('new', 1.5, 0.3),
  makeOrder('new', 0.1, 1.9),
  makeOrder('new', 0.4, 1.6),
];

// 5 accepted → preparing
const preparingOrders: Order[] = [
  makeOrder('accepted', 3),
  makeOrder('accepted', 4),
  makeOrder('preparing', 5),
  makeOrder('preparing', 6),
  makeOrder('preparing', 8),
];

// 3 ready
const readyOrders: Order[] = [
  makeOrder('ready', 12),
  makeOrder('ready', 15),
  makeOrder('ready', 18),
];

// 4 completed
const completedOrders: Order[] = [
  makeOrder('delivered', 25),
  makeOrder('delivered', 30),
  makeOrder('in_transit', 20),
  makeOrder('delivered', 35),
];

// 3 issues
const issueOrders: Order[] = [
  makeOrder('rejected', 10),
  makeOrder('refund_requested', 22),
  makeOrder('failed', 28),
];

export const mockOrders: Order[] = [
  ...newOrders,
  ...preparingOrders,
  ...readyOrders,
  ...completedOrders,
  ...issueOrders,
];
