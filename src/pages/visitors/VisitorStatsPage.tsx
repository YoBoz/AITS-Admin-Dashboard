import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { VisitorTrendChart } from '@/components/visitors/VisitorTrendChart';
import { VisitorDemographicChart } from '@/components/visitors/VisitorDemographicChart';
import { PeakHoursGrid } from '@/components/visitors/PeakHoursGrid';
// import { VisitorFlowSankey } from '@/components/visitors/VisitorFlowSankey';
import { GateTrafficChart } from '@/components/visitors/GateTrafficChart';
import { DwellTimeChart } from '@/components/visitors/DwellTimeChart';
import { TopCategoriesChart } from '@/components/visitors/TopCategoriesChart';
import { DataTable } from '@/components/common/DataTable';
import { visitorStatsData } from '@/data/mock/visitors.mock';
import { formatNumber, formatDate } from '@/lib/utils';
import { Users, Clock, ShoppingCart, TrendingUp } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import type { VisitorStats } from '@/types/visitor.types';
import { Button } from '@/components/ui/Button';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function KpiCard({ icon, label, value, trend, positive }: { icon: React.ReactNode; label: string; value: string; trend: string; positive: boolean }) {
  return (
    <motion.div variants={item}>
      <SectionCard title="" contentClassName="pt-0">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-brand/10 text-brand">{icon}</div>
          <div>
            <div className="text-xs text-muted-foreground font-lexend">{label}</div>
            <div className="text-xl font-bold font-montserrat text-foreground">{value}</div>
            <div className={`text-[11px] font-mono ${positive ? 'text-status-success' : 'text-destructive'}`}>
              {trend}
            </div>
          </div>
        </div>
      </SectionCard>
    </motion.div>
  );
}

const columns: ColumnDef<VisitorStats>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ getValue }) => (
      <span className="font-mono text-xs">{formatDate(getValue<string>(), 'MMM dd')}</span>
    ),
  },
  {
    accessorKey: 'total',
    header: 'Total Visitors',
    cell: ({ getValue }) => <span className="font-mono">{formatNumber(getValue<number>())}</span>,
  },
  {
    header: 'Trolley Users',
    accessorFn: (row) => Math.round(row.total * row.trolley_adoption_rate),
    cell: ({ getValue }) => <span className="font-mono">{formatNumber(getValue<number>())}</span>,
  },
  {
    accessorKey: 'avg_dwell_minutes',
    header: 'Avg Dwell',
    cell: ({ getValue }) => <span className="font-mono">{getValue<number>()} min</span>,
  },
  {
    header: 'Peak Hour',
    accessorFn: (row) => {
      const maxIdx = row.by_hour.indexOf(Math.max(...row.by_hour));
      return `${String(maxIdx).padStart(2, '0')}:00`;
    },
    cell: ({ getValue }) => <span className="font-mono">{getValue<string>()}</span>,
  },
  {
    header: 'Top Zone',
    accessorFn: (row) => {
      const entries = Object.entries(row.by_category_visits);
      entries.sort(([, a], [, b]) => b - a);
      return entries[0]?.[0] ?? '-';
    },
    cell: ({ getValue }) => (
      <span className="capitalize font-lexend text-xs">{getValue<string>()}</span>
    ),
  },
];

export default function VisitorStatsPage() {
  const [range, setRange] = useState<'7d' | '14d' | '30d'>('30d');

  const filteredData = useMemo(() => {
    const days = range === '7d' ? 7 : range === '14d' ? 14 : 30;
    return visitorStatsData.slice(-days);
  }, [range]);

  const kpis = useMemo(() => {
    const totals = filteredData.reduce((acc, d) => acc + d.total, 0);
    const avgDwell = Math.round(
      filteredData.reduce((acc, d) => acc + d.avg_dwell_minutes, 0) / filteredData.length
    );
    const avgAdoption = (
      filteredData.reduce((acc, d) => acc + d.trolley_adoption_rate, 0) / filteredData.length
    ).toFixed(1);
    return { totals, avgDwell, avgAdoption };
  }, [filteredData]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Visitor Analytics"
        subtitle="Comprehensive visitor statistics and insights"
        actions={
          <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-0.5">
            {(['7d', '14d', '30d'] as const).map((r) => (
              <Button
                key={r}
                variant={range === r ? 'default' : 'ghost'}
                size="sm"
                className="text-xs h-7"
                onClick={() => setRange(r)}
              >
                {r === '7d' ? '7 Days' : r === '14d' ? '14 Days' : '30 Days'}
              </Button>
            ))}
          </div>
        }
      />

      {/* Row 1: KPIs */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <KpiCard
          icon={<Users className="h-5 w-5" />}
          label="Total Visitors"
          value={formatNumber(kpis.totals)}
          trend="+12.5% vs previous"
          positive
        />
        <KpiCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Unique Sessions"
          value={formatNumber(Math.round(kpis.totals * 0.72))}
          trend="+8.3% vs previous"
          positive
        />
        <KpiCard
          icon={<Clock className="h-5 w-5" />}
          label="Avg Dwell Time"
          value={`${kpis.avgDwell} min`}
          trend="-2.1% vs previous"
          positive={false}
        />
        <KpiCard
          icon={<ShoppingCart className="h-5 w-5" />}
          label="Trolley Adoption"
          value={`${(Number(kpis.avgAdoption) * 100).toFixed(0)}%`}
          trend="+5.2% vs previous"
          positive
        />
      </motion.div>

      {/* Row 2: Trend + Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <VisitorTrendChart data={filteredData} />
        </div>
        <div className="lg:col-span-2">
          <VisitorDemographicChart />
        </div>
      </div>

      {/* Row 3: Peak Hours */}
      <PeakHoursGrid />

      {/* Row 4: Gate Traffic + Dwell Time + Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GateTrafficChart />
        <DwellTimeChart />
      </div>

      {/* Row 5: Top Categories + Data Table */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <TopCategoriesChart />
        </div>
        <div className="lg:col-span-3">
          <SectionCard title="Daily Statistics" subtitle="Tabular view of visitor data">
            <DataTable columns={columns} data={filteredData} />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
