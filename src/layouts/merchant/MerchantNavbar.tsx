import { useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Avatar, AvatarFallback } from '@/components/common/Avatar';
import { BusyModeToggle } from '@/components/merchant/BusyModeToggle';
import { CapacityIndicator } from '@/components/merchant/CapacityIndicator';
import { useMerchantAuth } from '@/hooks/useMerchantAuth';

const PAGE_TITLES: Record<string, string> = {
  '/merchant/orders': 'Orders Inbox',
  '/merchant/menu': 'Menu Management',
  '/merchant/coupons': 'Coupons & Campaigns',
  '/merchant/analytics': 'Analytics',
  '/merchant/settings': 'SLA Settings',
  '/merchant/switch-role': 'Switch Role',
};

export function MerchantNavbar() {
  const location = useLocation();
  const { merchantUser } = useMerchantAuth();

  const pageTitle =
    Object.entries(PAGE_TITLES).find(([path]) =>
      location.pathname.startsWith(path)
    )?.[1] ?? 'Dashboard';

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-card/80 backdrop-blur-md px-4 lg:px-6">
      {/* Left — Page title */}
      <h1 className="text-base font-semibold font-poppins text-foreground">{pageTitle}</h1>

      {/* Center — Busy mode */}
      <div className="hidden md:flex items-center gap-4">
        <BusyModeToggle />
      </div>

      {/* Right — Capacity, theme, avatar */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex">
          <CapacityIndicator />
        </div>
        <ThemeToggle />
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs bg-brand/10 text-brand">
            {merchantUser?.name
              ?.split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2) || 'M'}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
