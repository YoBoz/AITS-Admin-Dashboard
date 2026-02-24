import React, { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock, MapPin, Plane, AlertTriangle, Star,
  Check, X, Play, Package, Truck, DollarSign,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { RequirePermission } from '@/components/merchant/RequirePermission';
import { Button } from '@/components/ui/Button';
import { useMerchantStore } from '@/store/merchant.store';
import type { Order } from '@/types/order.types';

// ─── SLA Timer Hook (inline, performance-optimized) ───────────────────
function useCardSLA(slaBy: string | null, active: boolean, totalWindow = 120) {
  const deadline = useMemo(() => (slaBy ? new Date(slaBy).getTime() : null), [slaBy]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!deadline || !active) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [deadline, active]);

  if (!deadline) return { seconds: 0, pct: 100, urgency: 'ok' as const, expired: false };
  const diff = Math.max(0, Math.floor((deadline - now) / 1000));
  const pct = totalWindow > 0 ? Math.min(100, Math.max(0, (diff / totalWindow) * 100)) : 0;
  let urgency: 'ok' | 'warning' | 'critical' = 'ok';
  if (pct <= 0) urgency = 'critical';
  else if (pct < 30) urgency = 'critical';
  else if (pct < 60) urgency = 'warning';

  return { seconds: diff, pct, urgency, expired: diff <= 0 };
}

