import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  ShoppingCart,
  Activity,
  AlertTriangle,
  WifiOff,
  Wifi,
  Signal,
} from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

import { PageHeader } from '@/components/common/PageHeader';
import { SearchFilter } from '@/components/common/SearchFilter';
import { DataTable } from '@/components/common/DataTable';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TrolleyStatusBadge } from '@/components/trolleys/TrolleyStatusBadge';
import { BatteryIndicator } from '@/components/trolleys/BatteryIndicator';
import { TrolleyHealthScore } from '@/components/trolleys/TrolleyHealthScore';
import { TrolleyCard } from '@/components/trolleys/TrolleyCard';
import { useTrolleysStore } from '@/store/trolleys.store';
import { cn } from '@/lib/utils';
import type { Trolley, TrolleyStatus } from '@/types/trolley.types';

import AddTrolleyModal from './AddTrolleyModal';

const OUTDATED_FW = '3.2.0';
const LOW_CONF = 50;

function zoneToTerminal(zone: string): string {
  if (zone.startsWith('Zone A') || zone.startsWith('Zone B')) return 'Terminal 1';
  if (zone.startsWith('Zone C') || zone.startsWith('Zone D')) return 'Terminal 2';
  return 'Terminal 3';
}

function cmpVer(a: string, b: string): number {
  const pa = a.replace(/-.*$/, '').split('.').map(Number);
  const pb = b.replace(/-.*$/, '').split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const na = pa[i] ?? 0;
    const nb = pb[i] ?? 0;
    if (na !== nb) return na - nb;
  }
  return 0;
}

interface TrolleyListPageProps {
  embedded?: boolean;
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', color)}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold font-montserrat text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground font-lexend">{label}</p>
      </div>
    </Card>
  );
}

export default function TrolleyListPage({ embedded = false }: TrolleyListPageProps) {
  const navigate = useNavigate();
  const {
    filters,
    setFilters,
    viewMode,
    setViewMode,
    getFilteredTrolleys,
    getStats,
    deleteTrolley,
  } = useTrolleysStore();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Trolley | null>(null);

  const filteredTrolleys = getFilteredTrolleys();
  const stats = getStats();

  const zones = useMemo(() => {
    const store = useTrolleysStore.getState();
    const allZones = [...new Set(store.trolleys.map((t) => t.location.zone))].sort();
    return allZones;
  }, []);

  const columns: ColumnDef<Trolley, unknown>[] = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Device ID',
        cell: ({ row }) => (
          <span className="font-mono text-sm font-medium">{row.original.id}</span>
        ),
      },
      {
        accessorKey: 'imei',
        header: 'IMEI',
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">{row.original.imei}</span>
        ),
      },
      {
        id: 'terminal',
        header: 'Terminal',
        cell: ({ row }) => (
          <span className="text-sm">{zoneToTerminal(row.original.location.zone)}</span>
        ),
      },
      {
        id: 'online',
        header: 'Online',
        cell: ({ row }) => (
          row.original.status !== 'offline'
            ? <Wifi className="h-4 w-4 text-emerald-500" />
            : <WifiOff className="h-4 w-4 text-red-500" />
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <TrolleyStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: 'battery',
        header: 'Battery',
        cell: ({ row }) => (
          <BatteryIndicator
            level={row.original.battery}
            charging={row.original.status === 'charging'}
            size="sm"
          />
        ),
      },
      {
        accessorKey: 'health_score',
        header: 'Health',
        cell: ({ row }) => (
          <TrolleyHealthScore score={row.original.health_score} size="sm" showLabel={false} />
        ),
      },
      {
        id: 'zone',
        header: 'Zone / Gate',
        cell: ({ row }) => (
          <span className="text-sm">
            {row.original.location.zone}
            {row.original.location.gate && (
              <span className="text-muted-foreground"> — {row.original.location.gate}</span>
            )}
          </span>
        ),
      },
      {
        id: 'firmware',
        header: 'Firmware',
        cell: ({ row }) => (
          <span className={cn('font-mono text-sm', cmpVer(row.original.firmware_version, OUTDATED_FW) < 0 && 'text-amber-500')}>
            v{row.original.firmware_version}
          </span>
        ),
      },
      {
        id: 'confidence',
        header: 'Confidence',
        cell: ({ row }) => {
          const conf = row.original.location_confidence ?? 100;
          return (
            <div className="flex items-center gap-1">
              <Signal className={cn('h-3 w-3', conf < LOW_CONF ? 'text-red-500' : 'text-emerald-500')} />
              <span className={cn('font-mono text-sm', conf < LOW_CONF && 'text-red-500')}>{conf}%</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'last_seen',
        header: 'Last Seen',
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground" title={row.original.last_seen}>
            {formatDistanceToNow(new Date(row.original.last_seen), { addSuffix: true })}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {!embedded && (
        <PageHeader
          title="Fleet Management"
          subtitle="Monitor and manage the device fleet"
          actions={
            <Button onClick={() => setAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Trolley
            </Button>
          }
        />
      )}
      {embedded && (
        <div className="flex justify-end">
          <Button onClick={() => setAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Trolley
          </Button>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Fleet" value={stats.total} icon={ShoppingCart} color="bg-brand" />
        <StatCard label="Active" value={stats.active} icon={Activity} color="bg-emerald-600" />
        <StatCard label="Need Attention" value={stats.needAttention} icon={AlertTriangle} color="bg-amber-500" />
        <StatCard label="Offline" value={stats.offline} icon={WifiOff} color="bg-red-500" />
      </div>

      {/* Filters */}
      <SearchFilter
        searchValue={filters.search}
        onSearchChange={(search) => setFilters({ search })}
        searchPlaceholder="Search by IMEI, Serial, or Zone..."
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showViewToggle
      >
        <select
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value as TrolleyStatus | 'all' })}
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="idle">Idle</option>
          <option value="charging">Charging</option>
          <option value="maintenance">Maintenance</option>
          <option value="offline">Offline</option>
        </select>
        <select
          value={filters.zone}
          onChange={(e) => setFilters({ zone: e.target.value })}
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          <option value="all">All Zones</option>
          {zones.map((z) => (
            <option key={z} value={z}>{z}</option>
          ))}
        </select>
      </SearchFilter>

      {/* Content */}
      {viewMode === 'table' ? (
        <DataTable
          columns={columns}
          data={filteredTrolleys}
          searchable={false}
          pageSize={25}
          onRowClick={(row) => navigate(`/dashboard/trolleys/${row.id}`)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTrolleys.slice(0, 25).map((trolley) => (
            <TrolleyCard key={trolley.id} trolley={trolley} />
          ))}
        </div>
      )}

      {/* Modals */}
      <AddTrolleyModal open={addModalOpen} onOpenChange={setAddModalOpen} />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Delete Trolley"
        description={`Are you sure you want to delete trolley ${deleteTarget?.id}? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={() => {
          if (deleteTarget) {
            deleteTrolley(deleteTarget.id);
            toast.success(`Trolley ${deleteTarget.id} deleted`);
          }
        }}
      />
    </motion.div>
  );
}
