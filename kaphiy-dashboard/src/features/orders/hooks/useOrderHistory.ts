"use client";

import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/src/shared/api/fetcher";
import { useAuthStore } from "@/src/features/auth/store/authSlice";
import type { Order } from "../types";

interface HistoryResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

export interface OrderHistoryPage {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useOrderHistory(page = 1, limit = 20) {
  const token = useAuthStore((s) => s.token);

  return useQuery<OrderHistoryPage>({
    queryKey: ["orders", "history", page, limit],
    enabled: !!token,
    queryFn: async () => {
      const raw = await fetcher<HistoryResponse>(
        `/orders/history?page=${page}&limit=${limit}`,
        { token: token! },
      );
      return {
        orders: raw.orders,
        total: raw.total,
        page: raw.page,
        limit: raw.limit,
        totalPages: Math.max(1, Math.ceil(raw.total / raw.limit)),
      };
    },
    staleTime: 30_000,
  });
}
