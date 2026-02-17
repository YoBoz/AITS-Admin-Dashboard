import { Switch } from '@/components/ui/Switch';
import { cn } from '@/lib/utils';
import { useMerchantStore } from '@/store/merchant.store';
import { Pause, Play } from 'lucide-react';

interface BusyModeToggleProps {
  className?: string;
}

export function BusyModeToggle({ className }: BusyModeToggleProps) {
  const { isStoreOpen, toggleStore } = useMerchantStore();

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg border px-3 py-1.5',
        isStoreOpen
          ? 'border-status-success/30 bg-status-success/5'
          : 'border-destructive/30 bg-destructive/5',
        className
      )}
    >
      {isStoreOpen ? (
        <Play className="h-3.5 w-3.5 text-status-success" />
      ) : (
        <Pause className="h-3.5 w-3.5 text-destructive" />
      )}
      <span className="text-xs font-medium text-foreground">
        {isStoreOpen ? 'Open' : 'Paused'}
      </span>
      <Switch
        checked={isStoreOpen}
        onCheckedChange={(checked) => toggleStore(!!checked)}
        aria-label="Toggle store open/paused"
      />
    </div>
  );
}
