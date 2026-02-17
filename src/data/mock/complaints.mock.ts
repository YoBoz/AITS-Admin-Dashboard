// ──────────────────────────────────────
// Complaints Mock Data
// ──────────────────────────────────────

import type { Complaint, ComplaintCategory, ComplaintStatus } from '@/types/complaint.types';

const categories: ComplaintCategory[] = ['trolley_fault', 'navigation_error', 'display_issue', 'offer_dispute', 'privacy', 'general', 'staff', 'facility'];
const statusPool: ComplaintStatus[] = ['open', 'in_progress', 'pending_response', 'resolved', 'closed', 'escalated'];
const priorities: Complaint['priority'][] = ['high', 'medium', 'low'];

const subjects: Record<ComplaintCategory, string[]> = {
  trolley_fault: ['Trolley screen not responding', 'Wheel stuck on trolley', 'Battery drained too fast'],
  navigation_error: ['Wrong directions to gate', 'Map shows closed area', 'Navigation loop detected'],
  display_issue: ['Cracked screen on trolley', 'Display brightness too low', 'Ads not loading properly'],
  offer_dispute: ['Coupon code invalid', 'Discount not applied', 'Wrong offer displayed'],
  privacy: ['Camera concern', 'Data collection question', 'Profile deletion request'],
  general: ['General feedback', 'Service improvement suggestion', 'App feature request'],
  staff: ['Unhelpful staff member', 'Staff not available', 'Language barrier issue'],
  facility: ['Dirty trolley', 'Missing trolley at stand', 'Charging station broken'],
};

const names = [
  { name: 'Mohammed Al-Rashid', email: 'mohammed.r@email.com', phone: '+971501234567' },
  { name: 'Emily Watson', email: 'e.watson@email.com' },
  { name: 'Youssef Ben Ali', email: 'youssef.ba@email.com', phone: '+33612345678' },
  { name: 'Priya Sharma', email: 'priya.s@email.com', phone: '+91987654321' },
  { name: 'Hans Mueller', email: 'h.mueller@email.com' },
  { name: 'Ling Chen', email: 'l.chen@email.com', phone: '+8613800138000' },
  { name: 'Sofia Rodriguez', email: 'sofia.rod@email.com' },
  { name: 'Kwame Asante', email: 'k.asante@email.com', phone: '+233201234567' },
  { name: 'Olga Petrov', email: 'o.petrov@email.com' },
  { name: 'Takeshi Yamamoto', email: 't.yamamoto@email.com', phone: '+81312345678' },
];

const assignees = ['Ahmed Al-Farsi', 'Sara Khalil', 'John Mitchell', 'Fatima Ben Ali'];

function pastDate(hoursAgo: number): string {
  const d = new Date();
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
}

function makeTimeline(status: ComplaintStatus, createdAt: string, i: number): Complaint['timeline'] {
  const entries: Complaint['timeline'] = [
    { action: 'Complaint submitted', actor: 'System', timestamp: createdAt, note: 'Complaint received via mobile app.', status_change: 'open' },
  ];

  if (status !== 'open') {
    const t1 = new Date(new Date(createdAt).getTime() + (15 + i % 30) * 60000).toISOString();
    entries.push({ action: 'Assigned to agent', actor: 'System', timestamp: t1, note: `Assigned to ${assignees[i % assignees.length]}.`, status_change: 'in_progress' });
  }

  if (status === 'pending_response' || status === 'resolved' || status === 'closed') {
    const t2 = new Date(new Date(createdAt).getTime() + (45 + i % 60) * 60000).toISOString();
    entries.push({ action: 'Response sent', actor: assignees[i % assignees.length], timestamp: t2, note: 'Requested additional details from the visitor.', status_change: 'pending_response' });
  }

  if (status === 'resolved' || status === 'closed') {
    const t3 = new Date(new Date(createdAt).getTime() + (120 + i % 180) * 60000).toISOString();
    entries.push({ action: 'Issue resolved', actor: assignees[i % assignees.length], timestamp: t3, note: 'Root cause identified and corrective action taken.', status_change: 'resolved' });
  }

  if (status === 'closed') {
    const t4 = new Date(new Date(createdAt).getTime() + (180 + i % 240) * 60000).toISOString();
    entries.push({ action: 'Ticket closed', actor: 'System', timestamp: t4, note: 'Auto-closed after 48h with no further response.', status_change: 'closed' });
  }

  if (status === 'escalated') {
    const t2 = new Date(new Date(createdAt).getTime() + (30 + i % 20) * 60000).toISOString();
    entries.push({ action: 'Escalated to management', actor: assignees[i % assignees.length], timestamp: t2, note: 'Requires management intervention.', status_change: 'escalated' });
  }

  return entries;
}

export const complaintsData: Complaint[] = Array.from({ length: 35 }, (_, i) => {
  const cat = categories[i % categories.length];
  const status = statusPool[i % statusPool.length];
  const subs = subjects[cat];
  const subj = subs[i % subs.length];
  const hoursAgo = i < 5 ? i * 2 : i < 15 ? 12 + (i - 5) * 8 : 96 + (i - 15) * 24;
  const createdAt = pastDate(hoursAgo);
  const slaHours = cat === 'privacy' ? 24 : cat === 'trolley_fault' ? 48 : 72;
  const slaDue = new Date(new Date(createdAt).getTime() + slaHours * 3600000).toISOString();
  const slaBreached = i === 5 || i === 18 || i === 27; // 3 breached

  const timeline = makeTimeline(status, createdAt, i);
  const resolved = status === 'resolved' || status === 'closed';

  return {
    id: `CMP-${i + 1}`,
    ticket_id: `CMP-202411-${String(i + 1).padStart(4, '0')}`,
    category: cat,
    subject: subj,
    description: `${subj}. The visitor reported this issue while at the airport. Detailed description of the problem and how it affected their experience.`,
    status,
    priority: i < 5 ? 'high' : priorities[i % priorities.length],
    submitted_by: names[i % names.length],
    assigned_to: status !== 'open' ? assignees[i % assignees.length] : null,
    trolley_id: ['trolley_fault', 'navigation_error', 'display_issue'].includes(cat)
      ? `TRL-${String(i * 5 + 1).padStart(4, '0')}`
      : null,
    shop_id: cat === 'offer_dispute' ? `SHP-${String(i * 2 + 1).padStart(4, '0')}` : null,
    attachments: i % 4 === 0 ? 2 : i % 3 === 0 ? 1 : 0,
    created_at: createdAt,
    updated_at: timeline[timeline.length - 1].timestamp,
    resolved_at: resolved ? timeline.find(t => t.status_change === 'resolved')?.timestamp || null : null,
    resolution: resolved ? 'Root cause identified and corrective action taken. Visitor notified of the resolution.' : null,
    sla_due_at: slaDue,
    sla_breached: slaBreached,
    timeline,
    internal_notes: i % 5 === 0 ? 'VIP visitor – handle with extra care.' : '',
  };
});

export const complaintStats = {
  total: complaintsData.length,
  open: complaintsData.filter(c => c.status === 'open').length,
  in_progress: complaintsData.filter(c => c.status === 'in_progress' || c.status === 'pending_response').length,
  resolved: complaintsData.filter(c => c.status === 'resolved' || c.status === 'closed').length,
  escalated: complaintsData.filter(c => c.status === 'escalated').length,
  sla_breached: complaintsData.filter(c => c.sla_breached).length,
  avg_resolution_hours: 4.2,
};
