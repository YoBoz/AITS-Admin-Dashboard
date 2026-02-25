import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, DollarSign, ShoppingBag,
  Download, ArrowUpRight, ArrowDownRight,
  CheckCircle2, AlertTriangle, XCircle,
  BarChart3, Percent, Timer,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useOrdersStore } from '@/store/orders.store';
import { useMerchantAuth } from '@/hooks/useMerchantAuth';
import { useMerchantAuditStore } from '@/store/merchant-audit.store';

// --- Types ------------------------------------------------------------------
type ReportPeriod = 'today' | '7d' | '30d';
type ReportTab = 'overview' | 'orders' | 'sla' | 'issues';
type FulfillmentFilter = 'all' | 'delivery' | 'pickup';
type TimeOfDay = 'all' | 'morning' | 'afternoon' | 'evening';

// --- Mock data generator ----------------------------------------------------
function generateReportData(orders: ReturnType<typeof useOrdersStore.getState>['orders']) {
  const delivered = orders.filter((o) => o.status === 'delivered');
  const totalRevenue = delivered.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const completedOrders = delivered.length;
  const rejectedOrders = orders.filter((o) => o.status === 'rejected').length;
  const avgOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;
  const refundedOrders = orders.filter((o) => o.status === 'refunded' || o.status === 'refund_requested').length;

  // Simulated KPIs
  const acceptanceRate = totalOrders > 0 ? Math.round(((totalOrders - rejectedOrders) / totalOrders) * 100) : 100;
  const avgPrepTimeMin = Math.floor(Math.random() * 8) + 7; // 7-15 min
  const slaBreaches = Math.floor(Math.random() * 4);
  const refundRate = totalOrders > 0 ? Math.round((refundedOrders / totalOrders) * 100) : 0;

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
      slaBreaches: Math.floor(Math.random() * 2),
      avgPrep: Math.floor(Math.random() * 6) + 8,
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

  // Mock order rows
  const orderRows = orders.slice(0, 20).map((o) => ({
    id: o.id,
    time: new Date(o.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    items: o.items.length,
    total: o.total,
    status: o.status,
    fulfillment: Math.random() > 0.3 ? 'delivery' : 'pickup',
    prepMin: Math.floor(Math.random() * 12) + 5,
    slaOk: Math.random() > 0.15,
  }));

  // Rejection reasons
  const rejectionReasons = [
    { reason: 'Out of stock', count: Math.floor(Math.random() * 6) + 1 },
    { reason: 'Kitchen overload', count: Math.floor(Math.random() * 4) + 1 },
    { reason: 'Customer cancellation', count: Math.floor(Math.random() * 3) + 1 },
    { reason: 'Item unavailable', count: Math.floor(Math.random() * 2) + 1 },
    { reason: 'Incorrect order', count: Math.floor(Math.random() * 2) },
  ].filter((r) => r.count > 0).sort((a, b) => b.count - a.count);

  return {
    totalRevenue, totalOrders, completedOrders, rejectedOrders, refundedOrders,
    avgOrderValue, acceptanceRate, avgPrepTimeMin, slaBreaches, refundRate,
    daily, topItems, orderRows, rejectionReasons,
    completionRate: totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0,
  };
}

// --- Component --------------------------------------------------------------
export default function ReportsPage() {
  const { merchantRole, canDo, merchantUser } = useMerchantAuth();
  const { orders } = useOrdersStore();
  const addAudit = useMerchantAuditStore((s) => s.addEntry);
  const [period, setPeriod] = useState<ReportPeriod>('7d');
  const [tab, setTab] = useState<ReportTab>('overview');
  const [fulfillment, setFulfillment] = useState<FulfillmentFilter>('all');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('all');

  if (!canDo('reports.view')) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">You do not have permission to view this page.</p>
      </div>
    );
  }

  const report = useMemo(() => generateReportData(orders), [orders]);

  const handleExport = () => {
    const csvRows = [
      'Date,Orders,Revenue (AED),SLA Breaches,Avg Prep (min)',
      ...report.daily.map((d) => `${d.date},${d.orders},${d.revenue},${d.slaBreaches},${d.avgPrep}`),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `merchant-report-${period}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addAudit({
      eventType: 'merchant_report_exported',
      actorName: merchantUser?.name ?? 'Unknown',
      actorRole: merchantRole ?? 'unknown',
      metadata: { period, tab },
    });
  };

  const filteredOrders = report.orderRows.filter((o) => {
    if (fulfillment !== 'all' && o.fulfillment !== fulfillment) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-foreground">Reports</h1>
          <p className="text-xs text-muted-foreground font-lexend mt-0.5">
            Revenue, orders, SLA performance, and analytics {'\u00B7'} Role:{' '}
            <span className="font-semibold capitalize text-foreground">{merchantRole}</span>
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </Button>
      </div>

      {/* Period + Filters */}
      <div className="flex flex-wrap items-center gap-4">
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
                period === key ? 'bg-brand text-white' : 'bg-muted text-muted-foreground hover:text-foreground',
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-1.5">
          {(['all', 'delivery', 'pickup'] as FulfillmentFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFulfillment(f)}
              className={cn(
                'rounded-full px-2.5 py-1 text-[10px] font-medium capitalize transition-all',
                fulfillment === f ? 'bg-foreground/10 text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          {(['all', 'morning', 'afternoon', 'evening'] as TimeOfDay[]).map((t) => (
            <button
              key={t}
              onClick={() => setTimeOfDay(t)}
              className={cn(
                'rounded-full px-2.5 py-1 text-[10px] font-medium capitalize transition-all',
                timeOfDay === t ? 'bg-foreground/10 text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Nav */}
      <div className="flex items-center gap-1.5 border-b border-border pb-0">
        {([
          { key: 'overview', label: 'Overview', icon: BarChart3 },
          { key: 'orders', label: 'Orders Report', icon: ShoppingBag },
          { key: 'sla', label: 'SLA Report', icon: Timer },
          { key: 'issues', label: 'Rejection & Issues', icon: XCircle },
        ] as { key: ReportTab; label: string; icon: typeof BarChart3 }[]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => {
              setTab(key);
              addAudit({
                eventType: 'merchant_report_viewed',
                actorName: merchantUser?.name ?? 'Unknown',
                actorRole: merchantRole ?? 'unknown',
                metadata: { tab: key },
              });
            }}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-all',
              tab === key ? 'border-brand text-brand' : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="h-3.5 w-3.5" /> {label}
          </button>
        ))}
      </div>

      {/*  Overview Tab  */}
      {tab === 'overview' && (
        <>
          {/* KPI Cards - 8 cards in 2 rows */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Revenue', value: `${report.totalRevenue.toFixed(0)} AED`, icon: DollarSign, color: 'text-emerald-500', delta: '+12.5%', up: true },
              { label: 'Orders', value: String(report.totalOrders), icon: ShoppingBag, color: 'text-blue-500', delta: '+8.2%', up: true },
              { label: 'Avg Order Value', value: `${report.avgOrderValue.toFixed(1)} AED`, icon: TrendingUp, color: 'text-purple-500', delta: '-2.1%', up: false },
              { label: 'Completion Rate', value: `${report.completionRate}%`, icon: CheckCircle2, color: 'text-emerald-500', delta: '+1.4%', up: true },
              { label: 'Acceptance Rate', value: `${report.acceptanceRate}%`, icon: Percent, color: 'text-sky-500', delta: '+0.8%', up: true },
              { label: 'Avg Prep Time', value: `${report.avgPrepTimeMin} min`, icon: Timer, color: 'text-amber-500', delta: '-0.5 min', up: true },
              { label: 'SLA Breaches', value: String(report.slaBreaches), icon: AlertTriangle, color: 'text-red-500', delta: report.slaBreaches === 0 ? 'None' : '-1', up: report.slaBreaches === 0 },
              { label: 'Refund Rate', value: `${report.refundRate}%`, icon: XCircle, color: 'text-orange-500', delta: '-0.3%', up: true },
            ].map((kpi, idx) => (
              <motion.div key={kpi.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-muted-foreground">{kpi.label}</span>
                      <kpi.icon className={cn('h-4 w-4', kpi.color)} />
                    </div>
                    <p className="text-lg font-bold font-montserrat">{kpi.value}</p>
                    <div className={cn('flex items-center gap-0.5 mt-1 text-[10px]', kpi.up ? 'text-emerald-600' : 'text-red-500')}>
                      {kpi.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {kpi.delta}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Daily Breakdown + Bar chart */}
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
                        <th className="text-right py-2 px-3 text-muted-foreground font-medium">Revenue</th>
                        <th className="text-right py-2 px-3 text-muted-foreground font-medium">SLA Breaches</th>
                        <th className="text-right py-2 px-3 text-muted-foreground font-medium">Avg Prep</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.daily.map((day, i) => (
                        <tr key={i} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                          <td className="py-2 px-3 font-medium">{day.date}</td>
                          <td className="py-2 px-3 text-right font-mono">{day.orders}</td>
                          <td className="py-2 px-3 text-right font-mono">{day.revenue} AED</td>
                          <td className="py-2 px-3 text-right">
                            <Badge variant={day.slaBreaches > 0 ? 'destructive' : 'secondary'} className="text-[9px]">
                              {day.slaBreaches}
                            </Badge>
                          </td>
                          <td className="py-2 px-3 text-right font-mono">{day.avgPrep} min</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
        </>
      )}

      {/*  Orders Report Tab  */}
      {tab === 'orders' && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-0">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold font-montserrat">Orders Report</h3>
                <Badge variant="secondary" className="text-[10px]">{filteredOrders.length} orders</Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-2.5 px-4 font-medium text-muted-foreground">Order ID</th>
                      <th className="text-left py-2.5 px-4 font-medium text-muted-foreground">Time</th>
                      <th className="text-center py-2.5 px-4 font-medium text-muted-foreground">Items</th>
                      <th className="text-right py-2.5 px-4 font-medium text-muted-foreground">Total</th>
                      <th className="text-center py-2.5 px-4 font-medium text-muted-foreground">Fulfillment</th>
                      <th className="text-center py-2.5 px-4 font-medium text-muted-foreground">Prep (min)</th>
                      <th className="text-center py-2.5 px-4 font-medium text-muted-foreground">SLA</th>
                      <th className="text-center py-2.5 px-4 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((o) => (
                      <tr key={o.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 px-4 font-mono text-[10px]">{o.id.slice(0, 12)}...</td>
                        <td className="py-2.5 px-4">{o.time}</td>
                        <td className="py-2.5 px-4 text-center">{o.items}</td>
                        <td className="py-2.5 px-4 text-right font-mono">{o.total.toFixed(1)} AED</td>
                        <td className="py-2.5 px-4 text-center">
                          <Badge variant="secondary" className="text-[9px] capitalize">{o.fulfillment}</Badge>
                        </td>
                        <td className="py-2.5 px-4 text-center font-mono">{o.prepMin}</td>
                        <td className="py-2.5 px-4 text-center">
                          {o.slaOk ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mx-auto" />
                          ) : (
                            <AlertTriangle className="h-3.5 w-3.5 text-red-500 mx-auto" />
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <Badge
                            variant={o.status === 'delivered' ? 'success' : o.status === 'rejected' ? 'destructive' : 'secondary'}
                            className="text-[9px] capitalize"
                          >
                            {o.status.replace('_', ' ')}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/*  SLA Report Tab  */}
      {tab === 'sla' && (
        <div className="space-y-4">
          {/* SLA KPI row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-muted-foreground">Avg Prep Time</span>
                  <Timer className="h-4 w-4 text-amber-500" />
                </div>
                <p className="text-xl font-bold font-montserrat">{report.avgPrepTimeMin} min</p>
                <p className="text-[10px] text-muted-foreground mt-1">Target: {'\u2264'} 12 min</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-muted-foreground">SLA Breaches (Period)</span>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </div>
                <p className="text-xl font-bold font-montserrat">{report.daily.reduce((s, d) => s + d.slaBreaches, 0)}</p>
                <p className="text-[10px] text-muted-foreground mt-1">Target: 0</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-muted-foreground">On-time Rate</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="text-xl font-bold font-montserrat">
                  {report.totalOrders > 0
                    ? Math.round(((report.totalOrders - report.daily.reduce((s, d) => s + d.slaBreaches, 0)) / report.totalOrders) * 100)
                    : 100}%
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">Target: {'\u2265'} 95%</p>
              </CardContent>
            </Card>
          </div>

          {/* SLA daily chart */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold font-montserrat mb-4">SLA Breaches by Day</h3>
                <div className="flex items-end gap-2 h-24">
                  {report.daily.map((day, i) => {
                    const maxB = Math.max(...report.daily.map((d) => d.slaBreaches), 1);
                    const height = (day.slaBreaches / maxB) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[9px] font-mono">{day.slaBreaches}</span>
                        <div
                          className={cn('w-full rounded-t transition-all', day.slaBreaches > 0 ? 'bg-red-400' : 'bg-emerald-400')}
                          style={{ height: `${Math.max(height, 4)}%` }}
                        />
                        <span className="text-[8px] text-muted-foreground">{day.date.split(',')[0]}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Prep time chart */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold font-montserrat mb-4">Avg Prep Time by Day</h3>
                <div className="flex items-end gap-2 h-24">
                  {report.daily.map((day, i) => {
                    const maxP = Math.max(...report.daily.map((d) => d.avgPrep), 1);
                    const height = (day.avgPrep / maxP) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[9px] font-mono">{day.avgPrep}m</span>
                        <div
                          className={cn('w-full rounded-t transition-all', day.avgPrep > 12 ? 'bg-amber-400' : 'bg-brand/60')}
                          style={{ height: `${Math.max(height, 8)}%` }}
                        />
                        <span className="text-[8px] text-muted-foreground">{day.date.split(',')[0]}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/*  Rejection & Issues Tab  */}
      {tab === 'issues' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card>
              <CardContent className="p-4">
                <span className="text-[10px] text-muted-foreground block mb-1">Total Rejected</span>
                <p className="text-xl font-bold font-montserrat text-red-600">{report.rejectedOrders}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <span className="text-[10px] text-muted-foreground block mb-1">Total Refunded</span>
                <p className="text-xl font-bold font-montserrat text-orange-600">{report.refundedOrders}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <span className="text-[10px] text-muted-foreground block mb-1">Refund Rate</span>
                <p className="text-xl font-bold font-montserrat">{report.refundRate}%</p>
              </CardContent>
            </Card>
          </div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold font-montserrat mb-4">Rejection Reasons</h3>
                {report.rejectionReasons.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No rejections in this period</p>
                ) : (
                  <div className="space-y-3">
                    {report.rejectionReasons.map((r) => {
                      const max = report.rejectionReasons[0].count;
                      return (
                        <div key={r.reason} className="flex items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs font-medium">{r.reason}</p>
                              <span className="text-xs font-mono text-muted-foreground">{r.count}</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full bg-red-400 transition-all"
                                style={{ width: `${(r.count / max) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
