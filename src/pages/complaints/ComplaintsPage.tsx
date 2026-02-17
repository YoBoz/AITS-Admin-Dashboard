import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/common/PageHeader';
import { SearchFilter } from '@/components/common/SearchFilter';
import { SectionCard } from '@/components/common/SectionCard';
import { DataTable } from '@/components/common/DataTable';
import { ComplaintStatusBadge } from '@/components/complaints/ComplaintStatusBadge';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import ComplaintDetailModal from './ComplaintDetailModal';
import { useComplaintsStore } from '@/store/complaints.store';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Eye, AlertCircle, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import type { Complaint, ComplaintStatus, ComplaintCategory } from '@/types/complaint.types';

const statusOptions: { value: ComplaintStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'pending_response', label: 'Pending' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
  { value: 'escalated', label: 'Escalated' },
];

const categoryOptions: { value: ComplaintCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'trolley_fault', label: 'Trolley Fault' },
  { value: 'navigation_error', label: 'Navigation' },
  { value: 'display_issue', label: 'Display' },
  { value: 'offer_dispute', label: 'Offer Dispute' },
  { value: 'privacy', label: 'Privacy' },
  { value: 'general', label: 'General' },
  { value: 'staff', label: 'Staff' },
  { value: 'facility', label: 'Facility' },
];

const priorityVariant: Record<string, 'default' | 'destructive' | 'warning' | 'secondary'> = {
  high: 'destructive',
  medium: 'warning',
  low: 'secondary',
};

function StatsCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card"
    >
      <div className={cn('p-2 rounded-lg', color)}>{icon}</div>
      <div>
        <div className="text-xl font-bold font-montserrat text-foreground">{value}</div>
        <div className="text-[11px] text-muted-foreground font-lexend">{label}</div>
      </div>
    </motion.div>
  );
}

export default function ComplaintsPage() {
  const store = useComplaintsStore();
  const { filters, setFilters, getFilteredComplaints, selectComplaint, selectedComplaint } = store;
  const stats = store.getStats();

  const [detailOpen, setDetailOpen] = useState(false);

  const filteredComplaints = getFilteredComplaints();

  const columns: ColumnDef<Complaint>[] = useMemo(() => [
    {
      accessorKey: 'ticket_id',
      header: 'Ticket ID',
      cell: ({ row }) => (
        <button
          onClick={() => { selectComplaint(row.original); setDetailOpen(true); }}
          className="text-xs font-mono text-brand hover:underline"
        >
          {row.original.ticket_id}
        </button>
      ),
    },
    {
      accessorKey: 'subject',
      header: 'Subject',
      cell: ({ getValue }) => (
        <span className="text-xs font-lexend text-foreground truncate block max-w-[180px]">
          {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ getValue }) => (
        <span className="text-[10px] font-lexend capitalize">{getValue<string>().replace('_', ' ')}</span>
      ),
    },
    {
      header: 'Submitted By',
      accessorFn: (row) => row.submitted_by.name,
      cell: ({ getValue }) => (
        <span className="text-xs font-lexend">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ getValue }) => (
        <Badge variant={priorityVariant[getValue<string>()] || 'secondary'} className="text-[10px]">
          {getValue<string>()}
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => <ComplaintStatusBadge status={getValue<ComplaintStatus>()} />,
    },
    {
      header: 'Assigned To',
      accessorFn: (row) => row.assigned_to || '—',
      cell: ({ getValue }) => (
        <span className="text-xs font-lexend text-muted-foreground">{getValue<string>()}</span>
      ),
    },
    {
      header: 'SLA',
      accessorFn: (row) => row.sla_due_at,
      cell: ({ row }) => {
        const c = row.original;
        const slaDue = new Date(c.sla_due_at);
        const now = new Date();
        const hrs = (slaDue.getTime() - now.getTime()) / 3600000;
        let color = 'text-status-success';
        let text = `${Math.round(hrs)}h`;
        if (c.sla_breached || hrs < 0) { color = 'text-destructive font-bold'; text = 'Breached'; }
        else if (hrs < 8) { color = 'text-status-warning'; text = `${Math.round(hrs)}h`; }
        return <span className={cn('text-[10px] font-mono', color)}>{text}</span>;
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ getValue }) => (
        <span className="text-[10px] font-mono text-muted-foreground">
          {formatDistanceToNow(new Date(getValue<string>()), { addSuffix: true })}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => { selectComplaint(row.original); setDetailOpen(true); }}
        >
          <Eye className="h-3.5 w-3.5" />
        </Button>
      ),
    },
  ], [selectComplaint]);

  return (
    <div className="space-y-4 max-w-[1280px] mx-auto">
      <PageHeader title="Complaints" subtitle="Track and manage visitor complaints" />

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatsCard icon={<AlertCircle className="h-4 w-4" />} label="Open" value={stats.open} color="bg-status-info/10 text-status-info" />
        <StatsCard icon={<Clock className="h-4 w-4" />} label="In Progress" value={stats.in_progress} color="bg-status-warning/10 text-status-warning" />
        <StatsCard icon={<CheckCircle className="h-4 w-4" />} label="Resolved" value={stats.resolved} color="bg-status-success/10 text-status-success" />
        <StatsCard icon={<AlertTriangle className="h-4 w-4" />} label="Escalated" value={stats.escalated} color="bg-destructive/10 text-destructive" />
        <StatsCard
          icon={<AlertTriangle className="h-4 w-4" />}
          label="SLA Breached"
          value={stats.sla_breached}
          color={stats.sla_breached > 0 ? 'bg-destructive/20 text-destructive' : 'bg-muted text-muted-foreground'}
        />
        <StatsCard icon={<CheckCircle className="h-4 w-4" />} label="Total" value={stats.total} color="bg-muted text-muted-foreground" />
      </div>

      {/* Filters */}
      <SearchFilter
        searchValue={filters.search}
        onSearchChange={(val) => setFilters({ search: val })}
        searchPlaceholder="Search by ticket ID, subject..."
      >
        <select
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value as ComplaintStatus | 'all' })}
          className="h-9 rounded-md border border-border bg-background px-2 text-xs font-lexend"
        >
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          value={filters.category}
          onChange={(e) => setFilters({ category: e.target.value as ComplaintCategory | 'all' })}
          className="h-9 rounded-md border border-border bg-background px-2 text-xs font-lexend"
        >
          {categoryOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          value={filters.priority}
          onChange={(e) => setFilters({ priority: e.target.value as Complaint['priority'] | 'all' })}
          className="h-9 rounded-md border border-border bg-background px-2 text-xs font-lexend"
        >
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={filters.sla_status}
          onChange={(e) => setFilters({ sla_status: e.target.value as 'all' | 'breached' | 'at_risk' | 'on_track' })}
          className="h-9 rounded-md border border-border bg-background px-2 text-xs font-lexend"
        >
          <option value="all">All SLA</option>
          <option value="breached">Breached</option>
          <option value="at_risk">At Risk</option>
          <option value="on_track">On Track</option>
        </select>
      </SearchFilter>

      {/* Table */}
      <SectionCard title={`Complaints (${filteredComplaints.length})`} contentClassName="p-0">
        <DataTable columns={columns} data={filteredComplaints} />
      </SectionCard>

      <ComplaintDetailModal
        complaint={selectedComplaint}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
