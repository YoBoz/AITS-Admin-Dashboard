import { TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SectionCard } from '@/components/common/SectionCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { topShopsData } from '@/data/mock/overview.mock';
import { cn } from '@/lib/utils';

export function TopShopsWidget() {
  const navigate = useNavigate();

  return (
    <SectionCard
      title="Top Shops This Week"
      subtitle="By visitor engagement"
      action={
        <Button variant="ghost" size="sm" className="text-xs text-brand" onClick={() => navigate('/dashboard/shops')}>
          View All
        </Button>
      }
    >
      <div className="space-y-1 mt-1">
        {topShopsData.map((shop) => (
          <div
            key={shop.rank}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold font-montserrat text-foreground">
              {shop.rank}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium font-roboto truncate">{shop.name}</p>
            </div>
            <Badge variant="outline" className="text-[10px] shrink-0">
              {shop.category}
            </Badge>
            <span className="text-sm font-semibold font-roboto tabular-nums w-12 text-right">
              {shop.visitors.toLocaleString()}
            </span>
            <span className={cn('shrink-0', shop.trend === 'up' ? 'text-status-success' : 'text-status-error')}>
              {shop.trend === 'up' ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
