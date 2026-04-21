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

export function ConnectionBadge() {
  const status = useKaphiyStore((s) => s.connectionStatus);

  return (
    <span
      role="status"
      aria-label={`Estado de conexión: ${LABELS[status]}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        status === "connected" &&
          "bg-[color-mix(in_oklch,var(--sem-ok)_20%,transparent)] text-[var(--sem-ok)]",
        (status === "disconnected" || status === "reconnecting") &&
          "bg-[color-mix(in_oklch,var(--sem-alert)_18%,transparent)] text-[var(--sem-alert)]",
        status === "connecting" &&
          "bg-[color-mix(in_oklch,var(--sem-warn)_18%,transparent)] text-[var(--sem-warn)]",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          status === "connected" && "animate-pulse bg-[var(--sem-ok)]",
          status === "disconnected" && "bg-[var(--sem-alert)]",
          status === "reconnecting" && "animate-pulse bg-[var(--sem-alert)]",
          status === "connecting" && "animate-pulse bg-[var(--sem-warn)]",
        )}
      />
      {LABELS[status]}
    </span>
  );
}
