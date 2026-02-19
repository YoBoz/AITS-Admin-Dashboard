// ──────────────────────────────────────
// Overview Page Mock Data
// ──────────────────────────────────────

export interface KPIData {
  title: string;
  value: string;
  trend: string;
  trendType: 'up' | 'down' | 'down_good' | 'neutral';
  icon: string;
  subtitle: string;
  color: 'primary' | 'success' | 'warning' | 'info';
}

export const kpiData: KPIData[] = [
  { title: 'Active Trolleys', value: '247', trend: '+12', trendType: 'up', icon: 'ShoppingCart', subtitle: 'of 280 total', color: 'primary' },
  { title: 'Visitors Today', value: '14,832', trend: '+8.3%', trendType: 'up', icon: 'Users', subtitle: 'vs 13,694 yesterday', color: 'success' },
  { title: 'Active Alerts', value: '7', trend: '-3', trendType: 'down_good', icon: 'AlertTriangle', subtitle: 'Requires attention', color: 'warning' },
  { title: 'Registered Shops', value: '64', trend: '+2', trendType: 'up', icon: 'Store', subtitle: 'Active this month', color: 'info' },
  { title: 'Avg. Session Time', value: '34 min', trend: '+2.1 min', trendType: 'up', icon: 'Clock', subtitle: 'Per visitor', color: 'primary' },
  { title: 'Trolley Utilization', value: '88.2%', trend: '+4.1%', trendType: 'up', icon: 'BarChart2', subtitle: 'Fleet efficiency', color: 'success' },
];

// ─── Visitor Flow ────────────────────
export interface VisitorFlowPoint {
  hour: string;
  today: number;
  yesterday: number;
}

export const visitorFlowData24h: VisitorFlowPoint[] = [
  { hour: '00:00', today: 120, yesterday: 98 },
  { hour: '01:00', today: 85, yesterday: 72 },
  { hour: '02:00', today: 52, yesterday: 48 },
  { hour: '03:00', today: 38, yesterday: 35 },
  { hour: '04:00', today: 45, yesterday: 42 },
  { hour: '05:00', today: 180, yesterday: 155 },
  { hour: '06:00', today: 520, yesterday: 480 },
  { hour: '07:00', today: 890, yesterday: 820 },
  { hour: '08:00', today: 1120, yesterday: 1050 },
  { hour: '09:00', today: 980, yesterday: 920 },
  { hour: '10:00', today: 870, yesterday: 830 },
  { hour: '11:00', today: 920, yesterday: 880 },
  { hour: '12:00', today: 850, yesterday: 810 },
  { hour: '13:00', today: 720, yesterday: 700 },
  { hour: '14:00', today: 680, yesterday: 650 },
  { hour: '15:00', today: 950, yesterday: 900 },
  { hour: '16:00', today: 1100, yesterday: 1020 },
  { hour: '17:00', today: 1250, yesterday: 1180 },
  { hour: '18:00', today: 1180, yesterday: 1100 },
  { hour: '19:00', today: 1050, yesterday: 980 },
  { hour: '20:00', today: 780, yesterday: 720 },
  { hour: '21:00', today: 520, yesterday: 480 },
  { hour: '22:00', today: 320, yesterday: 290 },
  { hour: '23:00', today: 180, yesterday: 160 },
];

export interface VisitorFlowWeeklyPoint {
  day: string;
  thisWeek: number;
  lastWeek: number;
}

export const visitorFlowDataWeekly: VisitorFlowWeeklyPoint[] = [
  { day: 'Mon', thisWeek: 12400, lastWeek: 11800 },
  { day: 'Tue', thisWeek: 13200, lastWeek: 12500 },
  { day: 'Wed', thisWeek: 14100, lastWeek: 13400 },
  { day: 'Thu', thisWeek: 14800, lastWeek: 13900 },
  { day: 'Fri', thisWeek: 16200, lastWeek: 15100 },
  { day: 'Sat', thisWeek: 18500, lastWeek: 17200 },
  { day: 'Sun', thisWeek: 17100, lastWeek: 16000 },
];

export interface VisitorFlowMonthlyPoint {
  week: string;
  thisMonth: number;
  lastMonth: number;
}

export const visitorFlowDataMonthly: VisitorFlowMonthlyPoint[] = [
  { week: 'Week 1', thisMonth: 92000, lastMonth: 86000 },
  { week: 'Week 2', thisMonth: 98000, lastMonth: 91000 },
  { week: 'Week 3', thisMonth: 104000, lastMonth: 95000 },
  { week: 'Week 4', thisMonth: 110000, lastMonth: 100000 },
];

// ─── Trolley Status ──────────────────
export interface TrolleyStatusData {
  name: string;
  value: number;
  color: string;
}

export const trolleyStatusData: TrolleyStatusData[] = [
  { name: 'In Use', value: 247, color: '#BE052E' },
  { name: 'Idle', value: 18, color: '#10B981' },
  { name: 'Charging', value: 9, color: '#3B82F6' },
  { name: 'Maintenance', value: 4, color: '#F59E0B' },
  { name: 'Offline', value: 2, color: '#6B7280' },
];

