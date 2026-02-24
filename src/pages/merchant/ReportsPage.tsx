import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, DollarSign, ShoppingBag,
  Download, ArrowUpRight, ArrowDownRight,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useOrdersStore } from '@/store/orders.store';
import { useMerchantAuth } from '@/hooks/useMerchantAuth';

// ─── Types ────────────────────────────────────────────────────────────
type ReportPeriod = 'today' | '7d' | '30d' | 'custom';

// ─── Mock report data generator ───────────────────────────────────────
function generateReportData(orders: ReturnType<typeof useOrdersStore.getState>['orders']) {
  const delivered = orders.filter((o) => o.status === 'delivered');
  const totalRevenue = delivered.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const completedOrders = delivered.length;
  const rejectedOrders = orders.filter((o) => o.status === 'rejected').length;
  const avgOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;
  const refundedOrders = orders.filter((o) => o.status === 'refunded' || o.status === 'refund_requested').length;

  // Simulated daily breakdown (last 7 days)
  const daily = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayOrders = Math.floor(Math.random() * 30) + 10;
    const dayRevenue = dayOrders * (avgOrderValue || 45);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      orders: dayOrders,
      revenue: Math.round(dayRevenue),
    };
  });

  // Top items
  const itemCounts: Record<string, { name: string; count: number; revenue: number }> = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      if (!itemCounts[item.name]) {
        itemCounts[item.name] = { name: item.name, count: 0, revenue: 0 };
      }
      itemCounts[item.name].count += item.quantity;
      itemCounts[item.name].revenue += item.unit_price * item.quantity;
    });
  });
  const topItems = Object.values(itemCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalRevenue,
    totalOrders,
    completedOrders,
    rejectedOrders,
    refundedOrders,
    avgOrderValue,
    daily,
    topItems,
    completionRate: totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0,
  };
}

// ─── Component ────────────────────────────────────────────────────────
export default function ReportsPage() {
  const { merchantRole, canDo } = useMerchantAuth();
  const { orders } = useOrdersStore();
  const [period, setPeriod] = useState<ReportPeriod>('7d');

  if (!canDo('reports.view')) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">You do not have permission to view this page.</p>
      </div>
    );
  }

  const report = useMemo(() => generateReportData(orders), [orders]);

  const handleExport = () => {
    // Simulated export
    const csvRows = [
      'Date,Orders,Revenue (AED)',
      ...report.daily.map((d) => `${d.date},${d.orders},${d.revenue}`),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `merchant-report-${period}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-foreground">Reports</h1>
          <p className="text-xs text-muted-foreground font-lexend mt-0.5">
            Revenue, orders, and performance analytics · Role:{' '}
            <span className="font-semibold capitalize text-foreground">{merchantRole}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Period Filter */}
      <div className="flex items-center gap-1.5">
        {([
          { key: 'today', label: 'Today' },
          { key: '7d', label: '7 Days' },
          { key: '30d', label: '30 Days' },
        ] as { key: ReportPeriod; label: string }[]).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setPeriod(key)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-all',
              period === key
                ? 'bg-brand text-white'
                : 'bg-muted text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Total Revenue</span>
                <DollarSign className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-xl font-bold font-montserrat">{report.totalRevenue.toFixed(0)} AED</p>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-600">
                <ArrowUpRight className="h-3 w-3" /> +12.5% vs last period
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Total Orders</span>
                <ShoppingBag className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-xl font-bold font-montserrat">{report.totalOrders}</p>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-600">
                <ArrowUpRight className="h-3 w-3" /> +8.2% vs last period
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Avg Order Value</span>
                <TrendingUp className="h-4 w-4 text-purple-500" />
              </div>
              <p className="text-xl font-bold font-montserrat">{report.avgOrderValue.toFixed(1)} AED</p>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-red-600">
                <ArrowDownRight className="h-3 w-3" /> -2.1% vs last period
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Completion Rate</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-xl font-bold font-montserrat">{report.completionRate}%</p>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                {report.rejectedOrders} rejected · {report.refundedOrders} refunded
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Daily Breakdown */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold font-montserrat">Daily Breakdown</h3>
              <Badge variant="secondary" className="text-[10px]">Last 7 days</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Date</th>
                    <th className="text-right py-2 px-3 text-muted-foreground font-medium">Orders</th>
                    <th className="text-right py-2 px-3 text-muted-foreground font-medium">Revenue (AED)</th>
                  </tr>
                </thead>
                <tbody>
                  {report.daily.map((day, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                      <td className="py-2 px-3 font-medium">{day.date}</td>
                      <td className="py-2 px-3 text-right font-mono">{day.orders}</td>
                      <td className="py-2 px-3 text-right font-mono">{day.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Simple bar chart visualization */}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-[10px] text-muted-foreground mb-2">Revenue Distribution</p>
              <div className="flex items-end gap-1 h-20">
                {report.daily.map((day, i) => {
                  const max = Math.max(...report.daily.map((d) => d.revenue));
                  const height = max > 0 ? (day.revenue / max) * 100 : 0;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-brand/70 rounded-t transition-all"
                        style={{ height: `${height}%` }}
                        title={`${day.date}: ${day.revenue} AED`}
                      />
                      <span className="text-[8px] text-muted-foreground">{day.date.split(',')[0]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Items */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold font-montserrat mb-4">Top Selling Items</h3>
            {report.topItems.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No order data available</p>
            ) : (
              <div className="space-y-3">
                {report.topItems.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{item.name}</p>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden mt-1">
                        <div
                          className="h-full rounded-full bg-brand transition-all"
                          style={{ width: `${(item.count / report.topItems[0].count) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-mono font-medium">{item.count} sold</p>
                      <p className="text-[10px] text-muted-foreground">{item.revenue.toFixed(0)} AED</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
