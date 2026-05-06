"use client";

import { useOrdersSocketLifecycle } from "@/src/features/orders/hooks/useOrdersSocket";
import { useAuthStore } from "@/src/features/auth/store/authSlice";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001";

/**
 * Headless component — owns the WebSocket lifecycle for the entire dashboard.
 * Mount once at the layout level so the connection persists across route
 * navigations. The connection badge in the TopBar reflects the real backend
 * health regardless of which page the barista is viewing.
 */
export function DashboardSocketBridge() {
  const token = useAuthStore((s) => s.token);
  useOrdersSocketLifecycle(SOCKET_URL, token);
  return null;
}
