import { useState, useCallback, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useMapStore } from '@/store/map.store';
import { mapZones, trolleyPositions } from '@/data/mock/map.mock';
import { shopsData } from '@/data/mock/shops.mock';
import { trolleysData } from '@/data/mock/trolleys.mock';
import { AirportMapSVG } from '@/components/map/AirportMapSVG';
import { MapLegend } from '@/components/map/MapLegend';
// MapFilters removed per cleanup requirements
import { MapTooltip } from '@/components/map/MapTooltip';
import { PageHeader } from '@/components/common/PageHeader';
import { TrolleyStatusBadge } from '@/components/trolleys/TrolleyStatusBadge';
import { BatteryIndicator } from '@/components/trolleys/BatteryIndicator';
import { ContractStatusBadge } from '@/components/shops/ContractStatusBadge';
import { ShopCategoryBadge } from '@/components/shops/ShopCategoryBadge';
import type { MapZone } from '@/types/map.types';
import {
  ZoomIn,
  ZoomOut,
  X,
  MapPin,
  ShoppingCart,
  Store,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useNavigate } from 'react-router-dom';

export default function TerminalMapPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const {
    activeMapLayers,
    selectedZone,
    selectedShopId,
    selectedTrolleyId,
    zoomLevel,
    selectZone,
    selectShop,
    selectTrolley,
    clearSelection,
    zoomIn,
    zoomOut,
  } = useMapStore();

  const isDark = theme === 'dark';
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Tooltip state
  const [tooltip, _setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    type: 'zone' | 'shop' | 'trolley';
    data: any;
  }>({ visible: false, x: 0, y: 0, type: 'zone', data: {} });

  // Selected details
  const selectedZoneData = useMemo(() => {
    if (!selectedZone) return null;
    const zone = mapZones.find((z) => z.id === selectedZone.id);
    if (!zone) return null;
    const zoneShops = shopsData.filter((s) => s.location.zone === zone.id);
    const zoneTrolleys = trolleyPositions.filter((t) => t.zone_id === zone.id);
    return { zone, shops: zoneShops, trolleys: zoneTrolleys };
  }, [selectedZone]);

  const selectedShopData = useMemo(() => {
    if (!selectedShopId) return null;
    return shopsData.find((s) => s.id === selectedShopId) || null;
  }, [selectedShopId]);

  const selectedTrolleyData = useMemo(() => {
    if (!selectedTrolleyId) return null;
    const pos = trolleyPositions.find((t) => t.trolley_id === selectedTrolleyId);
    const trolley = trolleysData.find((t) => t.id === selectedTrolleyId);
    return trolley ? { ...trolley, position: pos } : null;
  }, [selectedTrolleyId]);

  const handleZoneClick = useCallback(
    (zone: MapZone) => selectZone(zone),
    [selectZone]
  );

  const handleTrolleyClick = useCallback(
    (trolleyId: string) => selectTrolley(trolleyId),
    [selectTrolley]
  );

  const handleShopClick = useCallback(
    (shopId: string) => selectShop(shopId),
    [selectShop]
  );

  // Stats
  const activeTrolleys = trolleyPositions.filter((t) => t.status === 'active').length;
  const totalShopsOnMap = shopsData.filter((s) => s.status === 'active').length;
  const zonesCount = mapZones.length;

  const hasSelection = selectedZone || selectedShopId || selectedTrolleyId;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <PageHeader
        title="Terminal Map"
        subtitle="Real-time terminal floor plan with trolley positions"
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <MapPin className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Zones</p>
            <p className="text-lg font-bold">{zonesCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
          <div className="p-2 rounded-lg bg-green-500/10">
            <ShoppingCart className="h-4 w-4 text-green-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Active Trolleys</p>
            <p className="text-lg font-bold">{activeTrolleys}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
          <div className="p-2 rounded-lg bg-primary/10">
            <Store className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Active Shops</p>
            <p className="text-lg font-bold">{totalShopsOnMap}</p>
          </div>
        </div>
      </div>

      {/* Main Layout: Map + Side Panel */}
      <div className="flex gap-4 h-[calc(100vh-280px)] min-h-[500px]">
        {/* Map Area */}
        <div className="flex-1 relative bg-card border border-border rounded-xl overflow-hidden">
          {/* Zoom Controls */}
          <div className="absolute top-3 right-3 z-20 flex flex-col gap-1">
            <button
              onClick={zoomIn}
              className="p-2 bg-card border border-border rounded-lg shadow-sm hover:bg-muted transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={zoomOut}
              className="p-2 bg-card border border-border rounded-lg shadow-sm hover:bg-muted transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
          </div>

          {/* Zoom Level Indicator */}
          <div className="absolute bottom-3 left-3 z-20">
            <span className="text-xs text-muted-foreground bg-card/80 backdrop-blur px-2 py-1 rounded border border-border">
              {Math.round(zoomLevel * 100)}%
            </span>
          </div>

          {/* Map Container */}
          <div
            ref={mapContainerRef}
            className="w-full h-full overflow-auto"
            style={{ cursor: zoomLevel > 1 ? 'grab' : 'default' }}
          >
            <div
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
                transition: 'transform 0.2s ease',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AirportMapSVG
                activeLayers={activeMapLayers}
                selectedZoneId={selectedZone?.id}
                selectedTrolleyId={selectedTrolleyId}
                selectedShopId={selectedShopId}
                isDark={isDark}
                onZoneClick={handleZoneClick}
                onTrolleyClick={handleTrolleyClick}
                onShopClick={handleShopClick}
              />
            </div>
          </div>

          {/* Tooltip */}
          <MapTooltip
            visible={tooltip.visible}
            x={tooltip.x}
            y={tooltip.y}
            type={tooltip.type}
            data={tooltip.data}
          />
        </div>

        {/* Side Panel */}
        <div className="w-80 shrink-0 flex flex-col gap-4 overflow-y-auto">
          {/* Legend */}
          <div className="bg-card border border-border rounded-xl p-4">
            <MapLegend />
          </div>

          {/* Selection Details */}
          {hasSelection && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Details
                </p>
                <button
                  onClick={clearSelection}
                  className="p-1 rounded hover:bg-muted transition-colors"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>

              {/* Zone Details */}
              {selectedZoneData && (
                <div className="space-y-3">
                  <div>
                    <h3 className="text-base font-semibold font-poppins">
                      {selectedZoneData.zone.name}
                    </h3>
                    <p className="text-xs text-muted-foreground capitalize">
                      {selectedZoneData.zone.type.replace(/_/g, ' ')} Zone
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-lg bg-muted/50 text-center">
                      <p className="text-lg font-bold">
                        {selectedZoneData.shops.length}
                      </p>
                      <p className="text-xs text-muted-foreground">Shops</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/50 text-center">
                      <p className="text-lg font-bold">
                        {selectedZoneData.trolleys.length}
                      </p>
                      <p className="text-xs text-muted-foreground">Trolleys</p>
                    </div>
                  </div>
                  {selectedZoneData.shops.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Shops in Zone
                      </p>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {selectedZoneData.shops.slice(0, 5).map((shop) => (
                          <button
                            key={shop.id}
                            onClick={() => selectShop(shop.id)}
                            className="flex items-center justify-between w-full text-left px-2 py-1.5 rounded hover:bg-muted transition-colors text-xs"
                          >
                            <span className="truncate">{shop.name}</span>
                            <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Shop Details */}
              {selectedShopData && (
                <div className="space-y-3">
                  <div>
                    <h3 className="text-base font-semibold font-poppins">
                      {selectedShopData.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedShopData.company_name}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <ShopCategoryBadge category={selectedShopData.category} />
                    <ContractStatusBadge status={selectedShopData.contract.status} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-lg bg-muted/50 text-center">
                      <p className="text-lg font-bold">
                        {selectedShopData.total_visitors.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Visitors</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/50 text-center">
                      <p className="text-lg font-bold">
                        {selectedShopData.offers_count}
                      </p>
                      <p className="text-xs text-muted-foreground">Offers</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/dashboard/shops/${selectedShopData.id}`)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View Shop Details
                  </button>
                </div>
              )}

              {/* Trolley Details */}
              {selectedTrolleyData && (
                <div className="space-y-3">
                  <div>
                    <h3 className="text-base font-semibold font-mono">
                      {selectedTrolleyData.imei}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedTrolleyData.serial_number}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrolleyStatusBadge status={selectedTrolleyData.status} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Battery</p>
                      <BatteryIndicator level={selectedTrolleyData.battery} size="sm" />
                    </div>
                    <div className="p-2 rounded-lg bg-muted/50 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Health</p>
                      <p className="text-lg font-bold">
                        {selectedTrolleyData.health_score}%
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between py-1 border-b border-border">
                      <span className="text-muted-foreground">Zone</span>
                      <span className="font-medium">
                        {selectedTrolleyData.location.zone}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border">
                      <span className="text-muted-foreground">Today Trips</span>
                      <span className="font-medium">
                        {selectedTrolleyData.today_trips}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Firmware</span>
                      <span className="font-mono text-[11px]">
                        {selectedTrolleyData.firmware_version}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      navigate(`/dashboard/trolleys/${selectedTrolleyData.id}`)
                    }
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View Trolley Details
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
