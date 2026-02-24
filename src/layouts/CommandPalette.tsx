import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Map, Flame, ShoppingCart, Store, Radio,
  AlertTriangle, ShieldCheck, Search, Target, ClipboardList,
  ScrollText, FileBarChart, UserCheck, FileText, DoorOpen, Building2,
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
  // Sidebar items (exact match)
  { label: 'Dashboard', icon: LayoutDashboard, route: '/dashboard/overview', group: 'Pages' },
  { label: 'Live Map', icon: Map, route: '/dashboard/map', group: 'Pages' },
  { label: 'Heatmap', icon: Flame, route: '/dashboard/map?tab=heatmap', group: 'Pages' },
  { label: 'Fleet Monitoring', icon: Radio, route: '/dashboard/fleet', group: 'Pages' },
  { label: 'Live Fleet', icon: Radio, route: '/dashboard/fleet?tab=live-fleet', group: 'Pages' },
  { label: 'Trolley Management', icon: ShoppingCart, route: '/dashboard/fleet?tab=trolleys', group: 'Pages' },
  { label: 'Runners', icon: UserCheck, route: '/dashboard/runners', group: 'Pages' },
  { label: 'Orders Console', icon: ClipboardList, route: '/dashboard/orders', group: 'Pages' },
  { label: 'Incidents', icon: AlertTriangle, route: '/dashboard/incidents', group: 'Pages' },
  { label: 'Gate Management', icon: DoorOpen, route: '/dashboard/gates', group: 'Pages' },
  { label: 'Policy Controls', icon: ShieldCheck, route: '/dashboard/policies', group: 'Pages' },
  { label: 'Merchant Management', icon: Store, route: '/dashboard/shops', group: 'Pages' },
  { label: 'Merchant Directory', icon: Building2, route: '/dashboard/shops?tab=merchants', group: 'Pages' },
  { label: 'SLA Analytics', icon: Target, route: '/dashboard/sla', group: 'Pages' },
  { label: 'Reports', icon: FileBarChart, route: '/dashboard/reports', group: 'Pages' },
  { label: 'RBAC & Permissions', icon: ScrollText, route: '/dashboard/permissions', group: 'Pages' },
  { label: 'Audit Logs', icon: FileText, route: '/dashboard/audit-logs', group: 'Pages' },
];

const trolleyItems = trolleysData.slice(0, 20).map((t) => ({
  label: `${t.id} — ${t.imei}`,
  icon: ShoppingCart,
  route: `/dashboard/fleet?tab=live-fleet&device=${t.id}`,
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
