import { create } from 'zustand';
import type { MerchantAuditEntry, MerchantAuditEventType } from '@/types/merchant.types';

interface MerchantAuditState {
  entries: MerchantAuditEntry[];
  addEntry: (event: {
    eventType: MerchantAuditEventType;
    actorName: string;
    actorRole: string;
    metadata?: Record<string, unknown>;
  }) => void;
  getFiltered: (filters: {
    staffName?: string;
    actionType?: MerchantAuditEventType;
    startDate?: Date;
    endDate?: Date;
  }) => MerchantAuditEntry[];
  clear: () => void;
}

export const useMerchantAuditStore = create<MerchantAuditState>((set, get) => ({
  entries: [],

  addEntry: (event) => {
    const entry: MerchantAuditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      eventType: event.eventType,
      actorName: event.actorName,
      actorRole: event.actorRole,
      timestamp: new Date().toISOString(),
      metadata: event.metadata ?? {},
    };
    set((state) => ({ entries: [entry, ...state.entries] }));
  },

  getFiltered: (filters) => {
    const { entries } = get();
    return entries.filter((e) => {
      if (filters.staffName && !e.actorName.toLowerCase().includes(filters.staffName.toLowerCase())) {
        return false;
      }
      if (filters.actionType && e.eventType !== filters.actionType) {
        return false;
      }
      if (filters.startDate && new Date(e.timestamp) < filters.startDate) {
        return false;
      }
      if (filters.endDate && new Date(e.timestamp) > filters.endDate) {
        return false;
      }
      return true;
    });
  },

  clear: () => set({ entries: [] }),
}));
