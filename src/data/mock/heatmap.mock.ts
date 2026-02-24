// ──────────────────────────────────────
// Heatmap Mock Data — Multi-Floor
// ──────────────────────────────────────

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Floor 1 zone IDs
const floor1ZoneIds = [
  'checkin', 'security', 'customs', 'main_retail', 'food_court',
  'duty_free', 'lounge_a', 'gates_a', 'lounge_b', 'gates_b',
  'washroom_a', 'washroom_b', 'pharmacy', 'bank',
];

// Floor 2 zone IDs
const floor2ZoneIds = [
  'arrivals_hall', 'immigration_exit', 'transfer_desk',
  'baggage_claim_a', 'baggage_claim_b', 'lost_luggage',
  'arrivals_retail', 'car_rental', 'ground_transport',
  'meeters_hall', 'washroom_arr',
];

// Floor 3 zone IDs
const floor3ZoneIds = [
  'vip_reception', 'premium_lounge', 'business_center',
  'exec_dining', 'spa_wellness', 'premium_retail',
  'vip_washroom', 'conf_room_a', 'conf_room_b',
  'private_suites', 'exec_lounge',
];

const zoneIds = [...floor1ZoneIds, ...floor2ZoneIds, ...floor3ZoneIds];

// Zone to floor mapping
export const zoneFloorMap: Record<string, number> = {};
floor1ZoneIds.forEach((id) => { zoneFloorMap[id] = 1; });
floor2ZoneIds.forEach((id) => { zoneFloorMap[id] = 2; });
floor3ZoneIds.forEach((id) => { zoneFloorMap[id] = 3; });

// Helper to get zone IDs for a specific floor
export function getZoneIdsByFloor(floor: number): string[] {
  return zoneIds.filter((id) => zoneFloorMap[id] === floor);
}

// Base intensities per mode per zone (all floors)
const baseIntensities: Record<string, Record<string, number>> = {
  visitors: {
    // Floor 1
    checkin: 0.75, security: 0.65, customs: 0.6, main_retail: 0.82,
    food_court: 0.85, duty_free: 0.9, lounge_a: 0.55, gates_a: 0.7,
    lounge_b: 0.5, gates_b: 0.65, washroom_a: 0.45, washroom_b: 0.48,
    pharmacy: 0.35, bank: 0.3,
    // Floor 2
    arrivals_hall: 0.78, immigration_exit: 0.62, transfer_desk: 0.48,
    baggage_claim_a: 0.72, baggage_claim_b: 0.68, lost_luggage: 0.25,
    arrivals_retail: 0.55, car_rental: 0.42, ground_transport: 0.85,
    meeters_hall: 0.7, washroom_arr: 0.38,
    // Floor 3
    vip_reception: 0.3, premium_lounge: 0.45, business_center: 0.35,
    exec_dining: 0.4, spa_wellness: 0.28, premium_retail: 0.38,
    vip_washroom: 0.15, conf_room_a: 0.32, conf_room_b: 0.28,
    private_suites: 0.2, exec_lounge: 0.42,
  },
  dwell: {
    // Floor 1
    checkin: 0.2, security: 0.15, customs: 0.18, main_retail: 0.55,
    food_court: 0.7, duty_free: 0.6, lounge_a: 0.95, gates_a: 0.35,
    lounge_b: 0.9, gates_b: 0.3, washroom_a: 0.12, washroom_b: 0.1,
    pharmacy: 0.25, bank: 0.2,
    // Floor 2
    arrivals_hall: 0.15, immigration_exit: 0.22, transfer_desk: 0.35,
    baggage_claim_a: 0.45, baggage_claim_b: 0.42, lost_luggage: 0.55,
    arrivals_retail: 0.38, car_rental: 0.5, ground_transport: 0.12,
    meeters_hall: 0.48, washroom_arr: 0.08,
    // Floor 3
    vip_reception: 0.25, premium_lounge: 0.92, business_center: 0.75,
    exec_dining: 0.85, spa_wellness: 0.95, premium_retail: 0.6,
    vip_washroom: 0.05, conf_room_a: 0.8, conf_room_b: 0.78,
    private_suites: 0.98, exec_lounge: 0.88,
  },
  trolleys: {
    // Floor 1
    checkin: 0.8, security: 0.3, customs: 0.25, main_retail: 0.7,
    food_court: 0.65, duty_free: 0.75, lounge_a: 0.4, gates_a: 0.85,
    lounge_b: 0.35, gates_b: 0.8, washroom_a: 0.15, washroom_b: 0.18,
    pharmacy: 0.2, bank: 0.1,
    // Floor 2
    arrivals_hall: 0.72, immigration_exit: 0.18, transfer_desk: 0.35,
    baggage_claim_a: 0.9, baggage_claim_b: 0.85, lost_luggage: 0.15,
    arrivals_retail: 0.45, car_rental: 0.55, ground_transport: 0.78,
    meeters_hall: 0.62, washroom_arr: 0.08,
    // Floor 3
    vip_reception: 0.15, premium_lounge: 0.2, business_center: 0.08,
    exec_dining: 0.12, spa_wellness: 0.05, premium_retail: 0.18,
    vip_washroom: 0.02, conf_room_a: 0.05, conf_room_b: 0.05,
    private_suites: 0.1, exec_lounge: 0.15,
  },
  offers: {
    // Floor 1
    checkin: 0.1, security: 0.05, customs: 0.08, main_retail: 0.85,
    food_court: 0.9, duty_free: 0.95, lounge_a: 0.6, gates_a: 0.25,
    lounge_b: 0.55, gates_b: 0.2, washroom_a: 0.02, washroom_b: 0.02,
    pharmacy: 0.4, bank: 0.15,
    // Floor 2
    arrivals_hall: 0.12, immigration_exit: 0.05, transfer_desk: 0.08,
    baggage_claim_a: 0.18, baggage_claim_b: 0.15, lost_luggage: 0.02,
    arrivals_retail: 0.65, car_rental: 0.72, ground_transport: 0.1,
    meeters_hall: 0.35, washroom_arr: 0.01,
    // Floor 3
    vip_reception: 0.45, premium_lounge: 0.78, business_center: 0.15,
    exec_dining: 0.82, spa_wellness: 0.88, premium_retail: 0.92,
    vip_washroom: 0.01, conf_room_a: 0.08, conf_room_b: 0.08,
    private_suites: 0.55, exec_lounge: 0.72,
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

// Zone display names (all floors)
export const zoneNameMap: Record<string, string> = {
  // Floor 1
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
  // Floor 2
  arrivals_hall: 'Arrivals Hall',
  immigration_exit: 'Immigration Exit',
  transfer_desk: 'Transfer Desk',
  baggage_claim_a: 'Baggage Claim A',
  baggage_claim_b: 'Baggage Claim B',
  lost_luggage: 'Lost & Found',
  arrivals_retail: 'Arrivals Retail',
  car_rental: 'Car Rental',
  ground_transport: 'Ground Transport',
  meeters_hall: 'Meeters & Greeters',
  washroom_arr: 'Washroom',
  // Floor 3
  vip_reception: 'VIP Reception',
  premium_lounge: 'Premium Lounge',
  business_center: 'Business Center',
  exec_dining: 'Executive Dining',
  spa_wellness: 'Spa & Wellness',
  premium_retail: 'Premium Retail',
  vip_washroom: 'VIP Washroom',
  conf_room_a: 'Conference A',
  conf_room_b: 'Conference B',
  private_suites: 'Private Suites',
  exec_lounge: 'Executive Lounge',
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
