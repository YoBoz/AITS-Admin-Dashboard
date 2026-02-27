import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SectionCard } from '@/components/common/SectionCard';
import { useTheme } from '@/hooks/useTheme';
import { trolleyStatusData } from '@/data/mock/overview.mock';

// Theme-specific status colors for better visibility
const statusColors = {
  light: {
    'In Use': '#BE052E',
    'Idle': '#10B981',
    'Charging': '#3B82F6',
    'Maintenance': '#F59E0B',
    'Offline': '#6B7280',
  },
  dark: {
    'In Use': '#E11D48',
    'Idle': '#34D399',
    'Charging': '#60A5FA',
    'Maintenance': '#FBBF24',
    'Offline': '#9CA3AF',
  },
  eclipse: {
    'In Use': '#A78BFA',
    'Idle': '#34D399',
    'Charging': '#60A5FA',
    'Maintenance': '#FBBF24',
    'Offline': '#9CA3AF',
  },
  tron: {
    'In Use': '#00FF66',      // Primary neon green
    'Idle': '#00E5FF',         // Cyan for contrast
    'Charging': '#FFD600',     // Yellow
    'Maintenance': '#FF6B00',  // Orange
    'Offline': '#8AA88A',      // Muted green-gray
  },
};

export function TrolleyStatusWidget() {
  const { theme } = useTheme();
  const colors = statusColors[theme] || statusColors.light;
  const total = trolleyStatusData.reduce((a, d) => a + d.value, 0);

  return (
    <SectionCard title="Trolley Fleet Status" subtitle={`${total} total trolleys`}>
      <div className="h-[300px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={trolleyStatusData}
              cx="50%"
              cy="45%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
              stroke={theme === 'tron' ? 'rgba(0, 255, 102, 0.3)' : 'none'}
              strokeWidth={theme === 'tron' ? 1 : 0}
            >
              {trolleyStatusData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[entry.name as keyof typeof colors] || entry.color}
                  style={theme === 'tron' ? { filter: 'drop-shadow(0 0 4px currentColor)' } : undefined}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'Lexend',
              }}
              formatter={(value: number, name: string) => [`${value} trolleys`, name]}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11px', fontFamily: 'Lexend' }}
            />
            {/* Center label */}
            <text
              x="50%"
              y="42%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-foreground text-2xl font-bold font-montserrat"
            >
              {total}
            </text>
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground text-[10px] font-lexend"
            >
              Total
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
