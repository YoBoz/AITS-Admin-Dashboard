import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { SectionCard } from '@/components/common/SectionCard';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import {
  visitorFlowData24h,
  visitorFlowDataWeekly,
  visitorFlowDataMonthly,
} from '@/data/mock/overview.mock';

type Range = '24h' | '7D' | '30D';

// Theme-specific chart colors
const chartColors = {
  light: { primary: '#BE052E', primaryLight: '#BE052E' },
  dark: { primary: '#E11D48', primaryLight: '#E11D48' },
  eclipse: { primary: '#A78BFA', primaryLight: '#A78BFA' },
  tron: { primary: '#00FF66', primaryLight: '#39FF6A' },
};

export function VisitorFlowChart() {
  const [range, setRange] = useState<Range>('24h');
  const { theme } = useTheme();
  const colors = chartColors[theme] || chartColors.light;

  const getData = () => {
    switch (range) {
      case '7D':
        return visitorFlowDataWeekly.map((d) => ({ name: d.day, current: d.thisWeek, previous: d.lastWeek }));
      case '30D':
        return visitorFlowDataMonthly.map((d) => ({ name: d.week, current: d.thisMonth, previous: d.lastMonth }));
      default:
        return visitorFlowData24h.map((d) => ({ name: d.hour, current: d.today, previous: d.yesterday }));
    }
  };

  const currentLabel = range === '24h' ? 'Today' : range === '7D' ? 'This Week' : 'This Month';
  const previousLabel = range === '24h' ? 'Yesterday' : range === '7D' ? 'Last Week' : 'Last Month';

  return (
    <SectionCard
      title="Visitor Flow"
      subtitle={`${currentLabel} vs ${previousLabel}`}
      action={
        <div className="flex gap-1">
          {(['24h', '7D', '30D'] as Range[]).map((r) => (
            <Button
              key={r}
              variant={range === r ? 'default' : 'ghost'}
              size="sm"
              className="h-7 px-2.5 text-xs"
              onClick={() => setRange(r)}
            >
              {r}
            </Button>
          ))}
        </div>
      }
    >
      <div className="h-[300px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={getData()} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.primary} stopOpacity={theme === 'tron' ? 0.5 : 0.3} />
                <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="name"
              className="text-[10px] font-roboto"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              className="text-[10px] font-roboto"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'Lexend',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', fontFamily: 'Lexend' }}
            />
            <Area
              type="monotone"
              dataKey="current"
              name={currentLabel}
              stroke={colors.primary}
              fill="url(#colorCurrent)"
              strokeWidth={2}
              style={theme === 'tron' ? { filter: 'drop-shadow(0 0 4px rgba(0, 255, 102, 0.6))' } : undefined}
            />
            <Area
              type="monotone"
              dataKey="previous"
              name={previousLabel}
              stroke="hsl(var(--muted-foreground))"
              fill="transparent"
              strokeWidth={1.5}
              strokeDasharray="5 5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
