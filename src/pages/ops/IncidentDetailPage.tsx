// ──────────────────────────────────────
// Incident Detail Page — Phase 8
// Single incident view with timeline & runbook
// ──────────────────────────────────────

import { useParams, useNavigate } from 'react-router-dom';
import { useIncidentsStore } from '@/store/incidents.store';
import { usePermissionsStore } from '@/store/permissions.store';
import { usePermissions } from '@/hooks/usePermissions';
import { 
  IncidentSeverityBadge, 
  IncidentTimeline, 
  RunbookPanel 
} from '@/components/ops';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Label } from '@/components/ui/Label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { Textarea } from '@/components/ui/Textarea';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  MapPin,
  ShoppingCart,
  FileText,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useState } from 'react';
import { IncidentStatus } from '@/types/incident.types';
import { cn } from '@/lib/utils';
import { UserCheck } from 'lucide-react';

/** Resolution reason codes for closing incidents */
const RESOLUTION_CODES = [
  { code: 'resolved_manually', label: 'Resolved Manually' },
  { code: 'auto_resolved', label: 'Auto-Resolved' },
  { code: 'false_positive', label: 'False Positive' },
  { code: 'escalated', label: 'Escalated to Engineering' },
  { code: 'workaround_applied', label: 'Workaround Applied' },
  { code: 'duplicate', label: 'Duplicate Incident' },
  { code: 'no_action_needed', label: 'No Action Needed' },
  { code: 'other', label: 'Other' },
];

const AVAILABLE_OPERATORS = [
  'Ahmed K.', 'Sara M.', 'Youssef R.', 'Layla T.', 'Omar H.',
];

function getStatusColor(status: IncidentStatus) {
  switch (status) {
    case 'open': return 'bg-amber-500/20 text-amber-500';
    case 'investigating': return 'bg-blue-500/20 text-blue-500';
    case 'resolved': return 'bg-emerald-500/20 text-emerald-500';
    default: return 'bg-gray-500/20 text-gray-500';
  }
}

