import { Switch } from '@/components/ui/Switch';
import { cn } from '@/lib/utils';
import type { AdminUserStatus } from '@/types/permissions.types';

interface UserStatusToggleProps {
  status: AdminUserStatus;
  disabled?: boolean;
  onChange?: (active: boolean) => void;
}

export function UserStatusToggle({ status, disabled, onChange }: UserStatusToggleProps) {
  const isActive = status === 'active';
  const isPending = status === 'pending_invite';

  if (isPending) {
    return (
      <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 rounded-full px-2 py-0.5">
        Pending
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={isActive}
        disabled={disabled}
        onCheckedChange={(checked) => onChange?.(checked)}
      />
      <span
        className={cn(
          'text-[10px] font-mono',
          isActive ? 'text-emerald-500' : 'text-muted-foreground',
        )}
      >
        {isActive ? 'Active' : status === 'suspended' ? 'Suspended' : 'Inactive'}
      </span>
    </div>
  );
}
