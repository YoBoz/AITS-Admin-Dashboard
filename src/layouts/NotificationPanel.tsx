import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X, CheckCheck, Bell, AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { useNotificationsStore, type Notification } from '@/store/notifications.store';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

const typeConfig: Record<Notification['type'], { icon: typeof Bell; color: string }> = {
  alert: { icon: AlertCircle, color: 'text-status-error' },
  warning: { icon: AlertTriangle, color: 'text-status-warning' },
  info: { icon: Info, color: 'text-status-info' },
  success: { icon: CheckCircle, color: 'text-status-success' },
};

export function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotificationsStore();
  const navigate = useNavigate();

  const handleNotificationClick = (n: Notification) => {
    markAsRead(n.id);
    const route = n.type === 'alert' ? '/dashboard/alerts' : '/dashboard/notifications';
    navigate(`${route}?id=${n.id}`);
    onClose();
  };

  if (!open) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-screen w-[380px] max-w-full border-l bg-card shadow-xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold font-montserrat">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs gap-1.5">
                    <CheckCheck className="h-3.5 w-3.5" />
                    Mark all read
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Bell className="h-10 w-10 mb-3 opacity-30" />
                  <p className="text-sm font-lexend">No notifications</p>
                </div>
              ) : (
                <div>
                  {notifications.map((n) => {
                    const cfg = typeConfig[n.type];
                    const Icon = cfg.icon;
                    return (
                      <button
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={cn(
                          'flex w-full gap-3 px-5 py-4 text-left border-b border-border/50 hover:bg-muted/50 transition-colors',
                          !n.read && 'bg-muted/30'
                        )}
                      >
                        <div className={cn('mt-0.5 shrink-0', cfg.color)}>
                          <Icon className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium font-lexend truncate">
                              {n.title}
                            </p>
                            {!n.read && (
                              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground font-lexend mt-0.5 line-clamp-2">
                            {n.description}
                          </p>
                          <p className="text-[10px] text-muted-foreground/60 mt-1">
                            {n.time}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
