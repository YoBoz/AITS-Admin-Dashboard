import { SectionCard } from '@/components/common/SectionCard';
import { StatusDot } from '@/components/common/StatusDot';
import { systemHealthData } from '@/data/mock/overview.mock';

export function SystemHealthWidget() {
  return (
    <SectionCard title="System Health" subtitle="Component status">
      <div className="space-y-1 mt-1">
        {systemHealthData.map((item) => (
          <div
            key={item.component}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-muted/50 transition-colors"
          >
            <StatusDot
              status={item.status === 'degraded' ? 'warning' : item.status}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium font-roboto truncate">{item.component}</p>
            </div>
            <span className="text-xs font-roboto tabular-nums text-muted-foreground">
              {item.uptime}
            </span>
            <span className="text-[10px] text-muted-foreground/60 w-14 text-right">
              {item.lastChecked}
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
