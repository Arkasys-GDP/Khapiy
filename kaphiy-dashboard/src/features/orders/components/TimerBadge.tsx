"use client";

import { useKaphiyStore } from "../store";
import { semaphoreOf } from "../lib/semaphore";
import { useElapsedTime, formatElapsed } from "../hooks/useElapsedTime";
import { cn } from "@/lib/utils";

interface TimerBadgeProps {
  createdAt: string;
  className?: string;
}

export function TimerBadge({ createdAt, className }: TimerBadgeProps) {
  const warnSecs = useKaphiyStore((s) => s.semaphoreWarnSecs);
  const alertSecs = useKaphiyStore((s) => s.semaphoreAlertSecs);

  const elapsed = useElapsedTime(createdAt);
  const state = semaphoreOf(elapsed, { warn: warnSecs, alert: alertSecs });

  return (
    <div
      className={cn("flex flex-col items-end gap-1", className)}
      aria-label={`Tiempo de espera: ${formatElapsed(elapsed)}`}
    >
      <span
        className={cn(
          "font-mono tabular text-2xl font-bold leading-none tracking-tight",
          state === "ok" && "text-[var(--praline)]",
          state === "warn" && "text-[var(--sem-warn)]",
          state === "alert" && "text-[var(--sem-alert)]",
        )}
        aria-live="off"
      >
        {formatElapsed(elapsed)}
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
        tiempo espera
      </span>
      {state === "alert" && (
        <span
          aria-label="Pedido demorado"
          className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklch,var(--sem-alert)_15%,transparent)] px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-[var(--sem-alert)]"
        >
          ⚠ Demorado
        </span>
      )}
    </div>
  );
}
