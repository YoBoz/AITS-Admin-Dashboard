// ──────────────────────────────────────
// Visitor Statistics Mock Data
// ──────────────────────────────────────

import type { VisitorStats } from '@/types/visitor.types';

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const gates = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8'];
const categories = ['retail', 'restaurant', 'cafe', 'lounge', 'pharmacy', 'electronics', 'fashion', 'services'];

function generateDayStats(dayOffset: number): VisitorStats {
  const date = new Date();
  date.setDate(date.getDate() - dayOffset);
  const dateStr = date.toISOString().split('T')[0];
  const seed = dayOffset * 17 + 42;
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const baseFactor = isWeekend ? 0.85 : 1.0;

  const baseTotal = Math.round((4500 + pseudoRandom(seed) * 3000) * baseFactor);

  const by_gate: Record<string, number> = {};
  gates.forEach((g, i) => {
    // B1/A1 busiest, A8/B8 quietest
    const gateFactor = 1 - (i % 8) * 0.08;
    const val = Math.round(baseTotal * 0.06 * gateFactor * (0.8 + pseudoRandom(seed + i * 3) * 0.4));
    by_gate[g] = val;
  });

  // Generate 24-hour distribution
  const by_hour: number[] = [];
  const hourCurve = [
    0.05, 0.03, 0.02, 0.02, 0.03, 0.08, 0.15, 0.25, 0.35, 0.45,
    0.5, 0.48, 0.42, 0.38, 0.45, 0.5, 0.52, 0.55, 0.48, 0.4,
    0.32, 0.22, 0.15, 0.08,
  ];
  for (let h = 0; h < 24; h++) {
    const noise = (pseudoRandom(seed + h * 7) - 0.5) * 0.05;
    by_hour.push(Math.round(baseTotal * (hourCurve[h] + noise)));
  }

  const by_category_visits: Record<string, number> = {};
  categories.forEach((cat, i) => {
    const catFactors: Record<string, number> = {
      retail: 0.22, restaurant: 0.18, cafe: 0.15, lounge: 0.08,
      pharmacy: 0.06, electronics: 0.12, fashion: 0.11, services: 0.08,
    };
    by_category_visits[cat] = Math.round(baseTotal * (catFactors[cat] || 0.1) * (0.8 + pseudoRandom(seed + i * 5) * 0.4));
  });

  return {
    date: dateStr,
    total: baseTotal,
    by_gate,
    by_hour,
    avg_dwell_minutes: Math.round(15 + pseudoRandom(seed + 99) * 20),
    trolley_adoption_rate: parseFloat((0.3 + pseudoRandom(seed + 100) * 0.35).toFixed(2)),
    by_category_visits,
  };
}

// Generate 30 days of data
export const visitorStatsData: VisitorStats[] = Array.from({ length: 30 }, (_, i) =>
  generateDayStats(i)
).reverse();

// Peak hours grid: 7 days x 24 hours
export const peakHoursGrid: number[][] = (() => {
  const grid: number[][] = [];
  for (let day = 0; day < 7; day++) {
    const row: number[] = [];
    for (let hour = 0; hour < 24; hour++) {
      const seed = day * 100 + hour * 13 + 7;
      const base = [
        0.05, 0.03, 0.02, 0.02, 0.03, 0.08, 0.18, 0.28, 0.4, 0.5,
        0.55, 0.52, 0.45, 0.42, 0.5, 0.55, 0.58, 0.6, 0.52, 0.42,
        0.35, 0.25, 0.18, 0.1,
      ][hour];
      // Thursday (day 3) busiest, Tuesday (day 1) quietest
      const dayFactor = day === 3 ? 1.15 : day === 1 ? 0.8 : day >= 5 ? 0.85 : 1.0;
      const noise = (pseudoRandom(seed) - 0.5) * 0.08;
      const visitors = Math.round((base * dayFactor + noise) * 3200);
      row.push(Math.max(5, visitors));
    }
    grid.push(row);
  }
  return grid;
})();

// Demographic breakdown (static)
export const demographicData = [
  { name: 'International Transit', value: 35, color: '#3B82F6' },
  { name: 'Domestic Departure', value: 30, color: '#BE052E' },
  { name: 'International Arrival', value: 20, color: '#10B981' },
  { name: 'Domestic Arrival', value: 15, color: '#F59E0B' },
];

// Gate traffic: arrivals and departures
export const gateTrafficData = gates.map((gate, i) => {
  const seed = i * 31 + 5;
  const baseFactor = 1 - (i % 8) * 0.1;
  return {
    gate,
    arrivals: Math.round(800 * baseFactor * (0.7 + pseudoRandom(seed) * 0.6)),
    departures: Math.round(750 * baseFactor * (0.7 + pseudoRandom(seed + 1) * 0.6)),
  };
});

// Dwell time per category (simulated box-plot data)
export const dwellTimeData = [
  { category: 'Lounge', min: 20, q1: 35, median: 48, q3: 65, max: 90 },
  { category: 'Food', min: 8, q1: 15, median: 22, q3: 32, max: 50 },
  { category: 'Retail', min: 5, q1: 12, median: 18, q3: 25, max: 40 },
  { category: 'Gates', min: 3, q1: 7, median: 12, q3: 18, max: 35 },
  { category: 'Services', min: 2, q1: 5, median: 8, q3: 12, max: 20 },
];

// Top categories radial data
export const topCategoriesData = [
  { name: 'Retail', visitors: 12500, fill: '#10B981' },
  { name: 'Restaurant', visitors: 10200, fill: '#BE052E' },
  { name: 'Cafe', visitors: 8500, fill: '#F59E0B' },
  { name: 'Electronics', visitors: 6800, fill: '#3B82F6' },
  { name: 'Fashion', visitors: 6200, fill: '#8B5CF6' },
  { name: 'Lounge', visitors: 4500, fill: '#EC4899' },
  { name: 'Pharmacy', visitors: 3200, fill: '#14B8A6' },
  { name: 'Services', visitors: 2800, fill: '#6B7280' },
];
