export interface ReasonCode {
  code: string;
  label: string;
  requires_notes: boolean;
}

export const reasonCodes = {
  merchant_reject: [
    { code: 'out_of_stock', label: 'Out of Stock', requires_notes: false },
    { code: 'too_busy', label: 'Too Busy / Capacity Exceeded', requires_notes: false },
    { code: 'item_unavailable', label: 'Item Unavailable', requires_notes: false },
    { code: 'system_issue', label: 'System Issue', requires_notes: true },
    { code: 'other', label: 'Other', requires_notes: true },
  ],
  runner_fail: [
    { code: 'passenger_not_found', label: 'Passenger Not Found', requires_notes: false },
    { code: 'gate_closed', label: 'Gate Closed / Security Restriction', requires_notes: false },
    { code: 'gate_changed_timeout', label: 'Gate Changed and Time Exceeded', requires_notes: false },
    { code: 'handoff_verification_failed', label: 'Could Not Verify Handoff', requires_notes: true },
    { code: 'other', label: 'Other', requires_notes: true },
  ],
  ops_override: [
    { code: 'sla_breach_mitigation', label: 'SLA Breach Mitigation', requires_notes: true },
    { code: 'safety_risk', label: 'Safety Risk', requires_notes: true },
    { code: 'incorrect_merchant_action', label: 'Incorrect Merchant Action', requires_notes: true },
    { code: 'runner_availability', label: 'Runner Availability Issue', requires_notes: false },
    { code: 'customer_recovery', label: 'Customer Experience Recovery', requires_notes: true },
    { code: 'manual_correction', label: 'Manual Correction', requires_notes: true },
    { code: 'other', label: 'Other', requires_notes: true },
  ],
  refund_reasons: [
    { code: 'order_failed', label: 'Order Failed', requires_notes: false },
    { code: 'merchant_rejected', label: 'Merchant Rejected', requires_notes: false },
    { code: 'delay_beyond_threshold', label: 'Delay Beyond Threshold', requires_notes: false },
    { code: 'wrong_item', label: 'Wrong Item Delivered', requires_notes: true },
    { code: 'quality_issue', label: 'Quality Issue', requires_notes: true },
    { code: 'ops_goodwill', label: 'Ops Goodwill Gesture', requires_notes: true },
    { code: 'other', label: 'Other', requires_notes: true },
  ],
} as const;

export type ReasonCodeType = keyof typeof reasonCodes;
