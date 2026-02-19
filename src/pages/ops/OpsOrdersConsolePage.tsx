// ──────────────────────────────────────
// Ops Orders Console Page — Phase 8
// Unified order management for operations
// ──────────────────────────────────────

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { 
  ClipboardList, 
  Search, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  Package,
  User,
  MapPin,
  MoreHorizontal,
  Play,
  RotateCcw,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { opsOrdersData, opsOverrideReasons } from '@/data/mock/ops-orders.mock';
import type { Order, OrderStatus } from '@/types/order.types';

// Merchant lookup for display
const merchantNames: Record<string, string> = {
  'SHOP-001': 'Costa Coffee',
  'SHOP-003': "McDonald's",
  'SHOP-004': 'Dubai Duty Free',
  'SHOP-005': 'WHSmith',
  'SHOP-012': 'Shake Shack',
  'SHOP-018': 'Paul Bakery',
};

function getStatusColor(status: OrderStatus) {
  switch (status) {
    case 'new': return 'bg-amber-500/20 text-amber-500';
    case 'accepted': return 'bg-sky-500/20 text-sky-500';
    case 'preparing': return 'bg-blue-500/20 text-blue-500';
    case 'ready': return 'bg-violet-500/20 text-violet-500';
    case 'in_transit': return 'bg-cyan-500/20 text-cyan-500';
    case 'delivered': return 'bg-emerald-500/20 text-emerald-500';
    case 'rejected': return 'bg-red-500/20 text-red-500';
    case 'failed': return 'bg-red-500/20 text-red-500';
    case 'refund_requested': return 'bg-orange-500/20 text-orange-500';
    case 'refunded': return 'bg-gray-500/20 text-gray-500';
    default: return 'bg-gray-500/20 text-gray-500';
  }
}

function getStatusIcon(status: OrderStatus) {
  switch (status) {
    case 'new': return Clock;
    case 'accepted': return CheckCircle;
    case 'preparing': return RefreshCw;
    case 'ready': return Package;
    case 'in_transit': return MapPin;
    case 'delivered': return CheckCircle;
    case 'rejected': return XCircle;
    case 'failed': return XCircle;
    case 'refund_requested': return AlertCircle;
    case 'refunded': return AlertCircle;
    default: return AlertCircle;
  }
}

export default function OpsOrdersConsolePage({ embedded }: { embedded?: boolean }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');
  const [overrideNotes, setOverrideNotes] = useState('');

  // Use mock data for now
  const orders: Order[] = opsOrdersData;

  // Filter orders
  const filteredOrders = orders.filter((order: Order) => {
    if (search) {
      const searchLower = search.toLowerCase();
      const merchantName = merchantNames[order.shop_id] || order.shop_id;
      if (!order.id.toLowerCase().includes(searchLower) &&
          !order.passenger_alias.toLowerCase().includes(searchLower) &&
          !merchantName.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }
    return true;
  });

  // Stats
  const newCount = orders.filter((o: Order) => o.status === 'new').length;
  const inProgressCount = orders.filter((o: Order) => ['accepted', 'preparing', 'ready', 'in_transit'].includes(o.status)).length;
  const completedCount = orders.filter((o: Order) => o.status === 'delivered').length;
  const failedCount = orders.filter((o: Order) => ['rejected', 'failed'].includes(o.status)).length;

  // selectedOrderId is used for order selection/override functionality

  const handleOverride = () => {
    // Would dispatch to store
    console.log('Override:', { orderId: selectedOrderId, reason: overrideReason, notes: overrideNotes });
    setIsOverrideOpen(false);
    setOverrideReason('');
    setOverrideNotes('');
    setSelectedOrderId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {!embedded && (
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-primary" />
              Operations Console
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Unified order management and tracking
            </p>
          </div>
        )}
        
        <div className="flex items-center gap-2 ml-auto">
          <Badge variant="outline" className="gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Updates
          </Badge>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setStatusFilter('new')}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{newCount}</p>
                <p className="text-xs text-muted-foreground">New</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setStatusFilter('preparing')}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <RefreshCw className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inProgressCount}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setStatusFilter('delivered')}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedCount}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setStatusFilter('rejected')}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{failedCount}</p>
                <p className="text-xs text-muted-foreground">Failed/Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders, customers, merchants..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={(v: string) => setStatusFilter(v as OrderStatus | 'all')}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            
            {statusFilter !== 'all' && (
              <Button variant="ghost" onClick={() => setStatusFilter('all')}>
                Clear Filter
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Orders</CardTitle>
          <CardDescription>
            {filteredOrders.length} orders found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.slice(0, 20).map((order) => {
                  const StatusIcon = getStatusIcon(order.status);
                  return (
                    <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">{order.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{order.passenger_alias}</span>
                        </div>
                      </TableCell>
                      <TableCell>{merchantNames[order.shop_id] || order.shop_id}</TableCell>
                      <TableCell>
                        <Badge className={cn('capitalize gap-1', getStatusColor(order.status))}>
                          <StatusIcon className="h-3 w-3" />
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">AED {order.total.toFixed(2)}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <ChevronRight className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {order.status === 'new' && (
                              <DropdownMenuItem>
                                <Play className="h-4 w-4 mr-2" />
                                Accept Order
                              </DropdownMenuItem>
                            )}
                            {order.status === 'preparing' && (
                              <DropdownMenuItem>
                                <Package className="h-4 w-4 mr-2" />
                                Mark Ready
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-amber-500"
                              onClick={() => {
                                setSelectedOrderId(order.id);
                                setIsOverrideOpen(true);
                              }}
                            >
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Override
                            </DropdownMenuItem>
                            {order.status !== 'rejected' && order.status !== 'failed' && order.status !== 'delivered' && order.status !== 'refunded' && (
                              <DropdownMenuItem className="text-red-500">
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancel Order
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-1">No orders found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Override Dialog */}
      <Dialog open={isOverrideOpen} onOpenChange={setIsOverrideOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Override Order</DialogTitle>
            <DialogDescription>
              Apply an override action to order {selectedOrderId}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Reason Code</Label>
              <Select value={overrideReason} onValueChange={setOverrideReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason..." />
                </SelectTrigger>
                <SelectContent>
                  {opsOverrideReasons.map((reason: { code: string; label: string }) => (
                    <SelectItem key={reason.code} value={reason.code}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Additional details for the override..."
                value={overrideNotes}
                onChange={(e) => setOverrideNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOverrideOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleOverride} disabled={!overrideReason}>
              Apply Override
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
