import { z } from "zod";

export const ingredientSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(255, "El nombre es demasiado largo"),
  isAllergen: z.boolean(),
});

export type IngredientInput = z.infer<typeof ingredientSchema>;
