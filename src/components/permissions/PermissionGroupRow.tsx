import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { Permission, PermissionGroup } from '@/types/permissions.types';
import { permissionGroupLabels } from '@/data/mock/roles.mock';

interface PermissionGroupRowProps {
  group: PermissionGroup;
  permissions: Permission[];
  roleCount: number;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

export function PermissionGroupRow({
  group,
  permissions,
  roleCount,
  defaultExpanded = false,
  children,
}: PermissionGroupRowProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <>
      <tr
        className="cursor-pointer bg-muted/50 hover:bg-muted/70 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <td
          className="px-4 py-2.5 text-xs font-poppins font-semibold text-foreground"
          colSpan={1 + roleCount}
        >
          <div className="flex items-center gap-2">
            {expanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            <span>{permissionGroupLabels[group]}</span>
            <span className={cn(
              'inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-mono',
              'bg-background text-muted-foreground border border-border',
            )}>
              {permissions.length}
            </span>
          </div>
        </td>
      </tr>
      {expanded && children}
    </>
  );
}
