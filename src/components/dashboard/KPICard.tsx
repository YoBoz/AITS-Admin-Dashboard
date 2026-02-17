import { motion } from 'framer-motion';
import {
  ShoppingCart, Users, AlertTriangle, Store, Clock, BarChart2,
  TrendingUp, TrendingDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { KPIData } from '@/data/mock/overview.mock';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  ShoppingCart, Users, AlertTriangle, Store, Clock, BarChart2,
};

const colorMap: Record<string, string> = {
  primary: 'bg-brand/10 text-brand',
  success: 'bg-status-success/10 text-status-success',
  warning: 'bg-status-warning/10 text-status-warning',
  info: 'bg-status-info/10 text-status-info',
};

interface KPICardProps {
  data: KPIData;
  index: number;
}

export function KPICard({ data, index }: KPICardProps) {
  const Icon = iconMap[data.icon] || BarChart2;
  const isPositive = data.trendType === 'up' || data.trendType === 'down_good';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="group rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', colorMap[data.color])}>
          <Icon className="h-5 w-5" />
        </div>
        <div className={cn(
          'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
          isPositive ? 'bg-status-success/10 text-status-success' : 'bg-status-error/10 text-status-error'
        )}>
          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {data.trend}
        </div>
      </div>
      <div className="mt-4">
        <p className="font-roboto text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {data.title}
        </p>
        <p className="mt-1 text-2xl font-bold font-montserrat text-foreground">
          {data.value}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground font-lexend">
          {data.subtitle}
        </p>
      </div>
    </motion.div>
  );
}
