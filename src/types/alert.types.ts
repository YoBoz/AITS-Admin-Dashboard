export type AlertType =
  | 'battery_low'
  | 'offline_trolley'
  | 'hardware_fault'
  | 'system_error'
  | 'network_issue'
  | 'maintenance_due'
  | 'unusual_activity';

export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved' | 'dismissed';

export interface AlertHistoryEntry {
  action: string;
  actor: string;
  timestamp: string;
  note: string | null;
}

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
  trolley_id: string | null;
  trolley_imei: string | null;
  zone: string | null;
  status: AlertStatus;
  created_at: string;
  acknowledged_at: string | null;
  resolved_at: string | null;
  assigned_to: string | null;
  resolution_notes: string | null;
  auto_generated: boolean;
  history: AlertHistoryEntry[];
}

export interface AlertFilters {
  search: string;
  status: AlertStatus | 'all';
  severity: AlertSeverity | 'all';
  type: AlertType | 'all';
  assigned_to: string | 'all';
}