function formatTimer(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function timeSince(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

// ─── Store Closed render prop ─────────────────────────────────────────
function StoreClosed({ children }: { children: (closed: boolean) => React.ReactNode }) {
  const closed = useMerchantStore((s) => s.slaSettings.is_store_closed);
  return <>{children(closed)}</>;
}

// ─── Types ────────────────────────────────────────────────────────────
interface OrderCardProps {
  order: Order;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onStartPreparing?: (id: string) => void;
  onMarkReady?: (id: string) => void;
  onMarkPickedUp?: (id: string) => void;
  onRefund?: (order: Order) => void;
  isTransitioning?: boolean;
}

// ─── Urgency Colors ───────────────────────────────────────────────────
const URGENCY_COLORS = {
  ok: {
    bar: 'bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800',
    ring: '',
  },
  warning: {
    bar: 'bg-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
    ring: '',
  },
  critical: {
    bar: 'bg-red-500',
    text: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-200 dark:border-red-800',
    ring: 'ring-2 ring-red-500/30',
  },
};

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400' },
  accepted: { label: 'Accepted', color: 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400' },
  preparing: { label: 'Preparing', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' },
  ready: { label: 'Ready', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' },
  in_transit: { label: 'In Transit', color: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400' },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400' },
  refund_requested: { label: 'Refund Req.', color: 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400' },
  refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-700 dark:bg-gray-950/40 dark:text-gray-400' },
};

// ─── Component ────────────────────────────────────────────────────────
export const OrderCard = React.forwardRef<HTMLDivElement, OrderCardProps>(function OrderCard({
  order,
  onAccept,
  onReject,
  onStartPreparing,
  onMarkReady,
  onMarkPickedUp,
  onRefund,
  isTransitioning = false,
}, ref) {
  const showSLA = order.status === 'new';
  const sla = useCardSLA(order.sla_accept_by, showSLA, 120);
  const statusBadge = STATUS_BADGES[order.status] || STATUS_BADGES.new;

  const urgencyColors = showSLA ? URGENCY_COLORS[sla.urgency] : null;

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: isTransitioning ? 0.6 : 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, x: -20 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md',
        showSLA && urgencyColors?.ring,
        showSLA && sla.expired && 'animate-pulse',
        order.is_priority && 'border-l-4 border-l-brand',
      )}
    >
      {/* Header: Order ID + Status + Time */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-bold font-mono text-foreground truncate">
            #{order.order_number}
          </span>
          {order.is_priority && (
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
          )}
          <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full', statusBadge.color)}>
            {statusBadge.label}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground whitespace-nowrap font-mono">
          {timeSince(order.created_at)}
        </span>
      </div>

      {/* SLA Timer Bar (New orders only) */}
      {showSLA && urgencyColors && (
        <div className={cn('rounded-lg px-3 py-2 mb-3 flex items-center gap-2', urgencyColors.bg)}>
          <Clock className={cn('h-3.5 w-3.5 shrink-0', urgencyColors.text)} />
          <div className="flex-1 min-w-0">
            <div className="h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
              <motion.div
                className={cn('h-full rounded-full', urgencyColors.bar)}
                initial={false}
                animate={{ width: `${sla.pct}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          <span className={cn(
            'text-xs font-bold font-mono tabular-nums',
            urgencyColors.text,
            sla.expired && 'animate-pulse',
          )}>
            {sla.expired ? 'EXPIRED' : formatTimer(sla.seconds)}
          </span>
        </div>
      )}

      {/* Destination + Flight */}
      <div className="flex items-center gap-3 mb-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          <span className="font-semibold text-foreground">{order.destination_gate}</span>
        </span>
        {order.flight_number && (
          <span className="flex items-center gap-1">
            <Plane className="h-3 w-3" />
            {order.flight_number}
          </span>
        )}
        <span className="ml-auto font-semibold text-foreground">
          {order.currency} {order.total.toFixed(2)}
        </span>
      </div>

      {/* Order Items — always visible */}
      <div className="pt-1 pb-1 space-y-1.5 border-t border-border mt-2">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-start justify-between text-xs">
            <div className="min-w-0">
              <span className="font-medium text-foreground">
                {item.quantity}× {item.name}
              </span>
              {item.modifiers.length > 0 && (
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {item.modifiers.map((m) => m.name).join(', ')}
                </p>
              )}
              {item.notes && (
                <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5 italic">
                  Note: {item.notes}
                </p>
              )}
            </div>
            <span className="text-muted-foreground font-mono shrink-0 ml-2">
              {(item.unit_price * item.quantity + item.modifiers.reduce((a, m) => a + m.price, 0)).toFixed(2)}
            </span>
          </div>
        ))}
        {order.notes && (
          <div className="flex items-start gap-1 text-[10px] text-amber-600 dark:text-amber-400 pt-1 border-t border-border">
            <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" />
            <span>{order.notes}</span>
          </div>
        )}
      </div>

      {/* Action Buttons — state-dependent */}
      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border">
        {/* New → Accept / Reject */}
        {order.status === 'new' && (
          <>
            <RequirePermission permission="orders.accept" disableInstead>
              <StoreClosed>
                {(closed) => (
                  <Button
                    size="sm"
                    className="flex-1 h-8 text-xs font-semibold gap-1"
                    onClick={() => onAccept?.(order.id)}
                    disabled={isTransitioning || closed}
                    title={closed ? 'Store is closed — cannot accept orders' : undefined}
                  >
                    <Check className="h-3 w-3" /> {closed ? 'Store Closed' : 'Accept'}
                  </Button>
                )}
              </StoreClosed>
            </RequirePermission>
            <RequirePermission permission="orders.reject" disableInstead>
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs font-semibold gap-1 text-destructive hover:bg-destructive/10"
                onClick={() => onReject?.(order.id)}
                disabled={isTransitioning}
              >
                <X className="h-3 w-3" /> Reject
              </Button>
            </RequirePermission>
          </>
        )}

        {/* Accepted → Start Preparing */}
        {order.status === 'accepted' && (
          <RequirePermission permission="orders.prepare" disableInstead>
            <Button
              size="sm"
              className="flex-1 h-8 text-xs font-semibold gap-1"
              onClick={() => onStartPreparing?.(order.id)}
              disabled={isTransitioning}
            >
              <Play className="h-3 w-3" /> Start Preparing
            </Button>
          </RequirePermission>
        )}

        {/* Preparing → Mark Ready */}
        {order.status === 'preparing' && (
          <RequirePermission permission="orders.ready" disableInstead>
            <Button
              size="sm"
              className="flex-1 h-8 text-xs font-semibold gap-1"
              onClick={() => onMarkReady?.(order.id)}
              disabled={isTransitioning}
            >
              <Package className="h-3 w-3" /> Mark Ready
            </Button>
          </RequirePermission>
        )}

        {/* Ready → Awaiting Pickup */}
        {order.status === 'ready' && (
          <div className="flex-1 flex items-center gap-2">
            <div className="flex-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Truck className="h-3.5 w-3.5" />
              <span>{order.runner_name ? `Runner: ${order.runner_name}` : 'Awaiting runner...'}</span>
            </div>
            {onMarkPickedUp && (
              <RequirePermission permission="orders.accept" disableInstead>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs font-semibold gap-1"
                  onClick={() => onMarkPickedUp(order.id)}
                  disabled={isTransitioning}
                >
                  <Truck className="h-3 w-3" /> Picked Up
                </Button>
              </RequirePermission>
            )}
          </div>
        )}

        {/* Completed — refund action available */}
        {(order.status === 'delivered' || order.status === 'in_transit') && (
          <div className="flex-1 flex items-center gap-2">
            <span className="text-xs text-muted-foreground italic">
              {order.status === 'in_transit' ? 'En route to gate' : 'Delivered'}
            </span>
            {order.status === 'delivered' && order.refund_status === 'none' && onRefund && (
              <RequirePermission permission="refunds.request" disableInstead>
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-auto h-7 text-[10px] font-semibold gap-1 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                  onClick={() => onRefund(order)}
                  disabled={isTransitioning}
                >
                  <DollarSign className="h-3 w-3" /> Refund
                </Button>
              </RequirePermission>
            )}
          </div>
        )}

        {/* Issues — info + refund action */}
        {['rejected', 'failed', 'refund_requested', 'refunded'].includes(order.status) && (
          <div className="flex-1 flex items-center gap-2">
            <div className="text-xs min-w-0">
              {order.reject_reason && (
                <span className="text-destructive font-medium">Reason: {order.reject_reason}</span>
              )}
              {order.refund_status !== 'none' && (
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  Refund: {order.refund_status === 'pending_approval' ? 'Pending' : order.refund_status}
                  {order.refund_amount ? ` (${order.currency} ${order.refund_amount.toFixed(2)})` : ''}
                </span>
              )}
            </div>
            {order.refund_status === 'none' && onRefund && (
              <RequirePermission permission="refunds.request" disableInstead>
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-auto h-7 text-[10px] font-semibold gap-1 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 shrink-0"
                  onClick={() => onRefund(order)}
                  disabled={isTransitioning}
                >
                  <DollarSign className="h-3 w-3" /> Refund
                </Button>
              </RequirePermission>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
});
