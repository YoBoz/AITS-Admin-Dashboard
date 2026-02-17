import { Switch } from '@/components/ui/Switch';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

interface AvailabilityToggleProps {
  label: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function AvailabilityToggle({
  label,
  checked,
  onCheckedChange,
  disabled,
  className,
}: AvailabilityToggleProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-label={label}
      />
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        {checked ? (
          <>
            <Eye className="h-3.5 w-3.5 text-status-success" />
            Available
          </>
        ) : (
          <>
            <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
            Hidden
          </>
        )}
      </span>
    </div>
  );
}
