import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList,
  UtensilsCrossed,
  Ticket,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Store,
  ArrowLeftRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LogoIcon } from '@/assets/logo';
import { useMerchantAuth } from '@/hooks/useMerchantAuth';
import { Avatar, AvatarFallback } from '@/components/common/Avatar';
import { Badge } from '@/components/ui/Badge';
import type { LucideIcon } from 'lucide-react';
import type { MerchantPermission } from '@/types/merchant.types';
import { useState } from 'react';

interface MerchantNavItem {
  label: string;
  icon: LucideIcon;
  route: string;
  permission?: MerchantPermission;
}

const NAV_ITEMS: MerchantNavItem[] = [
  { label: 'Orders', icon: ClipboardList, route: '/merchant/orders', permission: 'orders.view' },
  { label: 'Menu', icon: UtensilsCrossed, route: '/merchant/menu', permission: 'menu.view' },
  { label: 'Coupons', icon: Ticket, route: '/merchant/coupons', permission: 'campaigns.view' },
  { label: 'Analytics', icon: BarChart3, route: '/merchant/analytics', permission: 'analytics.view' },
  { label: 'SLA Settings', icon: Settings, route: '/merchant/settings', permission: 'sla.edit' },
];

export function MerchantSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { merchantUser, merchantRole, logout, canDo } = useMerchantAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (route: string) =>
    location.pathname === route || location.pathname.startsWith(route + '/');

  const handleLogout = () => {
    logout();
    navigate('/merchant/login');
  };

  const filteredItems = NAV_ITEMS.filter(
    (item) => !item.permission || canDo(item.permission)
  );

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-card overflow-hidden"
    >
      {/* Logo + Shop Name */}
      <div className="flex h-16 items-center gap-3 px-4 border-b border-border shrink-0">
        <AnimatePresence mode="wait">
          {isCollapsed ? (
            <motion.div
              key="icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto"
            >
              <LogoIcon size="sm" />
            </motion.div>
          ) : (
            <motion.div
              key="full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Store className="h-5 w-5 text-brand shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold font-poppins text-foreground truncate">
                  {merchantUser?.shop_name ?? 'Merchant'}
                </p>
                <Badge variant="outline" className="text-[9px] capitalize px-1.5 py-0">
                  {merchantRole}
                </Badge>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {filteredItems.map((item) => {
          const active = isActive(item.route);
          return (
            <button
              key={item.route}
              onClick={() => navigate(item.route)}
              className={cn(
                'group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-lexend transition-all',
                active
                  ? 'bg-brand/8 text-brand border-l-[3px] border-brand'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground border-l-[3px] border-transparent',
                isCollapsed && 'justify-center px-0'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className={cn('h-[18px] w-[18px] shrink-0', active && 'text-brand')} />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="truncate whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      {/* User + Footer */}
      <div className="border-t border-border p-3 space-y-2 shrink-0">
        {/* User row */}
        <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs bg-brand/10 text-brand">
              {merchantUser?.name
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2) || 'M'}
            </AvatarFallback>
          </Avatar>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-1 overflow-hidden"
              >
                <p className="text-sm font-medium font-lexend truncate">{merchantUser?.name}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Switch role */}
        {!isCollapsed && merchantUser && merchantUser.available_roles.length > 1 && (
          <button
            onClick={() => navigate('/merchant/switch-role')}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ArrowLeftRight className="h-3.5 w-3.5" />
            Switch Role
          </button>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={cn(
            'flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors',
            isCollapsed && 'justify-center px-0'
          )}
          title="Logout"
        >
          <LogOut className="h-3.5 w-3.5" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex w-full items-center justify-center gap-2 rounded-lg py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </motion.aside>
  );
}
