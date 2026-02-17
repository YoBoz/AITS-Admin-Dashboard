import { useState } from 'react';
import { FormModal } from '@/components/common/FormModal';
import { ComplaintStatusBadge } from '@/components/complaints/ComplaintStatusBadge';
import { ComplaintTimeline } from '@/components/complaints/ComplaintTimeline';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useComplaintsStore } from '@/store/complaints.store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Complaint } from '@/types/complaint.types';
import {
  User, Mail, Phone, Monitor, Store, Paperclip, Clock, AlertTriangle,
} from 'lucide-react';

interface ComplaintDetailModalProps {
  complaint: Complaint | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const priorityVariant: Record<string, 'default' | 'destructive' | 'warning' | 'secondary'> = {
  high: 'destructive',
  medium: 'warning',
  low: 'secondary',
};

export default function ComplaintDetailModal({ complaint, open, onOpenChange }: ComplaintDetailModalProps) {
  const { resolveComplaint, escalateComplaint, updateStatus, assignComplaint, addTimelineEntry } = useComplaintsStore();
  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'response'>('details');
  const [resolution, setResolution] = useState('');
  const [response, setResponse] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [notes, setNotes] = useState('');

  if (!complaint) return null;

  const slaDue = new Date(complaint.sla_due_at);
  const now = new Date();
  const slaHoursLeft = (slaDue.getTime() - now.getTime()) / 3600000;

  let slaColor = 'text-status-success';
  let slaText = `${Math.round(slaHoursLeft)}h remaining`;
  if (complaint.sla_breached || slaHoursLeft < 0) {
    slaColor = 'text-destructive';
    slaText = 'SLA Breached';
  } else if (slaHoursLeft < 8) {
    slaColor = 'text-status-warning';
    slaText = `${Math.round(slaHoursLeft)}h remaining (at risk)`;
  }

  const handleResolve = () => {
    resolveComplaint(complaint.id, 'Admin', resolution || 'Resolved by admin.');
    toast.success('Complaint resolved');
    onOpenChange(false);
  };

  const handleEscalate = () => {
    escalateComplaint(complaint.id, 'Admin', 'Escalated by admin.');
    toast.warning('Complaint escalated');
    onOpenChange(false);
  };

  const handleClose = () => {
    updateStatus(complaint.id, 'closed', 'Admin', 'Closed by admin.');
    toast.info('Complaint closed');
    onOpenChange(false);
  };

  const handleAssign = () => {
    if (assignTo.trim()) {
      assignComplaint(complaint.id, assignTo.trim());
      toast.success(`Assigned to ${assignTo.trim()}`);
    }
  };

  const handleSendResponse = () => {
    if (response.trim()) {
      addTimelineEntry(complaint.id, 'Response sent to visitor', 'Admin', response.trim());
      toast.success('Response sent');
      setResponse('');
      setActiveTab('timeline');
    }
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={complaint.ticket_id}
      subtitle={complaint.subject}
      size="xl"
    >
      {/* Tab switcher */}
      <div className="flex items-center gap-1 mb-4 border-b border-border pb-2">
        {(['details', 'timeline', 'response'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-3 py-1.5 rounded-t-md text-xs font-lexend transition-colors capitalize',
              activeTab === tab ? 'bg-brand text-white' : 'text-muted-foreground hover:bg-muted'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="max-h-[55vh] overflow-y-auto pr-1 space-y-4">
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Left column (60%) */}
            <div className="lg:col-span-3 space-y-4">
              <div>
                <h4 className="text-xs font-poppins font-semibold text-muted-foreground uppercase mb-2">Description</h4>
                <p className="text-sm font-lexend text-foreground/90">{complaint.description}</p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs text-muted-foreground font-lexend capitalize">
                  Category: {complaint.category.replace('_', ' ')}
                </span>
                <Badge variant={priorityVariant[complaint.priority]} className="text-[10px]">
                  {complaint.priority}
                </Badge>
              </div>

              {/* Submitter */}
              <div>
                <h4 className="text-xs font-poppins font-semibold text-muted-foreground uppercase mb-2">Submitted By</h4>
                <div className="bg-muted/30 rounded-lg p-3 space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-lexend">{complaint.submitted_by.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-mono text-xs">{complaint.submitted_by.email}</span>
                  </div>
                  {complaint.submitted_by.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-mono text-xs">{complaint.submitted_by.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Linked items */}
              {(complaint.trolley_id || complaint.shop_id) && (
                <div className="flex gap-3">
                  {complaint.trolley_id && (
                    <div className="flex items-center gap-1.5 text-xs bg-muted/30 rounded px-2 py-1">
                      <Monitor className="h-3 w-3 text-muted-foreground" />
                      <span className="font-mono">{complaint.trolley_id}</span>
                    </div>
                  )}
                  {complaint.shop_id && (
                    <div className="flex items-center gap-1.5 text-xs bg-muted/30 rounded px-2 py-1">
                      <Store className="h-3 w-3 text-muted-foreground" />
                      <span className="font-mono">{complaint.shop_id}</span>
                    </div>
                  )}
                </div>
              )}

              {complaint.attachments > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Paperclip className="h-3 w-3" /> {complaint.attachments} attachment{complaint.attachments > 1 ? 's' : ''}
                </div>
              )}
            </div>

            {/* Right column (40%) */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h4 className="text-xs font-poppins font-semibold text-muted-foreground uppercase mb-2">Status</h4>
                <ComplaintStatusBadge status={complaint.status} />
              </div>

              <div>
                <h4 className="text-xs font-poppins font-semibold text-muted-foreground uppercase mb-2">Assigned To</h4>
                <div className="flex items-center gap-2">
                  <input
                    value={assignTo || complaint.assigned_to || ''}
                    onChange={(e) => setAssignTo(e.target.value)}
                    placeholder="Assign to..."
                    className="flex-1 h-8 rounded-md border border-border bg-background px-2 text-xs font-lexend"
                  />
                  <Button size="sm" variant="outline" className="text-xs h-8" onClick={handleAssign}>
                    Assign
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-poppins font-semibold text-muted-foreground uppercase mb-2">SLA</h4>
                <div className={cn('flex items-center gap-1.5 text-sm font-mono', slaColor)}>
                  {complaint.sla_breached ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                  {slaText}
                </div>
              </div>

              {/* Internal notes */}
              <div>
                <h4 className="text-xs font-poppins font-semibold text-muted-foreground uppercase mb-2">Internal Notes</h4>
                <textarea
                  value={notes || complaint.internal_notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Admin-only notes..."
                  className="w-full h-16 rounded-md border border-border bg-background px-3 py-2 text-xs font-lexend placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand resize-none"
                />
              </div>

              {/* Actions */}
              <div className="space-y-2">
                {complaint.status !== 'resolved' && complaint.status !== 'closed' && (
                  <div>
                    <textarea
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      placeholder="Resolution notes..."
                      className="w-full h-14 rounded-md border border-border bg-background px-3 py-2 text-xs font-lexend placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand resize-none mb-2"
                    />
                    <div className="flex gap-1.5">
                      <Button size="sm" onClick={handleResolve} className="text-xs flex-1">Resolve</Button>
                      <Button size="sm" variant="outline" onClick={handleEscalate} className="text-xs flex-1">Escalate</Button>
                    </div>
                  </div>
                )}
                {complaint.status !== 'closed' && (
                  <Button size="sm" variant="ghost" onClick={handleClose} className="text-xs w-full text-muted-foreground">
                    Close Ticket
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <ComplaintTimeline timeline={complaint.timeline} />
        )}

        {activeTab === 'response' && (
          <div className="space-y-3">
            <h4 className="text-xs font-poppins font-semibold text-muted-foreground uppercase">Compose Response</h4>
            <div className="flex gap-2 mb-2">
              <Button size="sm" variant="outline" className="text-[10px]" onClick={() => setResponse('Thank you for your feedback. We are looking into this issue and will get back to you shortly.')}>
                Template: Acknowledge
              </Button>
              <Button size="sm" variant="outline" className="text-[10px]" onClick={() => setResponse('We have resolved the issue you reported. Please let us know if you need further assistance.')}>
                Template: Resolved
              </Button>
            </div>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Type your response to the submitter..."
              className="w-full h-32 rounded-md border border-border bg-background px-3 py-2 text-sm font-lexend placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand resize-none"
            />
            <Button size="sm" onClick={handleSendResponse} disabled={!response.trim()}>
              Send Response
            </Button>
          </div>
        )}
      </div>
    </FormModal>
  );
}
