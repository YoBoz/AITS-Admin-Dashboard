// ──────────────────────────────────────
// SLA Dashboard Page — Phase 8
// SLA metrics and performance tracking
// ──────────────────────────────────────

import { useState } from 'react';
import { SLAGauge } from '@/components/ops';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { 
  Target, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Calendar,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { cn } from '@/lib/utils';
import { todaySLAMetrics, weekSLAMetrics, monthSLAMetrics } from '@/data/mock/sla-metrics.mock';
import type { SLAMetrics, MerchantSLABreakdown } from '@/types/ops-metrics.types';

const slaData: Record<Period, SLAMetrics> = {
  today: todaySLAMetrics,
  week: weekSLAMetrics,
  month: monthSLAMetrics,
};

type Period = 'today' | 'week' | 'month';

export default function SLADashboardPage() {
  const [period, setPeriod] = useState<Period>('today');
  
  const metrics = slaData[period];
  const merchantBreakdown = metrics.order_acceptance.by_merchant;

  // Calculate trends (mock)
  const acceptanceTrend = period === 'today' ? 2.1 : period === 'week' ? 1.5 : 0.8;
  const prepTimeTrend = period === 'today' ? -1.2 : period === 'week' ? -0.5 : 0.3;
  const deliveryTrend = period === 'today' ? 1.8 : period === 'week' ? 2.1 : 1.2;

  // Acceptance time distribution data
  const acceptanceDistribution = [
    { range: '<1min', count: 45, color: '#22c55e' },
    { range: '1-3min', count: 30, color: '#84cc16' },
    { range: '3-5min', count: 15, color: '#eab308' },
    { range: '5-10min', count: 8, color: '#f97316' },
    { range: '>10min', count: 2, color: '#ef4444' },
  ];

  // SLA trend over time
  const slaTrend = [
    { date: 'Mon', acceptance: 95, prep: 92, delivery: 88 },
    { date: 'Tue', acceptance: 96, prep: 93, delivery: 90 },
    { date: 'Wed', acceptance: 94, prep: 91, delivery: 87 },
    { date: 'Thu', acceptance: 97, prep: 94, delivery: 91 },
    { date: 'Fri', acceptance: 95, prep: 92, delivery: 89 },
    { date: 'Sat', acceptance: 93, prep: 90, delivery: 86 },
    { date: 'Sun', acceptance: 96, prep: 93, delivery: 90 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            SLA Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Service Level Agreement performance metrics
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={(v: string) => setPeriod(v as Period)}>
            <SelectTrigger className="w-32">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Main SLA Gauges */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Overall SLA Performance</CardTitle>
          <CardDescription>
            Key performance indicators against targets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <SLAGauge
              value={100 - metrics.order_acceptance.sla_breached_pct}
              label="Acceptance Rate"
              subtitle="Target: 95%"
              trend={acceptanceTrend}
              threshold={95}
              size="lg"
            />
            <SLAGauge
              value={Math.max(0, 100 - (metrics.order_acceptance.median_seconds / 90) * 100)}
              label="Acceptance Time"
              subtitle={`Avg: ${metrics.order_acceptance.median_seconds}s`}
              trend={prepTimeTrend}
              threshold={85}
              size="lg"
            />
            <SLAGauge
              value={metrics.delivery.on_time_pct}
              label="On-Time Delivery"
              subtitle="Target: 90%"
              trend={deliveryTrend}
              threshold={90}
              size="lg"
            />
            <SLAGauge
              value={metrics.device_uptime.overall_pct}
              label="Device Uptime"
              subtitle="Target: 99%"
              threshold={99}
              size="lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SLA Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">SLA Trend</CardTitle>
            <CardDescription>Performance over the week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={slaTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis domain={[80, 100]} className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))' 
                    }} 
                  />
                  <Area
                    type="monotone"
                    dataKey="acceptance"
                    stackId="1"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.3}
                    name="Acceptance"
                  />
                  <Area
                    type="monotone"
                    dataKey="prep"
                    stackId="2"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                    name="Prep Time"
                  />
                  <Area
                    type="monotone"
                    dataKey="delivery"
                    stackId="3"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.3}
                    name="Delivery"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Acceptance Time Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Acceptance Time Distribution</CardTitle>
            <CardDescription>How quickly orders are accepted</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={acceptanceDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="range" type="category" className="text-xs" width={60} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))' 
                    }} 
                  />
                  <Bar 
                    dataKey="count" 
                    fill="hsl(var(--primary))"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Merchant Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Merchant SLA Breakdown</CardTitle>
          <CardDescription>Performance by merchant</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Merchant</TableHead>
                  <TableHead className="text-center">P95 Accept</TableHead>
                  <TableHead className="text-center">Median</TableHead>
                  <TableHead className="text-center">On-Time %</TableHead>
                  <TableHead className="text-center">Breach %</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {merchantBreakdown.map((merchant: MerchantSLABreakdown) => (
                  <TableRow key={merchant.merchant_id}>
                    <TableCell className="font-medium">{merchant.merchant_name}</TableCell>
                    <TableCell className="text-center">
                      <span className={cn(
                        'font-mono',
                        merchant.p95_acceptance <= 60 ? 'text-emerald-500' :
                        merchant.p95_acceptance <= 90 ? 'text-amber-500' : 'text-red-500'
                      )}>
                        {merchant.p95_acceptance}s
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={cn(
                        'font-mono',
                        merchant.median <= 40 ? 'text-emerald-500' :
                        merchant.median <= 50 ? 'text-amber-500' : 'text-red-500'
                      )}>
                        {merchant.median}s
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={cn(
                        'font-mono',
                        merchant.on_time_delivery_pct >= 90 ? 'text-emerald-500' :
                        merchant.on_time_delivery_pct >= 85 ? 'text-amber-500' : 'text-red-500'
                      )}>
                        {merchant.on_time_delivery_pct}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={merchant.breach_pct <= 3 ? 'secondary' : 'destructive'}>
                        {merchant.breach_pct}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {merchant.breach_pct <= 3 ? (
                        <Badge className="bg-emerald-500/20 text-emerald-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Good
                        </Badge>
                      ) : merchant.breach_pct <= 6 ? (
                        <Badge className="bg-amber-500/20 text-amber-500">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Warning
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500/20 text-red-500">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          At Risk
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{merchantBreakdown.reduce((sum, m) => sum + m.total_orders, 0)}</p>
                <p className="text-xs text-muted-foreground">Total Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.delivery.median_minutes}min</p>
                <p className="text-xs text-muted-foreground">Avg Delivery</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.order_acceptance.sla_breached_count + metrics.delivery.sla_breached_count}</p>
                <p className="text-xs text-muted-foreground">SLA Breaches</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                'p-2 rounded-lg',
                metrics.order_acceptance.sla_breached_pct <= 5 ? 'bg-emerald-500/20' : 'bg-amber-500/20'
              )}>
                <Target className={cn(
                  'h-5 w-5',
                  metrics.order_acceptance.sla_breached_pct <= 5 ? 'text-emerald-500' : 'text-amber-500'
                )} />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {(100 - metrics.order_acceptance.sla_breached_pct).toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">SLA Compliance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
