// ──────────────────────────────────────
// Incidents Page — Phase 8
// Incident list with filters and management
// ──────────────────────────────────────

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncidentsStore } from '@/store/incidents.store';
import { IncidentCard } from '@/components/ops';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
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
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { 
  AlertTriangle, 
  Search, 
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { IncidentSeverity, IncidentStatus, IncidentType } from '@/types/incident.types';

export default function IncidentsPage() {
  const navigate = useNavigate();
  const { 
    incidents, 
    filters, 
    setFilters, 
    createIncident 
  } = useIncidentsStore();
  
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newIncident, setNewIncident] = useState({
    type: 'device-stuck' as IncidentType,
    severity: 'medium' as IncidentSeverity,
    title: '',
    description: '',
    zone: '',
  });

  // Filter incidents
  const filteredIncidents = incidents.filter((incident) => {
    if (search && !incident.title.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (filters.severity && incident.severity !== filters.severity) {
      return false;
    }
    if (filters.status && incident.status !== filters.status) {
      return false;
    }
    if (filters.type && incident.type !== filters.type) {
      return false;
    }
    return true;
  });

  // Stats
  const openIncidents = incidents.filter(i => i.status === 'open').length;
  const inProgressIncidents = incidents.filter(i => i.status === 'investigating').length;
  const resolvedToday = incidents.filter(i => {
    if (i.status !== 'resolved' || !i.resolved_at) return false;
    const today = new Date();
    const resolved = new Date(i.resolved_at);
    return resolved.toDateString() === today.toDateString();
  }).length;
  const criticalCount = incidents.filter(i => i.severity === 'p1_critical' && i.status !== 'resolved').length;

  const handleCreateIncident = () => {
    createIncident({
      type: newIncident.type as IncidentType,
      severity: newIncident.severity as IncidentSeverity,
      title: newIncident.title,
      description: newIncident.description,
      created_by: 'Admin User',
    });
    setIsCreateOpen(false);
    setNewIncident({
      type: 'device_stuck',
      severity: 'p3_medium',
      title: '',
      description: '',
      zone: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-primary" />
            Incidents
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track and manage operational incidents
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              Create Incident
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Incident</DialogTitle>
              <DialogDescription>
                Report a new operational incident for tracking
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="Brief incident description"
                  value={newIncident.title}
                  onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select 
                    value={newIncident.type} 
                    onValueChange={(v) => setNewIncident({ ...newIncident, type: v as IncidentType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zone-breach">Zone Breach</SelectItem>
                      <SelectItem value="device-stuck">Device Stuck</SelectItem>
                      <SelectItem value="kiosk-crash">Kiosk Crash</SelectItem>
                      <SelectItem value="network-outage">Network Outage</SelectItem>
                      <SelectItem value="battery-cluster">Battery Cluster</SelectItem>
                      <SelectItem value="security-alert">Security Alert</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Severity</Label>
                  <Select 
                    value={newIncident.severity} 
                    onValueChange={(v) => setNewIncident({ ...newIncident, severity: v as IncidentSeverity })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Zone (optional)</Label>
                <Input
                  placeholder="e.g., Gate A1, Terminal 2"
                  value={newIncident.zone}
                  onChange={(e) => setNewIncident({ ...newIncident, zone: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Detailed description of the incident..."
                  value={newIncident.description}
                  onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateIncident} disabled={!newIncident.title}>
                Create Incident
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setFilters({ status: 'open' })}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <AlertCircle className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{openIncidents}</p>
                <p className="text-xs text-muted-foreground">Open</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setFilters({ status: 'investigating' })}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inProgressIncidents}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setFilters({ severity: 'p1_critical' })}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{criticalCount}</p>
                <p className="text-xs text-muted-foreground">Critical</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{resolvedToday}</p>
                <p className="text-xs text-muted-foreground">Resolved Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search incidents..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <Select 
              value={filters.severity || 'all'} 
              onValueChange={(v) => setFilters({ severity: v === 'all' ? undefined : v as IncidentSeverity })}
            >
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="p1_critical">P1 Critical</SelectItem>
                <SelectItem value="p2_high">P2 High</SelectItem>
                <SelectItem value="p3_medium">P3 Medium</SelectItem>
                <SelectItem value="p4_low">P4 Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={filters.status || 'all'} 
              onValueChange={(v) => setFilters({ status: v === 'all' ? undefined : v as IncidentStatus })}
            >
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="mitigating">Mitigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="post_mortem">Post-Mortem</SelectItem>
              </SelectContent>
            </Select>
            
            {(filters.severity || filters.status || filters.type) && (
              <Button variant="ghost" onClick={() => setFilters({})}>
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Incident List */}
      <div className="space-y-4">
        {filteredIncidents.map((incident) => (
          <IncidentCard
            key={incident.id}
            incident={incident}
            onClick={() => navigate(`/dashboard/ops/incidents/${incident.id}`)}
          />
        ))}
        
        {filteredIncidents.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-1">No incidents found</h3>
              <p className="text-sm text-muted-foreground">
                {search || filters.severity || filters.status
                  ? 'Try adjusting your filters'
                  : 'No incidents have been reported'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
