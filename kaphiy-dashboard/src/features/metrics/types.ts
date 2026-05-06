export type MetricsRange = "daily" | "weekly" | "monthly";

export interface MetricsTotals {
  orders: number;
  revenue: number;
  avgPrepMinutes: number;
  completed: number;
  cancelled: number;
}

export interface MetricsTimeBucket {
  bucket: string; // ISO datetime
  orders: number;
  revenue: number;
}

export interface MetricsTopProduct {
  productId: number;
  name: string;
  quantity: number;
  revenue: number;
}

export interface MetricsStatusBreakdown {
  status: string;
  count: number;
}

export interface Metrics {
  range: MetricsRange;
  totals: MetricsTotals;
  timeSeries: MetricsTimeBucket[];
  topProducts: MetricsTopProduct[];
  statusBreakdown: MetricsStatusBreakdown[];
}
