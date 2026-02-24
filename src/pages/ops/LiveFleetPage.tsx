// ──────────────────────────────────────
// Live Fleet Page — Phase 8
// Real-time map with device positions & status
// ──────────────────────────────────────

import { useState, useRef, useCallback, useEffect } from 'react';
import { useTrolleysStore } from '@/store/trolleys.store';
import { useFleetLive } from '@/hooks/useFleetLive';
import { useTheme } from '@/hooks/useTheme';
import { FleetHealthBar, DeviceStatusCard } from '@/components/ops';
import { AirportMapSVG } from '@/components/map/AirportMapSVG';
import { trolleyPositions } from '@/data/mock/map.mock';
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
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type DeviceFilter = 'all' | 'online' | 'offline' | 'low-battery' | 'moving' | 'idle';

interface LiveFleetPageProps {
  embedded?: boolean;
  initialDeviceId?: string | null;
}

export default function LiveFleetPage({ embedded = false, initialDeviceId = null }: LiveFleetPageProps) {
  const { trolleys } = useTrolleysStore();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  useFleetLive(); // Enable live simulation
  
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<DeviceFilter>('all');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(initialDeviceId);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [activeLayers] = useState(['zones', 'trolleys', 'gates', 'pois']);
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Lookup trolley floor from map positions
  const getTrolleyFloor = useCallback((trolleyId: string): number | null => {
    const pos = trolleyPositions.find((t) => t.trolley_id === trolleyId);
    return pos?.floor ?? null;
  }, []);

  // Sync selectedDeviceId when initialDeviceId prop changes (e.g. navigation from fleet overview)
  useEffect(() => {
    if (initialDeviceId && initialDeviceId !== selectedDeviceId) {
      setSelectedDeviceId(initialDeviceId);
      // Auto-switch floor to match the trolley's location
      const floor = getTrolleyFloor(initialDeviceId);
      if (floor && floor !== selectedFloor) {
        setSelectedFloor(floor);
      }
      // Zoom in to pinpoint the trolley
      setZoomLevel(1.6);
    }
  }, [initialDeviceId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Ref for scrollable device list — used to stop event propagation
  const deviceListRef = useRef<HTMLDivElement>(null);

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

  const handleDeviceClick = useCallback((id: string) => {
    setSelectedDeviceId((prev) => {
      if (prev === id) {
        setZoomLevel(1);
        return null;
      }
      // Auto-switch floor and zoom in
      const floor = getTrolleyFloor(id);
      if (floor && floor !== selectedFloor) {
        setSelectedFloor(floor);
      }
      setZoomLevel(1.6);
      return id;
    });
  }, [getTrolleyFloor, selectedFloor]);

  const handleTrolleyClickOnMap = useCallback((trolleyId: string) => {
    setSelectedDeviceId((prev) => {
      if (prev === trolleyId) {
        setZoomLevel(1);
        return null;
      }
      setZoomLevel(1.6);
      return trolleyId;
    });
  }, []);

  // Scroll selected device card into view when selection changes
  useEffect(() => {
    if (selectedDeviceId && deviceListRef.current) {
      const el = deviceListRef.current.querySelector(`[data-device-id="${selectedDeviceId}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedDeviceId]);

  // Prevent wheel events on the device list from propagating to the page
  useEffect(() => {
    const el = deviceListRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const atTop = scrollTop === 0 && e.deltaY < 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0;
      // Only stop propagation if there's room to scroll in the direction
      if (!atTop && !atBottom) {
        e.stopPropagation();
      }
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      {!embedded && (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 flex-shrink-0">
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
      )}

      {/* Fleet Health Bar */}
      <div className="flex-shrink-0">
        <FleetHealthBar className="mb-6" />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 flex-shrink-0">
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

      {/* Main Content — Map + Device Panel side-by-side, no page scroll */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 overflow-hidden">
        {/* Map — always fills available space */}
        <Card className={cn(
          'flex-1 flex flex-col min-h-[400px] order-1 lg:order-2 overflow-hidden',
          isMapFullscreen && 'fixed inset-4 z-50'
        )}>
          <CardHeader className="pb-3 flex-row items-center justify-between flex-shrink-0">
            <div>
              <CardTitle className="text-base">Fleet Map</CardTitle>
              <CardDescription>
                {selectedDevice ? `Tracking: ${selectedDevice.imei}` : 'Click a device to track'}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {/* Floor Selector */}
              <Select value={String(selectedFloor)} onValueChange={(v) => setSelectedFloor(Number(v))}>
                <SelectTrigger className="w-28 h-8 text-xs">
                  <SelectValue placeholder="Floor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Departures</SelectItem>
                  <SelectItem value="2">Arrivals</SelectItem>
                  <SelectItem value="3">VIP & Exec</SelectItem>
                </SelectContent>
              </Select>
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
          
          <CardContent className="flex-1 relative min-h-0 p-2">
            {/* Shared Airport Map — consistent with Terminal Map & Heatmap views */}
            <div className="absolute inset-0 overflow-auto rounded-lg">
              <div
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.3s ease',
                  width: '100%',
                  height: '100%',
                }}
              >
                <AirportMapSVG
                  floor={selectedFloor}
                  activeLayers={activeLayers}
                  selectedTrolleyId={selectedDeviceId}
                  highlightTrolleyId={selectedDeviceId}
                  isDark={isDark}
                  onTrolleyClick={handleTrolleyClickOnMap}
                />
              </div>
            </div>
            
            {/* Selected device info overlay on map */}
            {selectedDevice && (
              <div className="absolute bottom-3 left-3 right-3 max-w-sm">
                <div className="relative">
                  <button
                    className="absolute -top-2 -right-2 z-10 p-1 rounded-full bg-background border shadow-sm hover:bg-muted"
                    onClick={() => { setSelectedDeviceId(null); setZoomLevel(1); }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <DeviceStatusCard device={selectedDevice} isSelected />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device Panel — fixed width, capped height, isolated scroll */}
        <Card className="lg:w-80 xl:w-96 flex flex-col order-2 lg:order-1 h-[360px] lg:h-auto lg:max-h-full overflow-hidden">
          <CardHeader className="pb-3 flex-shrink-0">
            <CardTitle className="text-base">Devices</CardTitle>
            <CardDescription>
              {filteredDevices.length} of {trolleys.length} devices
            </CardDescription>
          </CardHeader>
          
          {/* Filters */}
          <div className="px-4 pb-3 space-y-2 flex-shrink-0">
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
          
          {/* Scrollable device list — isolated scroll container */}
          <div
            ref={deviceListRef}
            className="flex-1 overflow-y-auto overscroll-contain min-h-0 px-4 pb-4 space-y-2"
          >
            {filteredDevices.map((trolley: Trolley) => (
              <div key={trolley.id} data-device-id={trolley.id}>
                <DeviceStatusCard
                  device={trolley}
                  isSelected={trolley.id === selectedDeviceId}
                  onClick={() => handleDeviceClick(trolley.id)}
                />
              </div>
            ))}
            
            {filteredDevices.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No devices match your filters</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
