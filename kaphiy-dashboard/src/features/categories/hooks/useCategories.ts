"use client";

import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/src/shared/api/fetcher";
import type { Category } from "../types";

export function useCategoriesQuery() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => fetcher<Category[]>("/categories"),
    staleTime: 5 * 60_000, // categories rarely change
  });
}
