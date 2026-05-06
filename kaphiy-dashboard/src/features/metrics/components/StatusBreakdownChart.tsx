"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { MetricsStatusBreakdown } from "../types";

const STATUS_LABELS: Record<string, string> = {
  WAITING: "En espera",
  PREPARING: "En preparación",
  READY: "Listo",
  DELIVERED: "Entregado",
  OUT_OF_STOCK: "Agotado",
};

const STATUS_COLORS: Record<string, string> = {
  WAITING: "var(--crema)",
  PREPARING: "var(--praline)",
  READY: "var(--sem-ok)",
  DELIVERED: "var(--muted-foreground)",
  OUT_OF_STOCK: "var(--sem-alert)",
};

interface Props {
  data: MetricsStatusBreakdown[] | undefined;
  loading: boolean;
}

export function StatusBreakdownChart({ data, loading }: Props) {
  const config = useMemo<ChartConfig>(() => {
    const cfg: ChartConfig = {};
    Object.keys(STATUS_LABELS).forEach((k) => {
      cfg[k] = { label: STATUS_LABELS[k], color: STATUS_COLORS[k] };
    });
    return cfg;
  }, []);

  const chartData = useMemo(() => {
    if (!data) return [];
    return data.map((d) => ({
      status: d.status,
      label: STATUS_LABELS[d.status] ?? d.status,
      count: d.count,
      fill: STATUS_COLORS[d.status] ?? "var(--muted-foreground)",
    }));
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-bold uppercase tracking-widest text-[var(--praline)]">
          Distribución por estado
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[260px] w-full" />
        ) : chartData.length === 0 ? (
          <div className="flex h-[260px] items-center justify-center text-sm text-[var(--muted-foreground)]">
            Sin datos en este rango
          </div>
        ) : (
          <ChartContainer config={config} className="mx-auto aspect-square max-h-[260px]">
            <ResponsiveContainer>
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent nameKey="status" />}
                />
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.status} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="status" />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
