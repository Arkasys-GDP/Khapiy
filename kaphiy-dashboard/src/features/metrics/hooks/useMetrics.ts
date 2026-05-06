"use client";

import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/src/shared/api/fetcher";
import { useAuthStore } from "@/src/features/auth/store/authSlice";
import type { Metrics, MetricsRange } from "../types";

export function useMetricsQuery(range: MetricsRange = "daily") {
  const token = useAuthStore((s) => s.token);

  return useQuery<Metrics>({
    queryKey: ["metrics", range],
    enabled: !!token,
    queryFn: () =>
      fetcher<Metrics>(`/orders/metrics?range=${range}`, { token: token! }),
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });
}
