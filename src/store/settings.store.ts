// ──────────────────────────────────────
// Settings Store (Zustand + localStorage)
// ──────────────────────────────────────
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SettingsState {
  // General
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  currency: string;

  // Appearance
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  sidebarCollapsed: boolean;
  compactMode: boolean;
  animationsEnabled: boolean;

  // Notifications
  criticalAlerts: boolean;
  warningAlerts: boolean;
  infoAlerts: boolean;
  newComplaints: boolean;
  complaintSeverityFilter: 'high' | 'all';
  contractExpiry: boolean;
  contractExpiryDays: number;
  newShopRegistration: boolean;
  visitorMilestones: boolean;
  inAppNotifications: boolean;
  emailDigest: boolean;
  emailDigestFrequency: 'immediate' | 'hourly' | 'daily';
  soundAlerts: boolean;
  quietHoursEnabled: boolean;
  quietHoursFrom: string;
  quietHoursTo: string;

  // Security
  twoFactorEnabled: boolean;
  sessionTimeout: string;
  rememberMeDuration: string;
  allowedIps: string[];
  screenshotProtection: boolean;
  unfocusProtection: boolean;

  // Terminal
  defaultTerminal: string;
  terminalName: string;
  airportCode: string;
  terminalTimezone: string;
  terminalManager: string;
  supportEmail: string;
  emergencyContact: string;
  lowBatteryThreshold: number;
  criticalBatteryThreshold: number;
  idleAlertMinutes: number;
  maxFleetSize: number;
  autoAlertOfflineMinutes: number;
  defaultScreenLanguage: string;
  offerRotationInterval: number;
  screenBrightness: number;
  showNavigationDefault: boolean;

  // Data
  trolleyTrackingRetention: string;
  visitorStatsRetention: string;
  alertLogsRetention: string;
  auditLogsRetention: string;
  scheduledReport: boolean;
  scheduledReportDay: string;
  scheduledReportTime: string;
  exportFormat: 'csv' | 'excel' | 'pdf';
  anonymizeDays: number;
  maskPiiInExports: boolean;

  // Actions
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
  resetSection: (section: 'general' | 'appearance' | 'notifications' | 'security' | 'terminal' | 'data') => void;
  addAllowedIp: (ip: string) => void;
  removeAllowedIp: (ip: string) => void;
}

const generalDefaults = {
  language: 'en',
  timezone: 'UTC+4',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h' as const,
  currency: 'AED',
};

const appearanceDefaults = {
  theme: 'system' as const,
  fontSize: 'medium' as const,
  sidebarCollapsed: false,
  compactMode: false,
  animationsEnabled: true,
};

const notificationDefaults = {
  criticalAlerts: true,
  warningAlerts: true,
  infoAlerts: false,
  newComplaints: true,
  complaintSeverityFilter: 'all' as const,
  contractExpiry: true,
  contractExpiryDays: 30,
  newShopRegistration: true,
  visitorMilestones: false,
  inAppNotifications: true,
  emailDigest: false,
  emailDigestFrequency: 'daily' as const,
  soundAlerts: true,
  quietHoursEnabled: false,
  quietHoursFrom: '22:00',
  quietHoursTo: '07:00',
};

const securityDefaults = {
  twoFactorEnabled: false,
  sessionTimeout: '1h',
  rememberMeDuration: '7d',
  allowedIps: [] as string[],
  screenshotProtection: false,
  unfocusProtection: false,
};

const terminalDefaults = {
  defaultTerminal: 'terminal-2',
  terminalName: 'Terminal 2 - International',
  airportCode: 'DXB',
  terminalTimezone: 'UTC+4',
  terminalManager: 'Fatima Al-Rashid',
  supportEmail: 'support@aits.io',
  emergencyContact: '+971-4-000-0000',
  lowBatteryThreshold: 20,
  criticalBatteryThreshold: 10,
  idleAlertMinutes: 60,
  maxFleetSize: 300,
  autoAlertOfflineMinutes: 15,
  defaultScreenLanguage: 'en',
  offerRotationInterval: 10,
  screenBrightness: 80,
  showNavigationDefault: true,
};

const dataDefaults = {
  trolleyTrackingRetention: '90d',
  visitorStatsRetention: '1y',
  alertLogsRetention: '180d',
  auditLogsRetention: '1y',
  scheduledReport: false,
  scheduledReportDay: 'Monday',
  scheduledReportTime: '08:00',
  exportFormat: 'excel' as const,
  anonymizeDays: 30,
  maskPiiInExports: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...generalDefaults,
      ...appearanceDefaults,
      ...notificationDefaults,
      ...securityDefaults,
      ...terminalDefaults,
      ...dataDefaults,

      updateSetting: (key, value) => set({ [key]: value } as Partial<SettingsState>),

      resetSection: (section) => {
        switch (section) {
          case 'general': set(generalDefaults); break;
          case 'appearance': set(appearanceDefaults); break;
          case 'notifications': set(notificationDefaults); break;
          case 'security': set(securityDefaults); break;
          case 'terminal': set(terminalDefaults); break;
          case 'data': set(dataDefaults); break;
        }
      },

      addAllowedIp: (ip) =>
        set((state) => ({ allowedIps: [...state.allowedIps, ip] })),

      removeAllowedIp: (ip) =>
        set((state) => ({ allowedIps: state.allowedIps.filter((i) => i !== ip) })),
    }),
    {
      name: 'aits-settings',
      partialize: (state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { updateSetting, resetSection, addAllowedIp, removeAllowedIp, ...data } = state;
        return data;
      },
    },
  ),
);
