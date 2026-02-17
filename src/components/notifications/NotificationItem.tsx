import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import {
  AlertTriangle, Server, Store, Users, FileText, Tag, MessageCircle,
  Battery, Shield, TrendingUp, Check, Trash2, ExternalLink,
} from 'lucide-react';
import type { Notification } from '@/types/notification.types';

interface NotificationItemProps {
  notification: Notification;
  onMarkRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  AlertTriangle,
  Server,
  Store,
  Users,
  FileText,
  Tag,
  MessageCircle,
  Battery,
  Shield,
  TrendingUp,
};

const typeColors: Record<string, string> = {
  alert: 'bg-destructive/10 text-destructive',
  system: 'bg-muted text-muted-foreground',
  shop: 'bg-status-success/10 text-status-success',
  visitor: 'bg-status-info/10 text-status-info',
  contract: 'bg-status-warning/10 text-status-warning',
  offer: 'bg-brand/10 text-brand',
  complaint: 'bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400',
};

export function NotificationItem({ notification, onMarkRead, onDelete }: NotificationItemProps) {
  const Icon = iconMap[notification.icon] || AlertTriangle;
  const timeAgo = formatDistanceToNow(new Date(notification.created_at), { addSuffix: true });

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group flex items-start gap-3 p-3 rounded-lg border transition-colors',
        notification.is_read
          ? 'bg-card border-border/40 opacity-75'
          : 'bg-card border-l-[3px] border-l-brand border-border/60 shadow-sm'
      )}
    >
      {/* Icon */}
      <div className={cn('p-2 rounded-full shrink-0', typeColors[notification.type])}>
        <Icon className="h-4 w-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className={cn(
            'text-sm font-poppins line-clamp-1',
            notification.is_read ? 'font-normal text-foreground/70' : 'font-semibold text-foreground'
          )}>
            {notification.title}
          </h4>
          {notification.priority === 'high' && !notification.is_read && (
            <span className="shrink-0 w-2 h-2 rounded-full bg-brand mt-1.5" />
          )}
        </div>

        <p className="text-xs text-muted-foreground font-lexend mt-0.5 line-clamp-2">
          {notification.body}
        </p>

        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-[10px] font-mono text-muted-foreground">{timeAgo}</span>
          {notification.actor && (
            <span className="text-[10px] font-lexend text-muted-foreground">by {notification.actor}</span>
          )}
          {notification.link_to && (
            <a
              href={notification.link_to}
              className="text-[10px] font-lexend text-brand hover:underline flex items-center gap-0.5"
            >
              View <ExternalLink className="h-2.5 w-2.5" />
            </a>
          )}
        </div>
      </div>

      {/* Actions (hover) */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {!notification.is_read && (
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onMarkRead?.(notification.id)} title="Mark read">
            <Check className="h-3.5 w-3.5" />
          </Button>
        )}
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive" onClick={() => onDelete?.(notification.id)} title="Delete">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}
