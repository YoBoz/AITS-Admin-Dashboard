// ──────────────────────────────────────
// Trolley Fleet Mock Data — 280 trolleys
// ──────────────────────────────────────

import type { Trolley, MaintenanceRecord, TrolleyStatus } from '@/types/trolley.types';

const zones = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E', 'Zone F'];
const gates = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A8', 'A10', 'A12', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B8', 'C1', 'C2', 'C3', 'C4', 'D1', 'D2', 'D3', 'D4'];
const firmwareVersions = ['3.1.0', '3.1.2', '3.2.0', '3.2.1', '3.3.0-beta'];
const manufacturers = ['SmartTroll Inc.', 'AeroCart Systems', 'TrolleyTech GmbH'];
const models = ['ST-200', 'ST-300', 'AC-Pro', 'AC-Lite', 'TT-X1', 'TT-X2'];
const tabModels = ['Samsung Galaxy Tab A8', 'Lenovo Tab M10', 'Samsung Galaxy Tab S6 Lite', 'iPad 10th Gen'];
const maintenanceTypes: MaintenanceRecord['type'][] = ['scheduled', 'repair', 'battery_replace', 'firmware_update'];
const technicians = ['Ali Hassan', 'Mohammed Khalid', 'Fatima Al-Rashid', 'Omar Said', 'Nadia Mahmoud'];
const maintenanceDescriptions: Record<MaintenanceRecord['type'], string[]> = {
  scheduled: ['Quarterly inspection', 'Annual servicing', 'Routine check-up', 'Wheel alignment'],
  repair: ['Replaced broken wheel', 'Fixed handle mechanism', 'Repaired docking sensor', 'Replaced brake pad'],
  battery_replace: ['Replaced primary battery', 'Battery cell replacement', 'Full battery swap'],
  firmware_update: ['Updated to v3.2.0', 'Patched security vulnerability', 'Updated tablet firmware', 'OTA update applied'],
};

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateIMEI(index: number): string {
  let imei = '35';
  for (let i = 0; i < 13; i++) {
    imei += Math.floor(pseudoRandom(index * 17 + i * 31) * 10).toString();
  }
  return imei;
}

function generateSerial(index: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let serial = 'SN-';
  for (let i = 0; i < 8; i++) {
    serial += chars[Math.floor(pseudoRandom(index * 23 + i * 41) * chars.length)];
  }
  return serial;
}

function generateTabSerial(index: number): string {
  let serial = 'R5';
  for (let i = 0; i < 10; i++) {
    serial += Math.floor(pseudoRandom(index * 29 + i * 37) * 10).toString();
  }
  return serial;
}

function generateMaintenanceHistory(index: number): MaintenanceRecord[] {
  const r = (offset: number) => pseudoRandom(index * 19 + offset);
  const count = Math.floor(r(100) * 5) + 1;
  const records: MaintenanceRecord[] = [];

  for (let i = 0; i < count; i++) {
    const type = maintenanceTypes[Math.floor(r(101 + i) * maintenanceTypes.length)];
    const descs = maintenanceDescriptions[type];
    const daysAgo = Math.floor(r(102 + i) * 365) + 1;
    records.push({
      id: `MR-${String(index + 1).padStart(4, '0')}-${i + 1}`,
      date: new Date(Date.now() - daysAgo * 86400000).toISOString(),
      type,
      description: descs[Math.floor(r(103 + i) * descs.length)],
      technician: technicians[Math.floor(r(104 + i) * technicians.length)],
      cost: Math.floor(r(105 + i) * 450) + 50,
    });
  }

  return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function generateTrolley(index: number): Trolley {
  const r = (offset: number) => pseudoRandom(index * 13 + offset);

  const statusArr: TrolleyStatus[] = ['active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'idle', 'charging', 'maintenance', 'offline'];
  const status = statusArr[Math.floor(r(1) * statusArr.length)];

  const battery =
    status === 'charging'
      ? Math.floor(r(2) * 40) + 10
      : status === 'offline'
        ? Math.floor(r(2) * 15)
        : status === 'maintenance'
          ? Math.floor(r(2) * 50) + 20
          : Math.floor(r(2) * 80) + 20;

  const hoursAgo = status === 'offline' ? r(5) * 48 : r(5) * 2;
  const lastSeen = new Date(Date.now() - hoursAgo * 3600000).toISOString();
  const registeredDaysAgo = Math.floor(r(12) * 730) + 30;
  const lastMaintDaysAgo = Math.floor(r(13) * 90) + 1;

  const notes = [
    '', '', '', 'Slight wheel wobble, monitor closely', 'VIP terminal unit',
    'Scheduled for battery replacement next month', '', 'New unit, recently deployed',
    '', 'High-frequency route unit',
  ];

  return {
    id: `T-${String(index + 1).padStart(4, '0')}`,
    imei: generateIMEI(index),
    serial_number: generateSerial(index),
    battery: Math.min(battery, 100),
    status,
    health_score: Math.floor(r(7) * 30) + 70,
    location: {
      x: Math.round(r(3) * 800),
      y: Math.round(r(4) * 600),
      zone: zones[Math.floor(r(6) * zones.length)],
      gate: r(14) > 0.4 ? gates[Math.floor(r(8) * gates.length)] : undefined,
    },
    last_seen: lastSeen,
    assigned_gate: gates[Math.floor(r(8) * gates.length)],
    firmware_version: firmwareVersions[Math.floor(r(9) * firmwareVersions.length)],
    total_trips: Math.floor(r(10) * 2000) + 100,
    today_trips: Math.floor(r(15) * 25),
    manufacturer: manufacturers[Math.floor(r(11) * manufacturers.length)],
    model: models[Math.floor(r(16) * models.length)],
    registered_at: new Date(Date.now() - registeredDaysAgo * 86400000).toISOString(),
    last_maintenance: new Date(Date.now() - lastMaintDaysAgo * 86400000).toISOString(),
    tab_model: tabModels[Math.floor(r(17) * tabModels.length)],
    tab_serial: generateTabSerial(index),
    notes: notes[Math.floor(r(18) * notes.length)],
    maintenance_history: generateMaintenanceHistory(index),
  };
}

export const trolleysData: Trolley[] = Array.from({ length: 280 }, (_, i) => generateTrolley(i));
