// ──────────────────────────────────────
// Incidents Mock Data — Phase 8
// ──────────────────────────────────────

import type { Incident, Runbook, IncidentSeverity, IncidentType, IncidentStatus, IncidentTimelineEntry } from '@/types/incident.types';

// ─── Runbook Definitions ───────────────────────────────────────────────────

export const runbooksData: Runbook[] = [
  {
    id: 'RB-001',
    name: 'Zone Breach Response',
    incident_type: 'zone_breach',
    estimated_resolution_minutes: 30,
    steps: [
      { order: 1, title: 'Identify breaching device', description: 'Identify breaching device IMEI from alert. Navigate to Live Fleet and locate device.', action_type: 'check', is_completed: false },
      { order: 2, title: 'Check confidence level', description: 'Check device confidence level. If < 0.3: possible positioning error - do not lock yet.', action_type: 'check', is_completed: false },
      { order: 3, title: 'Issue LOCK command', description: 'If confidence > 0.3 and device is in restricted zone: issue LOCK command via Device Actions.', action_type: 'command', is_completed: false },
      { order: 4, title: 'Create incident log', description: 'Create incident, log device IMEI, zone, and time of breach.', action_type: 'check', is_completed: false },
      { order: 5, title: 'Notify security', description: 'Notify on-site security team via radio (out of band).', action_type: 'notify', is_completed: false },
      { order: 6, title: 'Monitor device', description: 'Monitor device for 5 minutes. If device moves out: unlock. If stays: escalate to P1.', action_type: 'wait', is_completed: false },
      { order: 7, title: 'Document and resolve', description: 'Document outcome in incident timeline and resolve.', action_type: 'check', is_completed: false },
    ],
  },
  {
    id: 'RB-002',
    name: 'Device Stuck / Not Moving',
    incident_type: 'device_stuck',
    estimated_resolution_minutes: 45,
    steps: [
      { order: 1, title: 'Check last seen timestamp', description: 'Check last seen timestamp. If > 10 min and battery > 20%: likely physically stuck.', action_type: 'check', is_completed: false },
      { order: 2, title: 'Check zone priority', description: 'Check zone. If in corridor: may be blocking passenger flow - prioritize.', action_type: 'check', is_completed: false },
      { order: 3, title: 'Attempt remote reboot', description: 'Attempt remote reboot via Device Actions > Reboot.', action_type: 'command', is_completed: false },
      { order: 4, title: 'Dispatch maintenance runner', description: 'If reboot fails or not possible: dispatch maintenance runner to physical location.', action_type: 'notify', is_completed: false },
      { order: 5, title: 'Mark device as maintenance', description: "While runner dispatched: mark device as 'maintenance' to remove from active fleet.", action_type: 'command', is_completed: false },
      { order: 6, title: 'Confirm physical status', description: 'Runner confirms physical status. Document in incident notes.', action_type: 'check', is_completed: false },
      { order: 7, title: 'Resolve or escalate', description: 'If device recovered: unmark maintenance. If hardware fault: escalate to P2 and schedule repair.', action_type: 'escalate', is_completed: false },
    ],
  },
  {
    id: 'RB-003',
    name: 'Kiosk App Crash',
    incident_type: 'kiosk_crash',
    estimated_resolution_minutes: 30,
    steps: [
      { order: 1, title: 'Identify affected device', description: 'Identify affected device IMEI from crash alert.', action_type: 'check', is_completed: false },
      { order: 2, title: 'Attempt remote restart', description: 'Attempt remote app update/restart via Device Actions > Update App.', action_type: 'command', is_completed: false },
      { order: 3, title: 'Monitor for stability', description: 'If restart resolves: monitor for 10 minutes. If no further crashes: resolve incident.', action_type: 'wait', is_completed: false },
      { order: 4, title: 'Collect crash logs', description: 'If crash persists: collect crash logs (note: log collection is out-of-band in backend).', action_type: 'check', is_completed: false },
      { order: 5, title: 'Check for pattern', description: 'Escalate to P2 if 3+ devices experiencing same crash pattern (potential software regression).', action_type: 'escalate', is_completed: false },
      { order: 6, title: 'Apply workaround', description: "Temporary workaround: mark affected devices as 'maintenance' until patch deployed.", action_type: 'command', is_completed: false },
      { order: 7, title: 'Coordinate patch', description: 'Coordinate with dev team for emergency patch if cluster of crashes.', action_type: 'notify', is_completed: false },
    ],
  },
  {
    id: 'RB-004',
    name: 'Network Outage Response',
    incident_type: 'network_outage',
    estimated_resolution_minutes: 60,
    steps: [
      { order: 1, title: 'Identify affected area', description: 'Identify affected zone/floor from offline cluster on Live Fleet map.', action_type: 'check', is_completed: false },
      { order: 2, title: 'Assess scope', description: 'Check if outage is localized (single zone) or widespread (multiple zones).', action_type: 'check', is_completed: false },
      { order: 3, title: 'Contact IT', description: 'Contact IT/networking team immediately if widespread.', action_type: 'notify', is_completed: false },
      { order: 4, title: 'Check AP status', description: 'For localized: check AP status (out of band - via network console).', action_type: 'check', is_completed: false },
      { order: 5, title: 'Wait for recovery', description: 'Devices will resume connectivity when network restored. No device actions needed.', action_type: 'wait', is_completed: false },
      { order: 6, title: 'Monitor fleet', description: 'Monitor via Live Fleet until devices come back online.', action_type: 'check', is_completed: false },
      { order: 7, title: 'Document outage', description: 'Document outage duration and affected device count in incident.', action_type: 'check', is_completed: false },
    ],
  },
  {
    id: 'RB-005',
    name: 'Battery Cluster Low Alert',
    incident_type: 'battery_cluster',
    estimated_resolution_minutes: 40,
    steps: [
      { order: 1, title: 'Identify affected devices', description: 'Identify how many devices are below 10% and in which zones.', action_type: 'check', is_completed: false },
      { order: 2, title: 'Prioritize zones', description: 'Prioritize devices in high-traffic zones (Food Court, Duty Free) for immediate charging.', action_type: 'check', is_completed: false },
      { order: 3, title: 'Send return commands', description: 'Send lock + return-to-dock commands to affected devices via bulk Device Actions.', action_type: 'command', is_completed: false },
      { order: 4, title: 'Alert maintenance', description: 'Alert maintenance team to escort devices to charging station if they cannot move.', action_type: 'notify', is_completed: false },
      { order: 5, title: 'Monitor battery levels', description: 'Monitor battery levels in Health Monitor page.', action_type: 'check', is_completed: false },
      { order: 6, title: 'Review schedule', description: 'Set a reminder note in incident to review fleet charging schedule.', action_type: 'check', is_completed: false },
    ],
  },
];

