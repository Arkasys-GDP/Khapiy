"use client"

import { TrendingUp, DollarSign, Clock, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { MetricsTotals } from "../types"

const PRICE_FORMATTER = new Intl.NumberFormat("es-EC", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

interface Props {
  totals: MetricsTotals | undefined
  loading: boolean
}

export function KpiCards({ totals, loading }: Props) {
  const items = [
    {
      label: "Pedidos",
      value: totals ? totals.orders.toLocaleString("es-EC") : "—",
      Icon: TrendingUp,
      color: "var(--praline)",
    },
    {
      label: "Ingresos",
      value: totals ? PRICE_FORMATTER.format(totals.revenue) : "—",
      Icon: DollarSign,
      color: "var(--sem-ok)",
    },
    {
      label: "Entregados",
      value: totals ? totals.completed.toLocaleString("es-EC") : "—",
      Icon: CheckCircle2,
      color: "var(--sem-ok)",
    },
    {
      label: "Tiempo prep. promedio",
      value:
        totals && totals.avgPrepMinutes > 0
          ? `${totals.avgPrepMinutes.toFixed(1)} min`
          : "—",
      Icon: Clock,
      color: "var(--sem-warn)",
      hint:
        totals?.avgPrepMinutes === 0
          ? "Métrica próxima — requiere completed_at"
          : undefined,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[11px] font-semibold tracking-widest text-[var(--muted-foreground)] uppercase">
              {item.label}
            </CardTitle>
            <item.Icon
              className="size-4 flex-shrink-0"
              style={{ color: item.color }}
              aria-hidden
            />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div
                className="font-display text-2xl font-bold"
                style={{ color: item.color }}
              >
                {item.value}
              </div>
            )}
            {item.hint && (
              <p className="mt-1 text-[10px] text-[var(--muted-foreground)] italic">
                {item.hint}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
