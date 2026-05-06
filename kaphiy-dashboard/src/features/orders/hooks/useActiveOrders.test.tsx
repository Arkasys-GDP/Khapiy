import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { makeTestQueryClient } from "@/src/test/renderWithProviders";
import { useActiveOrders } from "./useActiveOrders";
import { useKaphiyStore } from "../store";
import { useAuthStore } from "@/src/features/auth/store/authSlice";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => "/orders",
}));

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = makeTestQueryClient();
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

describe("useActiveOrders", () => {
  it("is disabled when no token", () => {
    useAuthStore.setState({ token: null, isAuthenticated: false });

    const { result } = renderHook(() => useActiveOrders(), { wrapper });
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("fetches orders + hydrates Zustand store with wire format", async () => {
    useAuthStore.setState({ token: "mock-token", isAuthenticated: true });

    const { result } = renderHook(() => useActiveOrders(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const orders = useKaphiyStore.getState().orders;
    const stats = useKaphiyStore.getState().stats;

    expect(orders.length).toBeGreaterThan(0);
    // wire format: status is one of frontend OrderStatus values directly
    expect(orders.every((o) => ["PENDING", "IN_PREP", "READY", "DELIVERED", "OUT_OF_STOCK"].includes(o.status))).toBe(true);
    expect(stats?.completedToday).toBeDefined();
  });
});
