"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { fetcher } from "@/src/shared/api/fetcher";
import { useAuthStore } from "@/src/features/auth/store/authSlice";
import type { Ingredient } from "../types";
import type { IngredientInput } from "../lib/schema";

const KEY = ["ingredients"] as const;

export function useIngredientsQuery() {
  return useQuery<Ingredient[]>({
    queryKey: KEY,
    queryFn: () => fetcher<Ingredient[]>("/ingredients"),
    staleTime: 60_000,
  });
}

export function useCreateIngredient() {
  const qc = useQueryClient();
  const token = useAuthStore((s) => s.token);

  return useMutation<Ingredient, Error, IngredientInput>({
    mutationFn: (input) =>
      fetcher<Ingredient>("/ingredients", {
        method: "POST",
        body: JSON.stringify(input),
        token: token ?? undefined,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateIngredient() {
  const qc = useQueryClient();
  const token = useAuthStore((s) => s.token);

  return useMutation<Ingredient, Error, { id: number; input: Partial<IngredientInput> }>({
    mutationFn: ({ id, input }) =>
      fetcher<Ingredient>(`/ingredients/${id}`, {
        method: "PATCH",
        body: JSON.stringify(input),
        token: token ?? undefined,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteIngredient() {
  const qc = useQueryClient();
  const token = useAuthStore((s) => s.token);

  return useMutation<void, Error, number>({
    mutationFn: (id) =>
      fetcher<void>(`/ingredients/${id}`, {
        method: "DELETE",
        token: token ?? undefined,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
