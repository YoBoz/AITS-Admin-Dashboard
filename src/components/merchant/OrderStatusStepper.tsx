import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/types/order.types';
import { Check, Circle, ChefHat, Package, Truck, XCircle, RotateCcw } from 'lucide-react';

interface Step {
  key: OrderStatus;
  label: string;
  icon: React.ReactNode;
}

const ORDER_STEPS: Step[] = [
  { key: 'new', label: 'Placed', icon: <Circle className="h-4 w-4" /> },
  { key: 'accepted', label: 'Accepted', icon: <Check className="h-4 w-4" /> },
  { key: 'preparing', label: 'Preparing', icon: <ChefHat className="h-4 w-4" /> },
  { key: 'ready', label: 'Ready', icon: <Package className="h-4 w-4" /> },
  { key: 'in_transit', label: 'In Transit', icon: <Truck className="h-4 w-4" /> },
  { key: 'delivered', label: 'Delivered', icon: <Check className="h-4 w-4" /> },
];

const STATUS_INDEX: Record<string, number> = {};
ORDER_STEPS.forEach((s, i) => {
  STATUS_INDEX[s.key] = i;
});

const TERMINAL_STATUSES = new Set<OrderStatus>(['rejected', 'failed']);

interface OrderStatusStepperProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusStepper({ status, className }: OrderStatusStepperProps) {
  if (TERMINAL_STATUSES.has(status)) {
    const isRejected = status === 'rejected';
    return (
      <div className={cn('flex items-center gap-2 text-sm', className)}>
        {isRejected ? (
          <XCircle className="h-5 w-5 text-destructive" />
        ) : (
          <RotateCcw className="h-5 w-5 text-status-warning" />
        )}
        <span className="font-medium capitalize text-muted-foreground">
          {status.replace('_', ' ')}
        </span>
      </div>
    );
  }

  const currentIndex = STATUS_INDEX[status] ?? 0;

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {ORDER_STEPS.map((step, i) => {
        const isCompleted = i < currentIndex;
        const isCurrent = i === currentIndex;

        return (
          <div key={step.key} className="flex items-center">
            <div
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors',
                isCompleted && 'border-primary bg-primary text-primary-foreground',
                isCurrent && 'border-primary bg-primary/10 text-primary',
                !isCompleted && !isCurrent && 'border-muted-foreground/30 text-muted-foreground/40'
              )}
              title={step.label}
            >
              {step.icon}
            </div>
            {i < ORDER_STEPS.length - 1 && (
              <div
                className={cn(
                  'h-0.5 w-4 transition-colors',
                  i < currentIndex ? 'bg-primary' : 'bg-muted-foreground/20'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
