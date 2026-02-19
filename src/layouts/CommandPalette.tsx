import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Map, Flame, ShoppingCart, Store, Users,
  Tag, Bell, AlertTriangle, MessageSquareWarning, ShieldCheck,
  Settings, Search, Target, MapPin, LayoutTemplate, Building2, ClipboardList,
  ScrollText, Shield, Plane,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { LucideIcon } from 'lucide-react';
import { trolleysData } from '@/data/mock/trolleys.mock';
import { topShopsData } from '@/data/mock/overview.mock';

interface CmdItem {
  label: string;
  icon: LucideIcon;
  route: string;
  group: string;
}

const pageItems: CmdItem[] = [
  { label: 'Overview', icon: LayoutDashboard, route: '/dashboard/overview', group: 'Pages' },
  { label: 'Terminal Map', icon: Map, route: '/dashboard/map', group: 'Pages' },
  { label: 'Heatmap', icon: Flame, route: '/dashboard/heatmap', group: 'Pages' },
  { label: 'Trolley Management', icon: ShoppingCart, route: '/dashboard/trolleys', group: 'Pages' },
  { label: 'Shop Management', icon: Store, route: '/dashboard/shops', group: 'Pages' },
  { label: 'Merchants', icon: Building2, route: '/dashboard/shops?tab=merchants', group: 'Pages' },
  { label: 'SLA Dashboard', icon: Target, route: '/dashboard/shops?tab=sla', group: 'Pages' },
  { label: 'Venue Setup', icon: MapPin, route: '/dashboard/shops?tab=venue', group: 'Pages' },
  { label: 'Content Management', icon: LayoutTemplate, route: '/dashboard/shops?tab=content', group: 'Pages' },
  { label: 'Orders Console', icon: ClipboardList, route: '/dashboard/shops?tab=orders', group: 'Pages' },
  { label: 'Visitor Stats', icon: Users, route: '/dashboard/visitors', group: 'Pages' },
  { label: 'Offers & Contracts', icon: Tag, route: '/dashboard/offers', group: 'Pages' },
  { label: 'Notifications', icon: Bell, route: '/dashboard/notifications', group: 'Pages' },
  { label: 'Alerts & Issues', icon: AlertTriangle, route: '/dashboard/alerts', group: 'Pages' },
  { label: 'Complaints', icon: MessageSquareWarning, route: '/dashboard/alerts?tab=complaints', group: 'Pages' },
  { label: 'Incidents', icon: AlertTriangle, route: '/dashboard/alerts?tab=incidents', group: 'Pages' },
  { label: 'Gate Surge', icon: Plane, route: '/dashboard/ops/surge', group: 'Pages' },
  { label: 'Administration', icon: ShieldCheck, route: '/dashboard/admin', group: 'Pages' },
  { label: 'Compliance Center', icon: ShieldCheck, route: '/dashboard/admin?tab=compliance', group: 'Pages' },
  { label: 'Global Rules', icon: ScrollText, route: '/dashboard/admin?tab=global-rules', group: 'Pages' },
  { label: 'Permissions', icon: Users, route: '/dashboard/admin?tab=permissions', group: 'Pages' },
  { label: 'Policies', icon: Shield, route: '/dashboard/admin?tab=policies', group: 'Pages' },
  { label: 'Settings', icon: Settings, route: '/dashboard/settings', group: 'Pages' },
];

const trolleyItems = trolleysData.slice(0, 20).map((t) => ({
  label: `${t.id} — ${t.imei}`,
  icon: ShoppingCart,
  route: `/dashboard/trolleys/${t.id}`,
  group: 'Trolleys',
}));

const shopItems = topShopsData.map((s) => ({
  label: s.name,
  icon: Store,
  route: `/dashboard/shops/${s.rank}`,
  group: 'Shops',
}));

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  const selectItem = (route: string) => {
    onOpenChange(false);
    navigate(route);
  };

  if (!open) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        >
          {/* Dialog */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg"
          >
            <Command className="rounded-xl border bg-card shadow-xl overflow-hidden">
              <div className="flex items-center gap-2 border-b px-4">
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <Command.Input
                  placeholder={t('common.searchPlaceholder', 'Type to search pages, trolleys, shops...')}
                  className="flex h-12 w-full bg-transparent font-lexend text-sm outline-none placeholder:text-muted-foreground"
                />
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  ESC
                </kbd>
              </div>
              <Command.List className="max-h-80 overflow-y-auto p-2">
                <Command.Empty className="py-6 text-center text-sm text-muted-foreground font-lexend">
                  {t('common.noResults', 'No results found.')}
                </Command.Empty>

                {/* Pages */}
                <Command.Group heading="Pages" className="text-xs font-roboto uppercase tracking-wider text-muted-foreground px-2 py-1.5">
                  {pageItems.map((item) => (
                    <Command.Item
                      key={item.route}
                      value={item.label}
                      onSelect={() => selectItem(item.route)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-lexend cursor-pointer aria-selected:bg-muted transition-colors"
                    >
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                      <span>{item.label}</span>
                    </Command.Item>
                  ))}
                </Command.Group>

                {/* Trolleys */}
                <Command.Group heading="Trolleys" className="text-xs font-roboto uppercase tracking-wider text-muted-foreground px-2 py-1.5">
                  {trolleyItems.map((item) => (
                    <Command.Item
                      key={item.route}
                      value={item.label}
                      onSelect={() => selectItem(item.route)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-lexend cursor-pointer aria-selected:bg-muted transition-colors"
                    >
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                      <span>{item.label}</span>
                    </Command.Item>
                  ))}
                </Command.Group>

                {/* Shops */}
                <Command.Group heading="Shops" className="text-xs font-roboto uppercase tracking-wider text-muted-foreground px-2 py-1.5">
                  {shopItems.map((item) => (
                    <Command.Item
                      key={item.route}
                      value={item.label}
                      onSelect={() => selectItem(item.route)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-lexend cursor-pointer aria-selected:bg-muted transition-colors"
                    >
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                      <span>{item.label}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
