// ──────────────────────────────────────
// Rule Row Component — Phase 9
// ──────────────────────────────────────

import { Switch } from '@/components/ui/Switch';
import { Pencil, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/Tooltip';

interface Props {
  label: string;
  description?: string;
  value: string | number;
  unit?: string;
  enabled: boolean;
  onToggle: () => void;
  onEdit: () => void;
  readOnly?: boolean;
}

export function RuleRow({ label, description, value, unit, enabled, onToggle, onEdit, readOnly }: Props) {
  return (
    <tr className="hover:bg-muted/30 transition-colors">
      <td className="py-3 pr-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">{label}</span>
          {description && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs max-w-48">{description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </td>
      <td className="py-3 pr-4">
        <span className="text-xs font-mono">
          {value}{unit ? ` ${unit}` : ''}
        </span>
      </td>
      <td className="py-3 pr-4">
        <Switch
          checked={enabled}
          onCheckedChange={onToggle}
          disabled={readOnly}
        />
      </td>
      <td className="py-3">
        {!readOnly ? (
          <button
            onClick={onEdit}
            className="p-1.5 rounded-md hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        ) : (
          <span className="text-[10px] text-muted-foreground italic">Read-only</span>
        )}
      </td>
    </tr>
  );
}