// ─── Battery Distribution ────────────
export interface BatteryDistData {
  range: string;
  count: number;
  color: string;
}

export const batteryDistributionData: BatteryDistData[] = [
  { range: '0-20%', count: 6, color: '#EF4444' },
  { range: '21-40%', count: 12, color: '#F59E0B' },
  { range: '41-60%', count: 31, color: '#F59E0B' },
  { range: '61-80%', count: 89, color: '#10B981' },
  { range: '81-100%', count: 142, color: '#10B981' },
];

// ─── Top Shops ───────────────────────
export interface TopShopData {
  rank: number;
  name: string;
  category: string;
  visitors: number;
  trend: 'up' | 'down';
}

// Top shops — names aligned with shops.mock.ts (SHOP-001 through SHOP-007)
export const topShopsData: TopShopData[] = [
  { rank: 1, name: 'Starbucks Terminal A', category: 'Cafe', visitors: 3421, trend: 'up' },
  { rank: 2, name: 'Sky Lounge Premium', category: 'Lounge', visitors: 2887, trend: 'up' },
  { rank: 3, name: 'McDonald\'s Airside', category: 'Restaurant', visitors: 2341, trend: 'down' },
  { rank: 4, name: 'Duty Free Electronics', category: 'Electronics', visitors: 1923, trend: 'up' },
  { rank: 5, name: 'Zara Travel Collection', category: 'Fashion', visitors: 1654, trend: 'up' },
  { rank: 6, name: 'Pharma Plus', category: 'Pharmacy', visitors: 1102, trend: 'down' },
];

// ─── System Health ───────────────────
export interface SystemHealthItem {
  component: string;
  status: 'online' | 'degraded' | 'offline';
  uptime: string;
  lastChecked: string;
}

export const systemHealthData: SystemHealthItem[] = [
  { component: 'API Gateway', status: 'online', uptime: '99.98%', lastChecked: '30s ago' },
  { component: 'Trolley Network', status: 'online', uptime: '99.95%', lastChecked: '15s ago' },
  { component: 'Map Service', status: 'degraded', uptime: '98.40%', lastChecked: '45s ago' },
  { component: 'Notification Service', status: 'online', uptime: '99.99%', lastChecked: '20s ago' },
  { component: 'Database', status: 'online', uptime: '99.99%', lastChecked: '10s ago' },
  { component: 'Analytics Engine', status: 'online', uptime: '99.90%', lastChecked: '25s ago' },
];

// ─── Active Alerts ───────────────────
export interface AlertData {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  reference: string;
  time: string;
}

export const alertsData: AlertData[] = [
  { id: 'a1', severity: 'critical', title: 'Trolley offline — no signal for 30 min', reference: 'T-0042 · Gate A12', time: '5 min ago' },
  { id: 'a2', severity: 'warning', title: 'Battery below 10%', reference: 'T-0118 · Zone C', time: '12 min ago' },
  { id: 'a3', severity: 'critical', title: 'Collision detected', reference: 'T-0203 · Corridor B', time: '18 min ago' },
  { id: 'a4', severity: 'info', title: 'Firmware update available', reference: '14 trolleys pending', time: '1 hr ago' },
  { id: 'a5', severity: 'warning', title: 'High dwell time in Zone D', reference: 'T-0091 · Zone D', time: '1.5 hr ago' },
];

// ─── Recent Activity ─────────────────
export interface ActivityItem {
  id: string;
  type: 'trolley' | 'shop' | 'offer' | 'user' | 'alert' | 'complaint';
  description: string;
  actor: string;
  time: string;
}

export const recentActivityData: ActivityItem[] = [
  { id: 'r1', type: 'trolley', description: 'Trolley T-0287 registered to fleet', actor: 'System', time: '3 min ago' },
  { id: 'r2', type: 'alert', description: 'Alert resolved: T-0042 back online', actor: 'Ops Manager', time: '8 min ago' },
  { id: 'r3', type: 'shop', description: 'Starbucks Gate B updated operating hours', actor: 'Admin User', time: '22 min ago' },
  { id: 'r4', type: 'complaint', description: 'Complaint #C-894 filed for Gate A6', actor: 'Visitor App', time: '35 min ago' },
  { id: 'r5', type: 'offer', description: 'New promotion created: Summer Sale 2026', actor: 'Admin User', time: '1 hr ago' },
  { id: 'r6', type: 'user', description: 'User john.doe@aits.io logged in', actor: 'John Doe', time: '1.5 hr ago' },
  { id: 'r7', type: 'trolley', description: 'Batch maintenance completed — 12 trolleys', actor: 'Maintenance Bot', time: '2 hr ago' },
  { id: 'r8', type: 'alert', description: 'New alert: Map Service latency spike', actor: 'Monitoring', time: '2.5 hr ago' },
  { id: 'r9', type: 'shop', description: 'Pharma Plus monthly report generated', actor: 'System', time: '3 hr ago' },
  { id: 'r10', type: 'user', description: 'Permissions updated for terminal_admin role', actor: 'Super Admin', time: '4 hr ago' },
];
