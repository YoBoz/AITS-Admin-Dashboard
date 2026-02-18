import type { ReactNode } from 'react';
import { useMerchantAuth } from '@/hooks/useMerchantAuth';
import type { MerchantPermission } from '@/types/merchant.types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/Tooltip';

interface RequirePermissionProps {
  /** Single permission or array of permissions to check */
  permission: MerchantPermission | MerchantPermission[];
  /** If true, ALL permissions must be present. Default: false (any) */
  requireAll?: boolean;
  /** What to render when permission is denied. Default: nothing */
  fallback?: ReactNode;
  /** If true, renders children but disabled with tooltip. Default: false (hides entirely) */
  disableInstead?: boolean;
  /** Custom tooltip message when disabled */
  disabledTooltip?: string;
  children: ReactNode;
}

/**
 * RBAC wrapper that conditionally renders children based on merchant permissions.
 *
 * Usage:
 * <RequirePermission permission="orders.accept">
 *   <Button>Accept Order</Button>
 * </RequirePermission>
 *
 * <RequirePermission permission="orders.accept" disableInstead>
 *   <Button>Accept Order</Button>
 * </RequirePermission>
 *
 * <RequirePermission permission={['menu.edit', 'menu.publish']} requireAll>
 *   <Button>Publish Menu</Button>
 * </RequirePermission>
 */
export function RequirePermission({
  permission,
  requireAll = false,
  fallback = null,
  disableInstead = false,
  disabledTooltip = 'You do not have permission to perform this action',
  children,
}: RequirePermissionProps) {
  const { canDo } = useMerchantAuth();

  const permissions = Array.isArray(permission) ? permission : [permission];
  const hasPermission = requireAll
    ? permissions.every((p) => canDo(p))
    : permissions.some((p) => canDo(p));

  if (hasPermission) {
    return <>{children}</>;
  }

  if (disableInstead) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex cursor-not-allowed">
            <div className="pointer-events-none opacity-50">{children}</div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{disabledTooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return <>{fallback}</>;
}
