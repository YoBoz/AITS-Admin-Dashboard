export type { Theme, ThemeContextType } from './theme.types';
export type {
  Role,
  Permission,
  User,
  LoginCredentials,
  AuthState,
  AuthContextType,
} from './auth.types';

// Shared generic types

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface TableColumn<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

// Phase 8 — Ops Command Center types
export type {
  IncidentSeverity,
  IncidentType,
  IncidentStatus,
  TimelineActionType,
  IncidentTimelineEntry,
  Incident,
  RunbookActionType,
  RunbookStep,
  Runbook,
  IncidentFilters,
} from './incident.types';

export type {
  PolicyType,
  PolicyStatus,
  ConditionOperator,
  PolicyCondition,
  PolicyActionType,
  PolicyAction,
  PolicyOverride,
  Policy,
  PolicyFilters,
} from './policy.types';

export type {
  Gate,
  Corridor,
  VenueZone,
  Floor,
  Terminal,
  VenueNodeType,
} from './venue.types';

export type {
  MerchantSLABreakdown,
  OrderAcceptanceMetrics,
  DeliveryMetrics,
  DeviceUptimeMetrics,
  RunnerPerformanceMetrics,
  SLAMetrics,
  SLAPeriod,
  FleetHealthSummary,
  BatteryDistribution,
  OfflineTimelinePoint,
} from './ops-metrics.types';
