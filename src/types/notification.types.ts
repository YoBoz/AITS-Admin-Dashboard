export interface Notification {
  id: string;
  type: 'alert' | 'system' | 'shop' | 'visitor' | 'contract' | 'offer' | 'complaint';
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
  link_to: string | null;
  priority: 'high' | 'medium' | 'low';
  icon: string;
  actor: string | null;
}
