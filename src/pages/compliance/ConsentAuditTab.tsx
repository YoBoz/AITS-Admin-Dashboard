// ──────────────────────────────────────
// Consent Audit Tab — Phase 9 (S-01)
// ──────────────────────────────────────

import { useState, useMemo } from 'react';
import { SectionCard } from '@/components/common/SectionCard';
import { ConsentStatusBadge } from '@/components/compliance/ConsentStatusBadge';
import { ConsentRecordModal } from '@/components/compliance/ConsentRecord';
import { useComplianceStore } from '@/store/compliance.store';
import { Input } from '@/components/ui/Input';
import { Search, ShieldCheck, TrendingDown, Users } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/Tooltip';
import type { ConsentRecord } from '@/types/compliance.types';

export default function ConsentAuditTab() {
  const { consentRecords } = useComplianceStore();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<ConsentRecord | null>(null);

  const filtered = useMemo(() => {
    return consentRecords.filter((r) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !r.session_id.toLowerCase().includes(q) &&
          !r.passenger_alias.toLowerCase().includes(q) &&
          !r.device_id.toLowerCase().includes(q)
        )
          return false;
      }
      if (typeFilter !== 'all' && r.consent_type !== typeFilter) return false;
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      return true;
    });
  }, [consentRecords, search, typeFilter, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    const total = consentRecords.length;
    const granted = consentRecords.filter((r) => r.status === 'granted').length;
    const grantedRate = total > 0 ? ((granted / total) * 100).toFixed(1) : '0';
    const today = new Date().toDateString();
    const withdrawnToday = consentRecords.filter(
      (r) => r.status === 'withdrawn' && r.withdrawn_at && new Date(r.withdrawn_at).toDateString() === today,
    ).length;
    return { total, grantedRate, withdrawnToday };
  }, [consentRecords]);

  const selectCls = 'h-9 rounded-md border border-border bg-background px-3 text-xs font-lexend';

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
          <div className="p-2.5 rounded-xl bg-primary/10"><Users className="h-5 w-5 text-primary" /></div>
          <div>
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total Records</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
          <div className="p-2.5 rounded-xl bg-green-500/10"><ShieldCheck className="h-5 w-5 text-green-500" /></div>
          <div>
            <p className="text-2xl font-bold">{stats.grantedRate}%</p>
            <p className="text-xs text-muted-foreground">Granted Rate</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
          <div className="p-2.5 rounded-xl bg-amber-500/10"><TrendingDown className="h-5 w-5 text-amber-500" /></div>
          <div>
            <p className="text-2xl font-bold">{stats.withdrawnToday}</p>
            <p className="text-xs text-muted-foreground">Withdrawn Today</p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[250px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Session ID, Passenger Alias, Device IMEI…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={selectCls}>
          <option value="all">All Types</option>
          <option value="analytics">Analytics</option>
          <option value="marketing">Marketing</option>
          <option value="location">Location</option>
          <option value="payment_data">Payment Data</option>
          <option value="all">All Consent</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectCls}>
          <option value="all">All Status</option>
          <option value="granted">Granted</option>
          <option value="declined">Declined</option>
          <option value="withdrawn">Withdrawn</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Table */}
      <SectionCard title="Consent Records" subtitle={`${filtered.length} records`}>
        <div className="overflow-auto max-h-[500px]">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-card border-b border-border z-10">
              <tr>
                {['Session ID', 'Passenger', 'Device IMEI', 'Consent Type', 'Status', 'Granted At', 'Scope', 'Version', 'Source', 'Actions'].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-[10px] font-poppins font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((record) => (
                <tr key={record.id} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="px-3 py-2 font-mono text-foreground">{record.session_id}</td>
                  <td className="px-3 py-2 font-lexend text-foreground">{record.passenger_alias}</td>
                  <td className="px-3 py-2 font-mono text-muted-foreground">{record.device_id}</td>
                  <td className="px-3 py-2 capitalize">{record.consent_type.replace('_', ' ')}</td>
                  <td className="px-3 py-2"><ConsentStatusBadge status={record.status} /></td>
                  <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">
                    {record.granted_at ? new Date(record.granted_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-3 py-2">
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex gap-1 max-w-[120px] overflow-hidden">
                          {record.scope.slice(0, 2).map((s) => (
                            <span key={s} className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[9px] truncate">{s}</span>
                          ))}
                          {record.scope.length > 2 && (
                            <span className="text-[9px] text-muted-foreground">+{record.scope.length - 2}</span>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent><p className="text-xs">{record.scope.join(', ')}</p></TooltipContent>
                    </Tooltip>
                  </td>
                  <td className="px-3 py-2 font-mono text-muted-foreground">{record.version}</td>
                  <td className="px-3 py-2 capitalize text-muted-foreground">{record.source.replace('_', ' ')}</td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="text-primary text-[10px] font-medium hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">No consent records match your search.</div>
          )}
        </div>
      </SectionCard>

      <ConsentRecordModal record={selectedRecord} open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)} />
    </div>
  );
}
