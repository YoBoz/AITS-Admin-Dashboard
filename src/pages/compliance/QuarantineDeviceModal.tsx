// ──────────────────────────────────────
// Quarantine Device Modal — Phase 9
// ──────────────────────────────────────

import { useState } from 'react';
import { FormModal } from '@/components/common/FormModal';
import { useComplianceStore } from '@/store/compliance.store';
import { toast } from 'sonner';
import type { QuarantinedDevice } from '@/types/compliance.types';

const reasons: { value: QuarantinedDevice['quarantine_reason']; label: string }[] = [
  { value: 'suspicious_behavior', label: 'Suspicious Behavior' },
  { value: 'security_breach', label: 'Security Breach' },
  { value: 'policy_violation', label: 'Policy Violation' },
  { value: 'hardware_fault', label: 'Hardware Fault' },
  { value: 'manual', label: 'Manual Quarantine' },
];

const flagOptions = [
  'erratic movement',
  'zone breach',
  'signal spoofing suspected',
  'repeated policy violations',
  'unauthorized firmware',
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillImei?: string;
}

export default function QuarantineDeviceModal({ open, onOpenChange, prefillImei }: Props) {
  const { quarantineDevice } = useComplianceStore();
  const [imei, setImei] = useState(prefillImei || '');
  const [reason, setReason] = useState<QuarantinedDevice['quarantine_reason']>('suspicious_behavior');
  const [notes, setNotes] = useState('');
  const [selectedFlags, setSelectedFlags] = useState<string[]>([]);
  const [incidentId, setIncidentId] = useState('');

  const toggleFlag = (flag: string) => {
    setSelectedFlags((prev) => prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag]);
  };

  const handleSubmit = () => {
    if (!imei.trim() || !notes.trim()) {
      toast.error('IMEI and notes are required.');
      return;
    }

    const device: QuarantinedDevice = {
      device_id: `trolley-${imei.replace('IMEI-', '')}`,
      device_imei: imei.startsWith('IMEI-') ? imei : `IMEI-${imei}`,
      quarantine_reason: reason,
      quarantined_at: new Date().toISOString(),
      quarantined_by: 'Current Admin',
      notes,
      status: 'active_quarantine',
      incident_id: incidentId.trim() || null,
      cleared_at: null,
      cleared_by: null,
      clearance_notes: null,
      behavioral_flags: selectedFlags,
    };

    quarantineDevice(device);
    toast.success(`Device ${device.device_imei} quarantined.`);
    onOpenChange(false);
    setImei('');
    setNotes('');
    setSelectedFlags([]);
    setIncidentId('');
  };

  const inputCls = 'w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm';

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Quarantine Device"
      subtitle="Isolate a suspicious or compromised device from the fleet."
      footer={
        <div className="flex justify-end gap-3">
          <button onClick={() => onOpenChange(false)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors">Quarantine</button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Device IMEI *</label>
          <input type="text" value={imei} onChange={(e) => setImei(e.target.value)} placeholder="e.g. IMEI-350042" className={inputCls} />
        </div>
        <div>
          <label className="text-sm font-medium">Quarantine Reason</label>
          <select value={reason} onChange={(e) => setReason(e.target.value as QuarantinedDevice['quarantine_reason'])} className={inputCls}>
            {reasons.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Behavioral Flags Observed</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {flagOptions.map((flag) => (
              <button
                key={flag}
                type="button"
                onClick={() => toggleFlag(flag)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  selectedFlags.includes(flag)
                    ? 'bg-red-500/20 border-red-500/50 text-red-700 dark:text-red-400'
                    : 'bg-muted border-border text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {flag}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Link to Incident (optional)</label>
          <input type="text" value={incidentId} onChange={(e) => setIncidentId(e.target.value)} placeholder="e.g. INC-2026-0032" className={inputCls} />
        </div>
        <div>
          <label className="text-sm font-medium">Notes *</label>
          <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Describe the reason for quarantine…" className={`${inputCls} resize-none`} />
        </div>
      </div>
    </FormModal>
  );
}
