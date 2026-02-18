// ──────────────────────────────────────
// Gate Surge Page — Phase 8
// Monitor and respond to gate surge events
// ──────────────────────────────────────

import { useState, useEffect } from 'react';
import { useVenueStore } from '@/store/venue.store';
import { useGateSurge } from '@/hooks/useGateSurge';
import { GateSurgeAlert } from '@/components/ops';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/Card';
import { 
  Plane, 
  Users, 
  AlertTriangle,
  TrendingUp,
  MapPin,
  ShoppingCart,
  RefreshCw,
  Bell,
  BellOff,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { cn } from '@/lib/utils';

// Mock passenger flow data
const passengerFlowData = [
  { time: '06:00', passengers: 120 },
  { time: '07:00', passengers: 180 },
  { time: '08:00', passengers: 250 },
  { time: '09:00', passengers: 320 },
  { time: '10:00', passengers: 280 },
  { time: '11:00', passengers: 220 },
  { time: '12:00', passengers: 190 },
  { time: '13:00', passengers: 240 },
  { time: '14:00', passengers: 310 },
  { time: '15:00', passengers: 350 },
  { time: '16:00', passengers: 280 },
  { time: '17:00', passengers: 200 },
];

export default function GateSurgePage() {
  const { getAllGates, randomizePassengerCounts } = useVenueStore();
  const { surgeGates, elevatedGates, isSurgeActive } = useGateSurge();
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [selectedGate, setSelectedGate] = useState<string | null>(null);
  
  const gates = getAllGates();

  // Simulate passenger updates
  useEffect(() => {
    const interval = setInterval(() => {
      randomizePassengerCounts();
    }, 10000); // Every 10 seconds
    return () => clearInterval(interval);
  }, [randomizePassengerCounts]);

  const totalPassengers = gates.reduce((sum: number, g) => sum + (g.passengerCount || 0), 0);
  const boardingGates = gates.filter(g => g.status === 'boarding').length;

  const selectedGateData = selectedGate ? gates.find(g => g.id === selectedGate) : null;

  return (
    <div className="space-y-6">
      {/* Surge Alert Banner */}
      {isSurgeActive && alertsEnabled && (
        <GateSurgeAlert
          surgeGates={surgeGates}
          onGateClick={(gate) => {
            setSelectedGate(gate.id);
          }}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Plane className="h-6 w-6 text-primary" />
            Gate Surge Monitor
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Real-time passenger flow and surge detection
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={alertsEnabled ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAlertsEnabled(!alertsEnabled)}
          >
            {alertsEnabled ? (
              <>
                <Bell className="h-4 w-4 mr-1" />
                Alerts On
              </>
            ) : (
              <>
                <BellOff className="h-4 w-4 mr-1" />
                Alerts Off
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={() => randomizePassengerCounts()}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalPassengers}</p>
                <p className="text-xs text-muted-foreground">Total Passengers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                'p-2 rounded-lg',
                surgeGates.length > 0 ? 'bg-red-500/20' : 'bg-emerald-500/20'
              )}>
                <AlertTriangle className={cn(
                  'h-5 w-5',
                  surgeGates.length > 0 ? 'text-red-500' : 'text-emerald-500'
                )} />
              </div>
              <div>
                <p className="text-2xl font-bold">{surgeGates.length}</p>
                <p className="text-xs text-muted-foreground">Surge Gates</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <TrendingUp className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{elevatedGates.length}</p>
                <p className="text-xs text-muted-foreground">Elevated</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Plane className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{boardingGates}</p>
                <p className="text-xs text-muted-foreground">Boarding</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gate Grid */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Gates Overview</CardTitle>
            <CardDescription>
              Click a gate for details • Red = Surge ({'>'}200) • Amber = Elevated ({'>'}150)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {gates.map((gate) => {
                const isSurge = gate.passengerCount >= 200;
                const isElevated = gate.passengerCount >= 150;
                const isSelected = gate.id === selectedGate;

                return (
                  <button
                    key={gate.id}
                    className={cn(
                      'p-3 rounded-lg border-2 text-center transition-all',
                      isSurge 
                        ? 'bg-red-500/20 border-red-500 text-red-500' 
                        : isElevated 
                        ? 'bg-amber-500/20 border-amber-500 text-amber-500'
                        : 'bg-card border-border hover:border-primary',
                      isSelected && 'ring-2 ring-primary ring-offset-2'
                    )}
                    onClick={() => setSelectedGate(gate.id)}
                  >
                    <p className="font-bold text-lg">{gate.code}</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Users className="h-3 w-3" />
                      <span className="text-sm font-mono">{gate.passengerCount}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        'mt-1 text-[10px] capitalize',
                        gate.status === 'boarding' && 'border-emerald-500 text-emerald-500',
                        gate.status === 'delayed' && 'border-amber-500 text-amber-500',
                        gate.status === 'closed' && 'border-red-500 text-red-500'
                      )}
                    >
                      {gate.status}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Gate Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Gate Details</CardTitle>
            <CardDescription>
              {selectedGateData ? `Gate ${selectedGateData.code}` : 'Select a gate'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedGateData ? (
              <div className="space-y-4">
                <div className="text-center py-4 bg-muted/50 rounded-lg">
                  <p className="text-4xl font-bold">{selectedGateData.passengerCount}</p>
                  <p className="text-sm text-muted-foreground">Passengers</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge className={cn(
                      'capitalize',
                      selectedGateData.status === 'boarding' && 'bg-emerald-500',
                      selectedGateData.status === 'delayed' && 'bg-amber-500',
                      selectedGateData.status === 'closed' && 'bg-red-500'
                    )}>
                      {selectedGateData.status}
                    </Badge>
                  </div>
                  
                  {selectedGateData.flightNumber && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Flight</span>
                      <span className="font-mono">{selectedGateData.flightNumber}</span>
                    </div>
                  )}
                  
                  {selectedGateData.destination && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Destination</span>
                      <span>{selectedGateData.destination}</span>
                    </div>
                  )}
                  
                  {selectedGateData.departureTime && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Departure</span>
                      <span>{selectedGateData.departureTime}</span>
                    </div>
                  )}
                </div>
                
                <div className="pt-4 border-t space-y-2">
                  <Button className="w-full" size="sm">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Deploy Trolleys
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    View on Map
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Select a gate to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Passenger Flow Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Passenger Flow</CardTitle>
          <CardDescription>
            Historical passenger counts with surge threshold
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={passengerFlowData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="time" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))' 
                  }} 
                />
                <ReferenceLine y={200} stroke="#ef4444" strokeDasharray="5 5" label="Surge" />
                <ReferenceLine y={150} stroke="#f59e0b" strokeDasharray="5 5" label="Elevated" />
                <Line
                  type="monotone"
                  dataKey="passengers"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
