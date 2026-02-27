import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Map,
  Store,
  AlertTriangle,
  ShieldCheck,
  ChevronsLeft,
  ChevronsRight,
  Radio,
  ClipboardList,
  DoorOpen,
  Target,
  FileBarChart,
  ScrollText,
  UserCheck,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/store/sidebar.store';
import { useNotificationsStore } from '@/store/notifications.store';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Avatar, AvatarFallback } from '@/components/common/Avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/Tooltip';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  label: string;
  icon: LucideIcon;
  route: string;
  badge?: 'live' | 'count' | null;
}

interface NavCategory {
  category: string;
  items: NavItem[];
}

const navCategories: NavCategory[] = [
  {
    category: '',
    items: [
      { label: 'nav.dashboard', icon: LayoutDashboard, route: '/dashboard/overview', badge: null },
    ],
  },
  {
    category: 'nav.catMonitoring',
    items: [
      { label: 'nav.liveMap', icon: Map, route: '/dashboard/map', badge: null },
      { label: 'nav.fleetMonitoring', icon: Radio, route: '/dashboard/fleet', badge: 'live' },
    ],
  },
  {
    category: 'nav.catOperations',
    items: [
      { label: 'nav.runners', icon: UserCheck, route: '/dashboard/runners', badge: null },
      { label: 'nav.orders', icon: ClipboardList, route: '/dashboard/orders', badge: null },
      { label: 'nav.incidents', icon: AlertTriangle, route: '/dashboard/incidents', badge: 'count' },
      { label: 'nav.gateManagement', icon: DoorOpen, route: '/dashboard/gates', badge: null },
    ],
  },
  {
    category: 'nav.catCommerce',
    items: [
      { label: 'nav.merchantManagement', icon: Store, route: '/dashboard/shops', badge: null },
      { label: 'nav.slaAnalytics', icon: Target, route: '/dashboard/sla', badge: null },
    ],
  },
  {
    category: 'nav.catGovernance',
    items: [
      { label: 'nav.policyControls', icon: ShieldCheck, route: '/dashboard/policies', badge: null },
      { label: 'nav.reports', icon: FileBarChart, route: '/dashboard/reports', badge: null },
    ],
  },
  {
    category: 'nav.catAdmin',
    items: [
      { label: 'nav.rbac', icon: ScrollText, route: '/dashboard/permissions', badge: null },
      { label: 'nav.auditLogs', icon: FileText, route: '/dashboard/audit-logs', badge: null },
    ],
  },
];

export function Sidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { isCollapsed, toggle } = useSidebarStore();
  const { unreadCount } = useNotificationsStore();
  const { user } = useAuth();
  const { theme } = useTheme();

  const isActive = (route: string) => location.pathname === route || location.pathname.startsWith(route + '/');

  // Flat list of all nav routes for Ctrl+Arrow navigation
  const allRoutes = useMemo(
    () => navCategories.flatMap((cat) => cat.items.map((item) => item.route)),
    []
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      
      // Ctrl+Left: collapse, Ctrl+Right: expand
      if (e.key === 'ArrowLeft') {
        if (!isCollapsed) {
          e.preventDefault();
          toggle();
        }
        return;
      }
      if (e.key === 'ArrowRight') {
        if (isCollapsed) {
          e.preventDefault();
          toggle();
        }
        return;
      }
      
      // Ctrl+Up/Down: navigate between nav items
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();

      const currentIndex = allRoutes.findIndex(
        (r) => location.pathname === r || location.pathname.startsWith(r + '/')
      );
      let nextIndex: number;
      if (e.key === 'ArrowDown') {
        nextIndex = currentIndex < allRoutes.length - 1 ? currentIndex + 1 : 0;
      } else {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : allRoutes.length - 1;
      }
      navigate(allRoutes[nextIndex]);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [allRoutes, location.pathname, navigate, isCollapsed, toggle]);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-card overflow-hidden"
    >
      {/* Logo */}
      <div className="flex h-14 items-center justify-center px-4 border-b border-border shrink-0">
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
              <img src={theme === 'tron' ? '/images/AITS - Tron.svg' : theme === 'eclipse' ? '/images/AITS - Eclipse.svg' : theme === 'dark' ? '/images/AiTS_White.svg' : '/images/AiTS.svg'} alt="Ai-TS" className={`h-8 w-8 object-contain ${theme === 'tron' ? 'tron-logo-glow' : ''}`} />
            </motion.div>
          ) : (
            <motion.div
              key="full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center"
            >
              <img src={theme === 'tron' ? '/images/AITS - Tron.svg' : theme === 'eclipse' ? '/images/AITS - Eclipse.svg' : theme === 'dark' ? '/images/AiTS_White.svg' : '/images/AiTS.svg'} alt="Ai-TS" className={`h-10 w-auto object-contain ${theme === 'tron' ? 'tron-logo-glow' : ''}`} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto pt-6 pb-2 px-2 scrollbar-thin">
        {navCategories.map((group, gi) => (
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
                    {t(group.category)}
                  </motion.p>
                ) : (
                  <div className="mx-auto my-1 h-px w-6 bg-border" />
                )}
              </AnimatePresence>
            )}

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.route);
                const linkContent = (
            <button
              onClick={() => navigate(item.route)}
              className={cn(
                'group relative flex w-full items-center gap-3 rounded-lg py-1.5 text-[13px] font-lexend transition-all duration-150',
                active
                  ? 'bg-brand/10 text-brand font-medium border-l-4 border-brand pl-2.5 pr-3'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground border-l-4 border-transparent px-3',
                isCollapsed && 'justify-center px-0 border-l-0'
              )}
            >
              <span className="relative">
                <item.icon
                  className={cn('h-4.5 w-4.5 shrink-0', active ? 'text-brand' : '')}
                  style={{ width: 18, height: 18 }}
                />
                {/* Collapsed red dot indicator for unread notifications */}
                {item.badge === 'count' && unreadCount > 0 && isCollapsed && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand" />
                  </span>
                )}
                {/* Collapsed live indicator */}
                {item.badge === 'live' && isCollapsed && (
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
                    {t(item.label)}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Badges - only show expanded versions when not collapsed */}
              {item.badge === 'live' && !isCollapsed && (
                <span className="ml-auto flex h-2 w-2">
                  <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-brand opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
                </span>
              )}
              {item.badge === 'count' && unreadCount > 0 && !isCollapsed && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-[10px] font-semibold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          );

          if (isCollapsed) {
            return (
              <Tooltip key={item.route}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right">
                  <p>{t(item.label)}</p>
                </TooltipContent>
              </Tooltip>
            );
          }

          return <div key={item.route}>{linkContent}</div>;
        })}
            </div>
          </div>
        ))}
      </nav>

      {/* User + Collapse toggle */}
      <div className="border-t border-border p-2 shrink-0 space-y-1">
        <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="text-xs bg-brand/10 text-brand">
              {user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2) || 'AU'}
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
                <p className="text-sm font-medium font-lexend truncate">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Collapse toggle - inline only when expanded */}
          {!isCollapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggle}
                  className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex-shrink-0"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Collapse</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        {/* Expand toggle - below avatar when collapsed */}
        {isCollapsed && (
          <div className="flex justify-center">
            <button
              onClick={toggle}
              className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
