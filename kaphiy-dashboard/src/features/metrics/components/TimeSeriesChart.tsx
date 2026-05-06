"use client"

import { useMemo } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { MetricsRange, MetricsTimeBucket } from "../types"

const config = {
  orders: {
    label: "Pedidos",
    color: "var(--praline)",
  },
  revenue: {
    label: "Ingresos ($)",
    color: "var(--sem-ok)",
  },
} satisfies ChartConfig

interface Props {
  data: MetricsTimeBucket[] | undefined
  range: MetricsRange
  loading: boolean
}

export function TimeSeriesChart({ data, range, loading }: Props) {
  const chartData = useMemo(() => {
    if (!data) return []
    return data.map((d) => ({
      bucket: d.bucket,
      orders: d.orders,
      revenue: Number(d.revenue.toFixed(2)),
    }))
  }, [data])

  const tickFormat = range === "daily" ? "HH:mm" : "dd MMM"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-bold tracking-widest text-praline uppercase">
          Tendencia de pedidos e ingresos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-70 w-full" />
        ) : chartData.length === 0 ? (
          <div className="flex h-70 items-center justify-center text-sm text-muted-foreground">
            Sin datos en este rango
          </div>
        ) : (
          <ChartContainer config={config} className="h-70 w-full">
            <ResponsiveContainer>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-orders)"
                      stopOpacity={0.5}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-orders)"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                  <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-revenue)"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-revenue)"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  stroke="var(--border)"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="bucket"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  tickFormatter={(value: string) =>
                    format(parseISO(value), tickFormat, { locale: es })
                  }
                />
                <YAxis
                  yAxisId="orders"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  width={32}
                />
                <YAxis
                  yAxisId="revenue"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  width={48}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) =>
                        typeof value === "string"
                          ? format(parseISO(value), "dd MMM HH:mm", {
                              locale: es,
                            })
                          : String(value ?? "")
                      }
                      indicator="line"
                    />
                  }
                />
                <Area
                  yAxisId="orders"
                  type="monotone"
                  dataKey="orders"
                  stroke="var(--color-orders)"
                  fill="url(#fillOrders)"
                  strokeWidth={2}
                />
                <Area
                  yAxisId="revenue"
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  fill="url(#fillRevenue)"
                  strokeWidth={2}
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
