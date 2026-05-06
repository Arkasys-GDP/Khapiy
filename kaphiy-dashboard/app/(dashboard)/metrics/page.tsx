"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMetricsQuery } from "@/src/features/metrics/hooks/useMetrics";
import { RangeSelector } from "@/src/features/metrics/components/RangeSelector";
import { KpiCards } from "@/src/features/metrics/components/KpiCards";
import { TimeSeriesChart } from "@/src/features/metrics/components/TimeSeriesChart";
import { TopProductsChart } from "@/src/features/metrics/components/TopProductsChart";
import { StatusBreakdownChart } from "@/src/features/metrics/components/StatusBreakdownChart";
import type { MetricsRange } from "@/src/features/metrics/types";

const RANGE_LABELS: Record<MetricsRange, string> = {
  daily: "últimas 24 horas",
  weekly: "últimos 7 días",
  monthly: "últimos 30 días",
};

export default function MetricsPage() {
  const [range, setRange] = useState<MetricsRange>("daily");
  const { data, isLoading, isError, refetch, isFetching } = useMetricsQuery(range);

  return (
    <main
      role="main"
      aria-label="Métricas operacionales"
      className="flex flex-1 flex-col overflow-y-auto"
    >
      <header className="flex flex-col gap-3 px-7 pt-4 pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-lg font-bold text-[var(--foreground)]">
            Métricas
          </h1>
          <p className="mt-0.5 text-[11px] text-[var(--muted-foreground)]">
            KPIs operacionales — {RANGE_LABELS[range]}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RangeSelector value={range} onChange={setRange} />
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            aria-label="Refrescar"
            className="gap-1.5"
          >
            <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} aria-hidden />
            <span className="hidden sm:inline">Refrescar</span>
          </Button>
        </div>
      </header>

      {isError && (
        <div
          role="alert"
          className="mx-7 mb-4 rounded-xl border border-[var(--sem-alert)]/30 bg-[color-mix(in_oklch,var(--sem-alert)_8%,transparent)] px-5 py-4 text-sm text-[var(--sem-alert)]"
        >
          No se pudieron cargar las métricas.{" "}
          <button onClick={() => refetch()} className="underline">Reintentar</button>
        </div>
      )}

      <div className="flex flex-col gap-5 px-7 pb-10">
        <KpiCards totals={data?.totals} loading={isLoading} />

        <TimeSeriesChart
          data={data?.timeSeries}
          range={range}
          loading={isLoading}
        />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <TopProductsChart data={data?.topProducts} loading={isLoading} />
          <StatusBreakdownChart data={data?.statusBreakdown} loading={isLoading} />
        </div>
      </div>
    </main>
  );
}
