// ──────────────────────────────────────
// Notifications Mock Data
// ──────────────────────────────────────

import type { Notification } from '@/types/notification.types';

const notificationItems: Array<{
  type: Notification['type'];
  icon: string;
  titleTmpl: string;
  bodyTmpl: string;
  linkTmpl: string | null;
}> = [
  { type: 'alert', icon: 'AlertTriangle', titleTmpl: 'Critical Alert: Trolley {t} offline', bodyTmpl: 'Trolley {t} lost connection in zone {z}. Requires immediate attention.', linkTmpl: '/dashboard/alerts' },
  { type: 'system', icon: 'Server', titleTmpl: 'System Update Deployed v2.{v}', bodyTmpl: 'Backend services updated to version 2.{v}. {c} bug fixes and {f} new features.', linkTmpl: null },
  { type: 'shop', icon: 'Store', titleTmpl: 'Shop "{s}" License Expiring', bodyTmpl: 'License for {s} expires in {d} days. Please contact the shop owner.', linkTmpl: '/dashboard/shops' },
  { type: 'visitor', icon: 'Users', titleTmpl: 'Peak Visitor Alert', bodyTmpl: 'Visitor count in {z} exceeded threshold ({n} visitors). Consider deploying additional trolleys.', linkTmpl: '/dashboard/visitors' },
  { type: 'contract', icon: 'FileText', titleTmpl: 'Contract Renewal Due – {s}', bodyTmpl: 'Contract for {s} due for renewal by {date}. Current status: pending review.', linkTmpl: '/dashboard/offers' },
  { type: 'offer', icon: 'Tag', titleTmpl: 'New Offer Submitted by {s}', bodyTmpl: '{s} submitted a new promotional offer for review. Campaign: "{campaign}".', linkTmpl: '/dashboard/offers' },
  { type: 'complaint', icon: 'MessageCircle', titleTmpl: 'New Complaint: {subj}', bodyTmpl: 'A new complaint ({ticket}) has been submitted regarding {cat}. SLA: {sla}h.', linkTmpl: '/dashboard/complaints' },
  { type: 'alert', icon: 'Battery', titleTmpl: 'Battery Warning – {n} trolleys below 20%', bodyTmpl: '{n} trolleys have battery levels below 20%. Charging schedule may need adjustment.', linkTmpl: '/dashboard/alerts' },
  { type: 'system', icon: 'Shield', titleTmpl: 'Security: Unusual Login Attempt', bodyTmpl: 'Detected login attempt from unrecognized IP ({ip}) at {time}. Access was blocked.', linkTmpl: null },
  { type: 'visitor', icon: 'TrendingUp', titleTmpl: 'Weekly Visitor Report Ready', bodyTmpl: 'The weekly visitor analytics report for {week} is ready. Total visitors: {n}.', linkTmpl: '/dashboard/visitors' },
];

const shopNames = ['Sky Boutique', 'Duty Free World', 'Cloud Nine Cafe', 'Terminal Books', 'AeroTech Store', 'Golden Pharma'];
const zones = ['duty_free', 'food_court', 'gates_a', 'gates_b', 'checkin', 'security', 'main_retail'];
const priorities: Notification['priority'][] = ['high', 'medium', 'low'];
const actors = ['System', 'Ahmed Al-Farsi', 'Sara Khalil', 'John Mitchell', 'Fatima Ben Ali', null];

function pastDate(hoursAgo: number): string {
  const d = new Date();
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
}

export const notificationsData: Notification[] = Array.from({ length: 50 }, (_, i) => {
  const tmpl = notificationItems[i % notificationItems.length];
  const shopName = shopNames[i % shopNames.length];
  const zone = zones[i % zones.length];
  const hoursAgo = i < 5 ? i * 0.5 : i < 15 ? 3 + (i - 5) * 2 : i < 30 ? 24 + (i - 15) * 6 : 120 + (i - 30) * 12;

  return {
    id: `NTF-${String(i + 1).padStart(5, '0')}`,
    type: tmpl.type,
    title: tmpl.titleTmpl
      .replace('{t}', `TRL-${String(i * 3 + 1).padStart(4, '0')}`)
      .replace('{s}', shopName)
      .replace('{n}', String(5 + i * 2))
      .replace('{subj}', 'Display not working')
      .replace('{v}', String(4 + (i % 5))),
    body: tmpl.bodyTmpl
      .replace('{t}', `TRL-${String(i * 3 + 1).padStart(4, '0')}`)
      .replace('{z}', zone)
      .replace('{s}', shopName)
      .replace('{d}', String(5 + i))
      .replace('{n}', String(150 + i * 20))
      .replace('{date}', '2024-12-15')
      .replace('{campaign}', `Winter Sale ${2024}`)
      .replace('{ticket}', `CMP-202411-${String(i + 1).padStart(4, '0')}`)
      .replace('{cat}', 'trolley display')
      .replace('{sla}', String(24 + (i % 3) * 24))
      .replace('{ip}', `192.168.${i % 255}.${(i * 3) % 255}`)
      .replace('{time}', '02:34 AM')
      .replace('{week}', 'Nov 4-10')
      .replace('{v}', String(4 + (i % 5)))
      .replace('{c}', String(12 + i))
      .replace('{f}', String(3 + (i % 4))),
    is_read: i >= 15 || (i >= 5 && i % 3 === 0), // ~30% unread
    created_at: pastDate(hoursAgo),
    link_to: tmpl.linkTmpl,
    priority: i < 5 ? 'high' : i < 20 ? priorities[i % 3] : 'low',
    icon: tmpl.icon,
    actor: actors[i % actors.length],
  };
});
