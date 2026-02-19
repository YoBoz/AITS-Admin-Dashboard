import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Store,
  Clock,
  AlertTriangle,
  DollarSign,
} from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { PageHeader } from '@/components/common/PageHeader';
import { SearchFilter } from '@/components/common/SearchFilter';
import { DataTable } from '@/components/common/DataTable';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ContractStatusBadge } from '@/components/shops/ContractStatusBadge';
import { ShopCategoryBadge } from '@/components/shops/ShopCategoryBadge';
import { useShopsStore } from '@/store/shops.store';
import { cn } from '@/lib/utils';
import type { Shop, ShopCategory } from '@/types/shop.types';

import AddShopModal from './AddShopModal';

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: React.ElementType; color: string }) {
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

export default function ShopListPage({ embedded }: { embedded?: boolean }) {
  const navigate = useNavigate();
  const { filters, setFilters, getFilteredShops, getStats, deleteShop } = useShopsStore();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Shop | null>(null);

  const filteredShops = getFilteredShops();
  const stats = getStats();

  const categories: ShopCategory[] = [
    'retail', 'restaurant', 'cafe', 'lounge', 'pharmacy',
    'electronics', 'fashion', 'services', 'bank', 'other',
  ];

  const columns: ColumnDef<Shop, unknown>[] = useMemo(
    () => [
      {
        id: 'logo',
        header: '',
        enableSorting: false,
        cell: ({ row }) =>
          row.original.logo_url ? (
            <img src={row.original.logo_url} alt="" className="h-8 w-8 rounded-md object-cover" />
          ) : (
            <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
              {row.original.name.charAt(0)}
            </div>
          ),
      },
      {
        accessorKey: 'name',
        header: 'Shop Name',
        cell: ({ row }) => (
          <div>
            <p className="text-sm font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.company_name}</p>
          </div>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => <ShopCategoryBadge category={row.original.category} />,
      },
      {
        id: 'location',
        header: 'Unit / Zone',
        cell: ({ row }) => (
          <span className="text-sm">
            {row.original.location.unit_number} — {row.original.location.zone}
          </span>
        ),
      },
      {
        id: 'contract_status',
        header: 'Contract',
        cell: ({ row }) => <ContractStatusBadge status={row.original.contract.status} />,
      },
      {
        id: 'monthly_fee',
        header: 'Monthly Fee',
        cell: ({ row }) => (
          <span className="text-sm font-medium">
            ${row.original.contract.monthly_fee.toLocaleString()}
          </span>
        ),
      },
      {
        id: 'contract_expiry',
        header: 'Contract Expiry',
        cell: ({ row }) => (
          <span className={cn(
            'text-sm',
            row.original.contract.status === 'expiring_soon' && 'text-amber-600 font-medium',
            row.original.contract.status === 'expired' && 'text-red-500 font-medium'
          )}>
            {format(new Date(row.original.contract.end_date), 'MMM dd, yyyy')}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const s = row.original.status;
          return (
            <span className={cn(
              'inline-flex px-2 py-0.5 rounded-full text-xs font-medium',
              s === 'active' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
              s === 'pending' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
              s === 'inactive' && 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
              s === 'suspended' && 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
            )}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
          );
        },
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
          title="Shop & Company Management"
          subtitle="Manage shops, contracts, and company relationships"
          actions={
            <Button onClick={() => setAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Shop
            </Button>
          }
        />
      )}

      {embedded && (
        <div className="flex justify-end">
          <Button onClick={() => setAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Shop
          </Button>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Shops" value={stats.active} icon={Store} color="bg-brand" />
        <StatCard label="Expiring Contracts" value={stats.expiringContracts} icon={Clock} color="bg-amber-500" />
        <StatCard label="Pending Approval" value={stats.pending} icon={AlertTriangle} color="bg-blue-500" />
        <StatCard
          label="Monthly Revenue"
          value={`$${(stats.totalMonthlyRevenue / 1000).toFixed(0)}K`}
          icon={DollarSign}
          color="bg-emerald-600"
        />
      </div>

      {/* Filters */}
      <SearchFilter
        searchValue={filters.search}
        onSearchChange={(search) => setFilters({ search })}
        searchPlaceholder="Search by shop or company name..."
      >
        <select
          value={filters.category}
          onChange={(e) => setFilters({ category: e.target.value })}
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value as Shop['status'] | 'all' })}
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
        <select
          value={filters.contract_status}
          onChange={(e) => setFilters({ contract_status: e.target.value })}
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          <option value="all">All Contracts</option>
          <option value="active">Active</option>
          <option value="expiring_soon">Expiring Soon</option>
          <option value="expired">Expired</option>
          <option value="pending_renewal">Pending Renewal</option>
        </select>
        <select
          value={filters.sort_by}
          onChange={(e) => setFilters({ sort_by: e.target.value as typeof filters.sort_by })}
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          <option value="name">Sort: Name</option>
          <option value="visitors">Sort: Visitors</option>
          <option value="revenue">Sort: Revenue</option>
          <option value="contract_expiry">Sort: Contract Expiry</option>
        </select>
      </SearchFilter>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredShops}
        searchable={false}
        pageSize={25}
        onRowClick={(row) => navigate(`/dashboard/shops/${row.id}`)}
      />

      {/* Modals */}
      <AddShopModal open={addModalOpen} onOpenChange={setAddModalOpen} />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Delete Shop"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? All associated contracts and offers will also be removed.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={() => {
          if (deleteTarget) {
            deleteShop(deleteTarget.id);
            toast.success(`${deleteTarget.name} deleted`);
          }
        }}
      />
    </motion.div>
  );
}
