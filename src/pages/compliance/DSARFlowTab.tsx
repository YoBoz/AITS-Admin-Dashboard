// ──────────────────────────────────────
// DSAR Flow Tab — Phase 9 (S-03)
// ──────────────────────────────────────

import { useState, useMemo } from 'react';
import { SectionCard } from '@/components/common/SectionCard';
import { DSARStatusBadge } from '@/components/compliance/DSARStatusBadge';
import { useComplianceStore } from '@/store/compliance.store';
import { Input } from '@/components/ui/Input';
import { Search, Clock, AlertTriangle, CheckCircle2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { differenceInDays } from 'date-fns';
import DSARRequestModal from './DSARRequestModal';
import type { DSARRequest } from '@/types/compliance.types';

export default function DSARFlowTab() {
  const { dsarRequests } = useComplianceStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDSAR, setSelectedDSAR] = useState<DSARRequest | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const filtered = useMemo(() => {
    return dsarRequests.filter((r) => {
      if (search) {
        const q = search.toLowerCase();
        if (!r.ticket_id.toLowerCase().includes(q) && !r.submitted_by_alias.toLowerCase().includes(q)) return false;
      }
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      return true;
    });
  }, [dsarRequests, search, statusFilter]);

  const stats = useMemo(() => {
    const open = dsarRequests.filter((r) => ['received', 'verifying', 'processing'].includes(r.status)).length;
    const overdue = dsarRequests.filter((r) => {
      if (['completed', 'rejected', 'withdrawn'].includes(r.status)) return false;
      return differenceInDays(new Date(r.due_by), new Date()) < 0;
    }).length;
    const completedMonth = dsarRequests.filter((r) => {
      if (r.status !== 'completed' || !r.completed_at) return false;
      const d = new Date(r.completed_at);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    return { open, overdue, completedMonth };
  }, [dsarRequests]);

  const dueDateColor = (dueBy: string, status: string) => {
    if (['completed', 'rejected', 'withdrawn'].includes(status)) return 'text-muted-foreground';
    const days = differenceInDays(new Date(dueBy), new Date());
    if (days < 0) return 'text-red-600 dark:text-red-400 font-semibold';
    if (days < 7) return 'text-amber-600 dark:text-amber-400';
    return 'text-green-600 dark:text-green-400';
  };

  const selectCls = 'h-9 rounded-md border border-border bg-background px-3 text-xs font-lexend';

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
          <div className="p-2.5 rounded-xl bg-blue-500/10"><Clock className="h-5 w-5 text-blue-500" /></div>
          <div><p className="text-2xl font-bold">{stats.open}</p><p className="text-xs text-muted-foreground">Open Requests</p></div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
          <div className="p-2.5 rounded-xl bg-red-500/10"><AlertTriangle className="h-5 w-5 text-red-500" /></div>
          <div><p className="text-2xl font-bold">{stats.overdue}</p><p className="text-xs text-muted-foreground">Overdue</p></div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
          <div className="p-2.5 rounded-xl bg-green-500/10"><CheckCircle2 className="h-5 w-5 text-green-500" /></div>
          <div><p className="text-2xl font-bold">{stats.completedMonth}</p><p className="text-xs text-muted-foreground">Completed This Month</p></div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search ticket ID or submitter…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectCls}>
          <option value="all">All Status</option>
          <option value="received">Received</option>
          <option value="verifying">Verifying</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
        <div className="flex-1" />
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
          <Plus className="h-3.5 w-3.5" /> New DSAR
        </button>
      </div>

      {/* Table */}
      <SectionCard title="DSAR Requests" subtitle={`${filtered.length} requests`}>
        <div className="overflow-auto max-h-[500px]">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-card border-b border-border z-10">
              <tr>
                {['Ticket ID', 'Type', 'Submitted By', 'Status', 'Submitted At', 'Due By', 'Assigned To', 'Actions'].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-[10px] font-poppins font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((req) => (
                <tr key={req.id} className="border-b border-border/50 hover:bg-muted/20 cursor-pointer" onClick={() => setSelectedDSAR(req)}>
                  <td className="px-3 py-2 font-mono text-foreground">{req.ticket_id}</td>
                  <td className="px-3 py-2 capitalize">{req.type}</td>
                  <td className="px-3 py-2 font-mono text-xs">{req.submitted_by_alias}</td>
                  <td className="px-3 py-2"><DSARStatusBadge status={req.status} /></td>
                  <td className="px-3 py-2 text-muted-foreground">{new Date(req.submitted_at).toLocaleDateString()}</td>
                  <td className={cn('px-3 py-2 whitespace-nowrap', dueDateColor(req.due_by, req.status))}>
                    {new Date(req.due_by).toLocaleDateString()}
                    {differenceInDays(new Date(req.due_by), new Date()) < 0 && !['completed', 'rejected', 'withdrawn'].includes(req.status) && (
                      <span className="ml-1 text-[9px]">OVERDUE</span>
                    )}
                  </td>
                  <td className="px-3 py-2">{req.assigned_to || <span className="text-muted-foreground">Unassigned</span>}</td>
                  <td className="px-3 py-2">
                    <button className="text-primary text-[10px] font-medium hover:underline" onClick={(e) => { e.stopPropagation(); setSelectedDSAR(req); }}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">No DSAR requests match your filters.</div>
          )}
        </div>
      </SectionCard>

      {/* DSAR Detail Modal */}
      <DSARRequestModal request={selectedDSAR} open={!!selectedDSAR} onOpenChange={() => setSelectedDSAR(null)} />

      {/* Create DSAR Modal */}
      <DSARRequestModal request={null} open={showCreate} onOpenChange={setShowCreate} createMode />
    </div>
  );
}
