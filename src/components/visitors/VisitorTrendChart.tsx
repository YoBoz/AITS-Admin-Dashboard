import { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
import { SectionCard } from '@/components/common/SectionCard';
import type { VisitorStats } from '@/types/visitor.types';
import { format, parseISO } from 'date-fns';

interface VisitorTrendChartProps {
  data: VisitorStats[];
}

export function VisitorTrendChart({ data }: VisitorTrendChartProps) {
  const chartData = useMemo(() => {
    return data.map((d) => {
      const trolleyUsers = Math.round(d.total * d.trolley_adoption_rate);
      return {
        date: format(parseISO(d.date), 'MMM dd'),
        total: d.total,
        trolleyUsers,
        nonTrolley: d.total - trolleyUsers,
      };
    });
  }, [data]);

  return (
    <SectionCard title="Visitor Trend" subtitle="Daily visitor counts over the period">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#BE052E" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#BE052E" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradTrolley" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradNonTrolley" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} className="text-muted-foreground" />
            <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="total" name="Total" stroke="#BE052E" fill="url(#gradTotal)" strokeWidth={2} />
            <Area type="monotone" dataKey="trolleyUsers" name="Trolley Users" stroke="#3B82F6" fill="url(#gradTrolley)" strokeWidth={2} />
            <Area type="monotone" dataKey="nonTrolley" name="Non-Trolley" stroke="#10B981" fill="url(#gradNonTrolley)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
