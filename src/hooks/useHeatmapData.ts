import { useMemo } from 'react';
import type { DataMode, TimeRange } from '@/types/visitor.types';
import { heatmapData, hourlyHeatmapData, zoneIds } from '@/data/mock/heatmap.mock';

interface UseHeatmapDataOptions {
  mode: DataMode;
  timeRange: TimeRange;
  hourRange?: [number, number];
}

interface HeatmapResult {
  intensityMap: Record<string, number>;
  maxValue: number;
  minValue: number;
}

export function useHeatmapData({ mode, timeRange, hourRange }: UseHeatmapDataOptions): HeatmapResult {
  return useMemo(() => {
    const intensityMap: Record<string, number> = {};
    let maxVal = 0;
    let minVal = 1;

    zoneIds.forEach((zoneId) => {
      let val: number;
      const tr = timeRange === 'custom' ? 'today' : timeRange;

      if (hourRange && hourRange[0] !== 0 && hourRange[1] !== 23) {
        // Hourly data: average over the selected hours
        const hourlyData = hourlyHeatmapData[zoneId];
        if (hourlyData) {
          const [start, end] = hourRange;
          const slice = hourlyData.slice(start, end + 1);
          val = slice.reduce((sum: number, v: number) => sum + v, 0) / slice.length;
        } else {
          val = heatmapData[mode]?.[zoneId]?.[tr] ?? 0;
        }
      } else {
        val = heatmapData[mode]?.[zoneId]?.[tr] ?? 0;
      }

      intensityMap[zoneId] = val;
      if (val > maxVal) maxVal = val;
      if (val < minVal) minVal = val;
    });

    return { intensityMap, maxValue: maxVal, minValue: minVal };
  }, [mode, timeRange, hourRange]);
}