// ─── Helper Functions ──────────────────────────────────────────────────────

function generateIncidentNumber(index: number, date: Date): string {
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  return `INC-${dateStr}-${String(index + 1).padStart(4, '0')}`;
}

function pastDate(hoursAgo: number): Date {
  const d = new Date();
  d.setHours(d.getHours() - hoursAgo);
  return d;
}

const operators = ['Ahmed Al-Farsi', 'Sara Khalil', 'John Mitchell', 'Fatima Ben Ali', 'Omar Hassan'];
const zones = ['checkin', 'security', 'duty_free', 'food_court', 'gates_a', 'gates_b', 'lounge_a', 'main_retail'];
const gates = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8'];

function generateTimeline(
  status: IncidentStatus,
  createdAt: Date,
  actor: string,
  seed: number
): IncidentTimelineEntry[] {
  const entries: IncidentTimelineEntry[] = [
    {
      id: `TL-${seed}-1`,
      timestamp: createdAt.toISOString(),
      actor: 'system',
      action_type: 'status_change',
      content: 'Incident created and status set to Open',
      new_status: 'open',
    },
  ];

  if (status !== 'open') {
    entries.push({
      id: `TL-${seed}-2`,
      timestamp: new Date(createdAt.getTime() + 5 * 60000).toISOString(),
      actor,
      action_type: 'assigned',
      content: `Incident assigned to ${actor}`,
      new_status: null,
    });

    entries.push({
      id: `TL-${seed}-3`,
      timestamp: new Date(createdAt.getTime() + 8 * 60000).toISOString(),
      actor,
      action_type: 'status_change',
      content: 'Started investigation',
      new_status: 'investigating',
    });
  }

  if (status === 'mitigating' || status === 'resolved' || status === 'post_mortem') {
    entries.push({
      id: `TL-${seed}-4`,
      timestamp: new Date(createdAt.getTime() + 20 * 60000).toISOString(),
      actor,
      action_type: 'note_added',
      content: 'Root cause identified. Implementing fix.',
      new_status: null,
    });

    entries.push({
      id: `TL-${seed}-5`,
      timestamp: new Date(createdAt.getTime() + 25 * 60000).toISOString(),
      actor,
      action_type: 'status_change',
      content: 'Moving to mitigation phase',
      new_status: 'mitigating',
    });
  }

  if (status === 'resolved' || status === 'post_mortem') {
    entries.push({
      id: `TL-${seed}-6`,
      timestamp: new Date(createdAt.getTime() + 45 * 60000).toISOString(),
      actor,
      action_type: 'device_action',
      content: 'Applied fix to affected devices',
      new_status: null,
    });

    entries.push({
      id: `TL-${seed}-7`,
      timestamp: new Date(createdAt.getTime() + 60 * 60000).toISOString(),
      actor,
      action_type: 'status_change',
      content: 'Incident resolved successfully',
      new_status: 'resolved',
    });
  }

  return entries;
}

