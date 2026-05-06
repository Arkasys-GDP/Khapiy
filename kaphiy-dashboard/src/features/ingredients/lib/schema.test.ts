import { describe, it, expect } from "vitest";
import { ingredientSchema } from "./schema";

describe("ingredientSchema", () => {
  it("accepts valid input", () => {
    const r = ingredientSchema.safeParse({ name: "Leche entera", isAllergen: true });
    expect(r.success).toBe(true);
  });

  it("rejects empty name", () => {
    const r = ingredientSchema.safeParse({ name: "", isAllergen: false });
    expect(r.success).toBe(false);
  });

  it("rejects name shorter than 2 chars", () => {
    const r = ingredientSchema.safeParse({ name: "X", isAllergen: false });
    expect(r.success).toBe(false);
  });

  it("requires isAllergen as boolean", () => {
    const r = ingredientSchema.safeParse({ name: "Sal", isAllergen: "yes" });
    expect(r.success).toBe(false);
  });
});
