// ──────────────────────────────────────
// Compliance Store — Phase 9
// ──────────────────────────────────────

import { create } from 'zustand';
import type {
  ConsentRecord,
  QuarantinedDevice,
  DSARRequest,
  ImmutableAuditEntry,
  PaymentComplianceBoundary,
  DSARTimelineEntry,
} from '@/types/compliance.types';
import {
  consentRecordsData,
  quarantinedDevicesData,
  dsarRequestsData,
  immutableAuditLogData,
  paymentBoundariesData,
} from '@/data/mock/compliance.mock';

interface ComplianceState {
  consentRecords: ConsentRecord[];
  quarantinedDevices: QuarantinedDevice[];
  dsarRequests: DSARRequest[];
  immutableAuditLog: ImmutableAuditEntry[];
  paymentBoundaries: PaymentComplianceBoundary[];

  // Actions
  addConsentRecord: (record: ConsentRecord) => void;
  quarantineDevice: (device: QuarantinedDevice) => void;
  clearQuarantine: (deviceId: string, clearedBy: string, notes: string) => void;
  createDSAR: (request: DSARRequest) => void;
  updateDSARStatus: (id: string, status: DSARRequest['status'], notes?: string, assignedTo?: string) => void;
  addDSARTimelineEntry: (dsarId: string, entry: DSARTimelineEntry) => void;
  addImmutableEntry: (entry: ImmutableAuditEntry) => void;
  updatePaymentBoundary: (id: string, updates: Partial<PaymentComplianceBoundary>) => void;
}

export const useComplianceStore = create<ComplianceState>((set) => ({
  consentRecords: consentRecordsData,
  quarantinedDevices: quarantinedDevicesData,
  dsarRequests: dsarRequestsData,
  immutableAuditLog: immutableAuditLogData,
  paymentBoundaries: paymentBoundariesData,

  addConsentRecord: (record) =>
    set((state) => ({ consentRecords: [record, ...state.consentRecords] })),

  quarantineDevice: (device) =>
    set((state) => ({ quarantinedDevices: [device, ...state.quarantinedDevices] })),

  clearQuarantine: (deviceId, clearedBy, notes) =>
    set((state) => ({
      quarantinedDevices: state.quarantinedDevices.map((d) =>
        d.device_id === deviceId
          ? {
              ...d,
              status: 'cleared' as const,
              cleared_at: new Date().toISOString(),
              cleared_by: clearedBy,
              clearance_notes: notes,
            }
          : d,
      ),
    })),

  createDSAR: (request) =>
    set((state) => ({ dsarRequests: [request, ...state.dsarRequests] })),

  updateDSARStatus: (id, status, notes, assignedTo) =>
    set((state) => ({
      dsarRequests: state.dsarRequests.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              ...(notes !== undefined ? { response_notes: notes } : {}),
              ...(assignedTo !== undefined ? { assigned_to: assignedTo } : {}),
              ...(status === 'completed' ? { completed_at: new Date().toISOString() } : {}),
            }
          : r,
      ),
    })),

  addDSARTimelineEntry: (dsarId, entry) =>
    set((state) => ({
      dsarRequests: state.dsarRequests.map((r) =>
        r.id === dsarId ? { ...r, timeline: [...r.timeline, entry] } : r,
      ),
    })),

  addImmutableEntry: (entry) =>
    set((state) => ({ immutableAuditLog: [...state.immutableAuditLog, entry] })),

  updatePaymentBoundary: (id, updates) =>
    set((state) => ({
      paymentBoundaries: state.paymentBoundaries.map((b) =>
        b.id === id ? { ...b, ...updates, last_updated: new Date().toISOString() } : b,
      ),
    })),
}));
