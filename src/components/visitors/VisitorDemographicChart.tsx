import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { SectionCard } from '@/components/common/SectionCard';
import { demographicData } from '@/data/mock/visitors.mock';

export function VisitorDemographicChart() {
  return (
    <SectionCard title="Visitor Demographics" subtitle="Breakdown by visitor type">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={demographicData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
              nameKey="name"
              animationBegin={0}
              animationDuration={800}
            >
              {demographicData.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(value: number) => [`${value}%`, '']}
            />
            <Legend
              wrapperStyle={{ fontSize: 11 }}
              formatter={(value: string) => (
                <span className="text-foreground font-lexend text-xs">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
