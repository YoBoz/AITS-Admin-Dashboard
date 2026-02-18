import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Clock,
  Star,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type TimeRange = 'today' | '7days' | '30days';

interface MetricCard {
  label: string;
  value: string;
  change: number;
  icon: typeof TrendingUp;
  iconColor: string;
}

// Mock data for analytics
const generateMockData = (range: TimeRange) => {
  const multiplier = range === 'today' ? 1 : range === '7days' ? 7 : 30;
  
  return {
    totalRevenue: (1250 * multiplier + Math.random() * 500).toFixed(2),
    totalOrders: Math.floor(45 * multiplier + Math.random() * 20),
    avgPrepTime: Math.floor(8 + Math.random() * 4),
    avgRating: (4.5 + Math.random() * 0.4).toFixed(1),
    revenueChange: Math.floor(Math.random() * 30 - 10),
    ordersChange: Math.floor(Math.random() * 25 - 5),
    prepTimeChange: Math.floor(Math.random() * 20 - 15),
    ratingChange: (Math.random() * 0.5 - 0.2).toFixed(1),
  };
};

const mockTopItems = [
  { name: 'Club Sandwich', orders: 156, revenue: 1872.00 },
  { name: 'Iced Latte', orders: 142, revenue: 781.00 },
  { name: 'Caesar Salad', orders: 98, revenue: 980.00 },
  { name: 'Grilled Panini', orders: 87, revenue: 1653.00 },
  { name: 'Mocha', orders: 76, revenue: 456.00 },
];

const mockHourlyData = [
  { hour: '6AM', orders: 12 },
  { hour: '7AM', orders: 28 },
  { hour: '8AM', orders: 45 },
  { hour: '9AM', orders: 38 },
  { hour: '10AM', orders: 22 },
  { hour: '11AM', orders: 35 },
  { hour: '12PM', orders: 52 },
  { hour: '1PM', orders: 48 },
  { hour: '2PM', orders: 30 },
  { hour: '3PM', orders: 25 },
  { hour: '4PM', orders: 32 },
  { hour: '5PM', orders: 40 },
  { hour: '6PM', orders: 55 },
  { hour: '7PM', orders: 42 },
  { hour: '8PM', orders: 28 },
];

export default function MerchantAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('today');

  const data = useMemo(() => generateMockData(timeRange), [timeRange]);

  const metrics: MetricCard[] = [
    {
      label: 'Total Revenue',
      value: `AED ${data.totalRevenue}`,
      change: data.revenueChange,
      icon: DollarSign,
      iconColor: 'text-green-500',
    },
    {
      label: 'Total Orders',
      value: data.totalOrders.toString(),
      change: data.ordersChange,
      icon: ShoppingBag,
      iconColor: 'text-blue-500',
    },
    {
      label: 'Avg Prep Time',
      value: `${data.avgPrepTime} min`,
      change: data.prepTimeChange,
      icon: Clock,
      iconColor: 'text-orange-500',
    },
    {
      label: 'Avg Rating',
      value: data.avgRating,
      change: Number(data.ratingChange),
      icon: Star,
      iconColor: 'text-yellow-500',
    },
  ];

  const maxOrders = Math.max(...mockHourlyData.map((d) => d.orders));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-montserrat text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your shop's performance and insights.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Time range selector */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            {(['today', '7days', '30days'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium transition-colors',
                  timeRange === range
                    ? 'bg-brand text-white'
                    : 'bg-background text-muted-foreground hover:bg-muted'
                )}
              >
                {range === 'today' ? 'Today' : range === '7days' ? '7 Days' : '30 Days'}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground font-lexend">{metric.label}</span>
                <metric.icon className={cn('h-4 w-4', metric.iconColor)} />
              </div>
              <div className="flex items-end justify-between">
                <p className="text-xl font-bold font-poppins text-foreground">{metric.value}</p>
                <div
                  className={cn(
                    'flex items-center gap-0.5 text-xs font-medium',
                    metric.change >= 0 ? 'text-green-500' : 'text-red-500'
                  )}
                >
                  {metric.change >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {Math.abs(metric.change)}%
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Hourly Orders Chart */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold font-poppins text-foreground mb-4">
              Orders by Hour
            </h3>
            <div className="flex items-end gap-1 h-40">
              {mockHourlyData.map((item) => (
                <div key={item.hour} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-brand/80 rounded-t transition-all hover:bg-brand"
                    style={{ height: `${(item.orders / maxOrders) * 100}%` }}
                    title={`${item.orders} orders`}
                  />
                  <span className="text-[9px] text-muted-foreground rotate-45 origin-left">
                    {item.hour}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Items */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold font-poppins text-foreground mb-4">
              Top Selling Items
            </h3>
            <div className="space-y-3">
              {mockTopItems.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span
                    className={cn(
                      'w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold',
                      idx === 0
                        ? 'bg-yellow-100 text-yellow-700'
                        : idx === 1
                        ? 'bg-gray-100 text-gray-700'
                        : idx === 2
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.orders} orders</p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    AED {item.revenue.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Breakdown */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold font-poppins text-foreground mb-4">
            Order Status Breakdown
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { status: 'Completed', count: 342, color: 'bg-green-500' },
              { status: 'Preparing', count: 12, color: 'bg-blue-500' },
              { status: 'Ready', count: 5, color: 'bg-purple-500' },
              { status: 'Rejected', count: 8, color: 'bg-red-500' },
              { status: 'Refunded', count: 3, color: 'bg-orange-500' },
            ].map((item) => (
              <div key={item.status} className="text-center">
                <div
                  className={cn('w-3 h-3 rounded-full mx-auto mb-2', item.color)}
                />
                <p className="text-lg font-bold font-poppins text-foreground">{item.count}</p>
                <p className="text-xs text-muted-foreground">{item.status}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
