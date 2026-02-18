// ──────────────────────────────────────
// Incidents Store — Phase 8
// ──────────────────────────────────────

import { create } from 'zustand';
import type { 
  Incident, 
  IncidentFilters, 
  IncidentStatus, 
  IncidentTimelineEntry, 
  Runbook,
  IncidentType,
  IncidentSeverity,
} from '@/types/incident.types';
import { incidentsData, runbooksData } from '@/data/mock/incidents.mock';

interface IncidentsState {
  incidents: Incident[];
  runbooks: Runbook[];
  filters: IncidentFilters;
  selectedIncidentId: string | null;
  isLoading: boolean;

  // Actions
  setIncidents: (incidents: Incident[]) => void;
  addIncident: (incident: Incident) => void;
  updateIncident: (id: string, updates: Partial<Incident>) => void;
  resolveIncident: (id: string, resolutionCode: string, resolutionNotes: string) => void;
  addTimelineEntry: (incidentId: string, entry: Omit<IncidentTimelineEntry, 'id'>) => void;
  attachRunbook: (incidentId: string, runbookId: string) => void;
  completeRunbookStep: (incidentId: string, stepOrder: number) => void;
  setFilters: (filters: Partial<IncidentFilters>) => void;
  resetFilters: () => void;
  selectIncident: (id: string | null) => void;
  setLoading: (loading: boolean) => void;

  // Auto-create from alert
  autoCreateFromAlert: (alertId: string, trolleyId: string, zone: string, alertTitle: string) => Incident;

  // Create new incident from partial data
  createIncident: (data: {
    type: IncidentType;
    severity: IncidentSeverity;
    title: string;
    description: string;
    created_by: string;
  }) => Incident;

  // Derived data
  getFilteredIncidents: () => Incident[];
  getIncidentById: (id: string) => Incident | undefined;
  getRunbookForType: (type: IncidentType) => Runbook | undefined;
  
  // Stats
  openCount: () => number;
  p1ActiveCount: () => number;
  investigatingCount: () => number;
  resolvedTodayCount: () => number;
}

const defaultFilters: IncidentFilters = {
  search: '',
  severity: 'all',
  type: 'all',
  status: 'all',
  assigned_to: 'all',
  date_from: null,
  date_to: null,
};

