export type OrderStatus =
  | 'new'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'in_transit'
  | 'delivered'
  | 'rejected'
  | 'failed'
  | 'refund_requested'
  | 'refunded';

export interface OrderItem {
  id: string;
  menu_item_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  modifiers: { name: string; price: number }[];
  notes: string | null;
  status: 'available' | 'out_of_stock' | 'substituted' | 'pending';
}

export interface OrderEvent {
  timestamp: string;
  actor: string;
  action: string;
  details: string | null;
}

export interface Order {
  id: string;
  order_number: string;
  status: OrderStatus;
  created_at: string;
  accepted_at: string | null;
  preparing_started_at: string | null;
  ready_at: string | null;
  delivered_at: string | null;
  sla_accept_by: string;
  sla_deliver_by: string;
  items: OrderItem[];
  subtotal: number;
  discount_applied: number;
  service_fee?: number;
  total: number;
  currency: string;
  destination_gate: string;
  destination_zone: string;
  passenger_alias: string;
  passenger_phone?: string | null;
  flight_number?: string | null;
  departure_time?: string | null;
  payment_method?: string;
  payment_status?: 'pending' | 'paid' | 'refunded' | 'failed';
  notes?: string | null;
  runner_id: string | null;
  runner_name: string | null;
  reject_reason: string | null;
  reject_notes: string | null;
  refund_status: 'none' | 'pending_approval' | 'approved' | 'declined';
  refund_amount: number | null;
  refund_reason: string | null;
  event_log: OrderEvent[];
  coupon_code: string | null;
  shop_id: string;
  is_priority: boolean;
}
