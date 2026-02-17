import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Map, Bell, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotificationsStore } from '@/store/notifications.store';

const mobileNavItems = [
  { icon: LayoutDashboard, route: '/dashboard/overview', label: 'Overview' },
  { icon: ShoppingCart, route: '/dashboard/trolleys', label: 'Trolleys' },
  { icon: Map, route: '/dashboard/map', label: 'Map' },
  { icon: Bell, route: '/dashboard/notifications', label: 'Alerts', hasBadge: true },
  { icon: Settings, route: '/dashboard/settings', label: 'Settings' },
];

export function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadCount } = useNotificationsStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t bg-card lg:hidden">
      {mobileNavItems.map((item) => {
        const active = location.pathname.startsWith(item.route);
        return (
          <button
            key={item.route}
            onClick={() => navigate(item.route)}
            className={cn(
              'relative flex flex-col items-center gap-0.5 px-3 py-1 transition-colors',
              active ? 'text-brand' : 'text-muted-foreground'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-lexend font-medium">{item.label}</span>
            {item.hasBadge && unreadCount > 0 && (
              <span className="absolute -top-0.5 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
