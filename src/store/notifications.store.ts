import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'alert',
    title: 'Trolley Battery Critical',
    description: 'Trolley #T-0042 battery at 5%. Requires immediate charging.',
    time: '2 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'success',
    title: 'New Shop Registered',
    description: 'Tech Haven has been successfully registered in Terminal 2.',
    time: '15 min ago',
    read: false,
  },
  {
    id: '3',
    type: 'warning',
    title: 'High Visitor Volume',
    description: 'Terminal 2 visitor count exceeds 5,000. Consider trolley rebalancing.',
    time: '32 min ago',
    read: false,
  },
  {
    id: '4',
    type: 'info',
    title: 'System Update Available',
    description: 'Ai-TS v1.2.3 is available. Schedule update during off-peak.',
    time: '1 hr ago',
    read: false,
  },
  {
    id: '5',
    type: 'alert',
    title: 'New Complaint Received',
    description: 'Complaint #C-891: Damaged trolley at Gate B4.',
    time: '1.5 hr ago',
    read: true,
  },
  {
    id: '6',
    type: 'warning',
    title: 'Offer Expiring Soon',
    description: 'Duty Free World promotional contract expires in 3 days.',
    time: '2 hr ago',
    read: true,
  },
  {
    id: '7',
    type: 'success',
    title: 'Visitor Milestone Reached',
    description: 'Terminal 2 surpassed 1M visitors this quarter!',
    time: '3 hr ago',
    read: true,
  },
  {
    id: '8',
    type: 'info',
    title: 'Maintenance Completed',
    description: 'Scheduled trolley maintenance batch #47 completed. 12 trolleys serviced.',
    time: '5 hr ago',
    read: true,
  },
  {
    id: '9',
    type: 'alert',
    title: 'System Health Warning',
    description: 'Map Service response time degraded. Latency above 500ms.',
    time: '6 hr ago',
    read: true,
  },
  {
    id: '10',
    type: 'info',
    title: 'Weekly Report Ready',
    description: 'Your weekly operations report is ready for download.',
    time: '8 hr ago',
    read: true,
  },
];

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: mockNotifications,
  unreadCount: mockNotifications.filter((n) => !n.read).length,

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.read ? 0 : 1),
    })),

  markAsRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
      };
    }),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}));
