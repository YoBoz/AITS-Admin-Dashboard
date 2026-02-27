import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SectionCard } from '@/components/common/SectionCard';
import { useTheme } from '@/hooks/useTheme';
import { batteryDistributionData } from '@/data/mock/overview.mock';

// Theme-specific battery colors for visibility
const batteryColors = {
  light: {
    critical: '#EF4444',
    low: '#F59E0B',
    medium: '#F59E0B',
    good: '#10B981',
    full: '#10B981',
  },
  dark: {
    critical: '#F87171',
    low: '#FBBF24',
    medium: '#FBBF24',
    good: '#34D399',
    full: '#34D399',
  },
  eclipse: {
    critical: '#F87171',
    low: '#FBBF24',
    medium: '#FBBF24',
    good: '#34D399',
    full: '#34D399',
  },
  tron: {
    critical: '#FF3333',      // Bright red
    low: '#FFD600',           // Yellow
    medium: '#FF9500',        // Orange
    good: '#00FF66',          // Neon green
    full: '#39FF6A',          // Brighter neon green
  },
};

const getBatteryColorKey = (range: string) => {
  if (range === '0-20%') return 'critical';
  if (range === '21-40%') return 'low';
  if (range === '41-60%') return 'medium';
  if (range === '61-80%') return 'good';
  return 'full';
};

export function TrolleyBatteryChart() {
  const { theme } = useTheme();
  const colors = batteryColors[theme] || batteryColors.light;
  return (
    <SectionCard title="Fleet Battery Distribution" subtitle="Trolley count by battery range">
      <div className="h-[280px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={batteryDistributionData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
            <XAxis
              type="number"
              className="text-[10px] font-roboto"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="range"
              className="text-[10px] font-roboto"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
              width={55}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'Lexend',
              }}
              formatter={(value: number) => [`${value} trolleys`, 'Count']}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
              {batteryDistributionData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[getBatteryColorKey(entry.range) as keyof typeof colors]}
                  style={theme === 'tron' ? { filter: 'drop-shadow(0 0 3px currentColor)' } : undefined}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
