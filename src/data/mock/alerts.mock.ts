// ──────────────────────────────────────
// Alerts Mock Data
// ──────────────────────────────────────

import type { Alert, AlertType, AlertSeverity, AlertStatus } from '@/types/alert.types';

const alertTemplates: Array<{
  type: AlertType;
  severity: AlertSeverity;
  titleTemplate: string;
  descTemplate: string;
}> = [
  { type: 'battery_low', severity: 'warning', titleTemplate: 'Low Battery – Trolley {t}', descTemplate: 'Trolley {t} battery level dropped below 15%. Currently at {pct}%.' },
  { type: 'offline_trolley', severity: 'critical', titleTemplate: 'Trolley {t} Offline', descTemplate: 'Lost connection to Trolley {t} (IMEI {imei}) in zone {z}. Last seen {ago} ago.' },
  { type: 'hardware_fault', severity: 'critical', titleTemplate: 'Hardware Fault – Trolley {t}', descTemplate: 'Screen sensor malfunction detected on Trolley {t}. Diagnostic code HW-{code}.' },
  { type: 'system_error', severity: 'critical', titleTemplate: 'System Error: DB Replication Lag', descTemplate: 'Database replication lag exceeded 500ms threshold. Current lag: {lag}ms.' },
  { type: 'network_issue', severity: 'warning', titleTemplate: 'Network Degradation – Zone {z}', descTemplate: 'Packet loss rate in zone {z} reached {pct}%. {count} trolleys affected.' },
  { type: 'maintenance_due', severity: 'info', titleTemplate: 'Scheduled Maintenance – Trolley {t}', descTemplate: 'Trolley {t} is due for quarterly maintenance. Last serviced {days} days ago.' },
  { type: 'unusual_activity', severity: 'warning', titleTemplate: 'Unusual Movement Pattern', descTemplate: 'Trolley {t} has been stationary in zone {z} for over {hrs} hours.' },
];

const zones = ['checkin', 'security', 'duty_free', 'food_court', 'gates_a', 'gates_b', 'lounge_a', 'lounge_b', 'main_retail', 'pharmacy'];
const staff = ['Ahmed Al-Farsi', 'Sara Khalil', 'John Mitchell', 'Fatima Ben Ali', null];

function makeId(i: number): string {
  return `ALR-${String(i + 1).padStart(5, '0')}`;
}

function makeTrolleyId(seed: number): string {
  return `TRL-${String((seed * 7 + 3) % 200 + 1).padStart(4, '0')}`;
}

function makeImei(seed: number): string {
  const base = 350000000000000 + seed * 12345678;
  return String(base);
}

function pastDate(hoursAgo: number): string {
  const d = new Date();
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
}

function buildHistory(status: AlertStatus, createdAt: string, seed: number): Alert['history'] {
  const entries: Alert['history'] = [
    { action: 'created', actor: 'system', timestamp: createdAt, note: 'Auto-generated alert.' },
  ];
  if (status === 'acknowledged' || status === 'resolved' || status === 'dismissed') {
    const ackTime = new Date(new Date(createdAt).getTime() + (5 + seed % 20) * 60000).toISOString();
    entries.push({ action: 'acknowledged', actor: staff[seed % 4] || 'Ahmed Al-Farsi', timestamp: ackTime, note: 'Investigating.' });
  }
  if (status === 'resolved') {
    const resTime = new Date(new Date(createdAt).getTime() + (30 + seed % 60) * 60000).toISOString();
    entries.push({ action: 'resolved', actor: staff[seed % 4] || 'Ahmed Al-Farsi', timestamp: resTime, note: 'Issue resolved. Root cause identified and fixed.' });
  }
  if (status === 'dismissed') {
    const disTime = new Date(new Date(createdAt).getTime() + (10 + seed % 15) * 60000).toISOString();
    entries.push({ action: 'dismissed', actor: staff[seed % 4] || 'Sara Khalil', timestamp: disTime, note: 'False positive.' });
  }
  return entries;
}

// Generate 40 alerts
const statusDistribution: AlertStatus[] = [
  // 7 active critical
  'active', 'active', 'active', 'active', 'active', 'active', 'active',
  // 8 acknowledged
  'acknowledged', 'acknowledged', 'acknowledged', 'acknowledged', 'acknowledged', 'acknowledged', 'acknowledged', 'acknowledged',
  // 12 resolved
  'resolved', 'resolved', 'resolved', 'resolved', 'resolved', 'resolved', 'resolved', 'resolved', 'resolved', 'resolved', 'resolved', 'resolved',
  // 5 dismissed
  'dismissed', 'dismissed', 'dismissed', 'dismissed', 'dismissed',
  // 8 more active (warnings/info)
  'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active',
];

export const alertsData: Alert[] = statusDistribution.map((status, i) => {
  const tmpl = alertTemplates[i % alertTemplates.length];
  const trolleyId = tmpl.type !== 'system_error' ? makeTrolleyId(i) : null;
  const zone = zones[i % zones.length];
  const hoursAgo = i < 7 ? i * 0.5 : i < 15 ? i * 1.5 : i * 3;
  const createdAt = pastDate(hoursAgo);
  const history = buildHistory(status, createdAt, i);
  const assignedTo = status !== 'active' ? (staff[i % 4] || null) : (i < 3 ? staff[i % 4] || null : null);

  return {
    id: makeId(i),
    type: tmpl.type,
    severity: i < 7 ? (tmpl.severity === 'info' ? 'warning' : tmpl.severity) : tmpl.severity,
    title: tmpl.titleTemplate.replace('{t}', trolleyId || 'N/A').replace('{z}', zone),
    description: tmpl.descTemplate
      .replace('{t}', trolleyId || 'N/A')
      .replace('{imei}', makeImei(i))
      .replace('{z}', zone)
      .replace('{pct}', String(8 + i % 12))
      .replace('{ago}', `${5 + i * 2} min`)
      .replace('{code}', `E${100 + i}`)
      .replace('{lag}', String(520 + i * 15))
      .replace('{count}', String(3 + i % 8))
      .replace('{days}', String(85 + i * 3))
      .replace('{hrs}', String(2 + (i % 5))),
    trolley_id: trolleyId,
    trolley_imei: trolleyId ? makeImei(i) : null,
    zone: tmpl.type !== 'system_error' ? zone : null,
    status,
    created_at: createdAt,
    acknowledged_at: status !== 'active' ? history.find(h => h.action === 'acknowledged')?.timestamp || null : null,
    resolved_at: status === 'resolved' ? history.find(h => h.action === 'resolved')?.timestamp || null : null,
    assigned_to: assignedTo,
    resolution_notes: status === 'resolved' ? 'Issue resolved. Root cause identified and fixed.' : null,
    auto_generated: true,
    history,
  };
});

// Summary stats
export const alertStats = {
  total: alertsData.length,
  critical: alertsData.filter(a => a.severity === 'critical' && a.status === 'active').length,
  warnings: alertsData.filter(a => a.severity === 'warning' && a.status === 'active').length,
  resolved_today: alertsData.filter(a => a.status === 'resolved').length,
  avg_resolution_min: 42,
};
