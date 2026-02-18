import { create } from 'zustand';
import { REFUND_CONFIG } from '@/types/merchant.types';

// ─── Types ────────────────────────────────────────────────────────────
export interface RefundRequest {
  id: string;
  orderId: string;
  orderNumber: string;
  type: 'full' | 'partial';
  amount: number;
  orderTotal: number;
  currency: string;
  reason: string;
  notes: string | null;
  status: 'pending_approval' | 'approved' | 'declined';
  requestedBy: string;
  requestedAt: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  requiresOpsApproval: boolean;
}

// ─── Store ────────────────────────────────────────────────────────────
interface RefundState {
  refunds: RefundRequest[];
  threshold: number; // AED — amounts above this require ops approval

  submitRefund: (data: {
    orderId: string;
    orderNumber: string;
    type: 'full' | 'partial';
    amount: number;
    orderTotal: number;
    currency: string;
    reason: string;
    notes: string | null;
    requestedBy: string;
  }) => RefundRequest;

  approveRefund: (id: string, reviewedBy: string) => void;
  declineRefund: (id: string, reviewedBy: string) => void;
  setThreshold: (value: number) => void;
}

let nextId = 1;

// Seed some mock refunds
const seedRefunds: RefundRequest[] = [
  {
    id: 'ref-1',
    orderId: 'ord-14',
    orderNumber: 'SLP-14',
    type: 'full',
    amount: 68.50,
    orderTotal: 68.50,
    currency: 'AED',
    reason: 'Order Failed',
    notes: null,
    status: 'approved',
    requestedBy: 'manager@demo.ai-ts',
    requestedAt: '2026-02-17T10:30:00Z',
    reviewedBy: 'system',
    reviewedAt: '2026-02-17T10:30:01Z',
    requiresOpsApproval: false,
  },
  {
    id: 'ref-2',
    orderId: 'ord-15',
    orderNumber: 'SLP-15',
    type: 'partial',
    amount: 150,
    orderTotal: 220,
    currency: 'AED',
    reason: 'Wrong Item Delivered',
    notes: 'Customer received wrong sandwich',
    status: 'pending_approval',
    requestedBy: 'manager@demo.ai-ts',
    requestedAt: '2026-02-18T08:15:00Z',
    reviewedBy: null,
    reviewedAt: null,
    requiresOpsApproval: true,
  },
  {
    id: 'ref-3',
    orderId: 'ord-16',
    orderNumber: 'SLP-16',
    type: 'full',
    amount: 42,
    orderTotal: 42,
    currency: 'AED',
    reason: 'Quality Issue',
    notes: 'Cold food',
    status: 'declined',
    requestedBy: 'manager@demo.ai-ts',
    requestedAt: '2026-02-17T14:00:00Z',
    reviewedBy: 'ops@ai-ts.com',
    reviewedAt: '2026-02-17T15:00:00Z',
    requiresOpsApproval: false,
  },
];

export const useRefundStore = create<RefundState>((set, get) => ({
  refunds: seedRefunds,
  threshold: REFUND_CONFIG.opsApprovalThreshold,

  submitRefund: (data) => {
    const requiresOps = data.amount > get().threshold;
    const refund: RefundRequest = {
      id: `ref-new-${++nextId}`,
      ...data,
      status: requiresOps ? 'pending_approval' : 'approved',
      requestedAt: new Date().toISOString(),
      reviewedBy: requiresOps ? null : 'auto',
      reviewedAt: requiresOps ? null : new Date().toISOString(),
      requiresOpsApproval: requiresOps,
    };

    set((s) => ({ refunds: [refund, ...s.refunds] }));
    return refund;
  },

  approveRefund: (id, reviewedBy) =>
    set((s) => ({
      refunds: s.refunds.map((r) =>
        r.id === id
          ? { ...r, status: 'approved' as const, reviewedBy, reviewedAt: new Date().toISOString() }
          : r
      ),
    })),

  declineRefund: (id, reviewedBy) =>
    set((s) => ({
      refunds: s.refunds.map((r) =>
        r.id === id
          ? { ...r, status: 'declined' as const, reviewedBy, reviewedAt: new Date().toISOString() }
          : r
      ),
    })),

  setThreshold: (value) => set({ threshold: value }),
}));
