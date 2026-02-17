import type { Order } from '@/types/order.types';

const now = new Date();
const iso = (offsetMs: number) => new Date(now.getTime() + offsetMs).toISOString();
const ago = (ms: number) => new Date(now.getTime() - ms).toISOString();

const SHOP_ID = 'sky-lounge-premier';
const GATES = ['A1','A2','A3','A4','A5','A6','A7','A8','B1','B2','B3','B4','B5','B6','B7','B8'];
const ZONES = ['Zone A - Departures', 'Zone B - International'];

function gate() { return GATES[Math.floor(Math.random() * GATES.length)]; }
function zone() { return ZONES[Math.floor(Math.random() * ZONES.length)]; }
function pax(n: number) { return `PAX-${4000 + n}`; }

export const mockOrders: Order[] = [
  // ---- NEW ORDERS (4) ----
  {
    id: 'ord-001', order_number: 'ORD-20260217-0001', status: 'new',
    created_at: ago(60_000), accepted_at: null, preparing_started_at: null, ready_at: null, delivered_at: null,
    sla_accept_by: iso(60_000), sla_deliver_by: iso(900_000),
    items: [
      { id: 'oi-1', menu_item_id: 'item-americano', name: 'Americano', quantity: 2, unit_price: 4.50, modifiers: [{ name: 'Oat Milk', price: 0.50 }], notes: null, status: 'available' },
      { id: 'oi-2', menu_item_id: 'item-croissant', name: 'Butter Croissant', quantity: 1, unit_price: 3.50, modifiers: [], notes: null, status: 'available' },
    ],
    subtotal: 13.50, discount_applied: 0, total: 13.50, currency: 'USD',
    destination_gate: 'B4', destination_zone: 'Zone B - International', passenger_alias: pax(1),
    runner_id: null, runner_name: null, reject_reason: null, reject_notes: null,
    refund_status: 'none', refund_amount: null, refund_reason: null,
    event_log: [{ timestamp: ago(60_000), actor: 'System', action: 'Order placed', details: null }],
    coupon_code: null, shop_id: SHOP_ID, is_priority: false,
  },
  {
    id: 'ord-002', order_number: 'ORD-20260217-0002', status: 'new',
    created_at: ago(30_000), accepted_at: null, preparing_started_at: null, ready_at: null, delivered_at: null,
    sla_accept_by: iso(90_000), sla_deliver_by: iso(1_200_000),
    items: [
      { id: 'oi-3', menu_item_id: 'item-cappuccino', name: 'Cappuccino', quantity: 1, unit_price: 5.00, modifiers: [], notes: 'Extra hot', status: 'available' },
    ],
    subtotal: 5.00, discount_applied: 0, total: 5.00, currency: 'USD',
    destination_gate: 'A3', destination_zone: 'Zone A - Departures', passenger_alias: pax(2),
    runner_id: null, runner_name: null, reject_reason: null, reject_notes: null,
    refund_status: 'none', refund_amount: null, refund_reason: null,
    event_log: [{ timestamp: ago(30_000), actor: 'System', action: 'Order placed', details: null }],
    coupon_code: 'WELCOME10', shop_id: SHOP_ID, is_priority: true,
  },
  {
    id: 'ord-003', order_number: 'ORD-20260217-0003', status: 'new',
    created_at: ago(80_000), accepted_at: null, preparing_started_at: null, ready_at: null, delivered_at: null,
    sla_accept_by: iso(10_000), sla_deliver_by: iso(600_000),
    items: [
      { id: 'oi-4', menu_item_id: 'item-club-sandwich', name: 'Club Sandwich', quantity: 1, unit_price: 12.00, modifiers: [], notes: null, status: 'available' },
      { id: 'oi-5', menu_item_id: 'item-iced-latte', name: 'Iced Latte', quantity: 1, unit_price: 5.50, modifiers: [], notes: null, status: 'available' },
    ],
    subtotal: 17.50, discount_applied: 1.75, total: 15.75, currency: 'USD',
    destination_gate: 'B7', destination_zone: 'Zone B - International', passenger_alias: pax(3),
    runner_id: null, runner_name: null, reject_reason: null, reject_notes: null,
    refund_status: 'none', refund_amount: null, refund_reason: null,
    event_log: [{ timestamp: ago(80_000), actor: 'System', action: 'Order placed', details: 'Coupon SAVE10 applied' }],
    coupon_code: 'SAVE10', shop_id: SHOP_ID, is_priority: false,
  },
  {
    id: 'ord-004', order_number: 'ORD-20260217-0004', status: 'new',
    created_at: ago(120_000), accepted_at: null, preparing_started_at: null, ready_at: null, delivered_at: null,
    sla_accept_by: ago(30_000), sla_deliver_by: iso(300_000),
    items: [
      { id: 'oi-6', menu_item_id: 'item-espresso', name: 'Espresso', quantity: 2, unit_price: 3.50, modifiers: [], notes: null, status: 'available' },
    ],
    subtotal: 7.00, discount_applied: 0, total: 7.00, currency: 'USD',
    destination_gate: 'A1', destination_zone: 'Zone A - Departures', passenger_alias: pax(4),
    runner_id: null, runner_name: null, reject_reason: null, reject_notes: null,
    refund_status: 'none', refund_amount: null, refund_reason: null,
    event_log: [{ timestamp: ago(120_000), actor: 'System', action: 'Order placed', details: null }],
    coupon_code: null, shop_id: SHOP_ID, is_priority: false,
  },

  // ---- ACCEPTED / PREPARING (6) ----
  ...[5,6,7,8,9,10].map((n): Order => ({
    id: `ord-00${n}`, order_number: `ORD-20260217-000${n}`, status: 'preparing',
    created_at: ago(300_000 + n * 60_000), accepted_at: ago(240_000 + n * 30_000), preparing_started_at: ago(180_000 + n * 20_000), ready_at: null, delivered_at: null,
    sla_accept_by: ago(200_000), sla_deliver_by: iso(600_000 + n * 60_000),
    items: [
      { id: `oi-p${n}a`, menu_item_id: 'item-latte', name: 'Caffè Latte', quantity: 1, unit_price: 5.50, modifiers: [], notes: null, status: 'available' },
      { id: `oi-p${n}b`, menu_item_id: 'item-muffin', name: 'Blueberry Muffin', quantity: n % 2 === 0 ? 2 : 1, unit_price: 4.00, modifiers: [], notes: null, status: 'available' },
    ],
    subtotal: 5.50 + 4.00 * (n % 2 === 0 ? 2 : 1), discount_applied: 0, total: 5.50 + 4.00 * (n % 2 === 0 ? 2 : 1), currency: 'USD',
    destination_gate: gate(), destination_zone: zone(), passenger_alias: pax(n),
    runner_id: null, runner_name: null, reject_reason: null, reject_notes: null,
    refund_status: 'none', refund_amount: null, refund_reason: null,
    event_log: [
      { timestamp: ago(300_000 + n * 60_000), actor: 'System', action: 'Order placed', details: null },
      { timestamp: ago(240_000 + n * 30_000), actor: 'Staff', action: 'Order accepted', details: null },
      { timestamp: ago(180_000 + n * 20_000), actor: 'Staff', action: 'Preparing started', details: null },
    ],
    coupon_code: null, shop_id: SHOP_ID, is_priority: n === 5,
  })),

  // ---- READY (3) ----
  ...[11,12,13].map((n): Order => ({
    id: `ord-0${n}`, order_number: `ORD-20260217-00${n}`, status: 'ready',
    created_at: ago(600_000 + n * 60_000), accepted_at: ago(540_000), preparing_started_at: ago(480_000), ready_at: ago(120_000 + n * 30_000), delivered_at: null,
    sla_accept_by: ago(500_000), sla_deliver_by: iso(300_000),
    items: [
      { id: `oi-r${n}`, menu_item_id: 'item-cold-brew', name: 'Cold Brew', quantity: 1, unit_price: 5.50, modifiers: [], notes: null, status: 'available' },
    ],
    subtotal: 5.50, discount_applied: 0, total: 5.50, currency: 'USD',
    destination_gate: gate(), destination_zone: zone(), passenger_alias: pax(n),
    runner_id: `runner-${n % 3 + 1}`, runner_name: ['Ahmed K.', 'Sara M.', 'John D.'][n % 3], reject_reason: null, reject_notes: null,
    refund_status: 'none', refund_amount: null, refund_reason: null,
    event_log: [
      { timestamp: ago(600_000 + n * 60_000), actor: 'System', action: 'Order placed', details: null },
      { timestamp: ago(540_000), actor: 'Staff', action: 'Order accepted', details: null },
      { timestamp: ago(480_000), actor: 'Staff', action: 'Preparing started', details: null },
      { timestamp: ago(120_000 + n * 30_000), actor: 'Staff', action: 'Marked ready', details: null },
      { timestamp: ago(60_000), actor: 'System', action: 'Runner assigned', details: null },
    ],
    coupon_code: null, shop_id: SHOP_ID, is_priority: false,
  })),

  // ---- COMPLETED / DELIVERED (16) ----
  ...[14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29].map((n): Order => ({
    id: `ord-0${n}`, order_number: `ORD-20260217-00${n}`, status: 'delivered',
    created_at: ago(n * 1_800_000), accepted_at: ago(n * 1_800_000 - 60_000), preparing_started_at: ago(n * 1_800_000 - 180_000), ready_at: ago(n * 1_800_000 - 420_000), delivered_at: ago(n * 1_800_000 - 600_000),
    sla_accept_by: ago(n * 1_800_000 - 90_000), sla_deliver_by: ago(n * 1_800_000 - 900_000),
    items: [
      { id: `oi-d${n}`, menu_item_id: 'item-americano', name: 'Americano', quantity: 1, unit_price: 4.50, modifiers: [], notes: null, status: 'available' },
    ],
    subtotal: 4.50, discount_applied: 0, total: 4.50, currency: 'USD',
    destination_gate: gate(), destination_zone: zone(), passenger_alias: pax(n),
    runner_id: `runner-${n % 4 + 1}`, runner_name: ['Ahmed K.', 'Sara M.', 'John D.', 'Li W.'][n % 4], reject_reason: null, reject_notes: null,
    refund_status: 'none', refund_amount: null, refund_reason: null,
    event_log: [
      { timestamp: ago(n * 1_800_000), actor: 'System', action: 'Order placed', details: null },
      { timestamp: ago(n * 1_800_000 - 60_000), actor: 'Staff', action: 'Order accepted', details: null },
      { timestamp: ago(n * 1_800_000 - 600_000), actor: 'Runner', action: 'Delivered', details: 'Handed to passenger at gate' },
    ],
    coupon_code: null, shop_id: SHOP_ID, is_priority: false,
  })),

  // ---- ISSUES (6) ----
  // 2 rejected
  {
    id: 'ord-030', order_number: 'ORD-20260217-0030', status: 'rejected',
    created_at: ago(3_600_000), accepted_at: null, preparing_started_at: null, ready_at: null, delivered_at: null,
    sla_accept_by: ago(3_510_000), sla_deliver_by: ago(2_700_000),
    items: [{ id: 'oi-rej1', menu_item_id: 'item-mocha', name: 'Mocha', quantity: 1, unit_price: 6.00, modifiers: [], notes: null, status: 'out_of_stock' }],
    subtotal: 6.00, discount_applied: 0, total: 6.00, currency: 'USD',
    destination_gate: 'A5', destination_zone: 'Zone A - Departures', passenger_alias: pax(30),
    runner_id: null, runner_name: null, reject_reason: 'out_of_stock', reject_notes: 'Mocha syrup depleted',
    refund_status: 'approved', refund_amount: 6.00, refund_reason: 'merchant_rejected',
    event_log: [
      { timestamp: ago(3_600_000), actor: 'System', action: 'Order placed', details: null },
      { timestamp: ago(3_540_000), actor: 'Staff', action: 'Order rejected', details: 'Reason: Out of Stock' },
      { timestamp: ago(3_500_000), actor: 'System', action: 'Auto-refund issued', details: '$6.00 refunded' },
    ],
    coupon_code: null, shop_id: SHOP_ID, is_priority: false,
  },
  {
    id: 'ord-031', order_number: 'ORD-20260217-0031', status: 'rejected',
    created_at: ago(5_400_000), accepted_at: null, preparing_started_at: null, ready_at: null, delivered_at: null,
    sla_accept_by: ago(5_310_000), sla_deliver_by: ago(4_500_000),
    items: [{ id: 'oi-rej2', menu_item_id: 'item-panini', name: 'Grilled Panini', quantity: 2, unit_price: 9.50, modifiers: [], notes: null, status: 'available' }],
    subtotal: 19.00, discount_applied: 0, total: 19.00, currency: 'USD',
    destination_gate: 'B2', destination_zone: 'Zone B - International', passenger_alias: pax(31),
    runner_id: null, runner_name: null, reject_reason: 'too_busy', reject_notes: null,
    refund_status: 'approved', refund_amount: 19.00, refund_reason: 'merchant_rejected',
    event_log: [
      { timestamp: ago(5_400_000), actor: 'System', action: 'Order placed', details: null },
      { timestamp: ago(5_340_000), actor: 'Staff', action: 'Order rejected', details: 'Reason: Too Busy' },
    ],
    coupon_code: null, shop_id: SHOP_ID, is_priority: false,
  },
  // 2 failed
  {
    id: 'ord-032', order_number: 'ORD-20260217-0032', status: 'failed',
    created_at: ago(7_200_000), accepted_at: ago(7_110_000), preparing_started_at: ago(6_900_000), ready_at: ago(6_600_000), delivered_at: null,
    sla_accept_by: ago(7_110_000), sla_deliver_by: ago(6_300_000),
    items: [{ id: 'oi-f1', menu_item_id: 'item-caesar-salad', name: 'Caesar Salad', quantity: 1, unit_price: 10.00, modifiers: [], notes: null, status: 'available' }],
    subtotal: 10.00, discount_applied: 0, total: 10.00, currency: 'USD',
    destination_gate: 'A7', destination_zone: 'Zone A - Departures', passenger_alias: pax(32),
    runner_id: 'runner-2', runner_name: 'Sara M.', reject_reason: null, reject_notes: null,
    refund_status: 'approved', refund_amount: 10.00, refund_reason: 'order_failed',
    event_log: [
      { timestamp: ago(7_200_000), actor: 'System', action: 'Order placed', details: null },
      { timestamp: ago(6_600_000), actor: 'Staff', action: 'Marked ready', details: null },
      { timestamp: ago(6_300_000), actor: 'Runner', action: 'Delivery failed', details: 'Passenger not found at gate' },
    ],
    coupon_code: null, shop_id: SHOP_ID, is_priority: false,
  },
  {
    id: 'ord-033', order_number: 'ORD-20260217-0033', status: 'failed',
    created_at: ago(10_800_000), accepted_at: ago(10_710_000), preparing_started_at: ago(10_500_000), ready_at: ago(10_200_000), delivered_at: null,
    sla_accept_by: ago(10_710_000), sla_deliver_by: ago(9_900_000),
    items: [{ id: 'oi-f2', menu_item_id: 'item-smoothie', name: 'Berry Smoothie', quantity: 1, unit_price: 7.00, modifiers: [], notes: null, status: 'available' }],
    subtotal: 7.00, discount_applied: 0, total: 7.00, currency: 'USD',
    destination_gate: 'B6', destination_zone: 'Zone B - International', passenger_alias: pax(33),
    runner_id: 'runner-3', runner_name: 'John D.', reject_reason: null, reject_notes: null,
    refund_status: 'pending_approval', refund_amount: 7.00, refund_reason: 'order_failed',
    event_log: [
      { timestamp: ago(10_800_000), actor: 'System', action: 'Order placed', details: null },
      { timestamp: ago(10_200_000), actor: 'Staff', action: 'Marked ready', details: null },
      { timestamp: ago(9_900_000), actor: 'Runner', action: 'Delivery failed', details: 'Gate closed' },
    ],
    coupon_code: null, shop_id: SHOP_ID, is_priority: false,
  },
  // 2 refund_requested
  {
    id: 'ord-034', order_number: 'ORD-20260217-0034', status: 'refund_requested',
    created_at: ago(14_400_000), accepted_at: ago(14_310_000), preparing_started_at: ago(14_100_000), ready_at: ago(13_800_000), delivered_at: ago(13_500_000),
    sla_accept_by: ago(14_310_000), sla_deliver_by: ago(13_500_000),
    items: [{ id: 'oi-rf1', menu_item_id: 'item-wrap', name: 'Falafel Wrap', quantity: 1, unit_price: 9.00, modifiers: [], notes: null, status: 'available' }],
    subtotal: 9.00, discount_applied: 0, total: 9.00, currency: 'USD',
    destination_gate: 'A2', destination_zone: 'Zone A - Departures', passenger_alias: pax(34),
    runner_id: 'runner-1', runner_name: 'Ahmed K.', reject_reason: null, reject_notes: null,
    refund_status: 'pending_approval', refund_amount: 9.00, refund_reason: 'wrong_item',
    event_log: [
      { timestamp: ago(14_400_000), actor: 'System', action: 'Order placed', details: null },
      { timestamp: ago(13_500_000), actor: 'Runner', action: 'Delivered', details: null },
      { timestamp: ago(12_600_000), actor: 'Staff', action: 'Refund requested', details: 'Wrong item - passenger reported' },
    ],
    coupon_code: null, shop_id: SHOP_ID, is_priority: false,
  },
  {
    id: 'ord-035', order_number: 'ORD-20260217-0035', status: 'refund_requested',
    created_at: ago(18_000_000), accepted_at: ago(17_910_000), preparing_started_at: ago(17_700_000), ready_at: ago(17_400_000), delivered_at: ago(17_100_000),
    sla_accept_by: ago(17_910_000), sla_deliver_by: ago(17_100_000),
    items: [
      { id: 'oi-rf2a', menu_item_id: 'item-quiche', name: 'Quiche Lorraine', quantity: 1, unit_price: 8.50, modifiers: [], notes: null, status: 'available' },
      { id: 'oi-rf2b', menu_item_id: 'item-fresh-oj', name: 'Fresh Orange Juice', quantity: 1, unit_price: 6.00, modifiers: [], notes: null, status: 'available' },
    ],
    subtotal: 14.50, discount_applied: 0, total: 14.50, currency: 'USD',
    destination_gate: 'B3', destination_zone: 'Zone B - International', passenger_alias: pax(35),
    runner_id: 'runner-4', runner_name: 'Li W.', reject_reason: null, reject_notes: null,
    refund_status: 'pending_approval', refund_amount: 14.50, refund_reason: 'quality_issue',
    event_log: [
      { timestamp: ago(18_000_000), actor: 'System', action: 'Order placed', details: null },
      { timestamp: ago(17_100_000), actor: 'Runner', action: 'Delivered', details: null },
      { timestamp: ago(16_200_000), actor: 'Staff', action: 'Refund requested', details: 'Quality issue reported by passenger' },
    ],
    coupon_code: null, shop_id: SHOP_ID, is_priority: false,
  },
];
