import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import {
  ArrowLeft,
  Battery,
  Heart,
  Route,
  TrendingUp,
  Wrench,
  Zap,
  RotateCcw,
  Download,
  Flag,
  Clock,
} from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SectionCard } from '@/components/common/SectionCard';
import { DataTable } from '@/components/common/DataTable';
import { TrolleyStatusBadge } from '@/components/trolleys/TrolleyStatusBadge';
import { TrolleyHistoryChart } from '@/components/trolleys/TrolleyHistoryChart';
import { useTrolleysStore } from '@/store/trolleys.store';
import { cn } from '@/lib/utils';
import type { MaintenanceRecord } from '@/types/trolley.types';

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground font-lexend">{label}</span>
      <span className="text-sm font-medium text-foreground text-right">{value}</span>
    </div>
  );
}

function MiniStatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) {
  return (
    <Card className="p-3 text-center">
      <Icon className={cn('h-5 w-5 mx-auto mb-1', color)} />
      <p className="text-lg font-bold font-montserrat text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground font-lexend uppercase tracking-wider">{label}</p>
    </Card>
  );
}

export default function TrolleyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const trolleys = useTrolleysStore((s) => s.trolleys);
  const updateTrolley = useTrolleysStore((s) => s.updateTrolley);

  const trolley = trolleys.find((t) => t.id === id);

  const maintenanceColumns: ColumnDef<MaintenanceRecord, unknown>[] = useMemo(
    () => [
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => (
          <span className="text-sm">{format(new Date(row.original.date), 'MMM dd, yyyy')}</span>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
          const typeColors: Record<string, string> = {
            scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            repair: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
            battery_replace: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
            firmware_update: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
          };
          return (
            <span className={cn('inline-flex px-2 py-0.5 rounded-full text-xs font-medium', typeColors[row.original.type])}>
              {row.original.type.replace('_', ' ')}
            </span>
          );
        },
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => <span className="text-sm">{row.original.description}</span>,
      },
      {
        accessorKey: 'technician',
        header: 'Technician',
        cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.technician}</span>,
      },
      {
        accessorKey: 'cost',
        header: 'Cost',
        cell: ({ row }) => <span className="text-sm font-medium">${row.original.cost}</span>,
      },
    ],
    []
  );

  if (!trolley) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg text-muted-foreground">Trolley not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/dashboard/trolleys')}>
          Back to Trolleys
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Back button & breadcrumb */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/trolleys')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <nav className="flex items-center gap-1 text-sm text-muted-foreground font-lexend">
          <button onClick={() => navigate('/dashboard/trolleys')} className="hover:text-foreground">
            Trolleys
          </button>
          <span>/</span>
          <span className="text-foreground font-medium">{trolley.id}</span>
        </nav>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column - 60% */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header Card */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xl font-mono font-bold text-foreground tracking-wider">
                  {trolley.imei}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <TrolleyStatusBadge status={trolley.status} />
                  <span className="text-sm text-muted-foreground">
                    {trolley.manufacturer} — {trolley.model}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {trolley.id} | SN: {trolley.serial_number}
                </p>
              </div>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </Card>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MiniStatCard icon={Battery} label="Battery" value={`${trolley.battery}%`} color="text-emerald-500" />
            <MiniStatCard icon={Heart} label="Health" value={trolley.health_score} color="text-blue-500" />
            <MiniStatCard icon={Route} label="Total Trips" value={trolley.total_trips.toLocaleString()} color="text-purple-500" />
            <MiniStatCard icon={TrendingUp} label="Today Trips" value={trolley.today_trips} color="text-brand" />
          </div>

          {/* Battery History Chart */}
          <SectionCard title="Battery History" subtitle="Last 48 hours">
            <TrolleyHistoryChart trolleyId={trolley.id} />
          </SectionCard>

          {/* Maintenance History */}
          <SectionCard title="Maintenance History">
            <DataTable
              columns={maintenanceColumns}
              data={trolley.maintenance_history}
              searchable={false}
              pageSize={5}
            />
          </SectionCard>
        </div>

        {/* Right Column - 40% */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info Card */}
          <SectionCard title="Device Information">
            <div className="space-y-0">
              <InfoRow label="Firmware Version" value={trolley.firmware_version} />
              <InfoRow label="Tab Model" value={trolley.tab_model} />
              <InfoRow label="Tab Serial" value={<span className="font-mono text-xs">{trolley.tab_serial}</span>} />
              <InfoRow label="Assigned Gate" value={trolley.assigned_gate} />
              <InfoRow
                label="Registered"
                value={format(new Date(trolley.registered_at), 'MMM dd, yyyy')}
              />
              <InfoRow
                label="Last Maintenance"
                value={format(new Date(trolley.last_maintenance), 'MMM dd, yyyy')}
              />
              <InfoRow
                label="Location"
                value={
                  <span>
                    {trolley.location.zone}
                    {trolley.location.gate && ` — Gate ${trolley.location.gate}`}
                  </span>
                }
              />
            </div>
            {trolley.notes && (
              <div className="mt-4 pt-3 border-t border-border">
                <label className="text-xs text-muted-foreground font-lexend uppercase tracking-wider">Notes</label>
                <p className="text-sm text-foreground mt-1">{trolley.notes}</p>
              </div>
            )}
          </SectionCard>

          {/* Quick Actions */}
          <SectionCard title="Quick Actions">
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  updateTrolley(trolley.id, { status: 'maintenance' });
                  toast.success('Marked for maintenance');
                }}
              >
                <Wrench className="h-4 w-4 mr-2" />
                Mark for Maintenance
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  updateTrolley(trolley.id, { status: 'charging' });
                  toast.success('Sent to charging');
                }}
              >
                <Zap className="h-4 w-4 mr-2" />
                Send to Charging
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => toast.success('Tab reset initiated')}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Tab
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled title="Coming soon">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-amber-600 hover:text-amber-700"
                onClick={() => toast.info('Issue flagged')}
              >
                <Flag className="h-4 w-4 mr-2" />
                Flag Issue
              </Button>
            </div>
          </SectionCard>

          {/* Status Timeline */}
          <SectionCard title="Recent Status Changes">
            <div className="space-y-4">
              {[
                { status: trolley.status, time: trolley.last_seen },
                { status: 'active' as const, time: new Date(Date.now() - 2 * 3600000).toISOString() },
                { status: 'charging' as const, time: new Date(Date.now() - 5 * 3600000).toISOString() },
                { status: 'idle' as const, time: new Date(Date.now() - 8 * 3600000).toISOString() },
                { status: 'active' as const, time: new Date(Date.now() - 12 * 3600000).toISOString() },
              ].map((entry, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      'h-2.5 w-2.5 rounded-full',
                      i === 0 ? 'bg-brand' : 'bg-muted-foreground/30'
                    )} />
                    {i < 4 && <div className="w-px h-6 bg-border" />}
                  </div>
                  <div className="flex-1 -mt-0.5">
                    <TrolleyStatusBadge status={entry.status} />
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(entry.time), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </motion.div>
  );
}
