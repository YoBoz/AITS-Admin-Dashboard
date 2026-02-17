import {
  RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip,
} from 'recharts';
import { SectionCard } from '@/components/common/SectionCard';
import { topCategoriesData } from '@/data/mock/visitors.mock';

// Scale for radial bar (as percentage of highest)
const maxVisitors = Math.max(...topCategoriesData.map((d) => d.visitors));
const chartData = topCategoriesData.map((d) => ({
  ...d,
  pct: Math.round((d.visitors / maxVisitors) * 100),
}));

export function TopCategoriesChart() {
  return (
    <SectionCard title="Top Categories by Visitors" subtitle="Shop categories ranked by foot traffic">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="15%"
            outerRadius="90%"
            data={chartData}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar
              dataKey="pct"
              cornerRadius={4}
              background={{ fill: 'hsl(var(--muted))' }}
              label={{
                position: 'insideStart',
                fill: '#fff',
                fontSize: 10,
                fontFamily: 'Roboto Mono',
                formatter: (val: number) => `${val}%`,
              }}
            />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(_value: number, _name: string, props: { payload?: { name?: string; visitors?: number } }) => {
                return [`${(props.payload?.visitors ?? 0).toLocaleString()} visitors`, props.payload?.name ?? ''];
              }}
            />
            <Legend
              iconSize={10}
              wrapperStyle={{ fontSize: 10 }}
              formatter={(_value: string, entry: unknown) => {
                const e = entry as { payload?: { name?: string } };
                return (
                  <span className="text-foreground font-lexend text-[10px]">
                    {e?.payload?.name}
                  </span>
                );
              }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
