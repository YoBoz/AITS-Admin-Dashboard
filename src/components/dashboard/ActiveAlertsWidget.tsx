import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SectionCard } from '@/components/common/SectionCard';
import { Button } from '@/components/ui/Button';
import { alertsData, type AlertData } from '@/data/mock/overview.mock';
import { cn } from '@/lib/utils';

const severityConfig: Record<AlertData['severity'], { icon: typeof AlertCircle; color: string; bg: string }> = {
  critical: { icon: AlertCircle, color: 'text-status-error', bg: 'bg-status-error/10' },
  warning: { icon: AlertTriangle, color: 'text-status-warning', bg: 'bg-status-warning/10' },
  info: { icon: Info, color: 'text-status-info', bg: 'bg-status-info/10' },
};

export function ActiveAlertsWidget() {
  const navigate = useNavigate();

  return (
    <SectionCard
      title="Active Alerts"
      subtitle={`${alertsData.length} alerts`}
      action={
        <Button variant="ghost" size="sm" className="text-xs text-brand" onClick={() => navigate('/dashboard/alerts')}>
          View All
        </Button>
      }
    >
      <div className="space-y-1 mt-1">
        {alertsData.map((alert) => {
          const cfg = severityConfig[alert.severity];
          const Icon = cfg.icon;
          return (
            <div
              key={alert.id}
              className="flex items-start gap-3 rounded-lg px-3 py-3 hover:bg-muted/50 transition-colors"
            >
              <div className={cn('mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg shrink-0', cfg.bg)}>
                <Icon className={cn('h-4 w-4', cfg.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium font-lexend">{alert.title}</p>
                <p className="text-xs text-muted-foreground font-roboto mt-0.5">{alert.reference}</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[10px] text-muted-foreground/60">{alert.time}</span>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] text-status-success">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Resolve
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