export const useIncidentsStore = create<IncidentsState>((set, get) => ({
  incidents: incidentsData,
  runbooks: runbooksData,
  filters: { ...defaultFilters },
  selectedIncidentId: null,
  isLoading: false,

  setIncidents: (incidents) => set({ incidents }),

  addIncident: (incident) =>
    set((state) => ({ incidents: [incident, ...state.incidents] })),

  updateIncident: (id, updates) =>
    set((state) => ({
      incidents: state.incidents.map((inc) =>
        inc.id === id ? { ...inc, ...updates } : inc
      ),
    })),

  resolveIncident: (id, resolutionCode, resolutionNotes) => {
    const now = new Date().toISOString();
    set((state) => ({
      incidents: state.incidents.map((inc) =>
        inc.id === id
          ? {
              ...inc,
              status: 'resolved' as IncidentStatus,
              resolution_code: resolutionCode,
              resolution_notes: resolutionNotes,
              resolved_at: now,
              timeline: [
                ...inc.timeline,
                {
                  id: `TL-${inc.id}-${inc.timeline.length + 1}`,
                  timestamp: now,
                  actor: 'Current User',
                  action_type: 'status_change',
                  content: `Incident resolved: ${resolutionNotes}`,
                  new_status: 'resolved',
                },
              ],
            }
          : inc
      ),
    }));
  },

  addTimelineEntry: (incidentId, entry) => {
    const now = new Date().toISOString();
    set((state) => ({
      incidents: state.incidents.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              timeline: [
                ...inc.timeline,
                {
                  ...entry,
                  id: `TL-${incidentId}-${inc.timeline.length + 1}`,
                  timestamp: entry.timestamp || now,
                },
              ],
              status: entry.new_status || inc.status,
              acknowledged_at: entry.new_status === 'investigating' && !inc.acknowledged_at 
                ? now 
                : inc.acknowledged_at,
            }
          : inc
      ),
    }));
  },

  attachRunbook: (incidentId, runbookId) =>
    set((state) => ({
      incidents: state.incidents.map((inc) =>
        inc.id === incidentId ? { ...inc, runbook_id: runbookId } : inc
      ),
    })),

  completeRunbookStep: (incidentId, stepOrder) => {
    const { incidents, runbooks } = get();
    const incident = incidents.find((i) => i.id === incidentId);
    if (!incident || !incident.runbook_id) return;

    // Add timeline entry for completing runbook step
    const runbook = runbooks.find((r) => r.id === incident.runbook_id);
    const step = runbook?.steps.find((s) => s.order === stepOrder);
    
    if (step) {
      get().addTimelineEntry(incidentId, {
        timestamp: new Date().toISOString(),
        actor: 'Current User',
        action_type: 'runbook_step',
        content: `Completed runbook step: ${step.title}`,
        new_status: null,
      });
    }
  },

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  resetFilters: () => set({ filters: { ...defaultFilters } }),

  selectIncident: (id) => set({ selectedIncidentId: id }),

  setLoading: (loading) => set({ isLoading: loading }),

  createIncident: (data) => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const incidentNumber = `INC-${dateStr}-${String(get().incidents.length + 1).padStart(4, '0')}`;
    
    const newIncident: Incident = {
      id: `INC-${Date.now()}`,
      incident_number: incidentNumber,
      title: data.title,
      type: data.type,
      severity: data.severity,
      status: 'open',
      affected_devices: [],
      affected_zones: [],
      affected_gates: [],
      description: data.description,
      auto_detected: false,
      detected_at: now.toISOString(),
      acknowledged_at: null,
      resolved_at: null,
      assigned_to: null,
      resolution_code: null,
      resolution_notes: null,
      runbook_id: null,
      timeline: [
        {
          id: `TL-${Date.now()}-1`,
          timestamp: now.toISOString(),
          actor: data.created_by,
          action_type: 'status_change',
          content: 'Incident created',
          new_status: 'open',
        },
      ],
      linked_alerts: [],
      impact_summary: '',
      created_by: data.created_by,
    };

    set((state) => ({ incidents: [newIncident, ...state.incidents] }));
    return newIncident;
  },

  autoCreateFromAlert: (alertId, trolleyId, zone, alertTitle) => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const incidentNumber = `INC-${dateStr}-${String(get().incidents.length + 1).padStart(4, '0')}`;
    
    const newIncident: Incident = {
      id: `INC-AUTO-${Date.now()}`,
      incident_number: incidentNumber,
      title: `Auto-detected: ${alertTitle}`,
      type: 'battery_cluster',
      severity: 'p2_high',
      status: 'open',
      affected_devices: trolleyId ? [trolleyId] : [],
      affected_zones: zone ? [zone] : [],
      affected_gates: [],
      description: `Automatically created from alert ${alertId}. ${alertTitle}`,
      auto_detected: true,
      detected_at: now.toISOString(),
      acknowledged_at: null,
      resolved_at: null,
      assigned_to: null,
      resolution_code: null,
      resolution_notes: null,
      runbook_id: null,
      timeline: [
        {
          id: `TL-AUTO-1`,
          timestamp: now.toISOString(),
          actor: 'system',
          action_type: 'status_change',
          content: 'Incident auto-created from critical alert',
          new_status: 'open',
        },
      ],
      linked_alerts: [alertId],
      impact_summary: 'Auto-generated incident requires investigation',
      created_by: 'system',
    };

    set((state) => ({ incidents: [newIncident, ...state.incidents] }));
    return newIncident;
  },

  getFilteredIncidents: () => {
    const { incidents, filters } = get();
    return incidents.filter((inc) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesSearch =
          inc.incident_number.toLowerCase().includes(q) ||
          inc.title.toLowerCase().includes(q) ||
          inc.description.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }
      if (filters.severity !== 'all' && inc.severity !== filters.severity) return false;
      if (filters.type !== 'all' && inc.type !== filters.type) return false;
      if (filters.status !== 'all' && inc.status !== filters.status) return false;
      if (filters.assigned_to !== 'all' && inc.assigned_to !== filters.assigned_to) return false;
      
      if (filters.date_from) {
        const fromDate = new Date(filters.date_from);
        if (new Date(inc.detected_at) < fromDate) return false;
      }
      if (filters.date_to) {
        const toDate = new Date(filters.date_to);
        if (new Date(inc.detected_at) > toDate) return false;
      }
      
      return true;
    });
  },

  getIncidentById: (id) => get().incidents.find((inc) => inc.id === id),

  getRunbookForType: (type) => get().runbooks.find((r) => r.incident_type === type),

  openCount: () => get().incidents.filter((i) => i.status === 'open').length,
  
  p1ActiveCount: () =>
    get().incidents.filter(
      (i) => i.severity === 'p1_critical' && !['resolved', 'post_mortem'].includes(i.status)
    ).length,

  investigatingCount: () =>
    get().incidents.filter((i) => i.status === 'investigating').length,

  resolvedTodayCount: () => {
    const today = new Date().toISOString().slice(0, 10);
    return get().incidents.filter(
      (i) => i.status === 'resolved' && i.resolved_at?.slice(0, 10) === today
    ).length;
  },
}));