// ─── Incident Data ─────────────────────────────────────────────────────────

interface IncidentTemplate {
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  title: string;
  description: string;
  impact: string;
}

const incidentTemplates: IncidentTemplate[] = [
  // P1 Critical - Open
  { type: 'zone_breach', severity: 'p1_critical', status: 'open', title: 'Device entered Security Zone without authorization', description: 'Trolley TRL-0045 has entered the Security restricted zone. Immediate lockdown required.', impact: 'Security protocol violation. Potential safety risk.' },
  { type: 'network_outage', severity: 'p1_critical', status: 'investigating', title: 'Major network outage affecting Gates B', description: 'Network connectivity lost in Gates B1-B8 area. 23 devices offline.', impact: '23 devices offline, affecting passenger service in high-traffic area.' },
  
  // P2 High - Investigating
  { type: 'battery_cluster', severity: 'p2_high', status: 'investigating', title: 'Critical battery cluster in Food Court', description: '8 devices in Food Court zone showing battery below 10%. Risk of service disruption.', impact: 'Potential loss of 8 service devices in peak dining hours.' },
  { type: 'device_stuck', severity: 'p2_high', status: 'investigating', title: 'Device stuck in corridor B', description: 'Trolley TRL-0112 has been stationary in main corridor for 45 minutes. Possible mechanical failure.', impact: 'Partial obstruction of passenger flow in busy corridor.' },
  { type: 'device_stuck', severity: 'p2_high', status: 'mitigating', title: 'Multiple devices stuck near Gate A3', description: 'Three devices reporting GPS drift near Gate A3. Unable to navigate.', impact: 'Service disruption for passengers at Gate A3.' },
  { type: 'kiosk_crash', severity: 'p2_high', status: 'investigating', title: 'App crash cluster detected', description: 'Same crash signature detected on 4 devices. Potential app regression.', impact: '4 devices out of service pending investigation.' },

  // P3 Medium - Various states
  { type: 'order_sla_breach', severity: 'p3_medium', status: 'mitigating', title: 'SLA breach rate elevated', description: 'Order acceptance SLA breach rate reached 12% in last hour.', impact: 'Customer satisfaction impact, potential complaints.' },
  { type: 'runner_unavailable', severity: 'p3_medium', status: 'resolved', title: 'Runner shortage in Terminal A', description: 'Only 2 runners available for 15 pending orders.', impact: 'Delayed deliveries, potential SLA breaches.' },
  { type: 'security_alert', severity: 'p3_medium', status: 'resolved', title: 'Unusual device movement pattern', description: 'Device TRL-0078 showing erratic movement. Possible tampering or malfunction.', impact: 'Device quarantined for inspection.' },
  { type: 'payment_failure', severity: 'p3_medium', status: 'resolved', title: 'Payment gateway timeout spike', description: 'Payment processing showing 8% failure rate in last 30 minutes.', impact: '12 failed transactions, customers redirected to retry.' },
  { type: 'kiosk_crash', severity: 'p3_medium', status: 'resolved', title: 'App crash on TRL-0156', description: 'Single device crash. Isolated incident.', impact: '1 device temporarily offline.' },
  { type: 'device_stuck', severity: 'p3_medium', status: 'resolved', title: 'Device stuck in charging dock', description: 'Trolley TRL-0089 unable to undock from charging station.', impact: 'Charging station at 87% capacity.' },

  // P4 Low - Mostly resolved/historical
  { type: 'custom', severity: 'p4_low', status: 'resolved', title: 'Scheduled maintenance reminder', description: 'Fleet maintenance window approaching. 12 devices due for service.', impact: 'Planned maintenance, no immediate impact.' },
  { type: 'custom', severity: 'p4_low', status: 'resolved', title: 'Firmware update notification', description: 'New firmware version 3.3.1 available for deployment.', impact: 'Informational only.' },
  { type: 'battery_cluster', severity: 'p4_low', status: 'resolved', title: 'Low battery warning for 3 devices', description: 'Devices in Lounge A showing 20% battery. Non-critical.', impact: 'Devices can operate for 2+ more hours.' },
  { type: 'network_outage', severity: 'p4_low', status: 'post_mortem', title: 'Brief network blip in Duty Free', description: 'Momentary connectivity loss affecting 5 devices. Auto-recovered.', impact: 'No service disruption.' },
  { type: 'zone_breach', severity: 'p4_low', status: 'resolved', title: 'Device proximity alert - Customs', description: 'Device TRL-0023 entered buffer zone near Customs. No breach.', impact: 'False positive - device within allowed tolerance.' },
  { type: 'order_sla_breach', severity: 'p4_low', status: 'resolved', title: 'Single order SLA breach', description: 'Order #ORD-2024-1234 delivered 3 minutes past SLA due to gate change.', impact: 'Customer notified and compensated.' },
  { type: 'custom', severity: 'p4_low', status: 'post_mortem', title: 'System performance degradation', description: 'API response times elevated during peak hour.', impact: 'Slight latency increase, no service impact.' },
  { type: 'custom', severity: 'p4_low', status: 'resolved', title: 'Configuration drift detected', description: 'Device TRL-0201 running outdated configuration.', impact: 'Updated remotely, no service impact.' },
];

