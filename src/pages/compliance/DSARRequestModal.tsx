// ──────────────────────────────────────
// DSAR Request Modal — Phase 9
// ──────────────────────────────────────

import { useState } from 'react';
import { FormModal } from '@/components/common/FormModal';
import { DSARStatusBadge } from '@/components/compliance/DSARStatusBadge';
import { Timeline } from '@/components/common/Timeline';
import { Callout } from '@/components/common/Callout';
import { useComplianceStore } from '@/store/compliance.store';
import { toast } from 'sonner';
import { FileDown } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import type { DSARRequest } from '@/types/compliance.types';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

interface Props {
  request: DSARRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  createMode?: boolean;
}

export default function DSARRequestModal({ request, open, onOpenChange, createMode }: Props) {
  const { updateDSARStatus, addDSARTimelineEntry, createDSAR } = useComplianceStore();
  const [status, setStatus] = useState(request?.status || 'received');
  const [assignedTo, setAssignedTo] = useState(request?.assigned_to || '');
  const [responseNotes, setResponseNotes] = useState(request?.response_notes || '');
  const [dataFound, setDataFound] = useState(request?.data_found ?? null);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);

  // Create mode state
  const [createType, setCreateType] = useState<DSARRequest['type']>('access');
  const [createAlias, setCreateAlias] = useState('');
  const [createCategories, setCreateCategories] = useState('');

  const handleSave = () => {
    if (!request) return;
    updateDSARStatus(request.id, status as DSARRequest['status'], responseNotes, assignedTo);
    addDSARTimelineEntry(request.id, {
      timestamp: new Date().toISOString(),
      actor: 'Current Admin',
      action: `Status updated to ${status}`,
      note: responseNotes || null,
    });
    toast.success('DSAR request updated.');
    onOpenChange(false);
  };

  const handleComplete = () => {
    if (!request) return;
    updateDSARStatus(request.id, 'completed', responseNotes, assignedTo);
    addDSARTimelineEntry(request.id, {
      timestamp: new Date().toISOString(),
      actor: 'Current Admin',
      action: 'DSAR completed',
      note: responseNotes || null,
    });
    toast.success('DSAR marked as completed.');
    setShowCompleteConfirm(false);
    onOpenChange(false);
  };

  const handleCreate = () => {
    if (!createAlias.trim()) {
      toast.error('Submitter alias is required.');
      return;
    }
    const now = new Date();
    const id = `dsar-${Date.now()}`;
    const ticketId = `DSAR-${now.toISOString().slice(0, 10).replace(/-/g, '')}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
    const dueBy = new Date(now);
    dueBy.setDate(dueBy.getDate() + 30);

    const newDSAR: DSARRequest = {
      id,
      ticket_id: ticketId,
      type: createType,
      status: 'received',
      submitted_by_alias: createAlias,
      submitted_at: now.toISOString(),
      due_by: dueBy.toISOString(),
      data_categories: createCategories.split(',').map((s) => s.trim()).filter(Boolean),
      data_found: null,
      response_notes: null,
      completed_at: null,
      assigned_to: null,
      timeline: [{ timestamp: now.toISOString(), actor: 'Current Admin', action: 'DSAR created on behalf of submitter', note: null }],
    };

    createDSAR(newDSAR);
    toast.success(`DSAR ${ticketId} created.`);
    onOpenChange(false);
  };

  const inputCls = 'w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm';

  // Create mode
  if (createMode) {
    return (
      <FormModal
        open={open}
        onOpenChange={onOpenChange}
        title="Create DSAR Request"
        subtitle="Create a Data Subject Access Request on behalf of a submitter."
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => onOpenChange(false)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
            <button onClick={handleCreate} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Create</button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Type</label>
            <select value={createType} onChange={(e) => setCreateType(e.target.value as DSARRequest['type'])} className={inputCls}>
              <option value="access">Access</option>
              <option value="deletion">Deletion</option>
              <option value="rectification">Rectification</option>
              <option value="portability">Portability</option>
              <option value="restriction">Restriction</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Submitter Alias / Email Hash *</label>
            <input type="text" value={createAlias} onChange={(e) => setCreateAlias(e.target.value)} placeholder="e.g. PAX-1042 or hash:abc…" className={inputCls} />
          </div>
          <div>
            <label className="text-sm font-medium">Data Categories (comma-separated)</label>
            <input type="text" value={createCategories} onChange={(e) => setCreateCategories(e.target.value)} placeholder="session_history, payment_records" className={inputCls} />
          </div>
        </div>
      </FormModal>
    );
  }

  if (!request) return null;

  const daysRemaining = differenceInDays(new Date(request.due_by), new Date());
  const isOverdue = daysRemaining < 0 && !['completed', 'rejected', 'withdrawn'].includes(request.status);

  return (
    <>
      <FormModal
        open={open}
        onOpenChange={onOpenChange}
        title={`DSAR: ${request.ticket_id}`}
        subtitle={`${request.type.charAt(0).toUpperCase() + request.type.slice(1)} request`}
        size="lg"
        footer={
          <div className="flex justify-between">
            <button
              onClick={() => toast.success('Response exported.')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors"
            >
              <FileDown className="h-3.5 w-3.5" /> Export Response
            </button>
            <div className="flex gap-3">
              <button onClick={() => onOpenChange(false)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">Close</button>
              {!['completed', 'rejected', 'withdrawn'].includes(request.status) && (
                <>
                  <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Save Changes</button>
                  <button onClick={() => setShowCompleteConfirm(true)} className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors">Mark Complete</button>
                </>
              )}
            </div>
          </div>
        }
      >
        <div className="space-y-5">
          {/* Warning */}
          <Callout variant="warning" title="Immutable Record">
            DSAR responses are logged in the Immutable Audit Log and cannot be edited after completion.
          </Callout>

          {/* Request Info */}
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-[10px] text-muted-foreground">Type</p><p className="text-sm capitalize font-medium">{request.type}</p></div>
            <div><p className="text-[10px] text-muted-foreground">Submitted By</p><p className="text-sm font-mono">{request.submitted_by_alias}</p></div>
            <div><p className="text-[10px] text-muted-foreground">Submitted At</p><p className="text-sm">{new Date(request.submitted_at).toLocaleString()}</p></div>
            <div>
              <p className="text-[10px] text-muted-foreground">Due By</p>
              <p className={`text-sm font-semibold ${isOverdue ? 'text-red-600' : daysRemaining < 7 ? 'text-amber-600' : 'text-green-600'}`}>
                {new Date(request.due_by).toLocaleDateString()} {isOverdue && '(OVERDUE)'}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-[10px] text-muted-foreground">Data Categories</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {request.data_categories.map((cat) => (
                  <span key={cat} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">{cat}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Processing */}
          {!['completed', 'rejected', 'withdrawn'].includes(request.status) && (
            <div className="space-y-3 p-4 rounded-lg border border-border bg-muted/30">
              <h4 className="text-xs font-semibold">Processing</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-muted-foreground">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value as DSARRequest['status'])} className={inputCls}>
                    <option value="received">Received</option>
                    <option value="verifying">Verifying</option>
                    <option value="processing">Processing</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground">Assign To</label>
                  <input type="text" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} placeholder="Operator name" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground">Data Found?</label>
                <div className="flex items-center gap-4 mt-1">
                  {[{ v: true, l: 'Yes' }, { v: false, l: 'No' }, { v: null, l: 'Pending' }].map(({ v, l }) => (
                    <label key={l} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name="dataFound" checked={dataFound === v} onChange={() => setDataFound(v)} className="h-3.5 w-3.5 accent-primary" />
                      <span className="text-xs">{l}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground">Response Notes</label>
                <textarea rows={3} value={responseNotes} onChange={(e) => setResponseNotes(e.target.value)} placeholder="Notes for the response…" className={`${inputCls} resize-none`} />
              </div>
            </div>
          )}

          {/* Current Status (read-only for completed) */}
          {['completed', 'rejected', 'withdrawn'].includes(request.status) && (
            <div className="space-y-2 p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">Status:</span>
                <DSARStatusBadge status={request.status} />
              </div>
              {request.response_notes && <p className="text-xs text-muted-foreground">{request.response_notes}</p>}
              {request.completed_at && <p className="text-xs text-muted-foreground">Completed: {new Date(request.completed_at).toLocaleString()}</p>}
            </div>
          )}

          {/* Timeline */}
          <div>
            <h4 className="text-xs font-semibold mb-3">Timeline</h4>
            <Timeline
              items={request.timeline.map((entry, i) => ({
                id: `tl-${i}`,
                title: entry.action,
                description: entry.note || undefined,
                time: new Date(entry.timestamp).toLocaleString(),
                variant: 'default' as const,
              }))}
            />
          </div>
        </div>
      </FormModal>

      <ConfirmDialog
        open={showCompleteConfirm}
        onOpenChange={setShowCompleteConfirm}
        onConfirm={handleComplete}
        title="Complete DSAR Request"
        description="Once completed, this DSAR response will be logged immutably and cannot be edited. Continue?"
        confirmLabel="Complete"
      />
    </>
  );
}
