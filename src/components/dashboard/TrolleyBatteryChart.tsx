import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SectionCard } from '@/components/common/SectionCard';
import { batteryDistributionData } from '@/data/mock/overview.mock';

export function TrolleyBatteryChart() {
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
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