export const incidentsData: Incident[] = incidentTemplates.map((template, index) => {
  const hoursAgo = index < 2 ? index * 0.5 + 0.5 : index < 6 ? index * 2 : index * 4;
  const createdAt = pastDate(hoursAgo);
  const assignedTo = template.status !== 'open' ? operators[index % operators.length] : null;

  const affectedDevices = index < 6 
    ? Array.from({ length: Math.min(index + 1, 5) }, (_, i) => `TRL-${String((index * 7 + i) % 200 + 1).padStart(4, '0')}`)
    : [];

  const affectedZones = [zones[index % zones.length]];
  if (index % 3 === 0) affectedZones.push(zones[(index + 1) % zones.length]);

  const affectedGates = index % 2 === 0 ? [gates[index % gates.length]] : [];

  const runbookId = ['zone_breach', 'device_stuck', 'kiosk_crash', 'network_outage', 'battery_cluster'].includes(template.type)
    ? runbooksData.find(r => r.incident_type === template.type)?.id ?? null
    : null;

  return {
    id: `INC-${String(index + 1).padStart(5, '0')}`,
    incident_number: generateIncidentNumber(index, createdAt),
    title: template.title,
    type: template.type,
    severity: template.severity,
    status: template.status,
    affected_devices: affectedDevices,
    affected_zones: affectedZones,
    affected_gates: affectedGates,
    description: template.description,
    auto_detected: index % 3 !== 0,
    detected_at: createdAt.toISOString(),
    acknowledged_at: template.status !== 'open' ? new Date(createdAt.getTime() + 5 * 60000).toISOString() : null,
    resolved_at: ['resolved', 'post_mortem'].includes(template.status) ? new Date(createdAt.getTime() + 60 * 60000).toISOString() : null,
    assigned_to: assignedTo,
    resolution_code: ['resolved', 'post_mortem'].includes(template.status) ? 'fix_applied' : null,
    resolution_notes: ['resolved', 'post_mortem'].includes(template.status) ? 'Issue resolved through standard procedure.' : null,
    runbook_id: runbookId,
    timeline: generateTimeline(template.status, createdAt, assignedTo || 'system', index),
    linked_alerts: index < 10 ? [`ALR-${String((index * 2) + 1).padStart(5, '0')}`] : [],
    impact_summary: template.impact,
    created_by: index % 3 === 0 ? operators[index % operators.length] : 'system',
  };
});
