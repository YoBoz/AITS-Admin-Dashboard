export type ComplaintCategory =
  | 'trolley_fault'
  | 'navigation_error'
  | 'display_issue'
  | 'offer_dispute'
  | 'privacy'
  | 'general'
  | 'staff'
  | 'facility';

export type ComplaintStatus =
  | 'open'
  | 'in_progress'
  | 'pending_response'
  | 'resolved'
  | 'closed'
  | 'escalated';

export interface ComplaintTimelineEntry {
  action: string;
  actor: string;
  timestamp: string;
  note: string | null;
  status_change: string | null;
}

export interface Complaint {
  id: string;
  ticket_id: string;
  category: ComplaintCategory;
  subject: string;
  description: string;
  status: ComplaintStatus;
  priority: 'high' | 'medium' | 'low';
  submitted_by: { name: string; email: string; phone?: string };
  assigned_to: string | null;
  trolley_id: string | null;
  shop_id: string | null;
  attachments: number;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  resolution: string | null;
  sla_due_at: string;
  sla_breached: boolean;
  timeline: ComplaintTimelineEntry[];
  internal_notes: string;
}

export interface ComplaintFilters {
  search: string;
  status: ComplaintStatus | 'all';
  category: ComplaintCategory | 'all';
  priority: Complaint['priority'] | 'all';
  assigned_to: string | 'all';
  sla_status: 'all' | 'breached' | 'at_risk' | 'on_track';
}
