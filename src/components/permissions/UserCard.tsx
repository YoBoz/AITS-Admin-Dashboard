import { RoleBadge } from './RoleBadge';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { AdminUser } from '@/types/permissions.types';
import {
  CheckCircle, Minus, Eye, RotateCcw, Activity, ShieldOff,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { UserStatusToggle } from './UserStatusToggle';

interface UserCardProps {
  user: AdminUser;
  roleColor: string;
  isOwnAccount?: boolean;
  isSuperAdmin?: boolean;
  onEdit?: () => void;
  onResetPassword?: () => void;
  onViewActivity?: () => void;
  onRevoke?: () => void;
  onStatusChange?: (active: boolean) => void;
}

export function UserCard({
  user,
  roleColor,
  isOwnAccount,
  isSuperAdmin,
  onEdit,
  onResetPassword,
  onViewActivity,
  onRevoke,
  onStatusChange,
}: UserCardProps) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="grid grid-cols-12 items-center gap-3 px-4 py-3 border-b border-border hover:bg-muted/30 transition-colors">
      {/* Avatar + Name */}
      <div className="col-span-3 flex items-center gap-3">
        <div
          className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
          style={{ backgroundColor: roleColor }}
        >
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium font-poppins text-foreground truncate">{user.name}</div>
          <div className="text-[10px] text-muted-foreground font-lexend truncate">{user.department}</div>
        </div>
      </div>

      {/* Email */}
      <div className="col-span-2 text-xs font-mono text-muted-foreground truncate">{user.email}</div>

      {/* Role */}
      <div className="col-span-1">
        <RoleBadge label={user.role_label} color={roleColor} />
      </div>

      {/* Terminal */}
      <div className="col-span-1 text-xs font-lexend text-muted-foreground">{user.terminal}</div>

      {/* Status */}
      <div className="col-span-1">
        <UserStatusToggle
          status={user.status}
          disabled={isOwnAccount || isSuperAdmin}
          onChange={onStatusChange}
        />
      </div>

      {/* Last Login */}
      <div className="col-span-1 text-xs font-mono text-muted-foreground">
        {user.last_login
          ? formatDistanceToNow(new Date(user.last_login), { addSuffix: true })
          : 'Never'}
      </div>

      {/* 2FA */}
      <div className="col-span-1 flex justify-center">
        {user.two_fa_enabled ? (
          <CheckCircle className="h-4 w-4 text-emerald-500" />
        ) : (
          <Minus className="h-4 w-4 text-muted-foreground/40" />
        )}
      </div>

      {/* Actions */}
      <div className={cn('col-span-1 flex items-center gap-1')}>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit} title="Edit User">
          <Eye className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onResetPassword} title="Reset Password">
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onViewActivity} title="View Activity">
          <Activity className="h-3.5 w-3.5" />
        </Button>
        {!isOwnAccount && !isSuperAdmin && (
          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600" onClick={onRevoke} title="Revoke Access">
            <ShieldOff className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
