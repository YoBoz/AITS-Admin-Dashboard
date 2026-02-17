import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { TabKey } from '@/store/orders.store';

interface Tab {
  key: TabKey;
  label: string;
  count: number;
}

interface OrderTabBarProps {
  tabs: Tab[];
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  className?: string;
}

export function OrderTabBar({ tabs, activeTab, onTabChange, className }: OrderTabBarProps) {
  return (
    <div className={cn('flex gap-1 rounded-lg bg-muted/50 p-1', className)}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              'relative flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground/80'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="order-tab-indicator"
                className="absolute inset-0 rounded-md bg-card shadow-sm"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
            {tab.count > 0 && (
              <span
                className={cn(
                  'relative z-10 min-w-[20px] rounded-full px-1.5 py-0.5 text-[10px] font-bold text-center',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted-foreground/20 text-muted-foreground'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
