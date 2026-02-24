import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { AirportMapSVG } from '@/components/map/AirportMapSVG';
import { HeatmapOverlay } from '@/components/heatmap/HeatmapOverlay';
import { HeatmapLegend } from '@/components/heatmap/HeatmapLegend';
import { HeatmapControls } from '@/components/heatmap/HeatmapControls';
import { FloorSelector } from '@/components/map/FloorSelector';
// CategoryHeatmapToggle removed — redundant with HeatmapControls Data Mode
import { useHeatmapData } from '@/hooks/useHeatmapData';
import { useTheme } from '@/hooks/useTheme';
import { zoneNameMap, zoneSparklines } from '@/data/mock/heatmap.mock';
import type { DataMode, TimeRange } from '@/types/visitor.types';

function ZoneStatsPanel({
  hoveredZone,
  mode: _mode,
  timeRange: _timeRange,
  intensityMap,
}: {
  hoveredZone: string | null;
  mode: DataMode;
  timeRange: TimeRange;
  intensityMap: Record<string, number>;
}) {
  // Sort zones by intensity for ranking
  const sorted = Object.entries(intensityMap).sort(([, a], [, b]) => b - a);
  const rank = hoveredZone ? sorted.findIndex(([id]) => id === hoveredZone) + 1 : 0;
  const sparkline = hoveredZone ? zoneSparklines[hoveredZone] : null;

  if (!hoveredZone) {
    // Default: show top 5 zones
    return (
      <div className="space-y-2">
        <h4 className="text-xs font-poppins font-semibold text-muted-foreground uppercase tracking-wider">
          Top Zones
        </h4>
        {sorted.slice(0, 5).map(([zoneId, intensity], idx) => (
          <div key={zoneId} className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground w-5">{idx + 1}</span>
            <div className="flex-1">
              <div className="text-xs font-lexend text-foreground">{zoneNameMap[zoneId] || zoneId}</div>
              <div className="h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-800"
                  style={{
                    width: `${Math.round(intensity * 100)}%`,
                    background: `linear-gradient(90deg, #3B82F6, #BE052E)`,
                  }}
                />
              </div>
            </div>
            <span className="text-xs font-mono text-foreground">{Math.round(intensity * 100)}%</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-poppins font-semibold text-foreground">
        {zoneNameMap[hoveredZone] || hoveredZone}
      </h4>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-muted/50 rounded-md p-2">
          <div className="text-[10px] text-muted-foreground font-lexend">Intensity</div>
          <div className="text-lg font-bold font-mono text-foreground">
            {Math.round((intensityMap[hoveredZone] ?? 0) * 100)}%
          </div>
        </div>
        <div className="bg-muted/50 rounded-md p-2">
          <div className="text-[10px] text-muted-foreground font-lexend">Rank</div>
          <div className="text-lg font-bold font-mono text-foreground">
            #{rank} <span className="text-xs text-muted-foreground">/ {sorted.length}</span>
          </div>
        </div>
      </div>

      {/* Sparkline */}
      {sparkline && (
        <div>
          <div className="text-[10px] text-muted-foreground font-lexend mb-1">7-Day Trend</div>
          <svg viewBox="0 0 120 30" className="w-full h-8">
            <polyline
              points={sparkline.map((v, i) => `${i * 20},${30 - v * 28}`).join(' ')}
              fill="none"
              stroke="#BE052E"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {sparkline.map((v, i) => (
              <circle key={i} cx={i * 20} cy={30 - v * 28} r="2" fill="#BE052E" />
            ))}
          </svg>
        </div>
      )}
    </div>
  );
}

export default function HeatmapPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [mode, setMode] = useState<DataMode>('visitors');
  const [timeRange, setTimeRange] = useState<TimeRange>('today');
  const [categoryFilter, setCategoryFilter] = useState<string[]>(['all']);
  const [hourRange, setHourRange] = useState<[number, number]>([0, 23]);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [currentFloor, setCurrentFloor] = useState(1);

  const { intensityMap } = useHeatmapData({ mode, timeRange, hourRange, floor: currentFloor });

  const handleZoneHover = useCallback((zoneId: string | null) => {
    setHoveredZone(zoneId);
  }, []);

  const handleZoneClick = useCallback((zoneId: string) => {
    setSelectedZone((prev) => (prev === zoneId ? null : zoneId));
  }, []);

  const handleFloorChange = useCallback((floor: number) => {
    setCurrentFloor(floor);
    setSelectedZone(null);
    setHoveredZone(null);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <PageHeader
          title="Heatmap View"
          subtitle="Visualize airport zone activity in real-time"
        />
        <FloorSelector currentFloor={currentFloor} onFloorChange={handleFloorChange} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Map Area - 75% */}
        <div className="lg:col-span-3">
          <SectionCard title="Terminal Heatmap" contentClassName="p-0 relative">
            <motion.div
              className="relative w-full"
              style={{ aspectRatio: '1200 / 800' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <AirportMapSVG
                isDark={isDark}
                floor={currentFloor}
                activeLayers={['zones']}
                selectedZoneId={selectedZone}
              />
              <HeatmapOverlay
                intensityMap={intensityMap}
                floor={currentFloor}
                selectedZoneId={selectedZone || hoveredZone}
                showShopMarkers={true}
                onZoneHover={handleZoneHover}
                onZoneClick={handleZoneClick}
                isDark={isDark}
              />
            </motion.div>
            <div className="px-4 pb-3 pt-2">
              <HeatmapLegend mode={mode} />
            </div>
          </SectionCard>
        </div>

        {/* Controls Panel - 25% */}
        <div className="space-y-4">
          <SectionCard title="Controls">
            <HeatmapControls
              mode={mode}
              onModeChange={setMode}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={setCategoryFilter}
              hourRange={hourRange}
              onHourRangeChange={setHourRange}
            />
          </SectionCard>

          <SectionCard title="Zone Stats">
            <ZoneStatsPanel
              hoveredZone={hoveredZone || selectedZone}
              mode={mode}
              timeRange={timeRange}
              intensityMap={intensityMap}
            />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
