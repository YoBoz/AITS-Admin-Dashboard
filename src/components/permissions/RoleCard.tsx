import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { Lock, Copy, Pencil, Trash2, Users } from 'lucide-react';
import type { Role } from '@/types/permissions.types';

interface RoleCardProps {
  role: Role;
  canEdit?: boolean;
  canDelete?: boolean;
  onEdit?: () => void;
  onClone?: () => void;
  onDelete?: () => void;
  previewPermissions?: string[];
}

export function RoleCard({
  role,
  canEdit = true,
  canDelete = true,
  onEdit,
  onClone,
  onDelete,
  previewPermissions = [],
}: RoleCardProps) {
  return (
    <div className="relative rounded-lg border border-border bg-card overflow-hidden hover:shadow-md transition-shadow">
      {/* Top color bar */}
      <div className="h-1.5" style={{ backgroundColor: role.color }} />

      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-montserrat font-bold text-foreground">
                {role.label}
              </h3>
              {role.is_system_role && (
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </div>
            <p className="text-xs text-muted-foreground font-lexend mt-1 leading-relaxed">
              {role.description}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-[10px]">
            {role.permissions.length} permissions
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span className="font-mono">{role.user_count}</span>
            <span className="font-lexend">users</span>
          </div>
        </div>

        {/* Permission chips preview */}
        {previewPermissions.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {previewPermissions.slice(0, 5).map((p) => (
              <span
                key={p}
                className="inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-mono bg-muted text-muted-foreground"
              >
                {p}
              </span>
            ))}
            {previewPermissions.length > 5 && (
              <span className="text-[9px] text-muted-foreground font-mono">
                +{previewPermissions.length - 5} more
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className={cn('flex items-center gap-2 pt-2 border-t border-border')}>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs gap-1.5"
            disabled={!canEdit}
            onClick={onEdit}
          >
            <Pencil className="h-3 w-3" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs gap-1.5"
            onClick={onClone}
          >
            <Copy className="h-3 w-3" />
            Clone
          </Button>
          {!role.is_system_role && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1.5 text-red-500 hover:text-red-600"
              disabled={!canDelete}
              onClick={onDelete}
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
