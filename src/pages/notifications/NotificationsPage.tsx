import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { NotificationFilters } from '@/components/notifications/NotificationFilters';
import { Button } from '@/components/ui/Button';
import { notificationsData } from '@/data/mock/notifications.mock';
import { AnimatePresence } from 'framer-motion';
import { isToday, isYesterday, isThisWeek } from 'date-fns';
import { CheckCheck, Settings, Info } from 'lucide-react';
import { toast } from 'sonner';
import type { Notification } from '@/types/notification.types';

function groupByDate(items: Notification[]): { label: string; items: Notification[] }[] {
  const groups: Record<string, Notification[]> = {
    Today: [],
    Yesterday: [],
    'This Week': [],
    Older: [],
  };

  items.forEach((n) => {
    const d = new Date(n.created_at);
    if (isToday(d)) groups['Today'].push(n);
    else if (isYesterday(d)) groups['Yesterday'].push(n);
    else if (isThisWeek(d)) groups['This Week'].push(n);
    else groups['Older'].push(n);
  });

  return Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([label, items]) => ({ label, items }));
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('all');

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (tab === 'unread' && n.is_read) return false;
      if (tab !== 'all' && tab !== 'unread' && n.type !== tab) return false;
      if (priority !== 'all' && n.priority !== priority) return false;
      if (search) {
        const s = search.toLowerCase();
        return n.title.toLowerCase().includes(s) || n.body.toLowerCase().includes(s);
      }
      return true;
    });
  }, [notifications, tab, search, priority]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    toast.success('All notifications marked as read');
  };

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.info('Notification deleted');
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Notifications"
        subtitle={`${unreadCount} unread`}
        actions={
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1.5"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark All Read
          </Button>
        }
      />

      {/* Preferences banner */}
      <div className="flex items-center gap-2 bg-status-info/5 border border-status-info/20 rounded-lg px-4 py-2.5">
        <Info className="h-4 w-4 text-status-info shrink-0" />
        <span className="text-xs font-lexend text-foreground flex-1">
          Manage notification preferences in your Profile settings
        </span>
        <a href="/dashboard/profile" className="text-xs font-lexend text-brand hover:underline flex items-center gap-1">
          <Settings className="h-3 w-3" /> Settings
        </a>
      </div>

      <NotificationFilters
        activeTab={tab}
        onTabChange={setTab}
        search={search}
        onSearchChange={setSearch}
        priority={priority}
        onPriorityChange={setPriority}
      />

      {/* Grouped list */}
      <div className="space-y-5">
        {grouped.map((group) => (
          <div key={group.label}>
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2 px-1">
              {group.label}
            </h3>
            <div className="space-y-1.5">
              <AnimatePresence mode="popLayout">
                {group.items.map((n) => (
                  <NotificationItem
                    key={n.id}
                    notification={n}
                    onMarkRead={handleMarkRead}
                    onDelete={handleDelete}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
        {grouped.length === 0 && (
          <div className="text-center py-12 text-muted-foreground font-lexend">
            No notifications match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