export default function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    incidents, 
    runbooks,
    updateIncident, 
    resolveIncident,
    addTimelineEntry,
    attachRunbook,
  } = useIncidentsStore();
  
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [resolveCode, setResolveCode] = useState('');
  const [resolveNotes, setResolveNotes] = useState('');
  const [pendingStatus, setPendingStatus] = useState<IncidentStatus | null>(null);

  const { can } = usePermissions();

  const incident = incidents.find(i => i.id === id);

  if (!incident) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Incident Not Found</h2>
        <p className="text-muted-foreground mb-4">The incident you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/dashboard/alerts?tab=incidents')}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Incidents
        </Button>
      </div>
    );
  }

  const attachedRunbook = incident.runbook_id 
    ? runbooks.find(r => r.id === incident.runbook_id) 
    : null;

  /** Helper to create an audit entry for incident actions */
  const logAudit = (action: string, changes: { field: string; from: string; to: string }[] | null) => {
    const { addAuditEntry } = usePermissionsStore.getState();
    addAuditEntry({
      id: `audit-${Date.now()}`,
      actor_id: 'admin-001',
      actor_name: 'Admin User',
      actor_role: 'ops_manager',
      action,
      resource_type: 'incident',
      resource_id: incident.id,
      resource_label: incident.title,
      changes,
      ip_address: '10.0.0.1',
      timestamp: new Date().toISOString(),
      result: 'success',
    });
  };

  const handleStatusChange = (status: IncidentStatus) => {
    // For resolved / closed, require resolution code via dialog
    if (status === 'resolved' || status === 'closed') {
      setPendingStatus(status);
      setIsResolveDialogOpen(true);
      return;
    }
    const prev = incident.status;
    updateIncident(incident.id, { status });
    addTimelineEntry(incident.id, {
      action_type: 'status_change',
      actor: 'Admin User',
      timestamp: new Date().toISOString(),
      content: `Status changed to ${status}`,
      new_status: status,
    });
    logAudit('incident:status_change', [{ field: 'status', from: prev, to: status }]);
  };

  const handleResolveConfirm = () => {
    if (!resolveCode || !pendingStatus) return;
    const prev = incident.status;
    resolveIncident(incident.id, resolveCode, resolveNotes || `Resolved by Admin User`);
    addTimelineEntry(incident.id, {
      action_type: 'status_change',
      actor: 'Admin User',
      timestamp: new Date().toISOString(),
      content: `${pendingStatus === 'closed' ? 'Closed' : 'Resolved'} — ${RESOLUTION_CODES.find(c => c.code === resolveCode)?.label ?? resolveCode}${resolveNotes ? ` — ${resolveNotes}` : ''}`,
      new_status: pendingStatus,
    });
    logAudit(`incident:${pendingStatus}`, [
      { field: 'status', from: prev, to: pendingStatus },
      { field: 'resolution_code', from: '', to: resolveCode },
    ]);
    setIsResolveDialogOpen(false);
    setResolveCode('');
    setResolveNotes('');
    setPendingStatus(null);
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addTimelineEntry(incident.id, {
      action_type: 'note_added',
      actor: 'Admin User',
      timestamp: new Date().toISOString(),
      content: noteText,
      new_status: null,
    });
    logAudit('incident:note_added', null);
    setNoteText('');
    setIsNoteDialogOpen(false);
  };

  const handleAttachRunbook = (runbookId: string) => {
    attachRunbook(incident.id, runbookId);
    setCompletedSteps([]);
    logAudit('incident:runbook_attached', [{ field: 'runbook_id', from: '', to: runbookId }]);
  };

  const handleCompleteStep = (stepOrder: number) => {
    setCompletedSteps([...completedSteps, stepOrder]);
    addTimelineEntry(incident.id, {
      action_type: 'runbook_step',
      actor: 'Admin User',
      timestamp: new Date().toISOString(),
      content: `Completed runbook step ${stepOrder}`,
      new_status: null,
    });
  };

  const handleAssignOperator = (operator: string) => {
    const prev = incident.assigned_to || 'unassigned';
    updateIncident(incident.id, { assigned_to: operator });
    addTimelineEntry(incident.id, {
      action_type: 'status_change',
      actor: 'Admin User',
      timestamp: new Date().toISOString(),
      content: `Assigned to ${operator}`,
      new_status: null,
    });
    logAudit('incident:assign_operator', [{ field: 'assigned_to', from: prev, to: operator }]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <Button 
            variant="ghost" 
            className="mb-2 -ml-2"
            onClick={() => navigate('/dashboard/alerts?tab=incidents')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Incidents
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <IncidentSeverityBadge severity={incident.severity} />
            <Badge className={cn('capitalize', getStatusColor(incident.status))}>
              {incident.status}
            </Badge>
          </div>
          
          <h1 className="text-2xl font-bold">{incident.title}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {incident.description}
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={incident.status} onValueChange={(v) => handleStatusChange(v as IncidentStatus)} disabled={!can('incidents.manage')}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={incident.assigned_to || ''} onValueChange={handleAssignOperator} disabled={!can('incidents.manage')}>
            <SelectTrigger className="w-44">
              <div className="flex items-center gap-1">
                <UserCheck className="h-3.5 w-3.5" />
                <SelectValue placeholder="Assign Operator" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_OPERATORS.map(op => (
                <SelectItem key={op} value={op}>{op}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-1" />
                Add Note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Note</DialogTitle>
                <DialogDescription>
                  Add a note or update to this incident
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Textarea
                  placeholder="Enter your note..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={4}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNoteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddNote} disabled={!noteText.trim()}>
                  Add Note
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Incident Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Type</p>
                  <p className="font-medium text-sm capitalize">{incident.type.replace('-', ' ')}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Reported</p>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <p className="font-medium text-sm">
                      {formatDistanceToNow(new Date(incident.detected_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Reported By</p>
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <p className="font-medium text-sm">{incident.created_by}</p>
                  </div>
                </div>
                {incident.assigned_to && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Assigned To</p>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <p className="font-medium text-sm">{incident.assigned_to}</p>
                    </div>
                  </div>
                )}
                {incident.affected_zones[0] && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Zone</p>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <p className="font-medium text-sm">{incident.affected_zones[0]}</p>
                    </div>
                  </div>
                )}
                {incident.affected_devices[0] && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Device</p>
                    <div className="flex items-center gap-1">
                      <ShoppingCart className="h-3 w-3 text-muted-foreground" />
                      <p className="font-medium text-sm">{incident.affected_devices[0]}</p>
                    </div>
                  </div>
                )}
                {incident.resolved_at && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Resolved</p>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-emerald-500" />
                      <p className="font-medium text-sm">
                        {format(new Date(incident.resolved_at), 'MMM d, HH:mm')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Activity Timeline</CardTitle>
              <CardDescription>
                {incident.timeline.length} events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IncidentTimeline entries={incident.timeline} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Runbook */}
        <div className="space-y-6">
          {/* Runbook Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Runbook
              </CardTitle>
              <CardDescription>
                {attachedRunbook 
                  ? 'Follow the steps below to resolve'
                  : 'Attach a runbook to guide resolution'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {attachedRunbook ? (
                <RunbookPanel
                  runbook={attachedRunbook}
                  completedStepOrders={completedSteps}
                  onCompleteStep={handleCompleteStep}
                />
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Select a runbook to attach:
                  </p>
                  {runbooks.map((runbook) => (
                    <Button
                      key={runbook.id}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAttachRunbook(runbook.id)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {runbook.name}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {incident.affected_devices[0] && (
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  View Device
                </Button>
              )}
              {incident.affected_zones[0] && (
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="h-4 w-4 mr-2" />
                  View Zone on Map
                </Button>
              )}
              {incident.status !== 'resolved' && can('incidents.manage') && (
                <Button 
                  className="w-full" 
                  onClick={() => handleStatusChange('resolved')}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Resolved
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Resolve / Close Dialog with mandatory reason code */}
      <Dialog open={isResolveDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsResolveDialogOpen(false);
          setResolveCode('');
          setResolveNotes('');
          setPendingStatus(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              {pendingStatus === 'closed' ? 'Close Incident' : 'Resolve Incident'}
            </DialogTitle>
            <DialogDescription>
              Select a resolution code. This action will be logged in the audit trail.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Resolution Code <span className="text-destructive">*</span></Label>
              <Select value={resolveCode} onValueChange={setResolveCode}>
                <SelectTrigger>
                  <SelectValue placeholder="Select resolution code..." />
                </SelectTrigger>
                <SelectContent>
                  {RESOLUTION_CODES.map(rc => (
                    <SelectItem key={rc.code} value={rc.code}>{rc.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea
                placeholder="Additional resolution notes..."
                value={resolveNotes}
                onChange={(e) => setResolveNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsResolveDialogOpen(false); setPendingStatus(null); }}>
              Cancel
            </Button>
            <Button onClick={handleResolveConfirm} disabled={!resolveCode}>
              {pendingStatus === 'closed' ? 'Close Incident' : 'Resolve Incident'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
