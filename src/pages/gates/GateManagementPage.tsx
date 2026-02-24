// ──────────────────────────────────────
// Gate Management Page — Command Center
// Gate surge monitoring and management
// ──────────────────────────────────────

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import {
  DoorOpen,
  Search,
  RefreshCw,
  AlertTriangle,
  Users,
  Plane,
  Clock,
  ShieldAlert,
  Lock,
  Unlock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type GateStatus = 'normal' | 'surge' | 'boarding' | 'closed' | 'maintenance';

interface Gate {
  id: string;
  name: string;
  terminal: string;
  zone: string;
  status: GateStatus;
  flight_number: string | null;
  departure_time: string | null;
  passenger_count: number;
  trolley_count: number;
  active_orders: number;
  is_restricted: boolean;
  safety_override_active: boolean;
  last_updated: string;
}

const mockGates: Gate[] = [
  { id: 'G-A01', name: 'Gate A1', terminal: 'Terminal 1', zone: 'Zone A', status: 'boarding', flight_number: 'EK-205', departure_time: '2026-02-24T11:30:00Z', passenger_count: 245, trolley_count: 12, active_orders: 8, is_restricted: false, safety_override_active: false, last_updated: '2026-02-24T10:50:00Z' },
  { id: 'G-A02', name: 'Gate A2', terminal: 'Terminal 1', zone: 'Zone A', status: 'surge', flight_number: 'QR-781', departure_time: '2026-02-24T12:00:00Z', passenger_count: 310, trolley_count: 18, active_orders: 15, is_restricted: false, safety_override_active: false, last_updated: '2026-02-24T10:48:00Z' },
  { id: 'G-B05', name: 'Gate B5', terminal: 'Terminal 2', zone: 'Zone B', status: 'normal', flight_number: 'SQ-422', departure_time: '2026-02-24T13:15:00Z', passenger_count: 180, trolley_count: 8, active_orders: 3, is_restricted: false, safety_override_active: false, last_updated: '2026-02-24T10:45:00Z' },
  { id: 'G-B07', name: 'Gate B7', terminal: 'Terminal 2', zone: 'Zone B', status: 'normal', flight_number: null, departure_time: null, passenger_count: 20, trolley_count: 2, active_orders: 0, is_restricted: false, safety_override_active: false, last_updated: '2026-02-24T10:40:00Z' },
  { id: 'G-C03', name: 'Gate C3', terminal: 'Terminal 3', zone: 'Zone C', status: 'closed', flight_number: null, departure_time: null, passenger_count: 0, trolley_count: 0, active_orders: 0, is_restricted: true, safety_override_active: false, last_updated: '2026-02-24T09:00:00Z' },
  { id: 'G-C08', name: 'Gate C8', terminal: 'Terminal 3', zone: 'Zone C', status: 'maintenance', flight_number: null, departure_time: null, passenger_count: 0, trolley_count: 1, active_orders: 0, is_restricted: true, safety_override_active: false, last_updated: '2026-02-24T08:00:00Z' },
  { id: 'G-A12', name: 'Gate A12', terminal: 'Terminal 1', zone: 'Zone A', status: 'boarding', flight_number: 'EK-873', departure_time: '2026-02-24T11:45:00Z', passenger_count: 198, trolley_count: 10, active_orders: 6, is_restricted: false, safety_override_active: true, last_updated: '2026-02-24T10:52:00Z' },
];

const statusConfig: Record<GateStatus, { label: string; color: string }> = {
  normal: { label: 'Normal', color: 'bg-emerald-500/20 text-emerald-500' },
  surge: { label: 'Surge', color: 'bg-red-500/20 text-red-500' },
  boarding: { label: 'Boarding', color: 'bg-blue-500/20 text-blue-500' },
  closed: { label: 'Closed', color: 'bg-gray-500/20 text-gray-500' },
  maintenance: { label: 'Maintenance', color: 'bg-purple-500/20 text-purple-500' },
};

export default function GateManagementPage() {
  const [gates, setGates] = useState<Gate[]>(mockGates);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<GateStatus | 'all'>('all');
  const [terminalFilter, setTerminalFilter] = useState<string>('all');
  const [selectedGate, setSelectedGate] = useState<Gate | null>(null);
  const [isRestrictionDialogOpen, setIsRestrictionDialogOpen] = useState(false);
  const [restrictionReason, setRestrictionReason] = useState('');

  const handleRestrictionClick = (gate: Gate) => {
    setSelectedGate(gate);
    setRestrictionReason('');
    setIsRestrictionDialogOpen(true);
  };

  const handleToggleRestriction = () => {
    if (!selectedGate) return;
    const newRestricted = !selectedGate.is_restricted;
    setGates(prev => prev.map(g => 
      g.id === selectedGate.id 
        ? { ...g, is_restricted: newRestricted, last_updated: new Date().toISOString() }
        : g
    ));
    toast.success(
      newRestricted 
        ? `${selectedGate.name} is now restricted` 
        : `${selectedGate.name} restriction removed`
    );
    setIsRestrictionDialogOpen(false);
    setSelectedGate(null);
  };

  const handleToggleSafetyOverride = () => {
    if (!selectedGate) return;
    const newOverride = !selectedGate.safety_override_active;
    setGates(prev => prev.map(g => 
      g.id === selectedGate.id 
        ? { ...g, safety_override_active: newOverride, last_updated: new Date().toISOString() }
        : g
    ));
    toast.success(
      newOverride 
        ? `Safety override activated for ${selectedGate.name}` 
        : `Safety override deactivated for ${selectedGate.name}`
    );
    setIsRestrictionDialogOpen(false);
    setSelectedGate(null);
  };

  const filtered = gates.filter((g) => {
    if (search && !g.name.toLowerCase().includes(search.toLowerCase()) && !g.flight_number?.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && g.status !== statusFilter) return false;
    if (terminalFilter !== 'all' && g.terminal !== terminalFilter) return false;
    return true;
  });

  const surgeCount = gates.filter((g) => g.status === 'surge').length;
  const boardingCount = gates.filter((g) => g.status === 'boarding').length;
  const totalOrders = gates.reduce((s, g) => s + g.active_orders, 0);
  const restrictedCount = gates.filter((g) => g.is_restricted).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <DoorOpen className="h-6 w-6 text-primary" />
            Gate Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Monitor gate activity, surge alerts, and delivery zones
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </Badge>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Surge Alerts</p>
                <p className="text-2xl font-bold text-red-500">{surgeCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Boarding</p>
                <p className="text-2xl font-bold text-blue-500">{boardingCount}</p>
              </div>
              <Plane className="h-8 w-8 text-blue-500/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Active Orders</p>
                <p className="text-2xl font-bold text-primary">{totalOrders}</p>
              </div>
              <Clock className="h-8 w-8 text-primary/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Restricted Zones</p>
                <p className="text-2xl font-bold text-amber-500">{restrictedCount}</p>
              </div>
              <ShieldAlert className="h-8 w-8 text-amber-500/30" />
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
              <Input placeholder="Search gates or flights..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as GateStatus | 'all')}>
              <SelectTrigger className="w-full md:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="surge">Surge</SelectItem>
                <SelectItem value="boarding">Boarding</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={terminalFilter} onValueChange={setTerminalFilter}>
              <SelectTrigger className="w-full md:w-40"><SelectValue placeholder="Terminal" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Terminals</SelectItem>
                <SelectItem value="Terminal 1">Terminal 1</SelectItem>
                <SelectItem value="Terminal 2">Terminal 2</SelectItem>
                <SelectItem value="Terminal 3">Terminal 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Gates Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gates</CardTitle>
          <CardDescription>{filtered.length} gates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gate</TableHead>
                  <TableHead>Terminal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Flight</TableHead>
                  <TableHead>Passengers</TableHead>
                  <TableHead>Trolleys</TableHead>
                  <TableHead>Active Orders</TableHead>
                  <TableHead>Restrictions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((gate) => (
                  <TableRow key={gate.id} className={cn(gate.status === 'surge' && 'bg-red-500/5')}>
                    <TableCell className="font-mono font-medium">{gate.name}</TableCell>
                    <TableCell>{gate.terminal}</TableCell>
                    <TableCell>
                      <Badge className={cn('gap-1', statusConfig[gate.status].color)}>
                        {statusConfig[gate.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {gate.flight_number ? (
                        <div>
                          <p className="font-mono text-sm">{gate.flight_number}</p>
                          {gate.departure_time && (
                            <p className="text-xs text-muted-foreground">
                              {new Date(gate.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="font-mono">{gate.passenger_count}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{gate.trolley_count}</TableCell>
                    <TableCell className="font-mono">{gate.active_orders}</TableCell>
                    <TableCell>
                      <div 
                        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleRestrictionClick(gate)}
                        title="Click to manage restrictions"
                      >
                        {gate.is_restricted ? (
                          <Badge variant="destructive" className="gap-1 text-[10px]">
                            <Lock className="h-3 w-3" />
                            Restricted
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1 text-[10px]">
                            <Unlock className="h-3 w-3" />
                            Open
                          </Badge>
                        )}
                        {gate.safety_override_active && (
                          <Badge className="bg-amber-500/20 text-amber-500 text-[10px] gap-1">
                            <ShieldAlert className="h-3 w-3" />
                            Override
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <DoorOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-1">No gates found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Restriction Management Dialog */}
      <Dialog open={isRestrictionDialogOpen} onOpenChange={setIsRestrictionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" />
              Gate Restrictions — {selectedGate?.name}
            </DialogTitle>
            <DialogDescription>
              Manage access restrictions and safety overrides for this gate
            </DialogDescription>
          </DialogHeader>
          
          {selectedGate && (
            <div className="space-y-4 py-4">
              {/* Current Status */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium">Current Status</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {selectedGate.flight_number 
                      ? `Flight ${selectedGate.flight_number} • ${selectedGate.passenger_count} passengers`
                      : 'No active flight'
                    }
                  </p>
                </div>
                <Badge className={cn(statusConfig[selectedGate.status].color)}>
                  {statusConfig[selectedGate.status].label}
                </Badge>
              </div>

              {/* Restriction Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="text-sm font-medium flex items-center gap-2">
                    {selectedGate.is_restricted ? <Lock className="h-4 w-4 text-red-500" /> : <Unlock className="h-4 w-4 text-emerald-500" />}
                    Gate Restriction
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {selectedGate.is_restricted 
                      ? 'Trolleys cannot enter this gate area'
                      : 'Gate is open for trolley access'
                    }
                  </p>
                </div>
                <Button 
                  variant={selectedGate.is_restricted ? 'outline' : 'destructive'}
                  size="sm"
                  onClick={handleToggleRestriction}
                >
                  {selectedGate.is_restricted ? 'Remove Restriction' : 'Add Restriction'}
                </Button>
              </div>

              {/* Safety Override Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="text-sm font-medium flex items-center gap-2">
                    <ShieldAlert className={cn('h-4 w-4', selectedGate.safety_override_active ? 'text-amber-500' : 'text-muted-foreground')} />
                    Safety Override
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {selectedGate.safety_override_active 
                      ? 'Manual safety override is active'
                      : 'Automatic safety rules apply'
                    }
                  </p>
                </div>
                <Button 
                  variant={selectedGate.safety_override_active ? 'outline' : 'secondary'}
                  size="sm"
                  onClick={handleToggleSafetyOverride}
                >
                  {selectedGate.safety_override_active ? 'Deactivate Override' : 'Activate Override'}
                </Button>
              </div>

              {/* Reason/Notes */}
              <div className="space-y-2">
                <Label>Notes (optional)</Label>
                <Textarea
                  placeholder="Add a reason for this change..."
                  value={restrictionReason}
                  onChange={(e) => setRestrictionReason(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRestrictionDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
