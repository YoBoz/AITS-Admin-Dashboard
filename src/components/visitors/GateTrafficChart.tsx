import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
import { SectionCard } from '@/components/common/SectionCard';
import { gateTrafficData } from '@/data/mock/visitors.mock';

export function GateTrafficChart() {
  return (
    <SectionCard title="Gate Traffic Breakdown" subtitle="Arrivals vs departures per gate">
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={gateTrafficData}
            layout="vertical"
            margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10 }} className="text-muted-foreground" />
            <YAxis
              dataKey="gate"
              type="category"
              tick={{ fontSize: 10, fontFamily: 'Roboto Mono' }}
              className="text-muted-foreground"
              width={35}
            />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="arrivals" name="Arrivals" fill="#3B82F6" radius={[0, 2, 2, 0]} stackId="a" />
            <Bar dataKey="departures" name="Departures" fill="#BE052E" radius={[0, 2, 2, 0]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
