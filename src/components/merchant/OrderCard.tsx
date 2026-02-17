import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SLACountdown } from './SLACountdown';
import { Badge } from '@/components/ui/Badge';
import type { Order, OrderStatus } from '@/types/order.types';
import { MapPin, User, Clock, DollarSign, ShoppingBag } from 'lucide-react';

const statusBadgeVariant: Record<OrderStatus, 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'> = {
  new: 'info',
  accepted: 'default',
  preparing: 'warning',
  ready: 'success',
  in_transit: 'secondary',
  delivered: 'success',
  rejected: 'destructive',
  failed: 'destructive',
  refund_requested: 'warning',
  refunded: 'outline',
};

interface OrderCardProps {
  order: Order;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function OrderCard({ order, isSelected, onClick, className }: OrderCardProps) {
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
  const showSLA = order.status === 'new' && order.sla_accept_by;

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      onClick={onClick}
      className={cn(
        'w-full text-left rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md',
        isSelected && 'ring-2 ring-primary border-primary',
        className
      )}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold font-mono text-foreground">
          {order.order_number}
        </span>
        <Badge variant={statusBadgeVariant[order.status]} className="capitalize text-[10px]">
          {order.status.replace('_', ' ')}
        </Badge>
      </div>

      {/* Customer & Gate */}
      <div className="flex items-center gap-3 mb-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <User className="h-3 w-3" />
          {order.passenger_alias}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          Gate {order.destination_gate}
        </span>
      </div>

      {/* Items summary */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
        <ShoppingBag className="h-3 w-3" />
        <span>
          {itemCount} item{itemCount !== 1 ? 's' : ''} &middot;{' '}
          {order.items
            .slice(0, 2)
            .map((i) => i.name)
            .join(', ')}
          {order.items.length > 2 && ` +${order.items.length - 2}`}
        </span>
      </div>

      {/* Footer: total + SLA */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
          <DollarSign className="h-3.5 w-3.5" />
          {order.total.toFixed(2)}
        </span>

        {showSLA ? (
          <SLACountdown slaBy={order.sla_accept_by} size="sm" />
        ) : (
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {new Date(order.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        )}
      </div>
    </motion.button>
  );
}
