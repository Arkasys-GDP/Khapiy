"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ingredientSchema, type IngredientInput } from "../lib/schema";
import type { Ingredient } from "../types";

interface Props {
  defaultValues?: Ingredient | null;
  onSubmit: (values: IngredientInput) => Promise<void>;
  onCancel: () => void;
  submitting?: boolean;
}

export function IngredientForm({ defaultValues, onSubmit, onCancel, submitting }: Props) {
  const form = useForm<IngredientInput>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      isAllergen: defaultValues?.isAllergen ?? false,
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      noValidate
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ing-name">Nombre</Label>
        <Input
          id="ing-name"
          {...form.register("name")}
          autoComplete="off"
          aria-invalid={!!form.formState.errors.name}
          placeholder="ej. Leche entera"
        />
        {form.formState.errors.name && (
          <p role="alert" className="text-xs text-[var(--sem-alert)]">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3">
        <div className="min-w-0">
          <Label htmlFor="ing-allergen" className="text-sm font-semibold">
            Alérgeno
          </Label>
          <p className="text-[11px] text-[var(--muted-foreground)]">
            Marca para mostrar advertencia en pedidos
          </p>
        </div>
        <Switch
          id="ing-allergen"
          checked={form.watch("isAllergen")}
          onCheckedChange={(v) => form.setValue("isAllergen", v, { shouldDirty: true })}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />}
          {defaultValues ? "Guardar cambios" : "Crear ingrediente"}
        </Button>
      </div>
    </form>
  );
}
