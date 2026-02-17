// ──────────────────────────────────────
// Profile Page Mock Data
// ──────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar: string | null;
  terminal: string;
  department: string;
  employeeId: string;
  memberSince: string;
  lastLogin: string;
  language: string;
  twoFactorEnabled: boolean;
  passwordLastChanged: string;
}

export const currentUserExtended: UserProfile = {
  id: '1',
  name: 'Admin User',
  email: 'admin@aits.io',
  phone: '+971 50 123 4567',
  role: 'super_admin',
  avatar: null,
  terminal: 'Terminal 2 - International',
  department: 'Operations',
  employeeId: 'EMP-00142',
  memberSince: '2024-06-15',
  lastLogin: '2026-02-17T08:32:00Z',
  language: 'en',
  twoFactorEnabled: false,
  passwordLastChanged: '2026-01-10T14:00:00Z',
};

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  action: string;
  ipAddress: string;
  device: string;
  status: 'success' | 'failed' | 'warning';
}

export const activityLog: ActivityLogEntry[] = [
  { id: 'al1', timestamp: '2026-02-17T08:32:00Z', action: 'Login', ipAddress: '192.168.1.42', device: 'Chrome · Windows', status: 'success' },
  { id: 'al2', timestamp: '2026-02-16T17:15:00Z', action: 'Updated profile settings', ipAddress: '192.168.1.42', device: 'Chrome · Windows', status: 'success' },
  { id: 'al3', timestamp: '2026-02-16T14:20:00Z', action: 'Exported weekly report', ipAddress: '192.168.1.42', device: 'Chrome · Windows', status: 'success' },
  { id: 'al4', timestamp: '2026-02-16T09:00:00Z', action: 'Login', ipAddress: '10.0.0.15', device: 'Safari · macOS', status: 'success' },
  { id: 'al5', timestamp: '2026-02-15T19:45:00Z', action: 'Changed password', ipAddress: '192.168.1.42', device: 'Chrome · Windows', status: 'success' },
  { id: 'al6', timestamp: '2026-02-15T11:30:00Z', action: 'Updated trolley T-0042 assignment', ipAddress: '192.168.1.42', device: 'Chrome · Windows', status: 'success' },
  { id: 'al7', timestamp: '2026-02-15T08:10:00Z', action: 'Login attempt', ipAddress: '203.45.12.99', device: 'Unknown · Android', status: 'failed' },
  { id: 'al8', timestamp: '2026-02-14T16:22:00Z', action: 'Created new offer', ipAddress: '192.168.1.42', device: 'Chrome · Windows', status: 'success' },
  { id: 'al9', timestamp: '2026-02-14T10:55:00Z', action: 'Resolved alert #A-321', ipAddress: '192.168.1.42', device: 'Chrome · Windows', status: 'success' },
  { id: 'al10', timestamp: '2026-02-14T08:30:00Z', action: 'Login', ipAddress: '192.168.1.42', device: 'Chrome · Windows', status: 'success' },
  { id: 'al11', timestamp: '2026-02-13T17:00:00Z', action: 'Logout', ipAddress: '192.168.1.42', device: 'Chrome · Windows', status: 'success' },
  { id: 'al12', timestamp: '2026-02-13T14:40:00Z', action: 'Updated shop Duty Free World', ipAddress: '192.168.1.42', device: 'Chrome · Windows', status: 'success' },
  { id: 'al13', timestamp: '2026-02-13T11:10:00Z', action: 'Added user jane@aits.io', ipAddress: '192.168.1.42', device: 'Chrome · Windows', status: 'success' },
  { id: 'al14', timestamp: '2026-02-13T08:25:00Z', action: 'Login', ipAddress: '192.168.1.42', device: 'Chrome · Windows', status: 'success' },
  { id: 'al15', timestamp: '2026-02-12T15:30:00Z', action: 'Exported trolley data CSV', ipAddress: '192.168.1.42', device: 'Chrome · Windows', status: 'success' },
  { id: 'al16', timestamp: '2026-02-12T12:45:00Z', action: 'Updated notification preferences', ipAddress: '10.0.0.15', device: 'Safari · macOS', status: 'success' },
  { id: 'al17', timestamp: '2026-02-12T09:20:00Z', action: 'Login', ipAddress: '10.0.0.15', device: 'Safari · macOS', status: 'success' },
  { id: 'al18', timestamp: '2026-02-11T17:10:00Z', action: 'Session expired', ipAddress: '192.168.1.42', device: 'Chrome · Windows', status: 'warning' },
  { id: 'al19', timestamp: '2026-02-11T10:30:00Z', action: 'Bulk trolley assignment update', ipAddress: '192.168.1.42', device: 'Chrome · Windows', status: 'success' },
  { id: 'al20', timestamp: '2026-02-11T08:15:00Z', action: 'Login', ipAddress: '192.168.1.42', device: 'Chrome · Windows', status: 'success' },
];

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  current: boolean;
}

export const activeSessions: ActiveSession[] = [
  {
    id: 'sess1',
    device: 'Windows Desktop',
    browser: 'Chrome 122',
    ip: '192.168.1.42',
    location: 'Dubai, UAE',
    lastActive: '2026-02-17T08:32:00Z',
    current: true,
  },
  {
    id: 'sess2',
    device: 'macOS Laptop',
    browser: 'Safari 19',
    ip: '10.0.0.15',
    location: 'Dubai, UAE',
    lastActive: '2026-02-16T09:00:00Z',
    current: false,
  },
];
