import { cn } from '@/lib/utils';

interface MapLegendProps {
  className?: string;
}

const zoneLegend = [
  { label: 'Terminal / Check-in', color: '#F0F0F0', darkColor: '#2A2A2A' },
  { label: 'Security', color: '#FEF3C7', darkColor: '#2D2108' },
  { label: 'Customs', color: '#EDE9FE', darkColor: '#1E1B2E' },
  { label: 'Retail', color: '#DCFCE7', darkColor: '#0D2016' },
  { label: 'Food Court', color: '#FEE2E2', darkColor: '#2D0A0A' },
  { label: 'Lounge', color: '#EDE9FE', darkColor: '#1E1B2E' },
  { label: 'Washroom', color: '#DBEAFE', darkColor: '#0A1628' },
];

const trolleyLegend = [
  { label: 'Active', color: '#10b981' },
  { label: 'Idle', color: '#9ca3af' },
  { label: 'Charging', color: '#3b82f6' },
  { label: 'Low Battery', color: '#f59e0b' },
];

const poiLegend = [
  { label: 'Info Desk', color: '#3b82f6' },
  { label: 'First Aid', color: '#ef4444' },
  { label: 'Charging', color: '#10b981' },
  { label: 'ATM', color: '#f59e0b' },
];

export function MapLegend({ className }: MapLegendProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <p className="text-xs font-semibold font-lexend text-muted-foreground uppercase tracking-wider mb-2">Zones</p>
        <div className="space-y-1.5">
          {zoneLegend.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded border"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold font-lexend text-muted-foreground uppercase tracking-wider mb-2">Trolleys</p>
        <div className="space-y-1.5">
          {trolleyLegend.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold font-lexend text-muted-foreground uppercase tracking-wider mb-2">Points of Interest</p>
        <div className="space-y-1.5">
          {poiLegend.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full border"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold font-lexend text-muted-foreground uppercase tracking-wider mb-2">Shops</p>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-brand" />
          <span className="text-xs text-foreground">Shop Location</span>
        </div>
      </div>
    </div>
  );
}
