// ──────────────────────────────────────
// Live Fleet Page — Phase 8
// Real-time map with device positions & status
// ──────────────────────────────────────

import { useState } from 'react';
import { useTrolleysStore } from '@/store/trolleys.store';
import { useFleetLive } from '@/hooks/useFleetLive';
import { FleetHealthBar, DeviceStatusCard } from '@/components/ops';
import type { Trolley } from '@/types/trolley.types';
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
  Map, 
  Search, 
  Filter, 
  RefreshCw, 
  Layers,
  Battery,
  Wifi,
  WifiOff,
  AlertTriangle,
  ShoppingCart,
  Maximize2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type DeviceFilter = 'all' | 'online' | 'offline' | 'low-battery' | 'moving' | 'idle';

export default function LiveFleetPage() {
  const { trolleys } = useTrolleysStore();
  useFleetLive(); // Enable live simulation
  
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<DeviceFilter>('all');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);

  // Filter trolleys based on search and filter
  const filteredDevices = trolleys.filter((trolley: Trolley) => {
    // Search filter
    if (search && !trolley.imei.toLowerCase().includes(search.toLowerCase()) && 
        !trolley.id.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    // Status filter
    switch (filter) {
      case 'online':
        return trolley.status === 'active' || trolley.status === 'idle';
      case 'offline':
        return trolley.status === 'offline';
      case 'low-battery':
        return trolley.battery < 20;
      case 'moving':
        return trolley.status === 'active';
      case 'idle':
        return trolley.status === 'idle';
      default:
        return true;
    }
  });

  // Stats
  const onlineCount = trolleys.filter((t: Trolley) => t.status === 'active' || t.status === 'idle').length;
  const offlineCount = trolleys.filter((t: Trolley) => t.status === 'offline').length;
  const lowBatteryCount = trolleys.filter((t: Trolley) => t.battery < 20).length;
  const movingCount = trolleys.filter((t: Trolley) => t.status === 'active').length;

  const selectedDevice = selectedDeviceId 
    ? trolleys.find((t: Trolley) => t.id === selectedDeviceId) 
    : null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Map className="h-6 w-6 text-primary" />
            Live Fleet Map
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Real-time device positions and status monitoring
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

      {/* Fleet Health Bar */}
      <FleetHealthBar className="mb-6" />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setFilter('online')}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Wifi className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{onlineCount}</p>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setFilter('offline')}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <WifiOff className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{offlineCount}</p>
                <p className="text-xs text-muted-foreground">Offline</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setFilter('low-battery')}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Battery className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{lowBatteryCount}</p>
                <p className="text-xs text-muted-foreground">Low Battery</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setFilter('moving')}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <ShoppingCart className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{movingCount}</p>
                <p className="text-xs text-muted-foreground">In Motion</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Device List */}
        <Card className="lg:col-span-1 flex flex-col min-h-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Devices</CardTitle>
            <CardDescription>
              {filteredDevices.length} of {trolleys.length} devices
            </CardDescription>
          </CardHeader>
          
          {/* Filters */}
          <div className="px-4 pb-3 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search devices..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={filter} onValueChange={(v) => setFilter(v as DeviceFilter)}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Devices</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="low-battery">Low Battery</SelectItem>
                <SelectItem value="moving">Moving</SelectItem>
                <SelectItem value="idle">Idle</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Device List */}
          <CardContent className="flex-1 overflow-y-auto space-y-2 pt-0">
            {filteredDevices.map((trolley: Trolley) => (
              <DeviceStatusCard
                key={trolley.id}
                device={trolley}
                isSelected={trolley.id === selectedDeviceId}
                onClick={() => setSelectedDeviceId(trolley.id)}
              />
            ))}
            
            {filteredDevices.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No devices match your filters</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Map Placeholder */}
        <Card className={cn(
          'lg:col-span-2 flex flex-col min-h-[400px]',
          isMapFullscreen && 'fixed inset-4 z-50 lg:col-span-1'
        )}>
          <CardHeader className="pb-3 flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Fleet Map</CardTitle>
              <CardDescription>
                {selectedDevice ? `Tracking: ${selectedDevice.imei}` : 'Click a device to track'}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Layers className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setIsMapFullscreen(!isMapFullscreen)}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 relative">
            {/* Map placeholder - would integrate with actual map component */}
            <div className="absolute inset-0 bg-muted/30 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Map className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground text-sm">
                  Interactive fleet map
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {trolleys.length} devices tracked
                </p>
              </div>
            </div>
            
            {/* Device markers would go here */}
            {selectedDevice && (
              <div className="absolute bottom-4 left-4 right-4">
                <DeviceStatusCard device={selectedDevice} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
