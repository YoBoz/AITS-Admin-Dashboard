import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Map,
  Flame,
  ShoppingCart,
  Store,
  Users,
  Tag,
  Bell,
  AlertTriangle,
  MessageSquareWarning,
  ShieldCheck,
  Settings,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/store/sidebar.store';
import { useNotificationsStore } from '@/store/notifications.store';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback } from '@/components/common/Avatar';
import { Badge } from '@/components/ui/Badge';
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

interface NavSection {
  section: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    section: 'nav.core',
    items: [
      { label: 'nav.overview', icon: LayoutDashboard, route: '/dashboard/overview', badge: null },
      { label: 'nav.terminalMap', icon: Map, route: '/dashboard/map', badge: null },
      { label: 'nav.heatmap', icon: Flame, route: '/dashboard/heatmap', badge: null },
    ],
  },
  {
    section: 'nav.operations',
    items: [
      { label: 'nav.trolleyManagement', icon: ShoppingCart, route: '/dashboard/trolleys', badge: 'live' },
      { label: 'nav.shopManagement', icon: Store, route: '/dashboard/shops', badge: null },
      { label: 'nav.visitorStats', icon: Users, route: '/dashboard/visitors', badge: null },
    ],
  },
  {
    section: 'nav.engagement',
    items: [
      { label: 'nav.offersContracts', icon: Tag, route: '/dashboard/offers', badge: null },
      { label: 'nav.notifications', icon: Bell, route: '/dashboard/notifications', badge: 'count' },
      { label: 'nav.alerts', icon: AlertTriangle, route: '/dashboard/alerts', badge: 'count' },
      { label: 'nav.complaints', icon: MessageSquareWarning, route: '/dashboard/complaints', badge: 'count' },
    ],
  },
  {
    section: 'nav.administration',
    items: [
      { label: 'nav.permissions', icon: ShieldCheck, route: '/dashboard/permissions', badge: null },
      { label: 'nav.settings', icon: Settings, route: '/dashboard/settings', badge: null },
    ],
  },
];

export function Sidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { isCollapsed, toggle } = useSidebarStore();
  const { unreadCount } = useNotificationsStore();
  const { user, logout } = useAuth();

  const isActive = (route: string) => location.pathname === route || location.pathname.startsWith(route + '/');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-card overflow-hidden"
    >
      {/* Logo */}
      <div className="flex h-16 items-center px-4 border-b border-border shrink-0">
        <AnimatePresence mode="wait">
          {isCollapsed ? (
            <motion.div
              key="icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="mx-auto"
            >
              <img src="/images/AiTS.svg" alt="Ai-TS" className="h-8 w-8 object-contain" />
            </motion.div>
          ) : (
            <motion.div
              key="full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <img src="/images/AiTS.svg" alt="Ai-TS" className="h-10 w-auto object-contain" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5 scrollbar-thin">
        {navSections.map((section) => (
          <div key={section.section}>
            {/* Section label */}
            <AnimatePresence>
              {!isCollapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-1.5 px-3 font-roboto text-[10px] font-semibold uppercase tracking-[0.05em] text-muted-foreground"
                >
                  {t(section.section)}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.route);
                const linkContent = (
                  <button
                    onClick={() => navigate(item.route)}
                    className={cn(
                      'group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-lexend transition-all duration-150',
                      active
                        ? 'bg-brand/8 text-brand border-l-[3px] border-brand'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground border-l-[3px] border-transparent',
                      isCollapsed && 'justify-center px-0'
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
      <div className="border-t border-border p-3 space-y-2 shrink-0">
        {/* User row */}
        <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
          <Avatar className="h-8 w-8">
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
                className="flex-1 overflow-hidden"
              >
                <p className="text-sm font-medium font-lexend truncate">{user?.name}</p>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {user?.role?.replace('_', ' ')}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleLogout}
                className="text-muted-foreground hover:text-destructive transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={toggle}
          className="flex w-full items-center justify-center gap-2 rounded-lg py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {isCollapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
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
