import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SectionCard } from '@/components/common/SectionCard';
import { trolleyStatusData } from '@/data/mock/overview.mock';

export function TrolleyStatusWidget() {
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
              stroke="none"
            >
              {trolleyStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
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
