import { useState, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '@/components/common/PageHeader';
import { SearchFilter } from '@/components/common/SearchFilter';
import { OfferCard } from '@/components/offers/OfferCard';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { FormModal } from '@/components/common/FormModal';
import { DataTable } from '@/components/common/DataTable';
import { offersData } from '@/data/mock/offers.mock';

import type { Offer, DiscountType } from '@/types/offer.types';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Plus,
  Eye,
  Tag,
  Calendar,
  Gift,
  Clock,
  Edit,
  Trash2,
  Pause,
  Play,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>(offersData);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [shopFilter, setShopFilter] = useState('all');
  const [discountTypeFilter, setDiscountTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Offer | null>(null);
  const [viewOffer, setViewOffer] = useState<Offer | null>(null);
  const [editOffer, setEditOffer] = useState<Offer | null>(null);

  // Stats
  const stats = useMemo(() => {
    const active = offers.filter((o) => o.status === 'active').length;
    const scheduled = offers.filter((o) => o.status === 'scheduled').length;
    const expired = offers.filter((o) => o.status === 'expired').length;
    const totalImpressions = offers.reduce((sum, o) => sum + o.impressions, 0);
    return { active, scheduled, expired, totalImpressions };
  }, [offers]);

  // Filtered offers
  const filteredOffers = useMemo(() => {
    return offers.filter((o) => {
      if (search) {
        const q = search.toLowerCase();
        const match =
          o.title.toLowerCase().includes(q) ||
          o.shop_name.toLowerCase().includes(q) ||
          o.description.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (shopFilter !== 'all' && o.shop_id !== shopFilter) return false;
      if (discountTypeFilter !== 'all' && o.discount_type !== discountTypeFilter) return false;
      return true;
    });
  }, [offers, search, statusFilter, shopFilter, discountTypeFilter]);

  // Unique shops for filter
  const shopOptions = useMemo(() => {
    const uniqueShops = new Map<string, string>();
    offers.forEach((o) => uniqueShops.set(o.shop_id, o.shop_name));
    return Array.from(uniqueShops.entries()).map(([id, name]) => ({
      value: id,
      label: name,
    }));
  }, [offers]);

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    setOffers((prev) => prev.filter((o) => o.id !== deleteTarget.id));
    toast.success(`Offer "${deleteTarget.title}" deleted`);
    setDeleteTarget(null);
  }, [deleteTarget]);

  const handleToggleStatus = useCallback((offer: Offer) => {
    setOffers((prev) =>
      prev.map((o) => {
        if (o.id !== offer.id) return o;
        const newStatus = o.status === 'paused' ? 'active' : 'paused';
        return { ...o, status: newStatus };
      })
    );
    toast.success(
      `Offer "${offer.title}" ${offer.status === 'paused' ? 'resumed' : 'paused'}`
    );
  }, []);

  const discountDisplay = (offer: Offer) => {
    switch (offer.discount_type) {
      case 'percentage':
        return `${offer.discount_value}%`;
      case 'fixed':
        return `$${offer.discount_value}`;
      case 'bogo':
        return 'BOGO';
      case 'freebie':
        return 'FREE';
    }
  };

  // Table columns
  const columns: ColumnDef<Offer>[] = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Offer',
        cell: ({ row }) => (
          <div className="max-w-[200px]">
            <p className="text-sm font-medium truncate">{row.original.title}</p>
            <p className="text-xs text-muted-foreground truncate">
              {row.original.shop_name}
            </p>
          </div>
        ),
      },
      {
        accessorKey: 'discount_type',
        header: 'Discount',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-primary">
              {discountDisplay(row.original)}
            </span>
            <span className="text-[10px] uppercase text-muted-foreground">
              {row.original.discount_type}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const st = row.original.status;
          const styles: Record<string, string> = {
            active: 'bg-green-500/10 text-green-700 dark:text-green-400',
            scheduled: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
            expired: 'bg-red-500/10 text-red-700 dark:text-red-400',
            paused: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
          };
          return (
            <span
              className={cn(
                'text-xs font-medium px-2 py-0.5 rounded-full capitalize',
                styles[st]
              )}
            >
              {st}
            </span>
          );
        },
      },
      {
        accessorKey: 'start_date',
        header: 'Duration',
        cell: ({ row }) => (
          <div className="text-xs text-muted-foreground">
            <div>{format(new Date(row.original.start_date), 'MMM dd, yyyy')}</div>
            <div>{format(new Date(row.original.end_date), 'MMM dd, yyyy')}</div>
          </div>
        ),
      },
      {
        accessorKey: 'impressions',
        header: 'Impressions',
        cell: ({ row }) => (
          <span className="text-sm font-mono">
            {row.original.impressions.toLocaleString()}
          </span>
        ),
      },
      {
        accessorKey: 'redemptions',
        header: 'Redemptions',
        cell: ({ row }) => (
          <span className="text-sm font-mono">
            {row.original.redemptions.toLocaleString()}
          </span>
        ),
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        cell: ({ row }) => (
          <span
            className={cn(
              'text-xs font-bold px-2 py-0.5 rounded',
              row.original.priority >= 8
                ? 'bg-primary/10 text-primary'
                : row.original.priority >= 5
                  ? 'bg-amber-500/10 text-amber-600'
                  : 'bg-muted text-muted-foreground'
            )}
          >
            {row.original.priority}/10
          </span>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewOffer(row.original)}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setEditOffer(row.original)}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            >
              <Edit className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => handleToggleStatus(row.original)}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            >
              {row.original.status === 'paused' ? (
                <Play className="h-3.5 w-3.5" />
              ) : (
                <Pause className="h-3.5 w-3.5" />
              )}
            </button>
            <button
              onClick={() => setDeleteTarget(row.original)}
              className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-500"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ),
      },
    ],
    [handleToggleStatus]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <PageHeader
        title="Offers & Promotions"
        subtitle="Manage shop offers and promotional campaigns"
        actions={
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Offer
          </button>
        }
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
          <div className="p-2.5 rounded-xl bg-green-500/10">
            <Tag className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.active}</p>
            <p className="text-xs text-muted-foreground">Active Offers</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
          <div className="p-2.5 rounded-xl bg-blue-500/10">
            <Clock className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.scheduled}</p>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
          <div className="p-2.5 rounded-xl bg-red-500/10">
            <Calendar className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.expired}</p>
            <p className="text-xs text-muted-foreground">Expired</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {stats.totalImpressions >= 1000
                ? `${(stats.totalImpressions / 1000).toFixed(0)}K`
                : stats.totalImpressions}
            </p>
            <p className="text-xs text-muted-foreground">Total Impressions</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <SearchFilter
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search offers, shops..."
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showViewToggle
      >
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="scheduled">Scheduled</option>
          <option value="paused">Paused</option>
          <option value="expired">Expired</option>
        </select>
        <select
          value={discountTypeFilter}
          onChange={(e) => setDiscountTypeFilter(e.target.value)}
          className="h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground"
        >
          <option value="all">All Types</option>
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed Amount</option>
          <option value="bogo">BOGO</option>
          <option value="freebie">Freebie</option>
        </select>
        <select
          value={shopFilter}
          onChange={(e) => setShopFilter(e.target.value)}
          className="h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground max-w-[200px]"
        >
          <option value="all">All Shops</option>
          {shopOptions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </SearchFilter>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredOffers.length} of {offers.length} offers
        </p>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4"
          >
            {filteredOffers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                onView={(o) => setViewOffer(o)}
                onEdit={(o) => setEditOffer(o)}
                onDelete={(o) => setDeleteTarget(o)}
                onToggleStatus={handleToggleStatus}
              />
            ))}
            {filteredOffers.length === 0 && (
              <div className="col-span-full text-center py-16">
                <Gift className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No offers found</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DataTable columns={columns} data={filteredOffers} pageSize={15} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Offer"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmVariant="danger"
        confirmLabel="Delete"
      />

      {/* View/Edit Offer Modal */}
      {(viewOffer || editOffer) && (
        <OfferDetailModalInline
          offer={(viewOffer || editOffer)!}
          mode={editOffer ? 'edit' : 'view'}
          onClose={() => {
            setViewOffer(null);
            setEditOffer(null);
          }}
          onSave={(updated) => {
            setOffers((prev) =>
              prev.map((o) => (o.id === updated.id ? updated : o))
            );
            toast.success(`Offer "${updated.title}" updated`);
            setEditOffer(null);
            setViewOffer(null);
          }}
        />
      )}

      {/* Create Offer Modal */}
      <FormModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        title="Create New Offer"
        subtitle="Fill in the details for a new promotional offer."
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
            <button onClick={() => { toast.success('Offer created successfully'); setShowAddModal(false); }} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Create Offer</button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <input type="text" placeholder="e.g. Summer Sale 20% Off" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea rows={2} placeholder="Brief description of the offer" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Discount Type</label>
              <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm">
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
                <option value="bogo">BOGO</option>
                <option value="freebie">Freebie</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Discount Value</label>
              <input type="number" placeholder="e.g. 20" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <input type="date" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium">End Date</label>
              <input type="date" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Priority (1-10)</label>
            <input type="range" min="1" max="10" defaultValue="5" className="w-full mt-1 accent-primary" />
          </div>
        </div>
      </FormModal>
    </motion.div>
  );
}

