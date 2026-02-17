// ──────────────────────────────────────
// Heatmap Mock Data
// ──────────────────────────────────────

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const zoneIds = [
  'checkin', 'security', 'customs', 'main_retail', 'food_court',
  'duty_free', 'lounge_a', 'gates_a', 'lounge_b', 'gates_b',
  'washroom_a', 'washroom_b', 'pharmacy', 'bank',
];

// Base intensities per mode per zone
const baseIntensities: Record<string, Record<string, number>> = {
  visitors: {
    checkin: 0.75, security: 0.65, customs: 0.6, main_retail: 0.82,
    food_court: 0.85, duty_free: 0.9, lounge_a: 0.55, gates_a: 0.7,
    lounge_b: 0.5, gates_b: 0.65, washroom_a: 0.45, washroom_b: 0.48,
    pharmacy: 0.35, bank: 0.3,
  },
  dwell: {
    checkin: 0.2, security: 0.15, customs: 0.18, main_retail: 0.55,
    food_court: 0.7, duty_free: 0.6, lounge_a: 0.95, gates_a: 0.35,
    lounge_b: 0.9, gates_b: 0.3, washroom_a: 0.12, washroom_b: 0.1,
    pharmacy: 0.25, bank: 0.2,
  },
  trolleys: {
    checkin: 0.8, security: 0.3, customs: 0.25, main_retail: 0.7,
    food_court: 0.65, duty_free: 0.75, lounge_a: 0.4, gates_a: 0.85,
    lounge_b: 0.35, gates_b: 0.8, washroom_a: 0.15, washroom_b: 0.18,
    pharmacy: 0.2, bank: 0.1,
  },
  offers: {
    checkin: 0.1, security: 0.05, customs: 0.08, main_retail: 0.85,
    food_court: 0.9, duty_free: 0.95, lounge_a: 0.6, gates_a: 0.25,
    lounge_b: 0.55, gates_b: 0.2, washroom_a: 0.02, washroom_b: 0.02,
    pharmacy: 0.4, bank: 0.15,
  },
};

// Generate time-variant data
function generateHeatmapData() {
  const data: Record<string, Record<string, { today: number; week: number; month: number }>> = {};

  for (const mode of Object.keys(baseIntensities)) {
    data[mode] = {};
    for (const zoneId of zoneIds) {
      const base = baseIntensities[mode][zoneId] || 0.5;
      const seed = zoneId.length * 17 + mode.length * 31;
      const jitter1 = (pseudoRandom(seed + 1) - 0.5) * 0.15;
      const jitter2 = (pseudoRandom(seed + 2) - 0.5) * 0.1;
      const jitter3 = (pseudoRandom(seed + 3) - 0.5) * 0.08;
      data[mode][zoneId] = {
        today: Math.min(1, Math.max(0, base + jitter1)),
        week: Math.min(1, Math.max(0, base + jitter2)),
        month: Math.min(1, Math.max(0, base + jitter3)),
      };
    }
  }

  return data;
}

// Generate hourly data per zone (24 values, representing today's hours)
function generateHourlyData() {
  const hourly: Record<string, number[]> = {};

  for (const zoneId of zoneIds) {
    const base = baseIntensities.visitors[zoneId] || 0.5;
    const hours: number[] = [];
    for (let h = 0; h < 24; h++) {
      const seed = zoneId.length * 7 + h * 13;
      // Time-of-day curve: peak at 10am, 2pm, 6pm; lowest 2-5am
      const timeFactor =
        h >= 2 && h <= 5 ? 0.1 :
        h >= 6 && h <= 8 ? 0.5 :
        h >= 9 && h <= 11 ? 0.9 :
        h >= 12 && h <= 13 ? 0.7 :
        h >= 14 && h <= 17 ? 0.85 :
        h >= 18 && h <= 20 ? 0.75 :
        h >= 21 && h <= 23 ? 0.4 :
        0.3;
      const noise = (pseudoRandom(seed) - 0.5) * 0.15;
      hours.push(Math.min(1, Math.max(0, base * timeFactor + noise)));
    }
    hourly[zoneId] = hours;
  }

  return hourly;
}

// Sparkline 7-day trends per zone
function generateSparklines() {
  const sparklines: Record<string, number[]> = {};
  for (const zoneId of zoneIds) {
    const base = baseIntensities.visitors[zoneId] || 0.5;
    sparklines[zoneId] = Array.from({ length: 7 }, (_, i) => {
      const noise = (pseudoRandom(zoneId.length * 11 + i * 23) - 0.5) * 0.2;
      return Math.min(1, Math.max(0, base + noise));
    });
  }
  return sparklines;
}

export const heatmapData = generateHeatmapData();
export const hourlyHeatmapData = generateHourlyData();
export const zoneSparklines = generateSparklines();
export { zoneIds };

// Zone display names
export const zoneNameMap: Record<string, string> = {
  checkin: 'Check-in Hall',
  security: 'Security',
  customs: 'Customs & Immigration',
  main_retail: 'Retail Zone',
  food_court: 'Food Court',
  duty_free: 'Duty Free',
  lounge_a: 'Sky Lounge A',
  gates_a: 'Gates A1-A8',
  lounge_b: 'Sky Lounge B',
  gates_b: 'Gates B1-B8',
  washroom_a: 'Washroom A',
  washroom_b: 'Washroom B',
  pharmacy: 'Pharma Plus',
  bank: 'Bank / ATM',
};

// Unit labels per mode
export const modeUnitMap: Record<string, string> = {
  visitors: 'Visitors',
  dwell: 'Minutes',
  trolleys: 'Trolleys',
  offers: 'Clicks',
};

// Mode display labels
export const modeLabelMap: Record<string, string> = {
  visitors: 'Visitor Density',
  dwell: 'Dwell Time',
  trolleys: 'Trolley Concentration',
  offers: 'Offer Interactions',
};
