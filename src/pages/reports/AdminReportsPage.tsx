// ──────────────────────────────────────
// Admin Reports Page — Command Center
// Operational reporting and data export
// ──────────────────────────────────────

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
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
  FileBarChart,
  Download,
  Calendar,
  TrendingUp,
  ShoppingCart,
  Users,
  AlertTriangle,
  Target,
  Truck,
  Clock,
  FileText,
  BarChart3,
} from 'lucide-react';

interface ReportCard {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  category: string;
  lastGenerated: string;
  format: string[];
}

const reportCards: ReportCard[] = [
  { id: 'rpt-fleet', title: 'Fleet Performance Report', description: 'Device uptime, battery health, maintenance cycles, and fleet utilization metrics', icon: ShoppingCart, category: 'operations', lastGenerated: '2026-02-24T08:00:00Z', format: ['PDF', 'CSV'] },
  { id: 'rpt-sla', title: 'SLA Compliance Report', description: 'Order acceptance times, delivery SLA, merchant compliance scores, and breach analysis', icon: Target, category: 'sla', lastGenerated: '2026-02-24T08:00:00Z', format: ['PDF', 'CSV', 'Excel'] },
  { id: 'rpt-runner', title: 'Runner Performance Report', description: 'Runner acceptance rates, delivery times, completion rates, and performance rankings', icon: Truck, category: 'operations', lastGenerated: '2026-02-24T06:00:00Z', format: ['PDF', 'CSV'] },
  { id: 'rpt-incident', title: 'Incident Analysis Report', description: 'Incident frequency, MTTR, severity distribution, and resolution patterns', icon: AlertTriangle, category: 'incidents', lastGenerated: '2026-02-23T22:00:00Z', format: ['PDF', 'CSV'] },
  { id: 'rpt-merchant', title: 'Merchant Analytics Report', description: 'Order volumes, revenue, SLA adherence, refund rates per merchant', icon: Users, category: 'merchant', lastGenerated: '2026-02-24T08:00:00Z', format: ['PDF', 'Excel'] },
  { id: 'rpt-revenue', title: 'Revenue Summary Report', description: 'Daily/weekly/monthly revenue breakdown, commission, and payment analytics', icon: TrendingUp, category: 'financial', lastGenerated: '2026-02-24T00:00:00Z', format: ['PDF', 'Excel'] },
  { id: 'rpt-audit', title: 'Audit Trail Report', description: 'Complete audit log export with actor actions, overrides, and system events', icon: FileText, category: 'compliance', lastGenerated: '2026-02-24T08:00:00Z', format: ['PDF', 'CSV'] },
  { id: 'rpt-gate', title: 'Gate Utilization Report', description: 'Gate surge patterns, passenger flow, trolley deployment, and order density', icon: BarChart3, category: 'operations', lastGenerated: '2026-02-23T20:00:00Z', format: ['PDF', 'CSV'] },
];

const categories = ['all', 'operations', 'sla', 'incidents', 'merchant', 'financial', 'compliance'];

export default function AdminReportsPage() {
  const [category, setCategory] = useState('all');
  const [period, setPeriod] = useState('week');

  const filtered = category === 'all' ? reportCards : reportCards.filter((r) => r.category === category);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileBarChart className="h-6 w-6 text-primary" />
            Reports
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Generate and download operational reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <Calendar className="h-4 w-4 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={category === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategory(cat)}
            className="capitalize"
          >
            {cat === 'all' ? 'All Reports' : cat}
          </Button>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Available Reports</p>
                <p className="text-2xl font-bold">{reportCards.length}</p>
              </div>
              <FileBarChart className="h-8 w-8 text-primary/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Generated Today</p>
                <p className="text-2xl font-bold text-emerald-500">6</p>
              </div>
              <Clock className="h-8 w-8 text-emerald-500/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Scheduled Reports</p>
                <p className="text-2xl font-bold text-blue-500">3</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Exports This Week</p>
                <p className="text-2xl font-bold text-violet-500">24</p>
              </div>
              <Download className="h-8 w-8 text-violet-500/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{report.title}</CardTitle>
                      <Badge variant="outline" className="mt-1 capitalize text-[10px]">
                        {report.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{report.description}</CardDescription>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Last: {new Date(report.lastGenerated).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-2">
                    {report.format.map((fmt) => (
                      <Button key={fmt} variant="outline" size="sm" className="h-7 text-xs">
                        <Download className="h-3 w-3 mr-1" />
                        {fmt}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
