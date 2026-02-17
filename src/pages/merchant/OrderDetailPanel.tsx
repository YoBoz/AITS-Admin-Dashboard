import { useState } from 'react';
import { useOrdersStore } from '@/store/orders.store';
import { useMerchantAuth } from '@/hooks/useMerchantAuth';
import { SLACountdown } from '@/components/merchant/SLACountdown';
import { OrderStatusStepper } from '@/components/merchant/OrderStatusStepper';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RejectOrderModal } from './RejectOrderModal';
import { RefundRequestModal } from './RefundRequestModal';
import type { Order, OrderStatus } from '@/types/order.types';
import {
  User,
  MapPin,
  Phone,
  Plane,
  Clock,
  DollarSign,
  Check,
  ChefHat,
  Package,
  XCircle,
  RotateCcw,
} from 'lucide-react';

interface OrderDetailPanelProps {
  order: Order;
}

export function OrderDetailPanel({ order }: OrderDetailPanelProps) {
  const { updateOrderStatus } = useOrdersStore();
  const { canDo } = useMerchantAuth();
  const [showReject, setShowReject] = useState(false);
  const [showRefund, setShowRefund] = useState(false);

  const handleAccept = () => {
    updateOrderStatus(order.id, 'accepted');
  };
  const handleStartPreparing = () => {
    updateOrderStatus(order.id, 'preparing');
  };
  const handleMarkReady = () => {
    updateOrderStatus(order.id, 'ready');
  };

  const actionButtons: Record<OrderStatus, React.ReactNode> = {
    new: (
      <div className="flex gap-2">
        <Button onClick={handleAccept} className="flex-1">
          <Check className="h-4 w-4 mr-1" /> Accept
        </Button>
        {canDo('orders.reject') && (
          <Button variant="destructive" onClick={() => setShowReject(true)} className="flex-1">
            <XCircle className="h-4 w-4 mr-1" /> Reject
          </Button>
        )}
      </div>
    ),
    accepted: (
      <Button onClick={handleStartPreparing} className="w-full">
        <ChefHat className="h-4 w-4 mr-1" /> Start Preparing
      </Button>
    ),
    preparing: (
      <Button onClick={handleMarkReady} className="w-full">
        <Package className="h-4 w-4 mr-1" /> Mark Ready
      </Button>
    ),
    ready: null,
    in_transit: null,
    delivered: canDo('refunds.request') ? (
      <Button variant="outline" onClick={() => setShowRefund(true)} className="w-full">
        <RotateCcw className="h-4 w-4 mr-1" /> Request Refund
      </Button>
    ) : null,
    rejected: null,
    failed: canDo('refunds.request') ? (
      <Button variant="outline" onClick={() => setShowRefund(true)} className="w-full">
        <RotateCcw className="h-4 w-4 mr-1" /> Request Refund
      </Button>
    ) : null,
    refund_requested: null,
    refunded: null,
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-6 scrollbar-thin">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold font-mono text-foreground">{order.order_number}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        {order.status === 'new' && order.sla_accept_by && (
          <SLACountdown slaBy={order.sla_accept_by} size="lg" />
        )}
      </div>

      {/* Status stepper */}
      <OrderStatusStepper status={order.status} />

      {/* Customer info */}
      <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-2">
        <h3 className="text-sm font-semibold text-foreground mb-2">Customer</h3>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" /> {order.passenger_alias}
          </span>
          <span className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" /> {order.passenger_phone ?? 'N/A'}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" /> Gate {order.destination_gate}
          </span>
          <span className="flex items-center gap-1.5">
            <Plane className="h-3.5 w-3.5" /> {order.flight_number ?? 'N/A'}
          </span>
          {order.departure_time && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Departs{' '}
              {new Date(order.departure_time).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}
        </div>
      </div>

      {/* Items */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-2">Items</h3>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-md border border-border bg-card p-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {item.quantity}× {item.name}
                </p>
                {item.modifiers.length > 0 && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {item.modifiers.map((m) => m.name).join(', ')}
                  </p>
                )}
                {item.notes && (
                  <p className="text-[10px] text-status-warning mt-0.5 italic">Note: {item.notes}</p>
                )}
              </div>
              <span className="text-sm font-semibold text-foreground ml-2">
                AED {(item.unit_price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment summary */}
      <div className="rounded-lg border border-border p-4 space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Subtotal</span>
          <span>AED {order.subtotal.toFixed(2)}</span>
        </div>
        {order.discount_applied > 0 && (
          <div className="flex justify-between text-xs text-status-success">
            <span>Discount</span>
            <span>−AED {order.discount_applied.toFixed(2)}</span>
          </div>
        )}
        {(order.service_fee ?? 0) > 0 && (
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Service fee</span>
            <span>AED {(order.service_fee ?? 0).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-semibold text-foreground pt-1.5 border-t border-border">
          <span className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" /> Total
          </span>
          <span>AED {order.total.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2 pt-1">
          {order.payment_method && (
            <Badge variant="outline" className="text-[10px] capitalize">
              {order.payment_method}
            </Badge>
          )}
          {order.payment_status && (
            <Badge variant="success" className="text-[10px] capitalize">
              {order.payment_status}
            </Badge>
          )}
        </div>
      </div>

      {/* Runner info */}
      {order.runner_name && (
        <div className="rounded-lg border border-border bg-muted/20 p-3">
          <p className="text-xs text-muted-foreground">
            Runner: <span className="font-medium text-foreground">{order.runner_name}</span>
          </p>
        </div>
      )}

      {/* Rejection / Refund info */}
      {order.reject_reason && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
          <p className="text-xs font-medium text-destructive">Rejected: {order.reject_reason}</p>
          {order.reject_notes && (
            <p className="text-xs text-muted-foreground mt-1">{order.reject_notes}</p>
          )}
        </div>
      )}
      {order.refund_status && order.refund_status !== 'none' && (
        <div className="rounded-lg border border-status-warning/30 bg-status-warning/5 p-3">
          <p className="text-xs font-medium text-status-warning capitalize">
            Refund: {order.refund_status.replace('_', ' ')}
          </p>
          {order.refund_amount && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Amount: AED {order.refund_amount.toFixed(2)}
            </p>
          )}
          {order.refund_reason && (
            <p className="text-xs text-muted-foreground mt-0.5">Reason: {order.refund_reason}</p>
          )}
        </div>
      )}

      {/* Event log */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-2">Event Log</h3>
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {order.event_log.map((ev, i) => (
            <div key={i} className="flex items-start gap-2 text-[10px] text-muted-foreground">
              <span className="font-mono shrink-0">
                {new Date(ev.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
              <span className="font-medium text-foreground">{ev.actor}</span>
              <span>{ev.details}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      {actionButtons[order.status] && (
        <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm py-3 border-t border-border">
          {actionButtons[order.status]}
        </div>
      )}

      {/* Modals */}
      <RejectOrderModal
        open={showReject}
        onOpenChange={setShowReject}
        orderId={order.id}
        orderReference={order.order_number}
      />
      <RefundRequestModal
        open={showRefund}
        onOpenChange={setShowRefund}
        order={order}
      />
    </div>
  );
}
