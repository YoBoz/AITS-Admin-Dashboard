import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Terminal } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { KPICard } from '@/components/dashboard/KPICard';
import { VisitorFlowChart } from '@/components/dashboard/VisitorFlowChart';
import { TrolleyStatusWidget } from '@/components/dashboard/TrolleyStatusWidget';
import { TrolleyBatteryChart } from '@/components/dashboard/TrolleyBatteryChart';
import { TopShopsWidget } from '@/components/dashboard/TopShopsWidget';
import { SystemHealthWidget } from '@/components/dashboard/SystemHealthWidget';
import { ActiveAlertsWidget } from '@/components/dashboard/ActiveAlertsWidget';
import { RecentActivityFeed } from '@/components/dashboard/RecentActivityFeed';
import { kpiData } from '@/data/mock/overview.mock';

function LiveClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-roboto">
      <Clock className="h-3.5 w-3.5" />
      <span>
        {now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        {' · '}
        {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Overview"
        subtitle="Real-time operational dashboard"
        actions={
          <div className="flex items-center gap-3">
            <LiveClock />
            <Badge variant="outline" className="gap-1.5 font-roboto text-xs">
              <Terminal className="h-3 w-3" />
              Terminal 2
            </Badge>
          </div>
        }
      />

      {/* KPI Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
      >
        {kpiData.map((kpi, i) => (
          <motion.div key={kpi.title} variants={itemVariants}>
            <KPICard data={kpi} index={i} />
          </motion.div>
        ))}
      </motion.div>

      {/* Row 2: Visitor Flow + Trolley Status */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <VisitorFlowChart />
        </div>
        <div className="lg:col-span-2">
          <TrolleyStatusWidget />
        </div>
      </div>

      {/* Row 3: Battery + Top Shops + System Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-2">
          <TrolleyBatteryChart />
        </div>
        <div className="xl:col-span-2">
          <TopShopsWidget />
        </div>
        <div className="xl:col-span-1 md:col-span-2 xl:md:col-span-1">
          <SystemHealthWidget />
        </div>
      </div>

      {/* Row 4: Active Alerts + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ActiveAlertsWidget />
        <RecentActivityFeed />
      </div>
    </div>
  );
}
