import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ClipboardList, UtensilsCrossed, Megaphone, Ticket, ReceiptText, Settings,
  ChevronsLeft, ChevronsRight, Gauge, Truck, BarChart3, Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMerchantAuth } from '@/hooks/useMerchantAuth';
import { Avatar, AvatarFallback } from '@/components/common/Avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/Tooltip';
import type { LucideIcon } from 'lucide-react';
import type { MerchantPermission } from '@/types/merchant.types';

interface MerchantSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  label: string;
  icon: LucideIcon;
  route: string;
  highlight?: boolean;
  /** Permission required to see this nav item. If omitted, always visible. */
  requiredPermission?: MerchantPermission;
}

interface NavCategory {
  category: string;
  items: NavItem[];
}

const navCategories: NavCategory[] = [
  {
    category: '',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, route: '/merchant/dashboard', requiredPermission: 'dashboard.view' },
    ],
  },
  {
    category: 'Operations',
    items: [
      { label: 'Orders', icon: ClipboardList, route: '/merchant/orders', requiredPermission: 'orders.view' },
      { label: 'Menu', icon: UtensilsCrossed, route: '/merchant/menu', requiredPermission: 'menu.view' },
      { label: 'Capacity & SLA', icon: Gauge, route: '/merchant/capacity-sla', requiredPermission: 'sla.view' },
      { label: 'Delivery Settings', icon: Truck, route: '/merchant/delivery', requiredPermission: 'delivery.view' },
    ],
  },
  {
    category: 'Marketing',
    items: [
      { label: 'Coupons', icon: Ticket, route: '/merchant/coupons', requiredPermission: 'coupons.validate' },
      { label: 'Campaigns', icon: Megaphone, route: '/merchant/campaigns', requiredPermission: 'campaigns.view' },
    ],
  },
  {
    category: 'Finance',
    items: [
      { label: 'Refunds', icon: ReceiptText, route: '/merchant/refunds', requiredPermission: 'refunds.view' },
      { label: 'Reports', icon: BarChart3, route: '/merchant/reports', requiredPermission: 'reports.view' },
    ],
  },
  {
    category: 'Admin',
    items: [
      { label: 'Staff & Roles', icon: Users, route: '/merchant/staff', requiredPermission: 'staff.view' },
      { label: 'Settings', icon: Settings, route: '/merchant/settings', requiredPermission: 'settings.view' },
    ],
  },
];

export function MerchantSidebar({ isCollapsed, onToggle }: MerchantSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { merchantUser, canDo } = useMerchantAuth();

  const isActive = (route: string) =>
    location.pathname === route || location.pathname.startsWith(route + '/');

  

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-card overflow-hidden"
    >
      {/* Logo */}
      <div className="flex h-20 items-center justify-center px-4 border-b border-border shrink-0">
        <AnimatePresence mode="wait">
          {isCollapsed ? (
            <motion.div
              key="icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center"
            >
              <img src="/images/AiTS.svg" alt="Ai-TS" className="h-10 w-10 object-contain" />
            </motion.div>
          ) : (
            <motion.div
              key="full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col items-center justify-center"
            >
              <img src="/images/AiTS.svg" alt="Ai-TS" className="h-10 w-auto object-contain" />
              <span className="text-[10px] font-semibold text-brand font-lexend mt-1 uppercase tracking-wider">
                Merchant
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto pt-3 pb-2 px-2 scrollbar-thin">
        {navCategories.map((group, gi) => {
          // Filter items by permission
          const visibleItems = group.items.filter(
            (item) => !item.requiredPermission || canDo(item.requiredPermission)
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={gi} className={cn(group.category && 'mt-2')}>
              {/* Category header — hidden when collapsed */}
              {group.category && (
                <AnimatePresence>
                  {!isCollapsed ? (
                    <motion.p
                      key="label"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="px-3 mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 font-roboto select-none"
                    >
                      {group.category}
                    </motion.p>
                  ) : (
                    <div className="mx-auto my-1 h-px w-6 bg-border" />
                  )}
                </AnimatePresence>
              )}

              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const active = isActive(item.route);
                  const linkContent = (
            <button
              onClick={() => navigate(item.route)}
              className={cn(
                'group relative flex w-full items-center gap-3 rounded-lg py-1.5 text-[13px] font-lexend transition-all duration-150',
                active
                  ? 'bg-brand/10 text-brand font-medium border-l-4 border-brand pl-2.5 pr-3'
                  : item.highlight && !active
                    ? 'text-foreground font-medium hover:bg-brand/5 hover:text-brand border-l-4 border-transparent px-3'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground border-l-4 border-transparent px-3',
                isCollapsed && 'justify-center px-0 border-l-0'
              )}
            >
              <span className="relative">
                <item.icon
                  className={cn(
                    'shrink-0',
                    active ? 'text-brand' : item.highlight ? 'text-brand/70' : '',
                  )}
                  style={{ width: 18, height: 18 }}
                />
                {item.highlight && isCollapsed && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand" />
                  </span>
                )}
              </span>
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
              {item.highlight && !isCollapsed && (
                <span className="ml-auto flex h-2 w-2">
                  <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-brand opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
                </span>
              )}
            </button>
          );

          if (isCollapsed) {
            return (
              <Tooltip key={item.route}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          }
          return <div key={item.route}>{linkContent}</div>;
        })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User + Collapse toggle */}
      <div className="border-t border-border p-2 space-y-1 shrink-0">
        <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
          <Avatar className="h-8 w-8 flex-shrink-0">
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
                className="flex-1 min-w-0 overflow-hidden"
              >
                <p className="text-sm font-medium font-lexend truncate">{merchantUser?.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{merchantUser?.email}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center gap-2 rounded-lg py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {isCollapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <ChevronsLeft className="h-4 w-4" />
          )}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-lexend"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
