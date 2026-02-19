// ──────────────────────────────────────
// Consent Record Modal — Phase 9
// ──────────────────────────────────────

import { FormModal } from '@/components/common/FormModal';
import { ConsentStatusBadge } from './ConsentStatusBadge';
import { Copy, FileDown } from 'lucide-react';
import { toast } from 'sonner';
import type { ConsentRecord as ConsentRecordType } from '@/types/compliance.types';

interface Props {
  record: ConsentRecordType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function sha256Mock(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const chr = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(12, '0') + 'a3f9c2e8b1d74f6e2a901c8d5b3e7f42a19c8d5b3e7f42a19c8d5b3e7f';
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 py-2.5 border-b border-border/50 last:border-0">
      <span className="text-xs font-medium text-muted-foreground w-36 shrink-0">{label}</span>
      <span className="text-sm text-foreground">{children}</span>
    </div>
  );
}

export function ConsentRecordModal({ record, open, onOpenChange }: Props) {
  if (!record) return null;

  const hashProof = sha256Mock(JSON.stringify(record));

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Consent Record Detail"
      subtitle={`Record ${record.id} — Regulatory proof of consent`}
    >
      <div className="space-y-4">
        <Row label="Session ID"><span className="font-mono text-xs">{record.session_id}</span></Row>
        <Row label="Passenger Alias">{record.passenger_alias}</Row>
        <Row label="Device IMEI"><span className="font-mono text-xs">{record.device_id}</span></Row>
        <Row label="Consent Type"><span className="capitalize">{record.consent_type.replace('_', ' ')}</span></Row>
        <Row label="Status"><ConsentStatusBadge status={record.status} /></Row>
        <Row label="Granted At">{record.granted_at ? new Date(record.granted_at).toLocaleString() : '—'}</Row>
        <Row label="Withdrawn At">{record.withdrawn_at ? new Date(record.withdrawn_at).toLocaleString() : '—'}</Row>
        <Row label="Version">{record.version}</Row>
        <Row label="Source"><span className="capitalize">{record.source.replace('_', ' ')}</span></Row>
        <Row label="IP Hash"><span className="font-mono text-xs">{record.ip_hash}</span></Row>

        {/* Scope chips */}
        <Row label="Scope">
          <div className="flex flex-wrap gap-1.5">
            {record.scope.map((s) => (
              <span key={s} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                {s}
              </span>
            ))}
          </div>
        </Row>

        {/* Hash proof */}
        <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Consent Record Hash (SHA-256)</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-[10px] font-mono break-all text-foreground/80">{hashProof}</code>
            <button
              onClick={() => { navigator.clipboard.writeText(hashProof); toast.success('Hash copied to clipboard'); }}
              className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Export */}
        <button
          onClick={() => toast.success('PDF export requested. You will be notified when ready.')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
        >
          <FileDown className="h-4 w-4" />
          Export as PDF
        </button>
      </div>
    </FormModal>
  );
}
