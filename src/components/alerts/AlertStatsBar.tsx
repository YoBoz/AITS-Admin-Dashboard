import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface AlertStatsBarProps {
  critical: number;
  warnings: number;
  info: number;
  resolved: number;
}

const stats = [
  { key: 'critical', label: 'Critical Active', icon: <AlertCircle className="h-5 w-5" />, color: 'text-destructive', bg: 'bg-destructive/10' },
  { key: 'warnings', label: 'Warnings', icon: <AlertTriangle className="h-5 w-5" />, color: 'text-status-warning', bg: 'bg-status-warning/10' },
  { key: 'info', label: 'Info', icon: <Info className="h-5 w-5" />, color: 'text-status-info', bg: 'bg-status-info/10' },
  { key: 'resolved', label: 'Resolved Today', icon: <CheckCircle className="h-5 w-5" />, color: 'text-status-success', bg: 'bg-status-success/10' },
] as const;

export function AlertStatsBar({ critical, warnings, info, resolved }: AlertStatsBarProps) {
  const values: Record<string, number> = { critical, warnings, info, resolved };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05, duration: 0.3 }}
          className={cn(
            'flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card'
          )}
        >
          <div className={cn('p-2 rounded-lg', stat.bg, stat.color)}>
            {stat.icon}
          </div>
          <div>
            <div className="text-2xl font-bold font-montserrat text-foreground">
              {values[stat.key]}
            </div>
            <div className="text-[11px] text-muted-foreground font-lexend">
              {stat.label}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
