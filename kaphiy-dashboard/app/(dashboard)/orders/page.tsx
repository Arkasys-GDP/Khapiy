"use client";

import { useAuthStore } from "@/src/features/auth/store/authSlice";
import { OrderGrid } from "@/src/features/orders/components/OrderGrid";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001";

export default function OrdersPage() {
  const token = useAuthStore((s) => s.token);

  if (!token) return null;

  return <OrderGrid socketUrl={SOCKET_URL} token={token} />;
}
