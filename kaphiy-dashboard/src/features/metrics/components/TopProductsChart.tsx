"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { MetricsTopProduct } from "../types";

const config = {
  quantity: {
    label: "Cantidad",
    color: "var(--praline)",
  },
} satisfies ChartConfig;

interface Props {
  data: MetricsTopProduct[] | undefined;
  loading: boolean;
}

export function TopProductsChart({ data, loading }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-bold uppercase tracking-widest text-[var(--praline)]">
          Top 5 productos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[260px] w-full" />
        ) : !data || data.length === 0 ? (
          <div className="flex h-[260px] items-center justify-center text-sm text-[var(--muted-foreground)]">
            Sin datos en este rango
          </div>
        ) : (
          <ChartContainer config={config} className="h-[260px] w-full">
            <ResponsiveContainer>
              <BarChart
                data={data}
                layout="vertical"
                margin={{ left: 12, right: 16, top: 4, bottom: 4 }}
              >
                <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  width={120}
                  tick={{ fill: "var(--foreground)", fontSize: 12 }}
                />
                <ChartTooltip
                  cursor={{ fill: "color-mix(in oklch, var(--praline) 8%, transparent)" }}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar
                  dataKey="quantity"
                  fill="var(--color-quantity)"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
