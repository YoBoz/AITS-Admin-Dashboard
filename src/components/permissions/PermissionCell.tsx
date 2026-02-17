import { cn } from '@/lib/utils';
import { Check, Lock, AlertTriangle } from 'lucide-react';
import type { Permission } from '@/types/permissions.types';

interface PermissionCellProps {
  checked: boolean;
  disabled?: boolean;
  permission: Permission;
  onChange?: (checked: boolean) => void;
}

const riskColors: Record<string, string> = {
  low: 'text-emerald-500',
  medium: 'text-blue-500',
  high: 'text-amber-500',
  critical: 'text-red-500',
};

export function PermissionCell({ checked, disabled, permission, onChange }: PermissionCellProps) {
  return (
    <td className="px-3 py-2 text-center">
      <div className="relative inline-flex items-center justify-center group">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && onChange?.(!checked)}
          className={cn(
            'h-5 w-5 rounded border flex items-center justify-center transition-colors',
            checked
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-border bg-background hover:border-primary',
            disabled && 'opacity-60 cursor-not-allowed',
            !disabled && !checked && 'cursor-pointer hover:bg-muted',
          )}
        >
          {checked && <Check className="h-3 w-3" />}
          {disabled && !checked && <Lock className="h-2.5 w-2.5 text-muted-foreground" />}
        </button>

        {/* Risk tooltip on hover */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1 bg-popover text-popover-foreground border border-border rounded px-2 py-1 text-[9px] whitespace-nowrap shadow-lg z-10">
          {permission.risk_level === 'high' || permission.risk_level === 'critical' ? (
            <AlertTriangle className={cn('h-2.5 w-2.5', riskColors[permission.risk_level])} />
          ) : null}
          <span className={cn('font-mono capitalize', riskColors[permission.risk_level])}>
            {permission.risk_level}
          </span>
        </div>
      </div>
    </td>
  );
}
