// ──────────────────────────────────────
// Incident Detail Page — Phase 8
// Single incident view with timeline & runbook
// ──────────────────────────────────────

import { useParams, useNavigate } from 'react-router-dom';
import { useIncidentsStore } from '@/store/incidents.store';
import { 
  IncidentSeverityBadge, 
  IncidentTimeline, 
  RunbookPanel 
} from '@/components/ops';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
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

  const handleStatusChange = (status: IncidentStatus) => {
    if (status === 'resolved') {
      resolveIncident(incident.id, 'resolved_manually', 'Resolved by Admin User');
    } else {
      updateIncident(incident.id, { status });
      addTimelineEntry(incident.id, {
        action_type: 'status_change',
        actor: 'Admin User',
        timestamp: new Date().toISOString(),
        content: `Status changed to ${status}`,
        new_status: status,
      });
    }
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
    setNoteText('');
    setIsNoteDialogOpen(false);
  };

  const handleAttachRunbook = (runbookId: string) => {
    attachRunbook(incident.id, runbookId);
    setCompletedSteps([]);
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
        
        <div className="flex items-center gap-2">
          <Select value={incident.status} onValueChange={(v) => handleStatusChange(v as IncidentStatus)}>
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
              {incident.status !== 'resolved' && (
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
    </div>
  );
}
