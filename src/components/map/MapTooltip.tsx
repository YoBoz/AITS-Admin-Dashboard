import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ShoppingCart, Store, MapPin, Battery, Activity, Users } from 'lucide-react';

interface MapTooltipProps {
  visible: boolean;
  x: number;
  y: number;
  type: 'zone' | 'shop' | 'trolley';
  data: {
    name: string;
    subtitle?: string;
    status?: string;
    battery?: number;
    visitors?: number;
    shopCount?: number;
    trolleyCount?: number;
  };
}

export function MapTooltip({ visible, x, y, type, data }: MapTooltipProps) {
  const iconMap = {
    zone: MapPin,
    shop: Store,
    trolley: ShoppingCart,
  };

  const Icon = iconMap[type];

  const statusColor: Record<string, string> = {
    active: 'bg-green-500',
    idle: 'bg-amber-500',
    charging: 'bg-blue-500',
    maintenance: 'bg-red-500',
    inactive: 'bg-gray-400',
    suspended: 'bg-red-400',
    pending: 'bg-amber-400',
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
          className={cn(
            'absolute z-50 pointer-events-none',
            'bg-card border border-border rounded-lg shadow-xl p-3 min-w-[180px]'
          )}
          style={{
            left: x + 16,
            top: y - 10,
          }}
        >
          <div className="flex items-start gap-2">
            <div className="p-1.5 rounded bg-muted">
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {data.name}
              </p>
              {data.subtitle && (
                <p className="text-xs text-muted-foreground truncate">
                  {data.subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="mt-2 space-y-1.5">
            {data.status && (
              <div className="flex items-center gap-2 text-xs">
                <span
                  className={cn(
                    'h-2 w-2 rounded-full',
                    statusColor[data.status] || 'bg-gray-400'
                  )}
                />
                <span className="text-muted-foreground capitalize">
                  {data.status.replace(/_/g, ' ')}
                </span>
              </div>
            )}

            {data.battery !== undefined && (
              <div className="flex items-center gap-2 text-xs">
                <Battery className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {data.battery}% Battery
                </span>
              </div>
            )}

            {data.visitors !== undefined && (
              <div className="flex items-center gap-2 text-xs">
                <Users className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {data.visitors.toLocaleString()} visitors
                </span>
              </div>
            )}

            {data.shopCount !== undefined && (
              <div className="flex items-center gap-2 text-xs">
                <Store className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {data.shopCount} shops
                </span>
              </div>
            )}

            {data.trolleyCount !== undefined && (
              <div className="flex items-center gap-2 text-xs">
                <Activity className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {data.trolleyCount} trolleys
                </span>
              </div>
            )}
          </div>

          {/* Arrow */}
          <div
            className="absolute top-3 -left-1.5 w-3 h-3 bg-card border-l border-b border-border rotate-45"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
