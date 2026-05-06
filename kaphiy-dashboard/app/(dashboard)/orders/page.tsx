"use client";

import { useAuthStore } from "@/src/features/auth/store/authSlice";
import { OrderGrid } from "@/src/features/orders/components/OrderGrid";

export default function OrdersPage() {
  const token = useAuthStore((s) => s.token);
  if (!token) return null;
  // Socket lifecycle is owned by the dashboard layout (DashboardSocketBridge).
  // OrderGrid only consumes the Zustand store + emits remote actions.
  return <OrderGrid />;
}