// Inline detail/edit modal
function OfferDetailModalInline({
  offer,
  mode,
  onClose,
  onSave,
}: {
  offer: Offer;
  mode: 'view' | 'edit';
  onClose: () => void;
  onSave: (offer: Offer) => void;
}) {
  const [formData, setFormData] = useState<Offer>({ ...offer });
  const [isEditing, setIsEditing] = useState(mode === 'edit');

  const discountDisplay = (() => {
    switch (formData.discount_type) {
      case 'percentage':
        return `${formData.discount_value}%`;
      case 'fixed':
        return `$${formData.discount_value}`;
      case 'bogo':
        return 'BOGO';
      case 'freebie':
        return 'FREE';
    }
  })();

  const statusStyles: Record<string, string> = {
    active: 'bg-green-500/10 text-green-700 dark:text-green-400',
    scheduled: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    expired: 'bg-red-500/10 text-red-700 dark:text-red-400',
    paused: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-card border border-border rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="relative h-32 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl font-bold font-poppins text-primary">
                {discountDisplay}
              </p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {formData.discount_type}
              </p>
            </div>
            <span
              className={cn(
                'absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full capitalize',
                statusStyles[formData.status]
              )}
            >
              {formData.status}
            </span>
            <button
              onClick={onClose}
              className="absolute top-3 left-3 p-1.5 rounded-lg bg-card/80 hover:bg-card border border-border transition-colors"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Title & Description */}
            <div>
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={3}
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold font-poppins">{formData.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formData.description}
                  </p>
                </>
              )}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Shop</p>
                  <p className="text-sm font-medium">{formData.shop_name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Discount Type</p>
                  {isEditing ? (
                    <select
                      value={formData.discount_type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount_type: e.target.value as DiscountType,
                        })
                      }
                      className="mt-1 w-full px-3 py-1.5 rounded-lg border border-border bg-background text-sm"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                      <option value="bogo">BOGO</option>
                      <option value="freebie">Freebie</option>
                    </select>
                  ) : (
                    <p className="text-sm font-medium capitalize">
                      {formData.discount_type}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Start Date</p>
                  {isEditing ? (
                    <input
                      type="date"
                      value={formData.start_date.split('T')[0]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          start_date: e.target.value + 'T00:00:00Z',
                        })
                      }
                      className="mt-1 w-full px-3 py-1.5 rounded-lg border border-border bg-background text-sm"
                    />
                  ) : (
                    <p className="text-sm font-medium">
                      {format(new Date(formData.start_date), 'MMM dd, yyyy')}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Created By</p>
                  <p className="text-sm font-medium">{formData.created_by}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Discount Value</p>
                  {isEditing ? (
                    <input
                      type="number"
                      value={formData.discount_value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount_value: Number(e.target.value),
                        })
                      }
                      className="mt-1 w-full px-3 py-1.5 rounded-lg border border-border bg-background text-sm"
                    />
                  ) : (
                    <p className="text-sm font-medium">{formData.discount_value}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">End Date</p>
                  {isEditing ? (
                    <input
                      type="date"
                      value={formData.end_date.split('T')[0]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          end_date: e.target.value + 'T00:00:00Z',
                        })
                      }
                      className="mt-1 w-full px-3 py-1.5 rounded-lg border border-border bg-background text-sm"
                    />
                  ) : (
                    <p className="text-sm font-medium">
                      {format(new Date(formData.end_date), 'MMM dd, yyyy')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Priority */}
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Priority ({formData.priority}/10)
              </p>
              {isEditing ? (
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: Number(e.target.value) })
                  }
                  className="w-full accent-primary"
                />
              ) : (
                <div className="flex gap-1">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'h-2 flex-1 rounded-full',
                        i < formData.priority ? 'bg-primary' : 'bg-muted'
                      )}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Categories */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">Target Categories</p>
              <div className="flex flex-wrap gap-1.5">
                {formData.target_categories.map((cat) => (
                  <span
                    key={cat}
                    className="text-xs px-2 py-1 rounded-lg bg-muted text-foreground capitalize"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-muted/50">
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {formData.impressions.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Impressions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {formData.redemptions.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Redemptions</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              {isEditing ? (
                <>
                  <button
                    onClick={() => {
                      onSave(formData);
                    }}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setFormData({ ...offer });
                      setIsEditing(false);
                    }}
                    className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Offer
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
