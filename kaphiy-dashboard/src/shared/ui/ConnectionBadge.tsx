"use client";

import { cn } from "@/lib/utils";
import { useKaphiyStore } from "@/src/features/orders/store";
import type { ConnectionStatus } from "@/src/features/orders/store/connectionSlice";

const LABELS: Record<ConnectionStatus, string> = {
  connected: "Cocina Activa",
  connecting: "Conectando…",
  reconnecting: "Reconectando…",
  disconnected: "Sin conexión",
};

/**
 * Solid cream pill with semantic-colored text + dot. Designed to pop on any
 * TopBar background (rose, olive, dark, etc.) by always using `--paper` as
 * the pill bg — high contrast guaranteed regardless of TopBar palette.
 */
export function ConnectionBadge() {
  const status = useKaphiyStore((s) => s.connectionStatus);

  const palette = {
    connected: { text: "var(--sem-ok)", dot: "var(--sem-ok)", pulse: true },
    connecting: { text: "var(--sem-warn)", dot: "var(--sem-warn)", pulse: true },
    reconnecting: { text: "var(--sem-alert)", dot: "var(--sem-alert)", pulse: true },
    disconnected: { text: "var(--sem-alert)", dot: "var(--sem-alert)", pulse: false },
  }[status];

  return (
    <span
      role="status"
      aria-label={`Estado de conexión: ${LABELS[status]}`}
      className="inline-flex items-center gap-1.5 rounded-full bg-[var(--paper)] px-3 py-1 text-xs font-bold tracking-wide ring-1 ring-black/5 shadow-sm"
      style={{ color: palette.text }}
    >
      <span
        aria-hidden
        className={cn("size-1.5 rounded-full", palette.pulse && "animate-pulse")}
        style={{ background: palette.dot }}
      />
      {LABELS[status]}
    </span>
  );
}
