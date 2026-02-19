// ──────────────────────────────────────
// Audit Export Panel — Phase 9
// ──────────────────────────────────────

import { useState } from 'react';
import { Download, Info } from 'lucide-react';
import { toast } from 'sonner';
import type { AuditActionCategory } from '@/types/compliance.types';

const categories: { value: AuditActionCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'consent', label: 'Consent' },
  { value: 'security', label: 'Security' },
  { value: 'payment', label: 'Payment' },
  { value: 'policy', label: 'Policy' },
  { value: 'data_access', label: 'Data Access' },
  { value: 'override', label: 'Override' },
  { value: 'config_change', label: 'Config Change' },
];

export function AuditExportPanel() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [category, setCategory] = useState<string>('all');

  const handleExport = () => {
    toast.success(`Exporting ${format.toUpperCase()} audit log${category !== 'all' ? ` (${category})` : ''}. Download will start shortly.`);
  };

  const selectCls = 'h-9 rounded-md border border-border bg-background px-3 text-xs font-lexend';

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Download className="h-4 w-4 text-muted-foreground" />
        <h4 className="text-xs font-semibold text-foreground">Export for Regulators</h4>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="h-9 rounded-md border border-border bg-background px-3 text-xs font-lexend"
          placeholder="From"
        />
        <span className="text-xs text-muted-foreground">to</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="h-9 rounded-md border border-border bg-background px-3 text-xs font-lexend"
          placeholder="To"
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectCls}>
          {categories.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        <select value={format} onChange={(e) => setFormat(e.target.value as 'csv' | 'json')} className={selectCls}>
          <option value="csv">CSV</option>
          <option value="json">JSON</option>
        </select>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          Export
        </button>
      </div>

      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
        <Info className="h-3 w-3" />
        <span>Exported files are signed with the Ai-TS compliance key in production.</span>
      </div>
    </div>
  );
}
