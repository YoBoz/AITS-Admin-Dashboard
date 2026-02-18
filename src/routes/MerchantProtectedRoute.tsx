import { Navigate, useLocation } from 'react-router-dom';
import { useMerchantAuth } from '@/hooks/useMerchantAuth';
import { Skeleton } from '@/components/ui/Skeleton';
import type { MerchantPermission } from '@/types/merchant.types';

interface MerchantProtectedRouteProps {
  children: React.ReactNode;
  /** Optional permission(s) required to access this route */
  requiredPermission?: MerchantPermission | MerchantPermission[];
  /** If true, ALL permissions must be present. Default: false (any) */
  requireAll?: boolean;
}

export function MerchantProtectedRoute({
  children,
  requiredPermission,
  requireAll = false,
}: MerchantProtectedRouteProps) {
  const { isAuthenticated, isLoading, canDo } = useMerchantAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="space-y-4 w-full max-w-md px-4">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-8 w-1/2 mx-auto" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/merchant/login" state={{ from: location.pathname }} replace />;
  }

  // Check route-level permissions
  if (requiredPermission) {
    const permissions = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];
    const hasPermission = requireAll
      ? permissions.every((p) => canDo(p))
      : permissions.some((p) => canDo(p));

    if (!hasPermission) {
      return <Navigate to="/merchant/unauthorized" replace />;
    }
  }

  return <>{children}</>;
}
