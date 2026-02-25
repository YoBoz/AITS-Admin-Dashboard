import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Building2, Menu, Search, LogOut, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Breadcrumb } from './Breadcrumb';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarFallback } from '@/components/common/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { useNotificationsStore } from '@/store/notifications.store';
import { useSidebarStore } from '@/store/sidebar.store';
import { useSettingsStore } from '@/store/settings.store';

interface NavbarProps {
  onSearchClick: () => void;
  onNotificationClick: () => void;
}

export function Navbar({ onSearchClick, onNotificationClick }: NavbarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotificationsStore();
  const { openMobile } = useSidebarStore();
  const { defaultTerminal } = useSettingsStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const terminalLabels: Record<string, string> = {
    'terminal-1': 'T1 - Domestic',
    'terminal-2': 'T2 - International',
    'terminal-3': 'T3 - Cargo',
    'terminal-4': 'T4 - VIP',
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/80 backdrop-blur-md px-4 lg:px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9"
          onClick={openMobile}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden sm:block">
          <Breadcrumb />
        </div>
      </div>

      {/* Center — Search trigger */}
      <button
        onClick={onSearchClick}
        className="hidden md:flex items-center gap-2 h-9 w-72 lg:w-96 rounded-lg border bg-muted/50 px-3 text-sm text-muted-foreground hover:bg-muted transition-colors"
      >
        <Search className="h-4 w-4" />
        <span className="font-lexend text-xs">{t('common.searchPlaceholder', 'Search pages, trolleys, shops...')}</span>
        <kbd className="ml-auto hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] text-muted-foreground">
          Ctrl+K
        </kbd>
      </button>

      {/* Right */}
      <div className="flex items-center gap-0.5">
        {/* Current Terminal Badge */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1.5 mr-0.5">
          <Building2 className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold font-lexend text-primary">
            {terminalLabels[defaultTerminal] || defaultTerminal}
          </span>
        </div>
        <ThemeToggle />

        {/* Notification bell */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9" onClick={onNotificationClick}>
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-1.5 rounded-lg px-1.5 py-1.5 hover:bg-muted transition-colors"
          >
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-[10px] bg-brand/10 text-brand">
                {user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2) || 'AU'}
              </AvatarFallback>
            </Avatar>
          </button>
          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-lg border bg-card p-1 shadow-lg">
                <button
                  onClick={() => { setUserMenuOpen(false); navigate('/dashboard/profile'); }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-lexend hover:bg-muted transition-colors"
                >
                  <User className="h-4 w-4" />
                  {t('nav.profile', 'Profile')}
                </button>
                <button
                  onClick={() => { setUserMenuOpen(false); navigate('/dashboard/settings'); }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-lexend hover:bg-muted transition-colors"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                  {t('nav.settings', 'Settings')}
                </button>
                <div className="my-1 h-px bg-border" />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-lexend text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  {t('common.logout', 'Logout')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
