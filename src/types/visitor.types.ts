export interface VisitorStats {
  date: string;
  total: number;
  by_gate: Record<string, number>;
  by_hour: number[];
  avg_dwell_minutes: number;
  trolley_adoption_rate: number;
  by_category_visits: Record<string, number>;
}

export type DataMode = 'visitors' | 'dwell' | 'trolleys' | 'offers';
export type TimeRange = 'today' | 'week' | 'month' | 'custom';
