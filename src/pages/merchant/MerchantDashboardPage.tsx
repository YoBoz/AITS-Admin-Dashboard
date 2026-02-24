import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import {
  ClipboardList, Clock, Package, CheckCircle2, AlertTriangle,
  TrendingUp, DollarSign, ShoppingBag, Timer, Zap,
  ArrowUpRight, ArrowDownRight, Activity, CreditCard,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useOrdersStore } from '@/store/orders.store';
import { useMerchantStore } from '@/store/merchant.store';
import { useMerchantAuth } from '@/hooks/useMerchantAuth';

// ─── Color Palette ────────────────────────────────────────────────────
const BRAND = '#6366f1';
const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#a855f7', '#ec4899', '#14b8a6'];
const STATUS_COLORS: Record<string, string> = {
  new: '#3b82f6',
  accepted: '#0ea5e9',
  preparing: '#f59e0b',
  ready: '#22c55e',
  in_transit: '#a855f7',
  delivered: '#16a34a',
  rejected: '#ef4444',
  failed: '#dc2626',
  refund_requested: '#f97316',
  refunded: '#6b7280',
};

// ─── Sparkline (tiny inline chart) ────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const points = data.map((v, i) => ({ v, i }));
  return (
    <ResponsiveContainer width="100%" height={32}>
      <LineChart data={points}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ─── Stat Card (enhanced with trend + sparkline) ──────────────────────
function StatCard({
  label, value, icon: Icon, color, bgColor, delay, trend, sparkData,
}: {
  label: string;
  value: string | number;
  icon: typeof ClipboardList;
  color: string;
  bgColor: string;
  delay: number;
  trend?: { value: number; up: boolean };
  sparkData?: number[];
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}>
      <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg shrink-0', bgColor)}>
              <Icon className={cn('h-4 w-4', color)} />
            </div>
            {trend && (
              <span className={cn(
                'flex items-center gap-0.5 text-[10px] font-bold rounded-full px-1.5 py-0.5',
                trend.up ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600' : 'bg-red-100 dark:bg-red-950/30 text-red-600'
              )}>
                {trend.up ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
                {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          <p className="text-[22px] font-bold font-montserrat leading-tight">{value}</p>
          <p className="text-[11px] text-muted-foreground font-lexend mt-0.5">{label}</p>
          {sparkData && (
            <div className="mt-2 -mb-1 -mx-1 opacity-60 group-hover:opacity-100 transition-opacity">
              <Sparkline data={sparkData} color={color.replace('text-', '')} />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Mini donut for pipeline ──────────────────────────────────────────
function MiniDonut({ data }: { data: { name: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          dataKey="value"
          strokeWidth={2}
          stroke="hsl(var(--card))"
        >
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} />
          ))}
        </Pie>
        <text x="50%" y="48%" textAnchor="middle" className="fill-foreground text-2xl font-bold font-montserrat">
          {total}
        </text>
        <text x="50%" y="60%" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          total
        </text>
        <RTooltip
          contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 11 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ─── Generate synthetic hourly data from orders ───────────────────────
function generateHourlyRevenue(orders: { status: string; total: number; created_at: string }[]) {
  const hours = Array.from({ length: 12 }, (_, i) => {
    const h = 8 + i; // 8am to 7pm
    return { hour: `${h}:00`, revenue: 0, count: 0 };
  });
  orders
    .filter((o) => o.status === 'delivered')
    .forEach((o) => {
      const h = new Date(o.created_at).getHours();
      const idx = Math.min(Math.max(h - 8, 0), 11);
      hours[idx].revenue += o.total;
      hours[idx].count += 1;
    });
  // Add some synthetic variation for visual interest
  hours.forEach((h, i) => {
    if (h.revenue === 0) {
      h.revenue = Math.floor(50 + Math.sin(i * 0.7) * 40 + Math.random() * 30);
      h.count = Math.floor(2 + Math.random() * 5);
    }
  });
  return hours;
}

function generateDailyOrders() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day) => ({
    day,
    orders: Math.floor(15 + Math.random() * 35),
    revenue: Math.floor(300 + Math.random() * 600),
  }));
}

function getTopItems(orders: { status: string; items: { name: string; quantity: number; unit_price: number }[] }[]) {
  const map: Record<string, { name: string; qty: number; revenue: number }> = {};
  orders
    .filter((o) => o.status === 'delivered')
    .forEach((o) => {
      o.items.forEach((item) => {
        if (!map[item.name]) map[item.name] = { name: item.name, qty: 0, revenue: 0 };
        map[item.name].qty += item.quantity;
        map[item.name].revenue += item.unit_price * item.quantity;
      });
    });
  return Object.values(map)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 6);
}

function getPaymentBreakdown(orders: { payment_method?: string; status: string }[]) {
  const map: Record<string, number> = {};
  orders
    .filter((o) => o.status === 'delivered')
    .forEach((o) => {
      const m = o.payment_method || 'card';
      map[m] = (map[m] || 0) + 1;
    });
  return Object.entries(map).map(([name, value], i) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: COLORS[i % COLORS.length],
  }));
}

// ─── Component ────────────────────────────────────────────────────────
export default function MerchantDashboardPage() {
  const navigate = useNavigate();
  const { merchantRole, canDo } = useMerchantAuth();
  const { orders } = useOrdersStore();
  const { storeStatus, slaSettings, capacitySettings } = useMerchantStore();

  if (!canDo('dashboard.view')) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">You do not have permission to view this page.</p>
      </div>
    );
  }

  const stats = useMemo(() => {
    const newOrders = orders.filter((o) => o.status === 'new').length;
    const preparing = orders.filter((o) => o.status === 'accepted' || o.status === 'preparing').length;
    const ready = orders.filter((o) => o.status === 'ready').length;
    const completed = orders.filter((o) => o.status === 'delivered').length;
    const issues = orders.filter((o) =>
      ['rejected', 'failed', 'refund_requested', 'refunded'].includes(o.status)
    ).length;
    const totalRevenue = orders
      .filter((o) => o.status === 'delivered')
      .reduce((sum, o) => sum + o.total, 0);
    const avgPrepTime = capacitySettings.avg_prep_time_minutes;
    const totalOrders = orders.length;
    const completionRate = totalOrders > 0 ? Math.round((completed / totalOrders) * 100) : 0;
    return { newOrders, preparing, ready, completed, issues, totalRevenue, avgPrepTime, totalOrders, completionRate };
  }, [orders, capacitySettings]);

  const hourlyData = useMemo(() => generateHourlyRevenue(orders), [orders]);
  const dailyData = useMemo(() => generateDailyOrders(), []);
  const topItems = useMemo(() => getTopItems(orders), [orders]);
  const paymentData = useMemo(() => getPaymentBreakdown(orders), [orders]);

  const statusDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((o) => {
      map[o.status] = (map[o.status] || 0) + 1;
    });
    return Object.entries(map)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value, color: STATUS_COLORS[name] || '#6b7280' }));
  }, [orders]);

  // Synthetic sparkline data
  const sparkRevenue = useMemo(() => Array.from({ length: 8 }, () => Math.floor(100 + Math.random() * 200)), []);
  const sparkOrders = useMemo(() => Array.from({ length: 8 }, () => Math.floor(3 + Math.random() * 12)), []);
  const sparkPrep = useMemo(() => Array.from({ length: 8 }, () => Math.floor(8 + Math.random() * 10)), []);

  // Max for top items bar normalization
  const topMax = topItems.length > 0 ? Math.max(...topItems.map((t) => t.qty)) : 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-foreground">Dashboard</h1>
          <p className="text-xs text-muted-foreground font-lexend mt-0.5">
            Store overview · Role:{' '}
            <span className="font-semibold capitalize text-foreground">{merchantRole}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider',
              storeStatus === 'open' && 'bg-emerald-500/10 text-emerald-500',
              storeStatus === 'busy' && 'bg-amber-500/10 text-amber-500',
              storeStatus === 'closed' && 'bg-red-500/10 text-red-500',
            )}
          >
            <span
              className={cn(
                'h-2 w-2 rounded-full animate-pulse',
                storeStatus === 'open' && 'bg-emerald-500',
                storeStatus === 'busy' && 'bg-amber-500',
                storeStatus === 'closed' && 'bg-red-500',
              )}
            />
            {storeStatus}
          </span>
        </div>
      </div>

      {/* ── Top Stats Row ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="New Orders"
          value={stats.newOrders}
          icon={ClipboardList}
          color="text-blue-600"
          bgColor="bg-blue-100 dark:bg-blue-950/30"
          delay={0}
          trend={{ value: 12, up: true }}
        />
        <StatCard
          label="Preparing"
          value={stats.preparing}
          icon={Clock}
          color="text-amber-600"
          bgColor="bg-amber-100 dark:bg-amber-950/30"
          delay={0.05}
        />
        <StatCard
          label="Ready"
          value={stats.ready}
          icon={Package}
          color="text-emerald-600"
          bgColor="bg-emerald-100 dark:bg-emerald-950/30"
          delay={0.1}
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          color="text-green-600"
          bgColor="bg-green-100 dark:bg-green-950/30"
          delay={0.15}
          trend={{ value: 8, up: true }}
        />
      </div>

      {/* ── Masonry Charts Grid ─────────────────────────────────────── */}
      <Masonry
        breakpointCols={{ default: 3, 1280: 3, 1024: 2, 768: 1 }}
        className="masonry-grid"
        columnClassName="masonry-grid-column"
      >
        {/* Revenue Chart (tall) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <Card className="overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold font-montserrat">Revenue Today</h3>
                  <p className="text-2xl font-bold font-montserrat mt-1">{stats.totalRevenue.toFixed(0)} <span className="text-sm text-muted-foreground font-normal">AED</span></p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10">
                  <DollarSign className="h-4 w-4 text-brand" />
                </div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={hourlyData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={BRAND} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={BRAND} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <RTooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 11 }}
                    formatter={(v: number) => [`${v.toFixed(0)} AED`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke={BRAND} fill="url(#revGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Status Distribution (donut) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }}>
          <Card>
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold font-montserrat mb-1">Live Order Pipeline</h3>
              <p className="text-[11px] text-muted-foreground mb-2">Current status distribution</p>
              <MiniDonut data={statusDistribution} />
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3">
                {statusDistribution.map((s) => (
                  <div key={s.name} className="flex items-center gap-1.5 text-[10px]">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ background: s.color }} />
                    <span className="capitalize text-muted-foreground">{s.name.replace('_', ' ')}</span>
                    <span className="ml-auto font-bold">{s.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* KPI Cards Column */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
          <div className="space-y-3">
            <StatCard
              label="Today's Revenue"
              value={`${stats.totalRevenue.toFixed(0)} AED`}
              icon={DollarSign}
              color="text-brand"
              bgColor="bg-brand/10"
              delay={0}
              trend={{ value: 15, up: true }}
              sparkData={sparkRevenue}
            />
            <StatCard
              label="Total Orders"
              value={stats.totalOrders}
              icon={ShoppingBag}
              color="text-cyan-600"
              bgColor="bg-cyan-100 dark:bg-cyan-950/30"
              delay={0}
              sparkData={sparkOrders}
            />
            <StatCard
              label="Avg Prep Time"
              value={`${stats.avgPrepTime} min`}
              icon={Timer}
              color="text-purple-600"
              bgColor="bg-purple-100 dark:bg-purple-950/30"
              delay={0}
              trend={{ value: 3, up: false }}
              sparkData={sparkPrep}
            />
          </div>
        </motion.div>

        {/* Weekly Orders Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }}>
          <Card>
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold font-montserrat mb-1">Weekly Orders</h3>
              <p className="text-[11px] text-muted-foreground mb-3">Last 7 days</p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={dailyData} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <RTooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 11 }}
                  />
                  <Bar dataKey="orders" fill={BRAND} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Selling Items */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
          <Card>
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold font-montserrat mb-3">Top Selling Items</h3>
              {topItems.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">No data yet</p>
              ) : (
                <div className="space-y-2.5">
                  {topItems.map((item, i) => (
                    <div key={item.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium truncate">{item.name}</span>
                        <span className="text-muted-foreground font-mono ml-2 shrink-0">{item.qty} sold</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.qty / topMax) * 100}%` }}
                          transition={{ delay: 0.5 + i * 0.08, duration: 0.6 }}
                          className="h-full rounded-full"
                          style={{ background: COLORS[i % COLORS.length] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment Methods */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.5 }}>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold font-montserrat">Payment Split</h3>
              </div>
              {paymentData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={140}>
                    <PieChart>
                      <Pie
                        data={paymentData}
                        cx="50%"
                        cy="50%"
                        outerRadius={55}
                        dataKey="value"
                        strokeWidth={2}
                        stroke="hsl(var(--card))"
                      >
                        {paymentData.map((d, i) => (
                          <Cell key={i} fill={d.color} />
                        ))}
                      </Pie>
                      <RTooltip
                        contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 11 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-2">
                    {paymentData.map((d) => (
                      <div key={d.name} className="flex items-center gap-1.5 text-[10px]">
                        <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                        <span className="text-muted-foreground">{d.name}</span>
                        <span className="font-bold">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-xs text-muted-foreground py-4 text-center">No data yet</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* SLA & Capacity Gauge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
          <Card className="bg-gradient-to-br from-brand/5 via-card to-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-4 w-4 text-brand" />
                <h3 className="text-sm font-semibold font-montserrat">SLA & Capacity</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* Completion Rate */}
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="h-20 w-20 -rotate-90">
                      <circle cx="40" cy="40" r="32" className="stroke-muted" fill="none" strokeWidth="6" />
                      <circle
                        cx="40" cy="40" r="32" fill="none" strokeWidth="6"
                        stroke={stats.completionRate >= 80 ? '#22c55e' : stats.completionRate >= 50 ? '#f59e0b' : '#ef4444'}
                        strokeDasharray={`${(stats.completionRate / 100) * 201} 201`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-sm font-bold font-montserrat">{stats.completionRate}%</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">Completion</p>
                </div>
                {/* Queue Fill */}
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center">
                    {(() => {
                      const qPct = capacitySettings.max_queue_length > 0
                        ? Math.round((capacitySettings.current_queue_length / capacitySettings.max_queue_length) * 100)
                        : 0;
                      return (
                        <>
                          <svg className="h-20 w-20 -rotate-90">
                            <circle cx="40" cy="40" r="32" className="stroke-muted" fill="none" strokeWidth="6" />
                            <circle
                              cx="40" cy="40" r="32" fill="none" strokeWidth="6"
                              stroke={qPct >= 80 ? '#ef4444' : qPct >= 50 ? '#f59e0b' : '#22c55e'}
                              strokeDasharray={`${(qPct / 100) * 201} 201`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="absolute text-sm font-bold font-montserrat">{qPct}%</span>
                        </>
                      );
                    })()}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">Queue Fill</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4 text-center">
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-[10px] text-muted-foreground">Accept SLA</p>
                  <p className="text-sm font-bold font-montserrat">{slaSettings.acceptance_sla_seconds}s</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-[10px] text-muted-foreground">Max Concurrent</p>
                  <p className="text-sm font-bold font-montserrat">{slaSettings.max_concurrent_orders}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-[10px] text-muted-foreground">Busy At</p>
                  <p className="text-sm font-bold font-montserrat">{slaSettings.busy_auto_throttle_at}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-[10px] text-muted-foreground">Queue</p>
                  <p className="text-sm font-bold font-montserrat">{capacitySettings.current_queue_length}/{capacitySettings.max_queue_length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Issues card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
          <Card className={cn(stats.issues > 0 && 'border-red-200 dark:border-red-900/50')}>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className={cn('h-4 w-4', stats.issues > 0 ? 'text-red-500' : 'text-muted-foreground')} />
                <h3 className="text-sm font-semibold font-montserrat">Issues</h3>
                {stats.issues > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                    {stats.issues}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {['rejected', 'failed', 'refund_requested', 'refunded'].map((s) => {
                  const count = orders.filter((o) => o.status === s).length;
                  return (
                    <div key={s} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full shrink-0" style={{ background: STATUS_COLORS[s] || '#6b7280' }} />
                        <span className="capitalize text-muted-foreground">{s.replace('_', ' ')}</span>
                      </div>
                      <span className="font-bold font-mono">{count}</span>
                    </div>
                  );
                })}
              </div>
              {stats.issues > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                  onClick={() => navigate('/merchant/orders')}
                >
                  View Issues
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.5 }}>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-4 w-4 text-amber-500" />
                <h3 className="text-sm font-semibold font-montserrat">Quick Actions</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="h-auto py-3 flex-col gap-1.5 text-[11px] hover:border-brand hover:text-brand transition-colors"
                  onClick={() => navigate('/merchant/orders')}
                >
                  <ClipboardList className="h-4 w-4" />
                  Orders
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-3 flex-col gap-1.5 text-[11px] hover:border-brand hover:text-brand transition-colors"
                  onClick={() => navigate('/merchant/menu')}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Menu
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-3 flex-col gap-1.5 text-[11px] hover:border-brand hover:text-brand transition-colors"
                  onClick={() => navigate('/merchant/capacity-sla')}
                >
                  <Timer className="h-4 w-4" />
                  SLA
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-3 flex-col gap-1.5 text-[11px] hover:border-brand hover:text-brand transition-colors"
                  onClick={() => navigate('/merchant/reports')}
                >
                  <TrendingUp className="h-4 w-4" />
                  Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Masonry>
    </div>
  );
}
