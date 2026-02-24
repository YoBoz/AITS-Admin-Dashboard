// ──────────────────────────────────────
// Runners Page — Command Center
// Runner management and performance tracking
// ──────────────────────────────────────

import { useState } from 'react';
import { useRunnersStore } from '@/store/runners.store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  UserCheck,
  Search,
  RefreshCw,
  Clock,
  MapPin,
  Activity,
  TrendingUp,
  Users,
  Truck,
  Coffee,
  WifiOff,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { runnerPerformanceData } from '@/data/mock/runners.mock';
import type { RunnerStatus } from '@/types/runner.types';

const statusConfig: Record<RunnerStatus, { label: string; color: string; icon: React.ElementType }> = {
  available: { label: 'Available', color: 'bg-emerald-500/20 text-emerald-500', icon: UserCheck },
  assigned: { label: 'Assigned', color: 'bg-blue-500/20 text-blue-500', icon: Truck },
  in_transit: { label: 'In Transit', color: 'bg-cyan-500/20 text-cyan-500', icon: Activity },
  returning: { label: 'Returning', color: 'bg-violet-500/20 text-violet-500', icon: MapPin },
  on_break: { label: 'On Break', color: 'bg-amber-500/20 text-amber-500', icon: Coffee },
  offline: { label: 'Offline', color: 'bg-red-500/20 text-red-500', icon: WifiOff },
};

export default function RunnersPage() {
  const { runners } = useRunnersStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<RunnerStatus | 'all'>('all');
  const [view, setView] = useState<'list' | 'performance'>('list');

  const filtered = runners.filter((r) => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.name.toLowerCase().includes(q) && !r.employee_id.toLowerCase().includes(q)) return false;
    }
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    return true;
  });

  const availableCount = runners.filter((r) => r.status === 'available').length;
  const assignedCount = runners.filter((r) => ['assigned', 'in_transit'].includes(r.status)).length;
  const onBreakCount = runners.filter((r) => r.status === 'on_break').length;
  const offlineCount = runners.filter((r) => r.status === 'offline').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-primary" />
            Runners
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Runner management, assignment tracking, and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </Badge>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Available</p>
                <p className="text-2xl font-bold text-emerald-500">{availableCount}</p>
              </div>
              <UserCheck className="h-8 w-8 text-emerald-500/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Assigned / In Transit</p>
                <p className="text-2xl font-bold text-blue-500">{assignedCount}</p>
              </div>
              <Truck className="h-8 w-8 text-blue-500/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">On Break</p>
                <p className="text-2xl font-bold text-amber-500">{onBreakCount}</p>
              </div>
              <Coffee className="h-8 w-8 text-amber-500/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Offline</p>
                <p className="text-2xl font-bold text-red-500">{offlineCount}</p>
              </div>
              <WifiOff className="h-8 w-8 text-red-500/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle + Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          <Button
            variant={view === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('list')}
          >
            <Users className="h-4 w-4 mr-1" />
            Runner List
          </Button>
          <Button
            variant={view === 'performance' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('performance')}
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            Performance
          </Button>
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search runners by name or ID..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as RunnerStatus | 'all')}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="in_transit">In Transit</SelectItem>
            <SelectItem value="returning">Returning</SelectItem>
            <SelectItem value="on_break">On Break</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Runner List View */}
      {view === 'list' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Active Runners</CardTitle>
            <CardDescription>{filtered.length} runners</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Runner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Zone / Gate</TableHead>
                    <TableHead>Current Order</TableHead>
                    <TableHead>Deliveries Today</TableHead>
                    <TableHead>Avg Time</TableHead>
                    <TableHead>Last Seen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((runner) => {
                    const config = statusConfig[runner.status];
                    const StatusIcon = config.icon;
                    return (
                      <TableRow key={runner.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{runner.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">{runner.employee_id}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn('gap-1', config.color)}>
                            <StatusIcon className="h-3 w-3" />
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span>{runner.current_zone}</span>
                            {runner.current_gate && (
                              <span className="text-muted-foreground">• {runner.current_gate}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {runner.current_order_id ? (
                            <span className="font-mono text-sm text-primary">{runner.current_order_id}</span>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell className="font-mono">{runner.total_deliveries_today}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            {runner.avg_delivery_time_minutes > 0 ? `${runner.avg_delivery_time_minutes}m` : '—'}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {formatDistanceToNow(new Date(runner.last_seen), { addSuffix: true })}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <UserCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-1">No runners found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Performance View */}
      {view === 'performance' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Runner Performance Metrics</CardTitle>
            <CardDescription>Historical performance breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Runner</TableHead>
                    <TableHead>Total Deliveries</TableHead>
                    <TableHead>Avg Acceptance</TableHead>
                    <TableHead>Avg Delivery</TableHead>
                    <TableHead>Completion Rate</TableHead>
                    <TableHead>SLA Breaches</TableHead>
                    <TableHead>Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {runnerPerformanceData.map((perf) => (
                    <TableRow key={perf.runner_id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{perf.runner_name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{perf.runner_id}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{perf.total_deliveries}</TableCell>
                      <TableCell>
                        <span className={cn('font-mono', perf.avg_acceptance_seconds > 30 ? 'text-red-500' : 'text-emerald-500')}>
                          {perf.avg_acceptance_seconds}s
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={cn('font-mono', perf.avg_delivery_minutes > 10 ? 'text-amber-500' : 'text-emerald-500')}>
                          {perf.avg_delivery_minutes}m
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={cn('font-mono', perf.completion_rate_pct < 95 ? 'text-red-500' : 'text-emerald-500')}>
                          {perf.completion_rate_pct}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={perf.sla_breach_count > 5 ? 'destructive' : 'outline'}>
                          {perf.sla_breach_count}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-amber-500">★</span>
                          <span className="font-mono">{perf.rating.toFixed(1)}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
