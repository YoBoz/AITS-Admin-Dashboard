import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { SectionCard } from '@/components/common/SectionCard';
import { dwellTimeData } from '@/data/mock/visitors.mock';

// Transform for composed chart: simulate box plot using bar + error bars
const chartData = dwellTimeData.map((d) => ({
  category: d.category,
  median: d.median,
  q1: d.q1,
  q3: d.q3,
  min: d.min,
  max: d.max,
  iqr: d.q3 - d.q1,
  iqrBase: d.q1,
  whiskerLow: d.q1 - d.min,
  whiskerHigh: d.max - d.q3,
}));

export function DwellTimeChart() {
  return (
    <SectionCard title="Dwell Time Distribution" subtitle="Time spent per zone category (minutes)">
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 10 }}
              className="text-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 10 }}
              className="text-muted-foreground"
              label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(value: number, name: string) => {
                const labels: Record<string, string> = {
                  iqrBase: 'Q1',
                  iqr: 'IQR (Q1-Q3)',
                  median: 'Median',
                };
                return [value + ' min', labels[name] || name];
              }}
            />
            {/* IQR box */}
            <Bar dataKey="iqrBase" stackId="box" fill="transparent" />
            <Bar dataKey="iqr" stackId="box" fill="#BE052E" opacity={0.3} radius={[2, 2, 0, 0]} />
            {/* Median line */}
            <Line
              type="monotone"
              dataKey="median"
              stroke="#BE052E"
              strokeWidth={2}
              dot={{ r: 4, fill: '#BE052E', stroke: '#fff', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 text-[10px] font-lexend text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-brand/30 rounded-sm" />
          <span>IQR (Q1-Q3)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-brand" />
          <span>Median</span>
        </div>
      </div>
    </SectionCard>
  );
}
