import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, User, ChevronDown, Clock, Store, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarFallback } from '@/components/common/Avatar';
import { Badge } from '@/components/ui/Badge';
import { useMerchantAuth } from '@/hooks/useMerchantAuth';
import { useMerchantStore } from '@/store/merchant.store';
import type { MerchantRole } from '@/types/merchant.types';

interface MerchantTopbarProps {
  onMenuClick: () => void;
}

const STORE_STATUS_CONFIG = {
  open: { label: 'Open', color: 'bg-emerald-500', textColor: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
  busy: { label: 'Busy', color: 'bg-amber-500', textColor: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40' },
  closed: { label: 'Closed', color: 'bg-red-500', textColor: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/40' },
} as const;

const ROLE_LABELS: Record<MerchantRole, string> = {
  manager: 'Manager',
  cashier: 'Cashier',
  kitchen: 'Kitchen',
  developer: 'Developer',
};

export function MerchantTopbar({ onMenuClick }: MerchantTopbarProps) {
  const navigate = useNavigate();
  const { merchantUser, merchantRole, logout, switchRole } = useMerchantAuth();
  const { storeStatus, slaSettings } = useMerchantStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const statusConfig = STORE_STATUS_CONFIG[storeStatus];
  const canSwitchRole = merchantRole === 'manager' || merchantRole === 'developer';

  const handleLogout = () => {
    logout();
    navigate('/merchant/login');
  };

  const handleRoleSwitch = (role: MerchantRole) => {
    switchRole(role);
    setRoleMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/80 backdrop-blur-md px-4 lg:px-6">
      {/* Left: mobile menu + store info */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>

        {/* Store name & status */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold font-lexend text-foreground">
              {merchantUser?.shop_name || 'Shop'}
            </span>
          </div>
          <div className={cn('flex items-center gap-1.5 rounded-full px-2.5 py-1', statusConfig.bg)}>
            <span className={cn('h-2 w-2 rounded-full', statusConfig.color)} />
            <span className={cn('text-xs font-semibold font-lexend', statusConfig.textColor)}>
              {statusConfig.label}
            </span>
          </div>
        </div>
      </div>

      {/* Center: SLA countdown global indicator */}
      <div className="hidden md:flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5">
        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-lexend text-muted-foreground">SLA Window:</span>
        <span className="text-xs font-mono font-semibold text-foreground">
          {slaSettings.acceptance_sla_seconds}s
        </span>
        <span className="text-[10px] text-muted-foreground">
          · Max {slaSettings.max_concurrent_orders} concurrent
        </span>
      </div>

      {/* Right: role switch, theme, user */}
      <div className="flex items-center gap-1">
        {/* Role Switch (Manager & Developer only) */}
        {canSwitchRole && (
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-2.5 py-1.5 hover:bg-muted transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-brand" />
              <span className="text-xs font-semibold font-lexend text-foreground">
                {merchantRole ? ROLE_LABELS[merchantRole] : 'Role'}
              </span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>

            <AnimatePresence>
              {roleMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setRoleMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 z-50 w-48 rounded-lg border bg-card p-1 shadow-lg"
                  >
                    <p className="px-3 py-1.5 text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">
                      Switch Role
                    </p>
                    {merchantUser?.available_roles.map((role) => (
                      <button
                        key={role}
                        onClick={() => handleRoleSwitch(role)}
                        className={cn(
                          'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-lexend transition-colors',
                          role === merchantRole
                            ? 'bg-brand/10 text-brand font-medium'
                            : 'hover:bg-muted text-foreground'
                        )}
                      >
                        <ShieldCheck className={cn('h-4 w-4', role === merchantRole ? 'text-brand' : 'text-muted-foreground')} />
                        {ROLE_LABELS[role]}
                        {role === merchantRole && (
                          <span className="ml-auto text-[10px] text-brand">Active</span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Non-switchable role badge */}
        {!canSwitchRole && merchantRole && (
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-2.5 py-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold font-lexend text-foreground">
              {ROLE_LABELS[merchantRole]}
            </span>
          </div>
        )}

        <ThemeToggle />

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors"
          >
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-[10px] bg-brand/10 text-brand">
                {merchantUser?.name
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2) || 'M'}
              </AvatarFallback>
            </Avatar>
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-lg border bg-card p-1 shadow-lg">
                <div className="px-3 py-2 border-b border-border mb-1">
                  <p className="text-sm font-medium font-lexend truncate">{merchantUser?.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{merchantUser?.email}</p>
                  <Badge variant="outline" className="mt-1 text-[10px] px-1.5 py-0">
                    {merchantRole ? ROLE_LABELS[merchantRole] : ''}
                  </Badge>
                </div>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    navigate('/merchant/settings');
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-lexend hover:bg-muted transition-colors"
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>
                <div className="my-1 h-px bg-border" />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-lexend text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
