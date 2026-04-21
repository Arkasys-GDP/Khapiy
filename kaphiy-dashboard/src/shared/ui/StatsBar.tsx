"use client";

import { useKaphiyStore } from "@/src/features/orders/store";

interface StatItem {
  value: string | number;
  label: string;
  colorVar?: string;
}

function Stat({ value, label, colorVar }: StatItem) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className="font-display text-2xl font-bold leading-none"
        style={colorVar ? { color: `var(--${colorVar})` } : { color: "var(--praline)" }}
      >
        {value}
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
        {label}
      </span>
    </div>
  );
}

export function StatsBar() {
  const stats = useKaphiyStore((s) => s.stats);
  const inPrep = useKaphiyStore((s) => s.orders.filter((o) => o.status === "IN_PREP").length);

  const items: StatItem[] = [
    { value: inPrep, label: "En preparación" },
    { value: stats.alerts, label: "Con alerta (+10 min)", colorVar: "sem-alert" },
    { value: stats.completedToday, label: "Completados hoy", colorVar: "sem-ok" },
    {
      value: stats.avgTimeMinutes > 0 ? `${stats.avgTimeMinutes.toFixed(1)} min` : "–",
      label: "Tiempo promedio",
    },
  ];

  return (
    <div
      role="region"
      aria-label="Estadísticas del turno"
      className="flex flex-shrink-0 items-center gap-8 overflow-x-auto border-b border-[var(--border)] bg-[var(--card)] px-7 py-3"
    >
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-8">
          <Stat {...item} />
          {i < items.length - 1 && (
            <span aria-hidden className="h-8 w-px bg-[var(--border)]" />
          )}
        </div>
      ))}
    </div>
  );
}
