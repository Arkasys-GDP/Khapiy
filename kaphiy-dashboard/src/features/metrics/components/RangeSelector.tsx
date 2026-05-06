"use client";

import type { MetricsRange } from "../types";
import { cn } from "@/lib/utils";

const OPTIONS: { value: MetricsRange; label: string }[] = [
  { value: "daily", label: "Hoy" },
  { value: "weekly", label: "Semana" },
  { value: "monthly", label: "Mes" },
];

interface Props {
  value: MetricsRange;
  onChange: (v: MetricsRange) => void;
}

export function RangeSelector({ value, onChange }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Rango de tiempo"
      className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--card)] p-1"
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          role="radio"
          aria-checked={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors",
            "focus-visible:outline-2 focus-visible:outline-[var(--praline)]",
            value === opt.value
              ? "bg-[var(--praline)] text-white"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
