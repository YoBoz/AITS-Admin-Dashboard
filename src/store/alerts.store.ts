import { create } from 'zustand';
import type { Alert, AlertFilters, AlertStatus } from '@/types/alert.types';
import { alertsData } from '@/data/mock/alerts.mock';

interface AlertsState {
  alerts: Alert[];
  filters: AlertFilters;
  selectedAlert: Alert | null;
  isLoading: boolean;

  setAlerts: (alerts: Alert[]) => void;
  setFilters: (filters: Partial<AlertFilters>) => void;
  resetFilters: () => void;
  selectAlert: (alert: Alert | null) => void;
  setLoading: (loading: boolean) => void;

  acknowledgeAlert: (id: string, actor: string) => void;
  resolveAlert: (id: string, actor: string, notes: string) => void;
  dismissAlert: (id: string, actor: string) => void;
  assignAlert: (id: string, assignee: string) => void;
  bulkUpdateStatus: (ids: string[], status: AlertStatus) => void;

  getFilteredAlerts: () => Alert[];
  getStats: () => { total: number; critical: number; warnings: number; resolved: number };
}

const defaultFilters: AlertFilters = {
  search: '',
  status: 'all',
  severity: 'all',
  type: 'all',
  assigned_to: 'all',
};

function addHistoryEntry(alert: Alert, action: string, actor: string, note: string | null): Alert {
  return {
    ...alert,
    history: [...alert.history, { action, actor, timestamp: new Date().toISOString(), note }],
  };
}

export const useAlertsStore = create<AlertsState>((set, get) => ({
  alerts: alertsData,
  filters: { ...defaultFilters },
  selectedAlert: null,
  isLoading: false,

  setAlerts: (alerts) => set({ alerts }),

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  resetFilters: () => set({ filters: { ...defaultFilters } }),

  selectAlert: (alert) => set({ selectedAlert: alert }),

  setLoading: (loading) => set({ isLoading: loading }),

  acknowledgeAlert: (id, actor) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === id
          ? addHistoryEntry(
              { ...a, status: 'acknowledged', acknowledged_at: new Date().toISOString(), assigned_to: a.assigned_to || actor },
              'acknowledged',
              actor,
              'Alert acknowledged.',
            )
          : a
      ),
    })),

  resolveAlert: (id, actor, notes) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === id
          ? addHistoryEntry(
              { ...a, status: 'resolved', resolved_at: new Date().toISOString(), resolution_notes: notes },
              'resolved',
              actor,
              notes,
            )
          : a
      ),
    })),

  dismissAlert: (id, actor) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === id
          ? addHistoryEntry({ ...a, status: 'dismissed' }, 'dismissed', actor, 'Alert dismissed.')
          : a
      ),
    })),

  assignAlert: (id, assignee) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === id
          ? addHistoryEntry({ ...a, assigned_to: assignee }, 'assigned', 'system', `Assigned to ${assignee}.`)
          : a
      ),
    })),

  bulkUpdateStatus: (ids, status) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        ids.includes(a.id)
          ? addHistoryEntry({ ...a, status }, 'bulk_update', 'system', `Status changed to ${status}.`)
          : a
      ),
    })),

  getFilteredAlerts: () => {
    const { alerts, filters } = get();
    return alerts.filter((a) => {
      if (filters.status !== 'all' && a.status !== filters.status) return false;
      if (filters.severity !== 'all' && a.severity !== filters.severity) return false;
      if (filters.type !== 'all' && a.type !== filters.type) return false;
      if (filters.assigned_to !== 'all' && a.assigned_to !== filters.assigned_to) return false;
      if (filters.search) {
        const s = filters.search.toLowerCase();
        return (
          a.title.toLowerCase().includes(s) ||
          a.description.toLowerCase().includes(s) ||
          (a.trolley_id?.toLowerCase().includes(s) ?? false)
        );
      }
      return true;
    });
  },

  getStats: () => {
    const alerts = get().alerts;
    return {
      total: alerts.length,
      critical: alerts.filter((a) => a.severity === 'critical' && a.status === 'active').length,
      warnings: alerts.filter((a) => a.severity === 'warning' && a.status === 'active').length,
      resolved: alerts.filter((a) => a.status === 'resolved').length,
    };
  },
}));
