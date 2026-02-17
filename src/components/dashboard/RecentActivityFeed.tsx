import {
  ShoppingCart,
  Store,
  Tag,
  User,
  AlertTriangle,
  MessageSquare,
  Activity,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SectionCard } from '@/components/common/SectionCard';
import { Button } from '@/components/ui/Button';
import { recentActivityData } from '@/data/mock/overview.mock';
import { cn } from '@/lib/utils';

const typeIconMap: Record<string, { icon: typeof Activity; color: string; bg: string }> = {
  trolley: { icon: ShoppingCart, color: 'text-brand', bg: 'bg-brand/10' },
  shop: { icon: Store, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  offer: { icon: Tag, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  user: { icon: User, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  alert: { icon: AlertTriangle, color: 'text-status-warning', bg: 'bg-status-warning/10' },
  complaint: { icon: MessageSquare, color: 'text-status-error', bg: 'bg-status-error/10' },
};

const fallbackIcon = { icon: Activity, color: 'text-muted-foreground', bg: 'bg-muted' };

export function RecentActivityFeed() {
  const navigate = useNavigate();

  return (
    <SectionCard
      title="Recent Activity"
      subtitle="Latest events"
      action={
        <Button variant="ghost" size="sm" className="text-xs text-brand" onClick={() => navigate('/dashboard/alerts')}>
          View All
        </Button>
      }
    >
      <div className="relative mt-1">

        <div className="space-y-0.5">
          {recentActivityData.map((item) => {
            const cfg = typeIconMap[item.type] || fallbackIcon;
            const Icon = cfg.icon;
            return (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-lg px-2 py-2.5 hover:bg-muted/50 transition-colors relative"
              >
                <div
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full shrink-0 z-10 ring-2 ring-background',
                    cfg.bg
                  )}
                >
                  <Icon className={cn('h-3.5 w-3.5', cfg.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium font-lexend leading-tight">{item.description}</p>
                  <p className="text-xs text-muted-foreground font-roboto mt-0.5 line-clamp-1">
                    by {item.actor}
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground/60 shrink-0 mt-0.5">{item.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </SectionCard>
  );
}
