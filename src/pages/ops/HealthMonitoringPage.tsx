// ──────────────────────────────────────
// Health Monitoring Page — Phase 8
// Fleet health dashboard with charts & alerts
// ──────────────────────────────────────

import { useState } from 'react';
import { useTrolleysStore } from '@/store/trolleys.store';
import { useFleetLive } from '@/hooks/useFleetLive';
import { FleetHealthBar, SLAGauge } from '@/components/ops';
import type { Trolley } from '@/types/trolley.types';
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
  Activity, 
  Battery, 
  BatteryWarning, 
  Wifi, 
  WifiOff,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock data for charts
const uptimeData = [
  { time: '00:00', uptime: 98.5 },
  { time: '04:00', uptime: 99.1 },
  { time: '08:00', uptime: 97.8 },
  { time: '12:00', uptime: 96.2 },
  { time: '16:00', uptime: 98.9 },
  { time: '20:00', uptime: 99.4 },
  { time: '24:00', uptime: 99.2 },
];

const batteryDistribution = [
  { range: '0-20%', count: 3, color: '#ef4444' },
  { range: '20-40%', count: 8, color: '#f97316' },
  { range: '40-60%', count: 15, color: '#eab308' },
  { range: '60-80%', count: 25, color: '#84cc16' },
  { range: '80-100%', count: 49, color: '#22c55e' },
];

const offlineTimeline = [
  { date: 'Mon', offline: 2, restored: 2 },
  { date: 'Tue', offline: 1, restored: 1 },
  { date: 'Wed', offline: 4, restored: 3 },
  { date: 'Thu', offline: 2, restored: 2 },
  { date: 'Fri', offline: 1, restored: 1 },
  { date: 'Sat', offline: 0, restored: 0 },
  { date: 'Sun', offline: 1, restored: 1 },
];

export default function HealthMonitoringPage({ embedded = false }: { embedded?: boolean }) {
  const { trolleys } = useTrolleysStore();
  useFleetLive(); // Enable live simulation
  const [timeRange, setTimeRange] = useState('24h');

  // Calculate metrics
  const totalDevices = trolleys.length;
  const onlineDevices = trolleys.filter((t: Trolley) => t.status === 'active' || t.status === 'idle').length;
  const uptimePercent = totalDevices > 0 ? ((onlineDevices / totalDevices) * 100) : 0;
  const avgBattery = totalDevices > 0 
    ? trolleys.reduce((sum: number, t: Trolley) => sum + t.battery, 0) / totalDevices 
    : 0;
  const criticalBattery = trolleys.filter((t: Trolley) => t.battery < 20).length;
  const offlineDevices = trolleys.filter((t: Trolley) => t.status === 'offline').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      {!embedded && (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            Health Monitoring
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Fleet health dashboard and performance metrics
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      )}
      {embedded && (
        <div className="flex justify-end">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Fleet Health Bar */}
      <FleetHealthBar />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Wifi className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{uptimePercent.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Fleet Uptime</p>
              </div>
              <TrendingUp className="h-4 w-4 text-emerald-500 ml-auto" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Battery className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgBattery.toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground">Avg Battery</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <BatteryWarning className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{criticalBattery}</p>
                <p className="text-xs text-muted-foreground">Critical Battery</p>
              </div>
              {criticalBattery > 0 && (
                <AlertTriangle className="h-4 w-4 text-amber-500 ml-auto" />
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <WifiOff className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{offlineDevices}</p>
                <p className="text-xs text-muted-foreground">Offline</p>
              </div>
              {offlineDevices > 0 && (
                <TrendingDown className="h-4 w-4 text-red-500 ml-auto" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Uptime Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Fleet Uptime</CardTitle>
            <CardDescription>Percentage of devices online over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={uptimeData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis domain={[95, 100]} className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))' 
                    }} 
                  />
                  <Area
                    type="monotone"
                    dataKey="uptime"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Battery Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Battery Distribution</CardTitle>
            <CardDescription>Device count by battery level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center">
              <div className="w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={batteryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="count"
                    >
                      {batteryDistribution.map((entry) => (
                        <Cell key={entry.range} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-2">
                {batteryDistribution.map((item) => (
                  <div key={item.range} className="flex items-center gap-2">
                    <div 
                      className="h-3 w-3 rounded" 
                      style={{ backgroundColor: item.color }} 
                    />
                    <span className="text-xs flex-1">{item.range}</span>
                    <span className="text-xs font-mono">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Offline Events */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Offline Events</CardTitle>
            <CardDescription>Devices going offline vs restored this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={offlineTimeline}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))' 
                    }} 
                  />
                  <Bar dataKey="offline" fill="#ef4444" name="Went Offline" />
                  <Bar dataKey="restored" fill="#22c55e" name="Restored" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Health Gauges */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">System Health</CardTitle>
            <CardDescription>Key health indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <SLAGauge 
                value={uptimePercent} 
                label="Uptime" 
                size="sm"
                threshold={95}
              />
              <SLAGauge 
                value={avgBattery} 
                label="Avg Battery" 
                size="sm"
                threshold={50}
              />
              <SLAGauge 
                value={98.5} 
                label="Network" 
                size="sm"
                threshold={95}
              />
              <SLAGauge 
                value={92.3} 
                label="Response" 
                size="sm"
                threshold={90}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
