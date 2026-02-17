import { create } from 'zustand';
import type { Complaint, ComplaintFilters, ComplaintStatus } from '@/types/complaint.types';
import { complaintsData } from '@/data/mock/complaints.mock';

interface ComplaintsState {
  complaints: Complaint[];
  filters: ComplaintFilters;
  selectedComplaint: Complaint | null;
  isLoading: boolean;

  setComplaints: (complaints: Complaint[]) => void;
  setFilters: (filters: Partial<ComplaintFilters>) => void;
  resetFilters: () => void;
  selectComplaint: (complaint: Complaint | null) => void;
  setLoading: (loading: boolean) => void;

  updateStatus: (id: string, status: ComplaintStatus, actor: string, note?: string) => void;
  assignComplaint: (id: string, assignee: string) => void;
  resolveComplaint: (id: string, actor: string, resolution: string) => void;
  escalateComplaint: (id: string, actor: string, note: string) => void;
  addTimelineEntry: (id: string, action: string, actor: string, note: string) => void;

  getFilteredComplaints: () => Complaint[];
  getStats: () => {
    total: number;
    open: number;
    in_progress: number;
    resolved: number;
    escalated: number;
    sla_breached: number;
  };
}

const defaultFilters: ComplaintFilters = {
  search: '',
  status: 'all',
  category: 'all',
  priority: 'all',
  assigned_to: 'all',
  sla_status: 'all',
};

export const useComplaintsStore = create<ComplaintsState>((set, get) => ({
  complaints: complaintsData,
  filters: { ...defaultFilters },
  selectedComplaint: null,
  isLoading: false,

  setComplaints: (complaints) => set({ complaints }),

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  resetFilters: () => set({ filters: { ...defaultFilters } }),

  selectComplaint: (complaint) => set({ selectedComplaint: complaint }),

  setLoading: (loading) => set({ isLoading: loading }),

  updateStatus: (id, status, actor, note) =>
    set((state) => ({
      complaints: state.complaints.map((c) =>
        c.id === id
          ? {
              ...c,
              status,
              updated_at: new Date().toISOString(),
              timeline: [
                ...c.timeline,
                {
                  action: `Status changed to ${status}`,
                  actor,
                  timestamp: new Date().toISOString(),
                  note: note || null,
                  status_change: status,
                },
              ],
            }
          : c
      ),
    })),

  assignComplaint: (id, assignee) =>
    set((state) => ({
      complaints: state.complaints.map((c) =>
        c.id === id
          ? {
              ...c,
              assigned_to: assignee,
              updated_at: new Date().toISOString(),
              timeline: [
                ...c.timeline,
                {
                  action: `Assigned to ${assignee}`,
                  actor: 'System',
                  timestamp: new Date().toISOString(),
                  note: null,
                  status_change: null,
                },
              ],
            }
          : c
      ),
    })),

  resolveComplaint: (id, actor, resolution) =>
    set((state) => ({
      complaints: state.complaints.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'resolved' as ComplaintStatus,
              resolution,
              resolved_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              timeline: [
                ...c.timeline,
                {
                  action: 'Complaint resolved',
                  actor,
                  timestamp: new Date().toISOString(),
                  note: resolution,
                  status_change: 'resolved',
                },
              ],
            }
          : c
      ),
    })),

  escalateComplaint: (id, actor, note) =>
    set((state) => ({
      complaints: state.complaints.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'escalated' as ComplaintStatus,
              updated_at: new Date().toISOString(),
              timeline: [
                ...c.timeline,
                {
                  action: 'Escalated to management',
                  actor,
                  timestamp: new Date().toISOString(),
                  note,
                  status_change: 'escalated',
                },
              ],
            }
          : c
      ),
    })),

  addTimelineEntry: (id, action, actor, note) =>
    set((state) => ({
      complaints: state.complaints.map((c) =>
        c.id === id
          ? {
              ...c,
              updated_at: new Date().toISOString(),
              timeline: [
                ...c.timeline,
                { action, actor, timestamp: new Date().toISOString(), note, status_change: null },
              ],
            }
          : c
      ),
    })),

  getFilteredComplaints: () => {
    const { complaints, filters } = get();
    return complaints.filter((c) => {
      if (filters.status !== 'all' && c.status !== filters.status) return false;
      if (filters.category !== 'all' && c.category !== filters.category) return false;
      if (filters.priority !== 'all' && c.priority !== filters.priority) return false;
      if (filters.assigned_to !== 'all' && c.assigned_to !== filters.assigned_to) return false;

      if (filters.sla_status !== 'all') {
        const now = new Date();
        const slaDue = new Date(c.sla_due_at);
        const hoursLeft = (slaDue.getTime() - now.getTime()) / 3600000;
        if (filters.sla_status === 'breached' && !c.sla_breached) return false;
        if (filters.sla_status === 'at_risk' && (c.sla_breached || hoursLeft > 8 || hoursLeft < 0)) return false;
        if (filters.sla_status === 'on_track' && (c.sla_breached || hoursLeft <= 8)) return false;
      }

      if (filters.search) {
        const s = filters.search.toLowerCase();
        return (
          c.ticket_id.toLowerCase().includes(s) ||
          c.subject.toLowerCase().includes(s) ||
          c.submitted_by.name.toLowerCase().includes(s) ||
          c.description.toLowerCase().includes(s)
        );
      }
      return true;
    });
  },

  getStats: () => {
    const complaints = get().complaints;
    return {
      total: complaints.length,
      open: complaints.filter((c) => c.status === 'open').length,
      in_progress: complaints.filter((c) => c.status === 'in_progress' || c.status === 'pending_response').length,
      resolved: complaints.filter((c) => c.status === 'resolved' || c.status === 'closed').length,
      escalated: complaints.filter((c) => c.status === 'escalated').length,
      sla_breached: complaints.filter((c) => c.sla_breached).length,
    };
  },
}));
