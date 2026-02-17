import { cn } from '@/lib/utils';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  time: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const dotColors: Record<string, string> = {
  default: 'bg-muted-foreground',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
};

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('relative', className)}>
      {/* Vertical line */}
      <div className="absolute left-3.5 top-2 bottom-2 w-px bg-border" aria-hidden="true" />

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="relative flex gap-4 pl-0">
            {/* Dot */}
            <div className="relative z-10 mt-1.5">
              {item.icon ? (
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                  {item.icon}
                </div>
              ) : (
                <div
                  className={cn(
                    'w-7 h-7 rounded-full border-2 border-background',
                    dotColors[item.variant ?? 'default']
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-1">
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium">{item.title}</p>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{item.time}</span>
              </div>
              {item.description && (
                <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
