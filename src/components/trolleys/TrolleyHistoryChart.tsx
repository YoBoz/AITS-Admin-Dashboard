import { useMemo } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

interface TrolleyHistoryChartProps {
  trolleyId: string;
  className?: string;
}

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function TrolleyHistoryChart({ trolleyId, className }: TrolleyHistoryChartProps) {
  const data = useMemo(() => {
    const seed = trolleyId.charCodeAt(2) * 100 + (parseInt(trolleyId.slice(-4)) || 0);
    const points = [];
    let battery = 85 + Math.floor(pseudoRandom(seed) * 15);

    for (let h = 48; h >= 0; h--) {
      const time = new Date(Date.now() - h * 3600000);
      const r = pseudoRandom(seed + h * 7);

      // Simulate battery drain and charging cycles
      if (battery < 20) {
        battery += Math.floor(r * 15) + 10; // charging
      } else if (r < 0.15) {
        battery += Math.floor(r * 20) + 5; // occasional charge
      } else {
        battery -= Math.floor(r * 5) + 1; // drain
      }

      battery = Math.min(100, Math.max(5, battery));

      points.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        battery,
        hour: h,
      });
    }

    return points;
  }, [trolleyId]);

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="batteryGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10 }}
            className="text-muted-foreground"
            interval={5}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 10 }}
            className="text-muted-foreground"
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
            formatter={(value: number) => [`${value}%`, 'Battery']}
          />
          <Area
            type="monotone"
            dataKey="battery"
            stroke="#10b981"
            fill="url(#batteryGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
